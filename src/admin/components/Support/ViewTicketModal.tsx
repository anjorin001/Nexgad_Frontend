import { Package, X } from "lucide-react";
import type { Order } from "../../../components/orderComponents/OrderInterfaces";
import {
  statusConfig,
  type SupportTicket,
} from "../../../components/support/types";

interface ViewTicketModalProp {
  ticket: SupportTicket | null;
  onClose: () => void;
  onReply: (ticketNumber: string, ticketId: string) => void;
  onCloseTicket: (ticket: SupportTicket) => void;
}

export const ViewTicketModal: React.FC<ViewTicketModalProp> = ({
  ticket,
  onClose,
  onCloseTicket,
  onReply,
}) => {
  if (!ticket) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const statusInfo = statusConfig[ticket.status];
  const StatusIcon = statusInfo.icon;

  return (
    <div className="fixed inset-0 bg-[#263b51]/40 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div
          className="sticky top-0 bg-white border-b px-6 py-4"
          style={{ borderColor: "#CBDCEB" }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold" style={{ color: "#263b51" }}>
                {ticket.ticketId}
              </h2>
              <div className="flex items-center gap-2">
                <StatusIcon className="w-4 h-4" />
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full border ${statusInfo.color}`}
                >
                  {statusInfo.label}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content - Left Side */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3
                  className="text-xl font-semibold mb-4"
                  style={{ color: "#263b51" }}
                >
                  {ticket.category}
                </h3>
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {ticket.description}
                  </p>
                </div>

                {/* Category Badge */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {ticket.category}
                  </span>
                </div>
              </div>

              {/* Order Details */}
              {ticket.order !== null &&
                (ticket.order as Order)?.orderNumber && (
                  <div
                    className="border rounded-lg p-6"
                    style={{ borderColor: "#CBDCEB" }}
                  >
                    <h3
                      className="text-lg font-semibold mb-4 flex items-center gap-2"
                      style={{ color: "#263b51" }}
                    >
                      <Package
                        className="w-5 h-5"
                        style={{ color: "#456882" }}
                      />
                      Order Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-500">
                            Order Number
                          </label>
                          <p
                            className="text-lg font-semibold"
                            style={{ color: "#263b51" }}
                          >
                            {(ticket.order as Order).orderNumber}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-500">
                            Order Value
                          </label>
                          <p className="text-lg font-bold text-green-600">
                            {formatPrice((ticket.order as Order).totalAmount)}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">
                            Order Date
                          </label>
                          <p style={{ color: "#263b51" }}>
                            {new Date(
                              (ticket.order as Order).orderDate
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
            </div>

            {/* Sidebar - Right Side */}
            <div className="space-y-6">
              {/* Customer Information */}
              <div
                className="border rounded-lg p-4"
                style={{ borderColor: "#CBDCEB" }}
              >
                <h3
                  className="text-lg font-semibold mb-4"
                  style={{ color: "#263b51" }}
                >
                  Customer
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-800 font-medium">
                        {ticket.userId.lastName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium" style={{ color: "#263b51" }}>
                        {`${ticket.userId.lastName} ${ticket.userId.firstName} `}
                      </p>
                      <p className="text-sm text-gray-500">
                        {ticket.userId.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ticket Timeline */}
              <div
                className="border rounded-lg p-4"
                style={{ borderColor: "#CBDCEB" }}
              >
                <h3
                  className="text-lg font-semibold mb-4"
                  style={{ color: "#263b51" }}
                >
                  Timeline
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Ticket Created</p>
                      <p className="text-xs text-gray-500">
                        {new Date(ticket.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>
                  </div>

                  {ticket.createdAt !== ticket.updatedAt && (
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">Last Updated</p>
                        <p className="text-xs text-gray-500">
                          {new Date(ticket.updatedAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div
                className="border rounded-lg p-4"
                style={{ borderColor: "#CBDCEB" }}
              >
                <h3
                  className="text-lg font-semibold mb-3"
                  style={{ color: "#263b51" }}
                >
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      onReply(ticket.ticketId, ticket._id);
                      onClose();
                    }}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Send Reply
                  </button>
                  <button
                    onClick={() => {
                      onCloseTicket(ticket);
                      onClose();
                    }}
                    className="w-full px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50 transition-colors"
                  >
                    Close Ticket
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
