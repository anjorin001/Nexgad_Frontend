import { ChevronDown, Search, X } from "lucide-react";
import { useState } from "react";
import {
  Status,
  type IGadgetRequest,
} from "../../components/gadgetRequestComponents/gadgetRequestInterface";
import Loader from "../../components/nexgadMidPageLoader";
import { useChatMVP } from "../../hooks/useChat";
import { useToast } from "../../utils/ToastNotification";
import { statusColors } from "../helpers/common";
import { ChatPanel } from "./Requests/ChatPanel";
import { RequestsTable } from "./Requests/RequestTable";

interface AdminGadgetRequestManagementProp {
  isPageLoading: boolean;
  isStatusChanging: string;
  requests: IGadgetRequest[];
  filteredRequests: IGadgetRequest[];
  selectedRequestId: string | null;
  selectedRequest: IGadgetRequest;
  isViewMoreLoading: boolean;
  isCloseOfferLoading: boolean;
  isCreateOfferLoading: boolean;
  isToggleChatLoading: boolean;
  statusFilter: string;
  searchTerm: string;
  sortBy: string;
  onSetSelectedRequestId: (value: any) => void;
  onSetSelectedRequest: (value: any) => void;
  onCreateOffer: (requestId: string, price: string) => Promise<void>;
  onCloseOffer: (requestId: string) => void;
  onToggleChat: (requestId: string, enabled: boolean) => Promise<void>;
  onChangeStatus: (requestId: string, newStatus: Status) => void;
  onViewDetails: (requestId: string) => void;
  onSetStatusFilter: (value: string) => void;
  onSetSearchTerm: (value: string) => void;
  onSetSortBy: (value: string) => void;
}

const AdminGadgetRequestManagement: React.FC<
  AdminGadgetRequestManagementProp
> = ({
  filteredRequests,
  isPageLoading,
  isViewMoreLoading,
  onChangeStatus,
  onCloseOffer,
  onCreateOffer,
  onSetSearchTerm,
  onSetSelectedRequestId,
  onSetSelectedRequest,
  onSetSortBy,
  onSetStatusFilter,
  onToggleChat,
  onViewDetails,
  requests,
  selectedRequestId,
  selectedRequest,
  statusFilter,
  searchTerm,
  sortBy,
  isStatusChanging,
  isCloseOfferLoading,
  isCreateOfferLoading,
  isToggleChatLoading,
}) => {
  const {
    messages,
    sendMessage,
    loading,
    connection,
    updateMessageLocal,
    close,
    reconnect,
  } = useChatMVP(selectedRequest?._id);

  const [sending, setSending] = useState(false);
  const [text, setText] = useState("");
  const toast = useToast();

  async function handleSend(e?: React.FormEvent) {
    e?.preventDefault();
    if (!text.trim()) return;
    setSending(true);
    try {
      const saved = await sendMessage(text.trim());
      updateMessageLocal(saved._id, { delivered: true });
      setText("");
    } catch (err: any) {
      console.error("send failed", err);

      if (err.response) {
        toast.error(err.response.data.message || "Something went wrong");
      } else if (
        err.code === "ERR_NETWORK" ||
        err.code === "ECONNABORTED" ||
        err.message.includes("Network Error")
      ) {
        window.dispatchEvent(new CustomEvent("network-error"));
      } else {
        toast.error("Unexpected error occurred.");
      }
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: "#263b51" }}>
            Gadget Request Management
          </h1>
          <p style={{ color: "#456882" }}>
            Manage and track all gadget requests from users
          </p>
        </div>

        <div className="lg:flex lg:gap-6">
          {/* Main Content */}
          <div
            className={`transition-all duration-300 ${
              selectedRequest ? "lg:w-2/3" : "w-full"
            }`}
          >
            {/* Filters Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Status Filter */}
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "#263b51" }}
                  >
                    Status
                  </label>
                  <div className="relative">
                    <select
                      value={statusFilter}
                      onChange={(e) => onSetStatusFilter(e.target.value)}
                      className="w-full appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ color: "#263b51" }}
                    >
                      <option value="all">All Status</option>
                      {Object.values(Status).map((status) => (
                        <option key={status} value={status}>
                          {status.replace("-", " ").toUpperCase()}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none"
                      style={{ color: "#456882" }}
                    />
                  </div>
                </div>

                {/* Search Bar */}
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "#263b51" }}
                  >
                    Search
                  </label>
                  <div className="relative">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                      style={{ color: "#456882" }}
                    />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => onSetSearchTerm(e.target.value)}
                      placeholder="Search requests..."
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ color: "#263b51" }}
                    />
                  </div>
                </div>

                {/* Sort Dropdown */}
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "#263b51" }}
                  >
                    Sort By
                  </label>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => onSetSortBy(e.target.value)}
                      className="w-full appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ color: "#263b51" }}
                    >
                      <option value="date-desc">Latest First</option>
                      <option value="date-asc">Oldest First</option>
                    </select>
                    <ChevronDown
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none"
                      style={{ color: "#456882" }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {isPageLoading ? (
              <div className="flex justify-center items-center">
                <Loader size={64} thickness={1} />
              </div>
            ) : filteredRequests.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-12 h-12 mb-3 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 13h6m-3-3v6m9 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-lg font-medium">No requests found</p>
              </div>
            ) : (
              <RequestsTable
                requests={filteredRequests}
                onViewDetails={onViewDetails}
                onChangeStatus={onChangeStatus}
                onToggleChat={onToggleChat}
                isStatusChanging={isStatusChanging}
              />
            )}
          </div>

          {isViewMoreLoading ? (
            <div className="lg:w-1/3 mt-6 lg:mt-0 transition-all duration-300">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex flex-col justify-center align-middle">
                <Loader size={36} thickness={1} />
              </div>
            </div>
          ) : (
            selectedRequest && (
              <div className="lg:w-1/3 mt-6 lg:mt-0 transition-all duration-300">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex flex-col">
                  <div
                    className="p-4 border-b flex justify-between items-center"
                    style={{ backgroundColor: "#CBDCEB" }}
                  >
                    <h2
                      className="text-lg font-semibold"
                      style={{ color: "#263b51" }}
                    >
                      Request Details
                    </h2>
                    <button
                      onClick={() => {
                        onSetSelectedRequestId(null);
                        onSetSelectedRequest(null);
                        close();
                      }}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Request Details & Chat */}
                  <div className="flex-1 flex flex-col">
                    <div className="p-4 border-b">
                      <div className="space-y-3 text-sm">
                        <div>
                          <span
                            className="font-medium"
                            style={{ color: "#456882" }}
                          >
                            Request ID:
                          </span>{" "}
                          <span style={{ color: "#263b51" }}>
                            {selectedRequest.requestId}
                          </span>
                        </div>
                        <div>
                          <span
                            className="font-medium"
                            style={{ color: "#456882" }}
                          >
                            Submitted:
                          </span>{" "}
                          <span style={{ color: "#263b51" }}>
                            {new Date(
                              selectedRequest.createdAt
                            ).toLocaleDateString()}
                          </span>
                        </div>
                        <div>
                          <span
                            className="font-medium"
                            style={{ color: "#456882" }}
                          >
                            Brand:
                          </span>{" "}
                          <span style={{ color: "#263b51" }}>
                            {selectedRequest.brand}
                          </span>
                        </div>
                        <div>
                          <span
                            className="font-medium"
                            style={{ color: "#456882" }}
                          >
                            Description:
                          </span>{" "}
                          <span style={{ color: "#263b51" }}>
                            {selectedRequest.description}
                          </span>
                        </div>
                        <div>
                          <span
                            className="font-medium"
                            style={{ color: "#456882" }}
                          >
                            Current Status:
                          </span>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ml-2 ${
                              statusColors[selectedRequest.status]
                            }`}
                          >
                            {selectedRequest.status
                              .replace("-", " ")
                              .toUpperCase()}
                          </span>
                        </div>
                        {selectedRequest.notes && (
                          <div>
                            <span
                              className="font-medium"
                              style={{ color: "#456882" }}
                            >
                              Notes:
                            </span>{" "}
                            <span style={{ color: "#263b51" }}>
                              {selectedRequest.notes}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Chat Panel */}
                    <div className="flex-1">
                      <ChatPanel
                        messages={messages}
                        connectionStatus={connection}
                        isMessageLoading={loading}
                        isSending={sending}
                        onSendMessage={handleSend}
                        onSetText={setText}
                        text={text}
                        isToggleChatLoading={isToggleChatLoading}
                        isCloseOfferLoading={isCloseOfferLoading}
                        isCreateOfferLoading={isCreateOfferLoading}
                        request={selectedRequest}
                        onToggleChat={async (enabled) => {
                          console.log("first");
                          await onToggleChat(selectedRequest._id, enabled);
                          console.log("done now reconnecting...");
                          reconnect();
                        }}
                        onCreateOffer={(price) =>
                          onCreateOffer(selectedRequest._id, price)
                        }
                        onCloseOffer={() => onCloseOffer(selectedRequest._id)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminGadgetRequestManagement;
