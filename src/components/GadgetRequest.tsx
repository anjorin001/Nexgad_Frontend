import React, { useState } from 'react';
import { Search, Clock, Check, X, Heart, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RequestFormData {
  productName: string;
  category: string;
  brand: string;
  description: string;
  quantity: string;
  budgetRange: string;
  purchaseDate: string;
  imageLink: string;
}

interface UserRequest {
  id: string;
  productName: string;
  category: string;
  status: 'pending' | 'in-progress' | 'found' | 'not-available';
  submittedDate: string;
  estimatedResponse?: string;
  productLink?: string;
  notes?: string;
}

interface CommunityRequest {
  id: string;
  productName: string;
  category: string;
  requestCount: number;
  status: 'available' | 'not-available';
  productLink?: string;
}

enum Status{
    PROGRESS = "in-progress",
    PENDING = "pending",
    FOUND = "found",
    NOT_AVAILABLE = "Not Available",
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
  const [activeTab, setActiveTab] = useState<'request' | 'my-requests' | 'community'>('request');
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
      status: 'found',
      submittedDate: '2025-08-05',
      productLink: '/products/macbook-pro-m4',
      notes: 'Found! Available in Space Gray and Silver'
    },
    {
      id: 'RQ-DEF456ZW',
      productName: 'PlayStation 5 Pro',
      category: 'Gaming & Entertainment',
      status: 'in-progress',
      submittedDate: '2025-08-07',
      estimatedResponse: '2025-08-09',
      notes: 'Checking with suppliers for availability'
    },
    {
      id: 'RQ-GHI789UV',
      productName: 'iPhone 15 Pro Max 1TB Purple',
      category: 'Smartphones & Accessories',
      status: 'pending',
      submittedDate: '2025-08-08',
      estimatedResponse: '2025-08-10'
    },
    {
      id: 'RQ-JKL012ST',
      productName: 'Samsung Galaxy Ring Size 8',
      category: 'Wearables & Fitness',
      status: 'not-available',
      submittedDate: '2025-08-01',
      notes: 'Currently not available in Nigeria market'
    }
  ];

  const communityRequests: CommunityRequest[] = [
    { id: '1', productName: 'iPhone 15 Pro Max 1TB', category: 'Smartphones', requestCount: 47, status: 'available', productLink: '/products/iphone-15-pro-max' },
    { id: '2', productName: 'Steam Deck 2TB', category: 'Gaming', requestCount: 32, status: 'not-available' },
    { id: '3', productName: 'MacBook Pro M4 32GB', category: 'Laptops', requestCount: 28, status: 'available', productLink: '/products/macbook-pro-m4' },
    { id: '4', productName: 'PlayStation 5 Pro', category: 'Gaming', requestCount: 156, status: 'not-available' },
    { id: '5', productName: 'Apple Vision Pro 512GB', category: 'Wearables', requestCount: 89, status: 'not-available' },
    { id: '6', productName: 'Samsung Galaxy S24 Ultra', category: 'Smartphones', requestCount: 23, status: 'available', productLink: '/products/galaxy-s24-ultra' }
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
      }, 5000);
    }
  };

  const isFormValid = formData.productName.trim() && formData.category;

  if (isSubmitted) {
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
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-4 px-6 rounded-2xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105"
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
            onClick={() => setActiveTab('request')}
            className={`flex-1 py-3 px-3 rounded-md font-semibold transition-all duration-300 text-sm ${
              activeTab === 'request'
                ? 'bg-[#263b51] text-white shadow-lg'
                : 'text-gray-600 hover:text-[#456882]'
            }`}
          >
            Make Request
          </button>
          <button
            onClick={() => setActiveTab('my-requests')}
            className={`flex-1 py-3 px-3 rounded-md font-semibold transition-all duration-300 text-sm ${
              activeTab === 'my-requests'
                ? 'bg-[#263b51] text-white shadow-lg'
                : 'text-gray-600 hover:text-[#456882]'
            }`}
          >
            My Requests
          </button>
          <button
            onClick={() => setActiveTab('community')}
            className={`flex-1 py-3 px-3 rounded-md font-semibold transition-all duration-300 text-sm ${
              activeTab === 'community'
                ? 'bg-[#263b51] text-white shadow-lg'
                : 'text-gray-600 hover:text-[#456882]'
            }`}
          >
            Community
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-12">
        {activeTab === 'request' ? (
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
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 hover:scale-105 shadow-lg'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Submit Request
                  </button>
                  
                  <button
                    type="button"
                    className="w-full bg-gray-100 text-gray-700 font-semibold py-4 px-6 rounded-2xl hover:bg-gray-200 transition-colors"
                    onClick={()=> {navigate("/listings")}}
                  >
                    Browse Our Gadgets
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === 'my-requests' ? (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-3">My Requests</h2>
              <p className="text-lg text-gray-600">
                Track the status of your gadget requests
              </p>
            </div>

            {userRequests.length > 0 ? (
              <div className="space-y-6 max-w-4xl mx-auto">
                {userRequests.map((request) => (
                  <div key={request.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-gray-800 text-lg">{request.productName}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            request.status === Status.FOUND
                              ? 'bg-green-100 text-green-800'
                              : request.status === Status.PROGRESS
                              ? 'bg-blue-100 text-blue-800'
                              : request.status === Status.PENDING
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {request.status === Status.FOUND ? 'Found!' 
                             : request.status === Status.PROGRESS ? 'In Progress'
                             : request.status === Status.PENDING ? 'Pending'
                             : 'Not Available'}
                          </span>
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
                        {request.status === Status.FOUND && request.productLink ? (
                          <button className="bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 px-4 rounded-md hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center">
                            <Check className="w-4 h-4 mr-2" />
                            View Gadget
                          </button>
                        ) : request.status === Status.PROGRESS ? (
                          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 px-4 rounded-md flex items-center justify-center">
                            <TrendingUp className="w-4 h-4 mr-2" />
                            In Progress
                          </div>
                        ) : request.status === Status.PENDING ? (
                          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold py-3 px-4 rounded-md flex items-center justify-center">
                            <Clock className="w-4 h-4 mr-2" />
                            Pending
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
        ) : (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-3">Community Requests</h2>
              <p className="text-lg text-gray-600">
                See what other customers are looking for and check availability
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {communityRequests.map((request) => (
                <div key={request.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 text-lg mb-2">{request.productName}</h3>
                      <p className="text-gray-600 text-sm mb-3">{request.category}</p>
                    </div>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Heart className="w-4 h-4 mr-1" />
                      {request.requestCount}
                    </div>
                  </div>

                  {request.status === 'available' ? (
                    <button className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 px-4 rounded-md hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center">
                      <Check className="w-5 h-5 mr-2" />
                      Available - View Gadget
                    </button>
                  ) : (
                    <button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold py-3 px-4 rounded-md hover:from-amber-600 hover:to-amber-700 transition-all duration-300 flex items-center justify-center">
                      <Clock className="w-5 h-5 mr-2" />
                      Not Available Yet
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestGadgetComponent;