import { Calendar, Eye, MessageCircle, Package, Send, X } from "lucide-react";
import React, { useState } from "react";
import {
  complaintCategories,
  statusConfig,
} from "../../../components/support/types";

interface TicketTableProps {
  tickets: SupportTicket[];
  onView: (ticket: SupportTicket) => void;
  onReply: (ticketId: string, message: string) => void;
  onStatusChange: (
    ticketId: string,
    newStatus: SupportTicket["status"]
  ) => void;
  onClose: (ticketId: string) => void;
}

export interface SupportTicket {
  id: string;
  orderNumber?: string;
  customerName: string;
  customerEmail: string;
  category: (typeof complaintCategories)[number];
  status: keyof typeof statusConfig;
  subject: string;
  description: string;
  createdDate: string;
  lastUpdated: string;
  orderDetails?: {
    productName: string;
    orderValue: number;
    orderDate: string;
  };
}

export const TicketTable: React.FC<TicketTableProps> = ({
  tickets,
  onView,
  onReply,
  onStatusChange,
  onClose,
}) => {
  const [replyTicketId, setReplyTicketId] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState("");

  const handleSendReply = () => {
    if (replyTicketId && replyMessage.trim()) {
      onReply(replyTicketId, replyMessage);
      setReplyTicketId(null);
      setReplyMessage("");
    }
  };

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
              {tickets.map((ticket: SupportTicket) => {
                return (
                  <tr key={ticket.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span
                        className="font-medium text-sm"
                        style={{ color: "#263b51" }}
                      >
                        {ticket.id}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {ticket.orderNumber ? (
                        <div className="flex items-center gap-2">
                          <Package
                            className="w-4 h-4"
                            style={{ color: "#456882" }}
                          />
                          <span
                            className="text-sm"
                            style={{ color: "#456882" }}
                          >
                            {ticket.orderNumber}
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
                          {ticket.customerName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {ticket.customerEmail}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm" style={{ color: "#456882" }}>
                        {ticket.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={ticket.status}
                        onChange={(e) =>
                          onStatusChange(
                            ticket.id,
                            e.target.value as SupportTicket["status"]
                          )
                        }
                        className="bg-white border rounded-md px-3 py-1 text-xs font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                        style={{ borderColor: "#CBDCEB" }}
                      >
                        {Object.entries(statusConfig).map(([key, config]) => (
                          <option key={key} value={key}>
                            {config.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {new Date(ticket.createdDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => onView(ticket)}
                          className="p-2 text-white rounded-md hover:opacity-90"
                          style={{ backgroundColor: "#456882" }}
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setReplyTicketId(ticket.id)}
                          className="p-2 border rounded-md hover:bg-gray-50"
                          style={{ borderColor: "#CBDCEB", color: "#456882" }}
                          title="Reply"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onClose(ticket.id)}
                          className="p-2 text-red-600 border border-red-300 rounded-md hover:bg-red-50"
                          title="Close Ticket"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reply Modal */}
      {replyTicketId && (
        <div className="fixed  inset-0 bg-[#263b51]/40 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3
                  className="text-lg font-semibold"
                  style={{ color: "#263b51" }}
                >
                  Reply to Ticket {replyTicketId}
                </h3>
                <button
                  onClick={() => setReplyTicketId(null)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "#456882" }}
                >
                  Your Message
                </label>
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 h-32"
                  style={{ borderColor: "#CBDCEB" }}
                  placeholder="Type your response here..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setReplyTicketId(null)}
                  className="flex-1 px-4 py-2 border rounded-md font-medium"
                  style={{ borderColor: "#CBDCEB", color: "#456882" }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendReply}
                  className="flex-1 px-4 py-2 text-white rounded-md font-medium flex items-center justify-center gap-2"
                  style={{ backgroundColor: "#263b51" }}
                  disabled={!replyMessage.trim()}
                >
                  <Send className="w-4 h-4" />
                  Send Reply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
