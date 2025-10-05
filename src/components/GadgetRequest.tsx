import {
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Info,
  Loader2,
  MessageCircle,
  Search,
  Send,
  TrendingUp,
  X,
} from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { categories } from "../admin/components/PromoCodeDiscount/types";
import type { ChatMessage } from "../hooks/useChat";
import { getStatusClasses } from "../utils/SseGetStatusColour";
import SubmitedModal from "./gadgetRequestComponents/SubmitedModal";
import {
  budgetRanges,
  getStatusConfig,
  Status,
  UserRole,
  type IGadgetRequest,
  type RequestFormData,
} from "./gadgetRequestComponents/gadgetRequestInterface";
import Loader from "./nexgadMidPageLoader";

interface gadgetRequestProp {
  onSubmitRequest: (formData: RequestFormData) => void;
  isSubmitted: boolean;
  requestId: string;
  setIsSubmitted: () => void;
  isLoading: boolean;
  isMessageLoading: boolean;
  onSendMessage: () => void;
  messages: ChatMessage[];
  onMessageChange: (value: string) => void;
  requests: IGadgetRequest[];
  isPageLoading: boolean;
  onSetSelectedRequest: (request: IGadgetRequest) => void;
  onCloseConnection: () => void;
  connectionStatus: string;
  text: string;
  isSending: boolean;
}

const RequestGadgetComponent: React.FC<gadgetRequestProp> = ({
  onSubmitRequest,
  isSubmitted,
  requestId,
  setIsSubmitted,
  isLoading,
  onSendMessage,
  messages,
  onMessageChange,
  requests,
  isPageLoading,
  onSetSelectedRequest,
  isMessageLoading,
  onCloseConnection,
  connectionStatus,
  text,
  isSending,
}) => {
  const [formData, setFormData] = useState<RequestFormData>({
    productName: "",
    category: "",
    brand: "",
    description: "",
    quantity: 1,
    budgetRange: "",
    imageLink: "",
  });

  const [activeTab, setActiveTab] = useState<"request" | "my-requests">(
    "request"
  );
  const [openChatRequests, setOpenChatRequests] = useState<Set<string>>(
    new Set()
  );

  const navigate = useNavigate();
  // console.log("message", messages)
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    if (
      formData.productName &&
      formData.category &&
      formData.description &&
      formData.quantity > 0 &&
      formData.budgetRange
    ) {
      onSubmitRequest(formData);
    }
  };

  const toggleChat = (requestId: string) => {
    const newOpenChats = new Set(openChatRequests);
    if (newOpenChats.has(requestId)) {
      newOpenChats.delete(requestId);
    } else {
      newOpenChats.add(requestId);
    }
    setOpenChatRequests(newOpenChats);
  };

  const canShowChat = (request: IGadgetRequest) => {
    return request.status === Status.IN_PROGRESS && request.chatEnabled; //TODO notify admin to know that status has to be in progress and chat enabled
  };

  const formatExpiry = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const hoursLeft = Math.max(
      0,
      Math.floor((expiry.getTime() - now.getTime()) / (1000 * 60 * 60))
    );

    if (hoursLeft > 24) {
      return `Expires in ${Math.floor(hoursLeft / 24)} day(s)`;
    } else if (hoursLeft > 0) {
      return `Expires in ${hoursLeft} hour(s)`;
    } else {
      return "Expired";
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("en-GB", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isFormValid =
    formData.productName.trim() &&
    formData.category &&
    formData.description &&
    formData.quantity > 0 &&
    formData.budgetRange !== "";

  const handleViewChat = (request: IGadgetRequest) => {
    toggleChat(request._id);
    if (openChatRequests.has(request._id)) {
      onCloseConnection();
    } else {
      onSetSelectedRequest(request);
    }
  };

  if (isSubmitted) {
    return (
      <SubmitedModal
        onClose={() => {
          setIsSubmitted();
          setFormData({
            productName: "",
            category: "",
            brand: "",
            description: "",
            quantity: 1,
            budgetRange: "",
            imageLink: "",
          });
        }}
        requestId={requestId}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 pt-12 pb-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            Can't Find What You're Looking For?
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tell us what gadget you need — we'll notify you the moment it
            becomes available in our store.
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex bg-white rounded-2xl p-2 shadow-lg mb-8 max-w-lg mx-auto">
          <button
            onClick={() => setActiveTab("request")}
            className={`flex-1 py-3 px-3 rounded-md font-semibold transition-all duration-300 text-sm ${
              activeTab === "request"
                ? "bg-[#263b51] text-white shadow-lg"
                : "text-gray-600 hover:text-[#456882]"
            }`}
          >
            Make Request
          </button>
          <button
            onClick={() => setActiveTab("my-requests")}
            className={`flex-1 py-3 px-3 rounded-md font-semibold transition-all duration-300 text-sm ${
              activeTab === "my-requests"
                ? "bg-[#263b51] text-white shadow-lg"
                : "text-gray-600 hover:text-[#456882]"
            }`}
          >
            My Requests
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-12">
        {activeTab === "request" ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <div className="space-y-6">
                {/* Required Fields */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      name="productName"
                      value={formData.productName}
                      onChange={handleInputChange}
                      placeholder="e.g., iPhone 15 Pro Max"
                      className="w-full p-4 border-2 border-gray-200 rounded-md focus:border-blue-500 focus:outline-none transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full p-4 border-2 border-gray-200 rounded-md focus:border-blue-500 focus:outline-none transition-colors"
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Optional Fields */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Brand/Model
                    </label>
                    <input
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                      placeholder="e.g., Apple, Samsung"
                      className="w-full p-4 border-2 border-gray-200 rounded-md focus:border-blue-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Quantity *
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      min={1}
                      className="w-full p-4 border-2 border-gray-200 rounded-md focus:border-blue-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Any specific features or requirements you're looking for..."
                    rows={3}
                    className="w-full p-4 border-2 border-gray-200 rounded-md focus:border-blue-500 focus:outline-none transition-colors resize-none"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Budget Range *
                    </label>
                    <select
                      required
                      name="budgetRange"
                      value={formData.budgetRange}
                      onChange={handleInputChange}
                      className="w-full p-4 border-2 border-gray-200 rounded-md focus:border-blue-500 focus:outline-none transition-colors"
                    >
                      <option value="">Select budget range</option>
                      {budgetRanges.map((range) => (
                        <option key={range} value={range}>
                          {range}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Image/Link
                  </label>
                  <input
                    type="url"
                    name="imageLink"
                    value={formData.imageLink}
                    onChange={handleInputChange}
                    placeholder="https://example.com/product-image"
                    className="w-full p-4 border-2 border-gray-200 rounded-md focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>

                {/* Action Buttons */}
                <div className="space-y-4 pt-4">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!isFormValid || isLoading}
                    className={`w-full font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform ${
                      isFormValid
                        ? "bg-[#263b51] text-white hover:scale-105 shadow-lg"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {isLoading ? (
                      <div className="flex justify-center align-middle">
                        <Loader2 className="w-6 h-6 animate-spin mr-2" />
                        Submitting...
                      </div>
                    ) : (
                      "Submit Request"
                    )}
                  </button>

                  <button
                    type="button"
                    className="w-full bg-gray-100 text-gray-700 font-semibold py-4 px-6 rounded-2xl hover:bg-gray-200 transition-colors"
                    onClick={() => {
                      navigate("/listings");
                    }}
                  >
                    Browse Our Gadgets
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-3">
                My Requests
              </h2>
              <p className="text-lg text-gray-600">
                Track the status of your gadget requests
              </p>

              {/* Info Notice */}
              <div className="max-w-2xl mx-auto mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-blue-800 mb-1">
                      Payment Information
                    </p>
                    <p className="text-sm text-blue-700">
                      After admin creates an offer with concluded price, make
                      sure to check your email for a link to continue to
                      payment.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {isPageLoading ? (
              <div className="flex justify-center items-center">
                <Loader size={64} thickness={1} />
              </div>
            ) : requests?.length > 0 ? (
              <div className="space-y-6 max-w-4xl mx-auto">
                {requests?.map((request) => {
                  const cls = getStatusClasses(connectionStatus as any);
                  return (
                    <div
                      key={request._id}
                      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                    >
                      <div className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-bold text-gray-800 text-lg">
                                {request.productName}
                              </h3>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  getStatusConfig(request.status).color
                                }`}
                              >
                                {getStatusConfig(request.status).label}
                              </span>
                              {request.status === Status.OFFER_MADE &&
                                request.offerExpiry && (
                                  <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md">
                                    {formatExpiry(request.offerExpiry)}
                                  </span>
                                )}
                            </div>
                            <p className="text-gray-600 text-sm mb-2">
                              {request.category}
                            </p>
                            <div className="flex items-center text-gray-500 text-sm gap-4">
                              <span>Request ID: {request.requestId}</span>
                              <span>•</span>
                              <span>
                                Submitted:{" "}
                                {new Date(
                                  request.createdAt
                                ).toLocaleDateString()}
                              </span>
                              {request.estimatedResponse && (
                                <>
                                  <span>•</span>
                                  <span>
                                    Estimated Response:{" "}
                                    {new Date(
                                      request.estimatedResponse
                                    ).toLocaleDateString()}
                                  </span>
                                </>
                              )}
                            </div>
                            {request.notes && (
                              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-700">
                                  {request.notes}
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col gap-2 md:min-w-[160px]">
                            {request.status === Status.IN_PROGRESS ? (
                              <div className="flex flex-col gap-2">
                                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 px-4 rounded-md flex items-center justify-center">
                                  <TrendingUp className="w-4 h-4 mr-2" />
                                  In Progress
                                </div>
                                {canShowChat(request) && (
                                  <button
                                    onClick={() => handleViewChat(request)}
                                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold py-2 px-4 rounded-md hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center text-sm"
                                  >
                                    <MessageCircle className="w-4 h-4 mr-2" />
                                    Chat
                                    {openChatRequests.has(request._id) ? (
                                      <ChevronUp className="w-4 h-4 ml-1" />
                                    ) : (
                                      <ChevronDown className="w-4 h-4 ml-1" />
                                    )}
                                  </button>
                                )}
                              </div>
                            ) : request.status === Status.PENDING ? (
                              <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold py-3 px-4 rounded-md flex items-center justify-center">
                                <Clock className="w-4 h-4 mr-2" />
                                Pending
                              </div>
                            ) : request.status === Status.OFFER_MADE ? (
                              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 px-4 rounded-md flex items-center justify-center">
                                <Check className="w-4 h-4 mr-2" />
                                Check Email
                              </div>
                            ) : request.status === Status.OFFER_DECLINED ? (
                              <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3 px-4 rounded-md flex items-center justify-center">
                                <X className="w-4 h-4 mr-2" />
                                Declined
                              </div>
                            ) : request.status === Status.OFFER_EXPIRED ? (
                              <div className="bg-gradient-to-r from-gray-500 to-gray-600 text-white font-semibold py-3 px-4 rounded-md flex items-center justify-center">
                                <Clock className="w-4 h-4 mr-2" />
                                Expired
                              </div>
                            ) : request.status === Status.PAID ? (
                              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold py-3 px-4 rounded-md flex items-center justify-center">
                                <Check className="w-4 h-4 mr-2" />
                                Paid
                              </div>
                            ) : (
                              <div className="bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold py-3 px-4 rounded-md flex items-center justify-center">
                                <X className="w-4 h-4 mr-2" />
                                Not Available
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {canShowChat(request) &&
                        openChatRequests.has(request._id) && (
                          <div className="border-t border-gray-200 bg-gray-50">
                            <div className="p-6">
                              <div className="flex items-center gap-2 mb-4">
                                <MessageCircle className="w-5 h-5 text-gray-600" />
                                <h4 className="font-semibold text-gray-800">
                                  Chat with Admin
                                </h4>
                                <span
                                  role="status"
                                  aria-live="polite"
                                  className={`inline-flex items-center gap-2 text-sm font-medium px-2.5 py-1 rounded-full ${cls.bg} ${cls.text}`}
                                  title={cls.label}
                                >
                                  <span
                                    className={`w-2.5 h-2.5 rounded-full ${cls.dot}`}
                                    aria-hidden="true"
                                  />
                                  <span>{cls.label}</span>
                                </span>
                              </div>

                              {/* Chat Messages */}
                              <div className="bg-white rounded-lg border border-gray-200 mb-4 max-h-80 overflow-y-auto">
                                {isMessageLoading ||
                                connectionStatus === "connecting" ? (
                                  <div className="flex justify-center align-middle">
                                    <div className="col-span-full flex justify-center items-center py-12">
                                      <Loader size={23} thickness={1} />
                                    </div>
                                  </div>
                                ) : messages && messages?.length > 0 ? (
                                  <div className="p-4 space-y-4">
                                    {messages?.map((message) => {
                                      const isUser =
                                        message.senderRole === UserRole.USER;
                                      const isAdmin =
                                        message.senderRole === UserRole.ADMIN;

                                      return (
                                        <div
                                          key={message._id || Date.now()}
                                          className={`flex ${
                                            isUser
                                              ? "justify-end"
                                              : "justify-start"
                                          }`}
                                        >
                                          <div
                                            className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                                              isUser
                                                ? "bg-blue-600 text-white"
                                                : isAdmin
                                                ? "bg-gray-200 text-gray-800"
                                                : "bg-gray-100 text-gray-800"
                                            }`}
                                          >
                                            <p className="text-sm">
                                              {message.message}
                                            </p>
                                            <p
                                              className={`text-xs mt-1 ${
                                                isUser
                                                  ? "text-blue-200"
                                                  : "text-gray-500"
                                              }`}
                                            >
                                              {formatTimestamp(
                                                message.createdAt ??
                                                  new Date().toISOString()
                                              )}
                                            </p>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                ) : (
                                  <div className="p-4 text-center text-gray-500">
                                    <p className="text-sm">
                                      Admin will start the conversation when
                                      ready!
                                    </p>
                                  </div>
                                )}
                              </div>

                              {/* Message Input - Only show if admin has started conversation */}
                              {messages && messages?.length > 0 ? (
                                <div className="flex gap-3">
                                  <input
                                    type="text"
                                    value={text || ""}
                                    onChange={(e) =>
                                      onMessageChange(e.target.value)
                                    }
                                    placeholder="Type your message..."
                                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                                    onKeyPress={(e) => {
                                      if (e.key === "Enter") {
                                        onSendMessage();
                                      }
                                    }}
                                  />
                                  <button
                                    onClick={() => onSendMessage()}
                                    disabled={isSending || !text.trim()}
                                    className={`px-4 py-3 rounded-lg font-semibold transition-all duration-300 ${
                                      !isSending && text.trim()
                                        ? "bg-blue-600 text-white hover:bg-blue-700"
                                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    }`}
                                  >
                                    {isSending ? (
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                      <Send className="w-4 h-4" />
                                    )}
                                  </button>
                                </div>
                              ) : (
                                <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
                                  <p className="text-sm text-gray-500">
                                    💬 Waiting for admin to start the
                                    conversation...
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No Requests Yet
                </h3>
                <p className="text-gray-500 mb-6">
                  You haven't submitted any gadget requests yet.
                </p>
                <button
                  onClick={() => setActiveTab("request")}
                  className="bg-[#263b51] text-white font-semibold py-3 px-6 rounded-md hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
                >
                  Make Your First Request
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestGadgetComponent;
