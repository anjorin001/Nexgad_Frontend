/* eslint-disable no-case-declarations */
import {
  AlertCircle,
  CheckCircle,
  Clock,
  MessageCircle,
  Search,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Loader from "../../components/nexgadMidPageLoader";
import {
  DateRangeType,
  SupportTicketStatus,
  type SupportTicket,
} from "../../components/support/types";
import api from "../../utils/api";
import { useToast } from "../../utils/ToastNotification";
import { CloseTicketModal } from "./Support/CloseTicketModal";
import { TicketFilters } from "./Support/Filter";
import ReplyModal from "./Support/ReplyModal";
import { TicketTable } from "./Support/TicketTable";
import { ViewTicketModal } from "./Support/ViewTicketModal";

export default function SupportTicketsManagement() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [viewTicket, setViewTicket] = useState<SupportTicket | null>(null);
  const [closeTicket, setIsCloseTicket] = useState<SupportTicket | null>(null);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
  const [isReplyLoading, setIsRepylyLoading] = useState<boolean>(false);
  const [isVeiwMoreLoading, setIsViewMoreLoading] = useState<boolean>(false);
  const [isStatusChangeLoading, setIsStatusChangeLoading] =
    useState<boolean>(false);
  const toast = useToast();
  const [replyTicketId, setReplyTicketId] = useState<string | null>(null);
  const [replyTicketNumber, setReplyTicketNumber] = useState<string | null>(
    null
  );
  const [replyMessage, setReplyMessage] = useState("");

  const [filters, setFilters] = useState({
    search: "",
    status: "",
    category: "",
    dateRange: "",
  });


  const fetchTickets = async () => {
    setIsPageLoading(true);
    try {
      const queryParams = new URLSearchParams();

      if (filters.category) {
        queryParams.append("category", filters.category);
      }

      if (filters.status) {
        queryParams.append("status", filters.status);
      }

      if (filters.dateRange) {
        queryParams.append("dateRange", filters.dateRange);
      }

      const queryString = queryParams.toString();
      const endpoint = queryString
        ? `/support/ticket/all?${queryString}`
        : "/support/ticket/all";

      const request = await api.get(endpoint);
      const response = request.data;
      setTickets(response.data || []);
    } catch (error: any) {
      console.error("Error fetching tickets", error);

      if (error.response) {
        toast.error(error.response.data.message || "Failed to fetch tickets");
      } else if (
        error.code === "ERR_NETWORK" ||
        error.code === "ECONNABORTED" ||
        error.message.includes("Network Error")
      ) {
        window.dispatchEvent(new CustomEvent("network-error"));
      } else {
        toast.error("Unexpected error occurred while fetching tickets.");
      }
    } finally {
      setIsPageLoading(false);
    }
  };

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesSearch =
          ticket.ticketId.toLowerCase().includes(searchTerm) ||
          `${ticket.userId.firstName} ${ticket.userId.lastName}`
            .toLowerCase()
            .includes(searchTerm) ||
          ticket.description.toLowerCase().includes(searchTerm) ||
          ticket.category.toLowerCase().includes(searchTerm);

        if (!matchesSearch) return false;
      }

      if (filters.status && ticket.status !== filters.status) {
        return false;
      }

      if (filters.category && ticket.category !== filters.category) {
        return false;
      }

      if (filters.dateRange) {
        const ticketDate = new Date(ticket.createdAt);
        const today = new Date();
        today.setHours(23, 59, 59, 999);

        switch (filters.dateRange) {
          case DateRangeType.TODAY:
            const startOfToday = new Date(today);
            startOfToday.setHours(0, 0, 0, 0);
            if (ticketDate < startOfToday || ticketDate > today) return false;
            break;

          case DateRangeType.YESTERDAY:
            const yesterday = new Date(today);
            yesterday.setDate(today.getDate() - 1);
            yesterday.setHours(0, 0, 0, 0);
            const endOfYesterday = new Date(yesterday);
            endOfYesterday.setHours(23, 59, 59, 999);
            if (ticketDate < yesterday || ticketDate > endOfYesterday)
              return false;
            break;

          case DateRangeType.LAST7DAYS:
            const sevenDaysAgo = new Date(today);
            sevenDaysAgo.setDate(today.getDate() - 7);
            sevenDaysAgo.setHours(0, 0, 0, 0);
            if (ticketDate < sevenDaysAgo) return false;
            break;

          case DateRangeType.LAST30DAYS:
            const thirtyDaysAgo = new Date(today);
            thirtyDaysAgo.setDate(today.getDate() - 30);
            thirtyDaysAgo.setHours(0, 0, 0, 0);
            if (ticketDate < thirtyDaysAgo) return false;
            break;
        }
      }

      return true;
    });
  }, [tickets, filters]);

  useEffect(() => {
    fetchTickets();
  }, [filters.status, filters.category, filters.dateRange]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchTickets();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [filters.search]);

  useEffect(() => {
    fetchTickets();
  }, []);

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

  const handleView = async (ticketId: string) => {
    setIsViewMoreLoading(true);
    try {
      const request = await api.get(`/support/ticket/${ticketId}`);
      const response = request.data;
      setViewTicket(response.data);
    } catch (error: any) {
      console.error("Error submitting ticket", error);

      if (error.response) {
        toast.error(error.response.data.message || "Something went wrong");
      } else if (
        error.code === "ERR_NETWORK" ||
        error.code === "ECONNABORTED" ||
        error.message.includes("Network Error")
      ) {
        window.dispatchEvent(new CustomEvent("network-error"));
      } else {
        toast.error("Unexpected error occurred.");
      }
    } finally {
      setIsViewMoreLoading(false);
    }
  };

  const handleReply = async (ticketId: string, message: string) => {
    setIsRepylyLoading(true);
    try {
      await api.post(`/support/ticket/reply/${ticketId}`, { message });

      setTickets((prev) =>
        prev.map((ticket) =>
          ticket._id === ticketId
            ? { ...ticket, updatedAt: new Date().toISOString() }
            : ticket
        )
      );

      toast.success("Reply sent successfully");
    } catch (error: any) {
      console.error("Error replying ticket", error);

      if (error.response) {
        toast.error(error.response.data.message || "Something went wrong");
      } else if (
        error.code === "ERR_NETWORK" ||
        error.code === "ECONNABORTED" ||
        error.message.includes("Network Error")
      ) {
        window.dispatchEvent(new CustomEvent("network-error"));
      } else {
        toast.error("Unexpected error occurred.");
      }
    } finally {
      setIsRepylyLoading(false);
    }
  };

  const handleStatusChange = async (
    ticketId: string,
    newStatus: SupportTicket["status"]
  ) => {
    setIsStatusChangeLoading(true);
    try {
      await api.patch(`/support/ticket/status/${ticketId}`, {
        status: newStatus,
      });
      setTickets((prev) =>
        prev.map((ticket) =>
          ticket._id === ticketId
            ? {
                ...ticket,
                status: newStatus,
                updatedAt: new Date().toISOString(),
              }
            : ticket
        )
      );

      toast.success("Ticket status updated successfully");
    } catch (error: any) {
      console.error("Error updating ticket status", error);

      if (error.response) {
        toast.error(error.response.data.message || "Something went wrong");
      } else if (
        error.code === "ERR_NETWORK" ||
        error.code === "ECONNABORTED" ||
        error.message.includes("Network Error")
      ) {
        window.dispatchEvent(new CustomEvent("network-error"));
      } else {
        toast.error("Unexpected error occurred.");
      }
    } finally {
      setIsStatusChangeLoading(false);
      setIsCloseTicket(null);
    }
  };

  const prepSendReply = async () => {
    if (replyTicketId && replyMessage.trim()) {
      await handleReply(replyTicketId, replyMessage);
      setReplyTicketId(null);
      setReplyTicketNumber(null);
      setReplyMessage("");
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
        isPageLoading={isPageLoading}
        isVeiwMoreLoading={isVeiwMoreLoading}
        tickets={filteredTickets}
        onView={handleView}
        onStatusChange={handleStatusChange}
        onClose={setIsCloseTicket}
        onSetReplyId={setReplyTicketId}
        onSetReplyNumber={setReplyTicketNumber}
      />

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

      {isVeiwMoreLoading ? (
        <div className="fixed inset-0 bg-[#263b51]/40 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white col-span-full flex justify-center items-center rounded-lg max-w-2xl w-full h-[80vh] overflow-y-auto">
            <Loader size={64} thickness={1} />
          </div>
        </div>
      ) : (
        viewTicket && (
          <ViewTicketModal
            ticket={viewTicket}
            onClose={() => setViewTicket(null)}
            onCloseTicket={setIsCloseTicket}
            onReply={(TicketNumber: string, ticketId: string) => {
              setReplyTicketId(ticketId);
              setReplyTicketNumber(TicketNumber);
            }}
          />
        )
      )}

      {replyTicketId && (
        <ReplyModal
          isReplyLoading={isReplyLoading}
          onClose={() => {
            setReplyTicketId(null);
            setReplyTicketNumber(null);
            setReplyMessage(null)
          }}
          onSendReply={prepSendReply}
          replyTicketId={replyTicketId}
          replyTicketNumber={replyTicketNumber}
          onSetReplyMessage={setReplyMessage}
          replyMessage={replyMessage}
        />
      )}

      {closeTicket && (
        <CloseTicketModal
          isOpen={!!closeTicket}
          onClose={() => setIsCloseTicket(null)}
          onConfirm={() =>
            handleStatusChange(closeTicket._id, SupportTicketStatus.CLOSED)
          }
          ticketId={closeTicket.ticketId}
          isLoading={isStatusChangeLoading}
        />
      )}
    </div>
  );
}
