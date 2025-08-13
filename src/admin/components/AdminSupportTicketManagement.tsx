/* eslint-disable no-case-declarations */
import {
  AlertCircle,
  CheckCircle,
  Clock,
  MessageCircle,
  Search,
} from "lucide-react";
import { useMemo, useState } from "react";
import { dummyTickets } from "../helpers/dummyData";
import { TicketFilters } from "./Support/Filter";
import { TicketTable, type SupportTicket } from "./Support/TicketTable";
import { ViewTicketModal } from "./Support/ViewTicketModal";

export default function SupportTicketsManagement() {
  const [tickets, setTickets] = useState<SupportTicket[]>(dummyTickets);
  const [viewTicket, setViewTicket] = useState<SupportTicket | null>(null);

  // Filter states
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    category: "",
    dateRange: "",
  });

  // Filter logic
  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const searchMatch =
          ticket.id.toLowerCase().includes(searchTerm) ||
          ticket.customerName.toLowerCase().includes(searchTerm) ||
          ticket.customerEmail.toLowerCase().includes(searchTerm) ||
          ticket.subject.toLowerCase().includes(searchTerm) ||
          (ticket.orderNumber &&
            ticket.orderNumber.toLowerCase().includes(searchTerm));

        if (!searchMatch) return false;
      }

      // Status filter
      if (filters.status && ticket.status !== filters.status) {
        return false;
      }

      // Category filter
      if (filters.category && ticket.category !== filters.category) {
        return false;
      }

      // Date range filter
      if (filters.dateRange) {
        const ticketDate = new Date(ticket.createdDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        switch (filters.dateRange) {
          case "today": {
            const todayStart = new Date(today);
            const todayEnd = new Date(today);
            todayEnd.setHours(23, 59, 59, 999);
            if (ticketDate < todayStart || ticketDate > todayEnd) return false;
            break;
          }
          case "yesterday":
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayEnd = new Date(yesterday);
            yesterdayEnd.setHours(23, 59, 59, 999);
            if (ticketDate < yesterday || ticketDate > yesterdayEnd)
              return false;
            break;
          case "last7days":
            const last7Days = new Date(today);
            last7Days.setDate(last7Days.getDate() - 7);
            if (ticketDate < last7Days) return false;
            break;
          case "last30days":
            const last30Days = new Date(today);
            last30Days.setDate(last30Days.getDate() - 30);
            if (ticketDate < last30Days) return false;
            break;
          case "last90days":
            const last90Days = new Date(today);
            last90Days.setDate(last90Days.getDate() - 90);
            if (ticketDate < last90Days) return false;
            break;
        }
      }

      return true;
    });
  }, [tickets, filters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: "",
      status: "",
      category: "",
      dateRange: "",
    });
  };

  const handleView = (ticket: SupportTicket) => {
    setViewTicket(ticket);
  };

  const handleReply = (ticketId: string, message: string) => {
    console.log(`Reply to ticket ${ticketId}: ${message}`);
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === ticketId
          ? { ...ticket, lastUpdated: new Date().toISOString().split("T")[0] }
          : ticket
      )
    );
  };

  const handleStatusChange = (
    ticketId: string,
    newStatus: SupportTicket["status"]
  ) => {
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === ticketId
          ? {
              ...ticket,
              status: newStatus,
              lastUpdated: new Date().toISOString().split("T")[0],
            }
          : ticket
      )
    );
  };

  const handleClose = (ticketId: string) => {
    if (window.confirm("Are you sure you want to close this ticket?")) {
      setTickets((prev) =>
        prev.map((ticket) =>
          ticket.id === ticketId
            ? {
                ...ticket,
                status: "closed",
                lastUpdated: new Date().toISOString().split("T")[0],
              }
            : ticket
        )
      );
    }
  };

  const getStatusCounts = () => {
    return tickets.reduce((acc, ticket) => {
      acc[ticket.status] = (acc[ticket.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: "#263b51" }}>
          Support Tickets
        </h1>
        <p className="text-gray-600">
          Manage customer support requests and inquiries
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div
          className="bg-white rounded-lg border p-6"
          style={{ borderColor: "#CBDCEB" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Open Tickets</p>
              <p className="text-2xl font-bold" style={{ color: "#263b51" }}>
                {statusCounts.open || 0}
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div
          className="bg-white rounded-lg border p-6"
          style={{ borderColor: "#CBDCEB" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold" style={{ color: "#263b51" }}>
                {statusCounts.in_progress || 0}
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        <div
          className="bg-white rounded-lg border p-6"
          style={{ borderColor: "#CBDCEB" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Resolved</p>
              <p className="text-2xl font-bold" style={{ color: "#263b51" }}>
                {statusCounts.resolved || 0}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div
          className="bg-white rounded-lg border p-6"
          style={{ borderColor: "#CBDCEB" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tickets</p>
              <p className="text-2xl font-bold" style={{ color: "#263b51" }}>
                {filteredTickets.length}
              </p>
            </div>
            <MessageCircle className="w-8 h-8" style={{ color: "#456882" }} />
          </div>
        </div>
      </div>

      {/* Filters */}
      <TicketFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        ticketCounts={statusCounts}
      />

      {/* Results Summary */}
      {(filters.search ||
        filters.status ||
        filters.category ||
        filters.dateRange) && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm" style={{ color: "#263b51" }}>
            Showing{" "}
            <span className="font-semibold">{filteredTickets.length}</span> of{" "}
            <span className="font-semibold">{tickets.length}</span> tickets
            {filters.search && (
              <span>
                {" "}
                matching "
                <span className="font-semibold">{filters.search}</span>"
              </span>
            )}
          </p>
        </div>
      )}

      {/* Tickets Table */}
      <TicketTable
        tickets={filteredTickets}
        onView={handleView}
        onReply={handleReply}
        onStatusChange={handleStatusChange}
        onClose={handleClose}
      />

      {/* Empty State */}
      {filteredTickets.length === 0 && tickets.length > 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No tickets found
          </h3>
          <p className="text-gray-500 mb-4">
            Try adjusting your search criteria or clearing the filters.
          </p>
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 text-white rounded-md"
            style={{ backgroundColor: "#456882" }}
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* View Modal */}
      <ViewTicketModal
        ticket={viewTicket}
        onClose={() => setViewTicket(null)}
      />
    </div>
  );
}
