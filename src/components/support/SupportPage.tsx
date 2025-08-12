import {
  ChevronDown,
  FileText,
  ImageIcon,
  MessageSquare,
  Plus,
} from "lucide-react";
import { useState } from "react";
import { mockOrders, mockTickets } from "../../helper/DummmyData";
import { SuccessToast } from "../Toast";
import { TicketFormModal } from "./ComplainTicketModel";
import { StatusBadge } from "./TicketStatus";
import type { Order, SupportTicket, TicketFormData } from "./types";

export const SupportPage: React.FC = () => {
  const [orders] = useState<Order[]>(mockOrders);
  const [tickets, setTickets] = useState<SupportTicket[]>(mockTickets);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<{
    id: string;
    info: Order;
  } | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"orders" | "tickets">("orders");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Filter tickets based on status
  const filteredTickets = tickets.filter(
    (ticket) => statusFilter === "all" || ticket.status === statusFilter
  );

  const handleOpenTicket = (orderId?: string, orderInfo?: Order) => {
    if (orderId && orderInfo) {
      setSelectedOrder({ id: orderId, info: orderInfo });
    } else {
      setSelectedOrder(null);
    }
    setIsTicketModalOpen(true);
  };

  const handleSubmitTicket = async (ticketData: TicketFormData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const newTicket: SupportTicket = {
      id: `TKT-${String(tickets.length + 1).padStart(3, "0")}`,
      orderId: ticketData.orderId,
      orderInfo: ticketData.orderId
        ? orders.find((o) => o.id === ticketData.orderId)
        : undefined,
      userId: ticketData.userId,
      category: ticketData.category,
      description: ticketData.description,
      attachments: ticketData.attachments.map((file) => file.name),
      status: ticketData.status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTickets((prev) => [newTicket, ...prev]);
    setSuccessMessage(
      "Ticket submitted successfully! We will get back to you soon."
    );
    setShowSuccessToast(true);

    console.log("Ticket submitted:", ticketData);
  };

  const getEligibleOrders = () => {
    // Orders that can have complaints (delivered or shipped)
    return orders.filter((order) =>
      ["delivered", "shipped"].includes(order.status)
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1
            className="text-2xl sm:text-3xl font-bold mb-2"
            style={{ color: "#263b51" }}
          >
            Support Center
          </h1>
          <p style={{ color: "#456882" }} className="text-sm sm:text-base">
            Get help with your orders and submit support tickets
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("orders")}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === "orders"
                  ? "border-b-2 border-[#263b51] bg-blue-50"
                  : "hover:bg-gray-50"
              }`}
              style={{ color: activeTab === "orders" ? "#263b51" : "#456882" }}
            >
              My Orders & Support
            </button>
            <button
              onClick={() => setActiveTab("tickets")}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === "tickets"
                  ? "border-b-2 border-[#263b51] bg-blue-50"
                  : "hover:bg-gray-50"
              }`}
              style={{ color: activeTab === "tickets" ? "#263b51" : "#456882" }}
            >
              Support Tickets ({tickets.length})
            </button>
          </div>
        </div>

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            {/* General Support Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="mb-4 sm:mb-0">
                  <h3
                    className="text-lg font-semibold mb-2"
                    style={{ color: "#263b51" }}
                  >
                    Need Help?
                  </h3>
                  <p style={{ color: "#456882" }} className="text-sm">
                    Submit a general support ticket for account issues,
                    questions, or feedback
                  </p>
                </div>
                <button
                  onClick={() => handleOpenTicket()}
                  className="flex items-center px-4 py-2 bg-[#263b51] text-white rounded-md hover:bg-[#2d4055] transition-colors flex-shrink-0"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Open Support Ticket
                </button>
              </div>
            </div>

            {/* Orders List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 sm:p-6 border-b">
                <h3
                  className="text-lg font-semibold"
                  style={{ color: "#263b51" }}
                >
                  Recent Orders
                </h3>
                <p style={{ color: "#456882" }} className="text-sm mt-1">
                  Report issues with delivered or shipped orders
                </p>
              </div>
              <div className="divide-y divide-gray-200">
                {getEligibleOrders().map((order) => (
                  <div
                    key={order.id}
                    className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                  >
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <h4
                          className="font-semibold"
                          style={{ color: "#263b51" }}
                        >
                          {order.productName}
                        </h4>
                        <span className="text-sm" style={{ color: "#456882" }}>
                          {order.id}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
                        <span className="text-sm" style={{ color: "#456882" }}>
                          Ordered:{" "}
                          {new Date(order.orderDate).toLocaleDateString()}
                        </span>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            order.status === "delivered"
                              ? "bg-green-100 text-green-800 border border-green-200"
                              : "bg-blue-100 text-blue-800 border border-blue-200"
                          }`}
                        >
                          {order.status.toUpperCase()}
                        </span>
                        <span
                          className="text-sm font-medium"
                          style={{ color: "#263b51" }}
                        >
                          ${order.total}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleOpenTicket(order.id, order)}
                      className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex-shrink-0"
                      style={{ color: "#263b51" }}
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Report Issue
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tickets Tab */}
        {activeTab === "tickets" && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "#263b51" }}
                  >
                    Filter by Status
                  </label>
                  <div className="relative">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ color: "#263b51" }}
                    >
                      <option value="all">All Tickets</option>
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                    <ChevronDown
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none"
                      style={{ color: "#456882" }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Tickets List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {filteredTickets.length === 0 ? (
                <div className="p-8 text-center">
                  <FileText
                    className="w-12 h-12 mx-auto mb-4 opacity-50"
                    style={{ color: "#456882" }}
                  />
                  <p style={{ color: "#456882" }}>
                    {statusFilter === "all"
                      ? "No support tickets found"
                      : `No ${statusFilter.replace("_", " ")} tickets found`}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredTickets.map((ticket) => (
                    <div key={ticket.id} className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                            <h4
                              className="font-semibold"
                              style={{ color: "#263b51" }}
                            >
                              {ticket.id}
                            </h4>
                            <StatusBadge status={ticket.status} />
                            <span
                              className="text-sm"
                              style={{ color: "#456882" }}
                            >
                              {ticket.category}
                            </span>
                          </div>

                          {ticket.orderInfo && (
                            <div
                              className="text-sm mb-2"
                              style={{ color: "#456882" }}
                            >
                              Related to order:{" "}
                              <span className="font-medium">
                                {ticket.orderInfo.productName}
                              </span>{" "}
                              ({ticket.orderId})
                            </div>
                          )}

                          <p
                            className="text-sm mb-3"
                            style={{ color: "#263b51" }}
                          >
                            {ticket.description}
                          </p>

                          {ticket.attachments.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {ticket.attachments.map((attachment, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2 py-1 bg-gray-100 text-xs rounded"
                                >
                                  <ImageIcon className="w-3 h-3 mr-1" />
                                  {attachment}
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="text-xs" style={{ color: "#456882" }}>
                            Created:{" "}
                            {new Date(ticket.createdAt).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Ticket Form Modal */}
        <TicketFormModal
          isOpen={isTicketModalOpen}
          onClose={() => {
            setIsTicketModalOpen(false);
            setSelectedOrder(null);
          }}
          onSubmit={handleSubmitTicket}
          orderId={selectedOrder?.id}
          orderInfo={selectedOrder?.info}
        />

        {/* Success Toast */}
        <SuccessToast
          show={showSuccessToast}
          message={successMessage}
          onClose={() => setShowSuccessToast(false)}
        />
      </div>
    </div>
  );
};
