import React, { useState } from 'react';
import { Search, Clock, Check, X, TrendingUp, ChevronDown, ChevronUp, Send, MessageCircle, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RequestFormData {
  productName: string;
  category: string;
  brand: string;
  description: string;
  quantity: string;
  budgetRange: string;
  purchaseDate: string; //TODO remove this guy it woudnt work
  imageLink: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'admin';
  message: string;
  timestamp: string;
}

interface UserRequest {
  id: string;
  productName: string;
  category: string;
  status: 'pending' | 'in-progress' | 'not-available' | 'offer-made' | 'offer-declined' | 'offer-expired' | 'paid' | 'shipped' | 'completed';
  submittedDate: string;
  estimatedResponse?: string;
  notes?: string;
  chatMessages?: ChatMessage[];
  chatEnabled?: boolean; // Admin controls if chat is open for user
  offerExpiry?: string; // For offer-made and offer-expired statuses
}

enum Status{
    PENDING = "pending",
    IN_PROGRESS = "in-progress",
    NOT_AVAILABLE = "not-available",
    OFFER_MADE = "offer-made",
    OFFER_DECLINED = "offer-declined",
    OFFER_EXPIRED = "offer-expired",
    PAID = "paid",
    SHIPPED = "shipped", //TODO remove this order will handle this
    COMPLETED = "completed",//TODO remove this order will handle this
}

const RequestGadgetComponent: React.FC = () => {
  const [formData, setFormData] = useState<RequestFormData>({
    productName: '',
    category: '',
    brand: '',
    description: '',
    quantity: '1',
    budgetRange: '',
    purchaseDate: '',
    imageLink: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [requestId, setRequestId] = useState('');
  const [activeTab, setActiveTab] = useState<'request' | 'my-requests'>('request');
  const [openChatRequests, setOpenChatRequests] = useState<Set<string>>(new Set());
  const [newMessages, setNewMessages] = useState<Record<string, string>>({});
  const navigate = useNavigate()
  
  const categories = [
    'Smartphones & Accessories',
    'Laptops & Computers',
    'Gaming & Entertainment',
    'Smart Home & IoT',
    'Wearables & Fitness',
    'Audio & Headphones',
    'Cameras & Photography',
    'Tablets & E-readers',
    'Other'
  ];

  const budgetRanges = [
    'Under ₦25,000',
    '₦25,000 - ₦50,000',
    '₦50,000 - ₦100,000',
    '₦100,000 - ₦250,000',
    '₦250,000 - ₦500,000',
    '₦500,000 - ₦1,000,000',
    'Above ₦1,000,000',
    'No Budget Limit'
  ];

  const userRequests: UserRequest[] = [
    {
      id: 'RQ-ABC123XY',
      productName: 'MacBook Pro M4 32GB',
      category: 'Laptops & Computers',
      status: 'pending',
      submittedDate: '2025-08-05',
      notes: 'Request received and queued for processing'
    },
    {
      id: 'RQ-DEF456ZW',
      productName: 'PlayStation 5 Pro',
      category: 'Gaming & Entertainment',
      status: 'in-progress',
      submittedDate: '2025-08-07',
      estimatedResponse: '2025-08-09',
      notes: 'Checking with suppliers for availability',
      chatEnabled: true,
      chatMessages: [
        {
          id: '1',
          sender: 'admin',
          message: 'Hi! I\'m checking with our suppliers for the PlayStation 5 Pro. I found one supplier who has it in stock.',
          timestamp: '2025-08-07T10:30:00Z'
        },
        {
          id: '2',
          sender: 'user',
          message: 'Great! What would be the price?',
          timestamp: '2025-08-07T11:15:00Z'
        },
        {
          id: '3',
          sender: 'admin',
          message: 'The supplier is offering it for $650. This includes 1-year warranty. Would this work for you?',
          timestamp: '2025-08-07T14:20:00Z'
        }
      ]
    },
    {
      id: 'RQ-GHI789UV',
      productName: 'iPhone 15 Pro Max 1TB Purple',
      category: 'Smartphones & Accessories',
      status: 'offer-made',
      submittedDate: '2025-08-08',
      notes: 'Offer created! Check your email for payment link.',
      offerExpiry: '2025-08-12T23:59:59Z'
    },
    {
      id: 'RQ-JKL012ST',
      productName: 'Samsung Galaxy Ring Size 8',
      category: 'Wearables & Fitness',
      status: 'not-available',
      submittedDate: '2025-08-01',
      notes: 'Currently not available in Nigeria market'
    },
    {
      id: 'RQ-MNO345QR',
      productName: 'Apple Vision Pro 512GB',
      category: 'Wearables & Fitness',
      status: 'offer-declined',
      submittedDate: '2025-07-28',
      notes: 'Price negotiation unsuccessful. Request closed by admin.'
    },
    {
      id: 'RQ-PQR678ST',
      productName: 'Steam Deck 1TB',
      category: 'Gaming & Entertainment',
      status: 'offer-expired',
      submittedDate: '2025-07-25',
      notes: 'Payment not completed within 48 hours. Offer has expired.',
      offerExpiry: '2025-08-08T23:59:59Z'
    },
    {
      id: 'RQ-UVW901XY',
      productName: 'MacBook Air M3',
      category: 'Laptops & Computers',
      status: 'paid',
      submittedDate: '2025-07-20',
      notes: 'Payment confirmed! Your order is being prepared for shipment.'
    },
    {
      id: 'RQ-ZAB234CD',
      productName: 'iPhone 14 Pro 256GB',
      category: 'Smartphones & Accessories',
      status: 'shipped',
      submittedDate: '2025-07-15',
      notes: 'Your gadget has been shipped! Tracking: NGP123456789'
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    if (formData.productName && formData.category) {
      const newRequestId = 'RQ-' + Math.random().toString(36).substr(2, 8).toUpperCase();
      setRequestId(newRequestId);
      setIsSubmitted(true);
      
      // Reset form after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          productName: '',
          category: '',
          brand: '',
          description: '',
          quantity: '1',
          budgetRange: '',
          purchaseDate: '',
          imageLink: ''
        });
      }, 20000);
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

  const handleSendMessage = (requestId: string) => {
    const message = newMessages[requestId]?.trim();
    if (!message) return;

    // Here you would typically send the message to your backend
    console.log(`Sending message for request ${requestId}: ${message}`);
    
    // Clear the input
    setNewMessages({
      ...newMessages,
      [requestId]: ''
    });
  };

  const handleMessageChange = (requestId: string, value: string) => {
    setNewMessages({
      ...newMessages,
      [requestId]: value
    });
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case Status.PENDING:
        return { color: 'bg-yellow-100 text-yellow-800', label: 'Pending', icon: Clock };
      case Status.IN_PROGRESS:
        return { color: 'bg-blue-100 text-blue-800', label: 'In Progress', icon: TrendingUp };
      case Status.NOT_AVAILABLE:
        return { color: 'bg-red-100 text-red-800', label: 'Not Available', icon: X };
      case Status.OFFER_MADE:
        return { color: 'bg-green-100 text-green-800', label: 'Offer Made - Check Email', icon: Check };
      case Status.OFFER_DECLINED:
        return { color: 'bg-orange-100 text-orange-800', label: 'Offer Declined', icon: X };
      case Status.OFFER_EXPIRED:
        return { color: 'bg-gray-100 text-gray-800', label: 'Offer Expired', icon: Clock };
      case Status.PAID:
        return { color: 'bg-emerald-100 text-emerald-800', label: 'Payment Confirmed', icon: Check };
      case Status.SHIPPED:
        return { color: 'bg-purple-100 text-purple-800', label: 'Shipped', icon: TrendingUp };
      case Status.COMPLETED:
        return { color: 'bg-teal-100 text-teal-800', label: 'Completed', icon: Check };
      default:
        return { color: 'bg-gray-100 text-gray-800', label: 'Unknown', icon: Clock };
    }
  };

  const canShowChat = (request: UserRequest) => {
    return request.status === Status.IN_PROGRESS && request.chatEnabled;
  };

  const formatExpiry = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const hoursLeft = Math.max(0, Math.floor((expiry.getTime() - now.getTime()) / (1000 * 60 * 60)));
    
    if (hoursLeft > 24) {
      return `Expires in ${Math.floor(hoursLeft / 24)} day(s)`;
    } else if (hoursLeft > 0) {
      return `Expires in ${hoursLeft} hour(s)`;
    } else {
      return 'Expired';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-GB', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isFormValid = formData.productName.trim() && formData.category;

  if (isSubmitted) { //TODO move this guy to a component
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Request Submitted Successfully!</h2>
            <p className="text-lg text-gray-600 mb-6">
              We've received your gadget request and our team is already working on it.
            </p>
            <div className="bg-blue-50 rounded-2xl p-6 mb-6">
              <p className="text-sm text-gray-500 mb-2">Your Request ID</p>
              <p className="text-2xl font-mono font-bold text-blue-600">{requestId}</p>
            </div>
            <div className="flex items-center justify-center text-amber-600 mb-6">
              <Clock className="w-5 h-5 mr-2" />
              <span className="font-medium">We'll reply within 48 hours</span>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => setIsSubmitted(false)}
                className="w-full bg-[#263b51] text-white font-semibold py-4 px-6 rounded-2x transition-all duration-300 transform hover:scale-105"
              >
                Submit Another Request
              </button>
              <button className="w-full bg-gray-100 text-gray-700 font-semibold py-4 px-6 rounded-2xl hover:bg-gray-200 transition-colors">
                Browse Our Gadgets
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 pt-12 pb-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">Can't Find What You're Looking For?</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tell us what gadget you need — we'll notify you the moment it becomes available in our store.
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
                      Quantity
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full p-4 border-2 border-gray-200 rounded-md focus:border-blue-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Any specific features or requirements you're looking for..."
                    rows={3}
                    className="w-full p-4 border-2 border-gray-200 rounded-md focus:border-blue-500 focus:outline-none transition-colors resize-none"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Budget Range
                    </label>
                    <select
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

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Preferred Purchase Date
                    </label>
                    <input
                      type="date"
                      name="purchaseDate"
                      value={formData.purchaseDate}
                      onChange={handleInputChange}
                      className="w-full p-4 border-2 border-gray-200 rounded-md focus:border-blue-500 focus:outline-none transition-colors"
                    />
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
                    disabled={!isFormValid}
                    className={`w-full font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform ${
                      isFormValid
                        ? "bg-[#263b51] text-white hover:scale-105 shadow-lg"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Submit Request
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
              <h2 className="text-3xl font-bold text-gray-800 mb-3">My Requests</h2>
              <p className="text-lg text-gray-600">
                Track the status of your gadget requests
              </p>
              
              {/* Info Notice */}
              <div className="max-w-2xl mx-auto mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-blue-800 mb-1">Payment Information</p>
                    <p className="text-sm text-blue-700">
                      After admin creates an offer with concluded price, make sure to check your email for a link to continue to payment.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {userRequests.length > 0 ? (
              <div className="space-y-6 max-w-4xl mx-auto">
                {userRequests.map((request) => (
                  <div key={request.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-gray-800 text-lg">{request.productName}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusConfig(request.status).color}`}>
                              {getStatusConfig(request.status).label}
                            </span>
                            {request.status === Status.OFFER_MADE && request.offerExpiry && (
                              <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md">
                                {formatExpiry(request.offerExpiry)}
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm mb-2">{request.category}</p>
                          <div className="flex items-center text-gray-500 text-sm gap-4">
                            <span>Request ID: {request.id}</span>
                            <span>•</span>
                            <span>Submitted: {new Date(request.submittedDate).toLocaleDateString()}</span>
                            {request.estimatedResponse && (
                              <>
                                <span>•</span>
                                <span>Expected: {new Date(request.estimatedResponse).toLocaleDateString()}</span>
                              </>
                            )}
                          </div>
                          {request.notes && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-700">{request.notes}</p>
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
                                  onClick={() => toggleChat(request.id)}
                                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold py-2 px-4 rounded-md hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center text-sm"
                                >
                                  <MessageCircle className="w-4 h-4 mr-2" />
                                  Chat
                                  {openChatRequests.has(request.id) ? (
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
                          ) : request.status === Status.SHIPPED ? (
                            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold py-3 px-4 rounded-md flex items-center justify-center">
                              <TrendingUp className="w-4 h-4 mr-2" />
                              Shipped
                            </div>
                          ) : request.status === Status.COMPLETED ? (
                            <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold py-3 px-4 rounded-md flex items-center justify-center">
                              <Check className="w-4 h-4 mr-2" />
                              Completed
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

                    {/* Chat Section - Only for in-progress requests where admin enabled chat */}
                    {canShowChat(request) && openChatRequests.has(request.id) && (
                      <div className="border-t border-gray-200 bg-gray-50">
                        <div className="p-6">
                          <div className="flex items-center gap-2 mb-4">
                            <MessageCircle className="w-5 h-5 text-gray-600" />
                            <h4 className="font-semibold text-gray-800">Chat with Admin</h4>
                          </div>
                          
                          {/* Chat Messages */}
                          <div className="bg-white rounded-lg border border-gray-200 mb-4 max-h-80 overflow-y-auto">
                            {request.chatMessages && request.chatMessages.length > 0 ? (
                              <div className="p-4 space-y-4">
                                {request.chatMessages.map((message) => (
                                  <div
                                    key={message.id}
                                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                  >
                                    <div
                                      className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                                        message.sender === 'user'
                                          ? 'bg-blue-600 text-white'
                                          : 'bg-gray-100 text-gray-800'
                                      }`}
                                    >
                                      <p className="text-sm">{message.message}</p>
                                      <p className={`text-xs mt-1 ${
                                        message.sender === 'user' ? 'text-blue-200' : 'text-gray-500'
                                      }`}>
                                        {formatTimestamp(message.timestamp)}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="p-4 text-center text-gray-500">
                                <p className="text-sm">Admin will start the conversation when ready!</p>
                              </div>
                            )}
                          </div>
                          
                          {/* Message Input - Only show if admin has started conversation */}
                          {request.chatMessages && request.chatMessages.length > 0 ? (
                            <div className="flex gap-3">
                              <input
                                type="text"
                                value={newMessages[request.id] || ''}
                                onChange={(e) => handleMessageChange(request.id, e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    handleSendMessage(request.id);
                                  }
                                }}
                              />
                              <button
                                onClick={() => handleSendMessage(request.id)}
                                disabled={!newMessages[request.id]?.trim()}
                                className={`px-4 py-3 rounded-lg font-semibold transition-all duration-300 ${
                                  newMessages[request.id]?.trim()
                                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                              >
                                <Send className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
                              <p className="text-sm text-gray-500">
                                💬 Waiting for admin to start the conversation...
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Requests Yet</h3>
                <p className="text-gray-500 mb-6">You haven't submitted any gadget requests yet.</p>
                <button
                  onClick={() => setActiveTab('request')}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 px-6 rounded-md hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
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