import {
  Check,
  CheckCircle,
  ChevronDown,
  Clock,
  Eye,
  Filter,
  MessageCircle,
  Truck,
  X,
} from "lucide-react";
import React from "react";
import { statusColors } from "../helpers/common";

// Data Interfaces
export interface RequestFormData {
  productName: string;
  category: string;
  brand: string;
  description: string;
  quantity: string;
  budgetRange: string;
  purchaseDate: string;
  imageLink: string;
}

interface ChatMessage {
  id: string;
  sender: "user" | "admin";
  message: string;
  timestamp: string;
}

export interface UserRequest {
  id: string;
  productName: string;
  category: string;
  status:
    | "pending"
    | "in-progress"
    | "not-available"
    | "offer-made"
    | "offer-declined"
    | "offer-expired"
    | "paid"
    | "shipped"
    | "completed";
  submittedDate: string;
  estimatedResponse?: string;
  notes?: string;
  chatMessages?: ChatMessage[];
  chatEnabled?: boolean;
  offerExpiry?: string;
  userName?: string;
  brand?: string;
  description?: string;
  quantity?: string;
  budgetRange?: string;
}

enum Status {
  PENDING = "pending",
  IN_PROGRESS = "in-progress",
  NOT_AVAILABLE = "not-available",
  OFFER_MADE = "offer-made",
  OFFER_DECLINED = "offer-declined",
  OFFER_EXPIRED = "offer-expired",
  PAID = "paid",
  SHIPPED = "shipped",
  COMPLETED = "completed",
}

const statusIcons = {
  pending: Clock,
  "in-progress": Filter,
  "not-available": X,
  "offer-made": Check,
  "offer-declined": X,
  "offer-expired": Clock,
  paid: CheckCircle,
  shipped: Truck,
  completed: CheckCircle,
};

// RequestsTable Component
interface RequestsTableProps {
  requests: UserRequest[];
  onViewDetails: (requestId: string) => void;
  onChangeStatus: (requestId: string, newStatus: Status) => void;
  onToggleChat: (requestId: string, enabled: boolean) => void;
}

export const RequestsTable: React.FC<RequestsTableProps> = ({
  requests,
  onViewDetails,
  onChangeStatus,
  onToggleChat,
}) => {
  const getValidStatusTransitions = (currentStatus: string) => {
    const transitions: Record<string, Status[]> = {
      pending: [Status.IN_PROGRESS, Status.NOT_AVAILABLE],
      "in-progress": [Status.SHIPPED],
      shipped: [Status.COMPLETED],
    };
    return transitions[currentStatus] || [];
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                Request ID
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                User
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                Product
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                Chat
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                ETA/Notes
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {requests.map((request) => {
              const StatusIcon = statusIcons[request.status];
              const validTransitions = getValidStatusTransitions(
                request.status
              );

              return (
                <tr
                  key={request.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td
                    className="px-6 py-4 text-sm font-medium"
                    style={{ color: "#263b51" }}
                  >
                    {request.id}
                  </td>
                  <td
                    className="px-6 py-4 text-sm"
                    style={{ color: "#263b51" }}
                  >
                    {request.userName}
                  </td>
                  <td
                    className="px-6 py-4 text-sm"
                    style={{ color: "#263b51" }}
                  >
                    <div className="font-medium">{request.productName}</div>
                    <div className="text-xs text-gray-500">
                      {request.category}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                        statusColors[request.status]
                      }`}
                    >
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {request.status.replace("-", " ").toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() =>
                        onToggleChat(request.id, !request.chatEnabled)
                      }
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                        request.chatEnabled
                          ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-200"
                          : "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200"
                      }`}
                    >
                      <MessageCircle className="w-3 h-3 mr-1" />
                      {request.chatEnabled ? "ON" : "OFF"}
                    </button>
                  </td>
                  <td
                    className="px-6 py-4 text-sm"
                    style={{ color: "#456882" }}
                  >
                    {request.estimatedResponse ? (
                      <div>
                        ETA:{" "}
                        {new Date(
                          request.estimatedResponse
                        ).toLocaleDateString()}
                      </div>
                    ) : null}
                    {request.notes && (
                      <div className="text-xs text-gray-500 truncate max-w-32">
                        {request.notes}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onViewDetails(request.id)}
                        className="inline-flex items-center px-3 py-1 bg-white border border-gray-300 rounded-md text-xs font-medium hover:bg-gray-50 transition-colors"
                        style={{ color: "#263b51" }}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </button>
                      {validTransitions.length > 0 && (
                        <div className="relative">
                          <select
                            onChange={(e) =>
                              onChangeStatus(
                                request.id,
                                e.target.value as Status
                              )
                            }
                            className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-1 text-xs font-medium pr-8 hover:bg-gray-50 transition-colors"
                            style={{ color: "#263b51" }}
                            defaultValue=""
                          >
                            <option value="">Change Status</option>
                            {validTransitions.map((status) => (
                              <option key={status} value={status}>
                                {status.replace("-", " ").toUpperCase()}
                              </option>
                            ))}
                          </select>
                          <ChevronDown
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 pointer-events-none"
                            style={{ color: "#456882" }}
                          />
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
