import { useMemo, useState } from "react";
import { mockRequests } from "../helpers/dummyData";
import { ChatPanel } from "./ChatPanel";
import { RequestsTable, type UserRequest } from "./RequestTable";
import { Calendar, ChevronDown, Search, X } from "lucide-react";
import { statusColors } from "../helpers/common";

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

const AdminGadgetRequestManagement: React.FC = () => {
  const [requests, setRequests] = useState<UserRequest[]>(mockRequests);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null
  );
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<string>("date-desc");

  // Filter and sort requests
  const filteredRequests = useMemo(() => {
    let filtered = requests;

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((req) => req.status === statusFilter);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (req) =>
          req.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          req.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (req.userName &&
            req.userName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date-asc":
          return (
            new Date(a.submittedDate).getTime() -
            new Date(b.submittedDate).getTime()
          );
        case "date-desc":
          return (
            new Date(b.submittedDate).getTime() -
            new Date(a.submittedDate).getTime()
          );
        case "status":
          return a.status.localeCompare(b.status);
        case "product":
          return a.productName.localeCompare(b.productName);
        default:
          return 0;
      }
    });

    return filtered;
  }, [requests, statusFilter, searchTerm, sortBy]);

  const selectedRequest = selectedRequestId
    ? requests.find((req) => req.id === selectedRequestId)
    : null;

  const handleViewDetails = (requestId: string) => {
    setSelectedRequestId(requestId);
  };

  const handleChangeStatus = (requestId: string, newStatus: Status) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === requestId
          ? {
              ...req,
              status: newStatus,
              // Auto-enable chat when moving to in-progress
              ...(newStatus === Status.IN_PROGRESS
                ? { chatEnabled: true }
                : {}),
            }
          : req
      )
    );
  };

  const handleToggleChat = (requestId: string, enabled: boolean) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === requestId ? { ...req, chatEnabled: enabled } : req
      )
    );
  };

  const handleCreateOffer = (requestId: string, price: string) => {
    console.log(`Creating offer for ${requestId}: ${price}`);
    handleChangeStatus(requestId, Status.OFFER_MADE);
  };

  const handleCloseOffer = (requestId: string) => {
    handleChangeStatus(requestId, Status.OFFER_DECLINED);
  };

  return (
     <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#263b51' }}>
            Gadget Request Management
          </h1>
          <p style={{ color: '#456882' }}>
            Manage and track all gadget requests from users
          </p>
        </div>

        <div className="lg:flex lg:gap-6">
          {/* Main Content */}
          <div className={`transition-all duration-300 ${selectedRequest ? "lg:w-2/3" : "w-full"}`}>
            {/* Filters Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#263b51' }}>
                    Status
                  </label>
                  <div className="relative">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ color: '#263b51' }}
                    >
                      <option value="all">All Status</option>
                      {Object.values(Status).map(status => (
                        <option key={status} value={status}>
                          {status.replace('-', ' ').toUpperCase()}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: '#456882' }} />
                  </div>
                </div>

                {/* Search Bar */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#263b51' }}>
                    Search
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: '#456882' }} />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search requests..."
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ color: '#263b51' }}
                    />
                  </div>
                </div>

                {/* Sort Dropdown */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#263b51' }}>
                    Sort By
                  </label>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ color: '#263b51' }}
                    >
                      <option value="date-desc">Latest First</option>
                      <option value="date-asc">Oldest First</option>
                      <option value="status">Status</option>
                      <option value="product">Product Name</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: '#456882' }} />
                  </div>
                </div>

                {/* Date Range Picker Placeholder */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#263b51' }}>
                    Date Range
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: '#456882' }} />
                    <input
                      type="text"
                      placeholder="Select date range"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ color: '#263b51' }}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Requests Table */}
            <RequestsTable
              requests={filteredRequests}
              onViewDetails={handleViewDetails}
              onChangeStatus={handleChangeStatus}
              onToggleChat={handleToggleChat}
            />
          </div>

          {/* Request Details Panel */}
          {selectedRequest && (
            <div className="lg:w-1/3 mt-6 lg:mt-0 transition-all duration-300">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex flex-col">
                {/* Panel Header */}
                <div className="p-4 border-b flex justify-between items-center" style={{ backgroundColor: '#CBDCEB' }}>
                  <h2 className="text-lg font-semibold" style={{ color: '#263b51' }}>
                    Request Details
                  </h2>
                  <button
                    onClick={() => setSelectedRequestId(null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Request Details & Chat */}
                <div className="flex-1 flex flex-col">
                  <div className="p-4 border-b">
                    <div className="space-y-3 text-sm">
                      <div><span className="font-medium" style={{ color: '#456882' }}>Request ID:</span> <span style={{ color: '#263b51' }}>{selectedRequest.id}</span></div>
                      <div><span className="font-medium" style={{ color: '#456882' }}>Submitted:</span> <span style={{ color: '#263b51' }}>{new Date(selectedRequest.submittedDate).toLocaleDateString()}</span></div>
                      <div><span className="font-medium" style={{ color: '#456882' }}>Brand:</span> <span style={{ color: '#263b51' }}>{selectedRequest.brand}</span></div>
                      <div><span className="font-medium" style={{ color: '#456882' }}>Description:</span> <span style={{ color: '#263b51' }}>{selectedRequest.description}</span></div>
                      <div><span className="font-medium" style={{ color: '#456882' }}>Current Status:</span> 
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ml-2 ${statusColors[selectedRequest.status]}`}>
                          {selectedRequest.status.replace('-', ' ').toUpperCase()}
                        </span>
                      </div>
                      {selectedRequest.notes && (
                        <div><span className="font-medium" style={{ color: '#456882' }}>Notes:</span> <span style={{ color: '#263b51' }}>{selectedRequest.notes}</span></div>
                      )}
                    </div>
                  </div>

                  {/* Chat Panel */}
                  <div className="flex-1">
                    <ChatPanel
                      request={selectedRequest}
                      onToggleChat={(enabled) => handleToggleChat(selectedRequest.id, enabled)}
                      onCreateOffer={(price) => handleCreateOffer(selectedRequest.id, price)}
                      onCloseOffer={() => handleCloseOffer(selectedRequest.id)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminGadgetRequestManagement;
