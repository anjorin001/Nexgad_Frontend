import {
  Calendar,
  ChevronDown,
  Eye,
  MessageCircle,
  Package,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import Loader from "../../../components/nexgadMidPageLoader";
import {
  statusConfig,
  type SupportTicket,
} from "../../../components/support/types";

interface TicketTableProps {
  isPageLoading: boolean;

  isVeiwMoreLoading: boolean;
  tickets: SupportTicket[];
  onView: (ticketId: string) => void;
  onStatusChange: (
    ticketId: string,
    newStatus: SupportTicket["status"]
  ) => void;
  onClose: (ticket: SupportTicket) => void;
  onSetReplyNumber: (ticketNumber: string) => void;
  onSetReplyId: (ticketId: string) => void;
}

export const TicketTable: React.FC<TicketTableProps> = ({
  isVeiwMoreLoading,
  isPageLoading,
  tickets,
  onView,
  onStatusChange,
  onClose,
  onSetReplyId,
  onSetReplyNumber,
}) => {
  const [showStatusDropdown, setShowStatusDropdown] = useState<string | null>(
    null
  );

  const statusFlow: Record<string, string[]> = {
    open: ["closed", "resolved", "in_progress"],
    in_progress: ["resolved", "closed"],
    resolved: [],
    closed: [],
  };

  const getStatusIcon = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig];
    if (config?.icon) {
      const IconComponent = config.icon;
      return <IconComponent className="w-3 h-3" />;
    }
    return null;
  };

  const getStatusColor = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig];
    return config?.color || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getAllowedNextStatuses = (currentStatus: string) => {
    return statusFlow[currentStatus] || [];
  };

  const handleStatusUpdate = (ticketId: string, newStatus: string) => {
    onStatusChange(ticketId, newStatus as SupportTicket["status"]);
    setShowStatusDropdown(null);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showStatusDropdown) {
        setShowStatusDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showStatusDropdown]);

  return (
    <>
      <div
        className="bg-white rounded-lg shadow-xl border border-[#CBDCEB]/30 overflow-hidden"
        style={{ borderColor: "#CBDCEB" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/80">
              <tr>
                <th
                  className="px-6 py-4 text-left text-sm font-semibold"
                  style={{ color: "#263b51" }}
                >
                  Ticket ID
                </th>
                <th
                  className="px-6 py-4 text-left text-sm font-semibold"
                  style={{ color: "#263b51" }}
                >
                  Order Number
                </th>
                <th
                  className="px-6 py-4 text-left text-sm font-semibold"
                  style={{ color: "#263b51" }}
                >
                  Customer
                </th>
                <th
                  className="px-6 py-4 text-left text-sm font-semibold"
                  style={{ color: "#263b51" }}
                >
                  Category
                </th>
                <th
                  className="px-6 py-4 text-left text-sm font-semibold"
                  style={{ color: "#263b51" }}
                >
                  Status
                </th>
                <th
                  className="px-6 py-4 text-left text-sm font-semibold"
                  style={{ color: "#263b51" }}
                >
                  Created
                </th>
                <th
                  className="px-6 py-4 text-left text-sm font-semibold"
                  style={{ color: "#263b51" }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "#CBDCEB" }}>
              {isPageLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12">
                    <div className="flex justify-center items-center">
                      <Loader size={64} thickness={1} />
                    </div>
                  </td>
                </tr>
              ) : (
                tickets.map((ticket: SupportTicket) => {
                  return (
                    <tr key={ticket._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <span
                          className="font-medium text-sm"
                          style={{ color: "#263b51" }}
                        >
                          {ticket.ticketId}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {ticket.order ? (
                          <div className="flex items-center gap-2">
                            <Package
                              className="w-4 h-4"
                              style={{ color: "#456882" }}
                            />
                            <span
                              className="text-sm"
                              style={{ color: "#456882" }}
                            >
                              {ticket.order as string}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div
                            className="font-medium text-sm"
                            style={{ color: "#263b51" }}
                          >
                            {`${ticket.userId.lastName} ${ticket.userId.firstName} `}
                          </div>
                          <div className="text-xs text-gray-500">
                            {ticket.userId.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm" style={{ color: "#456882" }}>
                          {ticket.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="relative">
                          <button
                            onClick={() =>
                              setShowStatusDropdown(
                                showStatusDropdown === ticket._id
                                  ? null
                                  : ticket._id
                              )
                            }
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              ticket.status
                            )}`}
                          >
                            {getStatusIcon(ticket.status)}
                            {statusConfig[
                              ticket.status as keyof typeof statusConfig
                            ]?.label || ticket.status}
                            {getAllowedNextStatuses(ticket.status).length >
                              0 && <ChevronDown className="w-3 h-3" />}
                          </button>
                          {showStatusDropdown === ticket._id &&
                            getAllowedNextStatuses(ticket.status).length >
                              0 && (
                              <div
                                className="absolute right-0 top-full mt-1 bg-white border rounded-md shadow-lg z-10 min-w-32"
                                style={{ borderColor: "#CBDCEB" }}
                              >
                                {getAllowedNextStatuses(ticket.status).map(
                                  (status) => (
                                    <button
                                      key={status}
                                      onClick={() =>
                                        handleStatusUpdate(ticket._id, status)
                                      }
                                      className="w-full px-3 py-2 text-left hover:bg-gray-50 text-xs"
                                    >
                                      {statusConfig[
                                        status as keyof typeof statusConfig
                                      ]?.label ||
                                        status.charAt(0).toUpperCase() +
                                          status.slice(1)}
                                    </button>
                                  )
                                )}
                              </div>
                            )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => onView(ticket._id)}
                            className="p-2 text-white rounded-md hover:opacity-90"
                            style={{ backgroundColor: "#456882" }}
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              onSetReplyId(ticket._id);
                              onSetReplyNumber(ticket.ticketId);
                            }}
                            className="p-2 border rounded-md hover:bg-gray-50"
                            style={{ borderColor: "#CBDCEB", color: "#456882" }}
                            title="Reply"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onClose(ticket)} //TODO modify to render confirm modal
                            className="p-2 text-red-600 border border-red-300 rounded-md hover:bg-red-50"
                            title="Close Ticket"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
