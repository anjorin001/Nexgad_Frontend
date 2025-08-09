import React, { useState } from "react";
import {
  FaBox,
  FaCalendarAlt,
  FaCheckCircle,
  FaDownload,
  FaExclamationTriangle,
  FaEye,
  FaFilter,
  FaMapMarkerAlt,
  FaPhone,
  FaReceipt,
  FaRedo,
  FaSearch,
  FaShoppingBag,
  FaStar,
  FaTimesCircle,
  FaTruck,
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";

// Types
interface OrderItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  orderNumber: string;
  status:
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "returned";
  items: OrderItem[];
  totalAmount: number;
  orderDate: string;
  deliveryDate?: string;
  shippingAddress: string;
  paymentMethod: string;
  trackingNumber?: string;
  seller: {
    name: string;
    id: string;
  };
  estimatedDelivery?: string;
  cancellationReason?: string;
  returnReason?: string;
}

interface OrdersPageProps {
  onViewOrderDetails?: (orderId: string) => void;
  onReorder?: (orderId: string) => void;
  onTrackOrder?: (trackingNumber: string) => void;
  onContactSeller?: (sellerId: string) => void;
  onDownloadInvoice?: (orderId: string) => void;
  onRateOrder?: (orderId: string) => void;
}

const OrdersPage: React.FC<OrdersPageProps> = ({
  onViewOrderDetails,
  onReorder,
  onTrackOrder,
  onContactSeller,
  onDownloadInvoice,
  onRateOrder,
}) => {
  const [activeTab, setActiveTab] = useState<"active" | "inactive">("active");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const navigate = useNavigate()
  // Sample orders data
  const allOrders: Order[] = [
    {
      id: "1",
      orderNumber: "NG-2024-001",
      status: "delivered",
      items: [
        {
          id: "1",
          name: "MacBook Pro M2 14-inch",
          brand: "Apple",
          price: 850000,
          quantity: 1,
          image:
            "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=200&h=200&fit=crop",
        },
        {
          id: "2",
          name: "Magic Mouse",
          brand: "Apple",
          price: 45000,
          quantity: 1,
          image:
            "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200&h=200&fit=crop",
        },
      ],
      totalAmount: 895000,
      orderDate: "2024-07-15",
      deliveryDate: "2024-07-20",
      shippingAddress: "Lagos, Victoria Island",
      paymentMethod: "Card ending in 4567",
      trackingNumber: "TRK123456789",
      seller: {
        name: "TechHub Lagos",
        id: "seller-1",
      },
    },
    {
      id: "2",
      orderNumber: "NG-2024-002",
      status: "shipped",
      items: [
        {
          id: "3",
          name: "iPhone 14 Pro Max 256GB",
          brand: "Apple",
          price: 650000,
          quantity: 1,
          image:
            "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=200&h=200&fit=crop",
        },
      ],
      totalAmount: 650000,
      orderDate: "2024-07-25",
      shippingAddress: "Abuja, Wuse 2",
      paymentMethod: "Bank Transfer",
      trackingNumber: "TRK987654321",
      estimatedDelivery: "2024-08-05",
      seller: {
        name: "Mobile World Abuja",
        id: "seller-2",
      },
    },
    {
      id: "3",
      orderNumber: "NG-2024-003",
      status: "processing",
      items: [
        {
          id: "4",
          name: "Samsung Galaxy S23 Ultra",
          brand: "Samsung",
          price: 580000,
          quantity: 1,
          image:
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&h=200&fit=crop",
        },
      ],
      totalAmount: 580000,
      orderDate: "2024-07-30",
      shippingAddress: "Lagos, Ikeja",
      paymentMethod: "Card ending in 1234",
      estimatedDelivery: "2024-08-10",
      seller: {
        name: "Galaxy Store Lagos",
        id: "seller-3",
      },
    },
    {
      id: "4",
      orderNumber: "NG-2024-004",
      status: "cancelled",
      items: [
        {
          id: "5",
          name: "Dell XPS 13 Laptop",
          brand: "Dell",
          price: 420000,
          quantity: 1,
          image:
            "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&h=200&fit=crop",
        },
      ],
      totalAmount: 420000,
      orderDate: "2024-07-18",
      shippingAddress: "Port Harcourt, GRA",
      paymentMethod: "Card ending in 7890",
      cancellationReason: "Out of stock",
      seller: {
        name: "Laptop Hub PH",
        id: "seller-4",
      },
    },
    {
      id: "5",
      orderNumber: "NG-2024-005",
      status: "returned",
      items: [
        {
          id: "6",
          name: "Sony WH-1000XM5 Headphones",
          brand: "Sony",
          price: 180000,
          quantity: 1,
          image:
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop",
        },
      ],
      totalAmount: 180000,
      orderDate: "2024-07-10",
      deliveryDate: "2024-07-15",
      shippingAddress: "Kano, Fagge",
      paymentMethod: "Bank Transfer",
      returnReason: "Defective product",
      seller: {
        name: "Audio Pro Kano",
        id: "seller-5",
      },
    },
  ];

  // Filter orders based on active tab
  const activeOrders = allOrders.filter((order) =>
    ["pending", "processing", "shipped", "delivered"].includes(order.status)
  );

  const inactiveOrders = allOrders.filter((order) =>
    ["cancelled", "returned"].includes(order.status)
  );

  const currentOrders = activeTab === "active" ? activeOrders : inactiveOrders;

  // Filter orders based on search and status
  const filteredOrders = currentOrders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatPrice = (price: number): string => {
    return price.toLocaleString("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    });
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <FaBox className="text-yellow-500" />;
      case "processing":
        return <FaBox className="text-blue-500" />;
      case "shipped":
        return <FaTruck className="text-purple-500" />;
      case "delivered":
        return <FaCheckCircle className="text-green-500" />;
      case "cancelled":
        return <FaTimesCircle className="text-red-500" />;
      case "returned":
        return <FaRedo className="text-orange-500" />;
      default:
        return <FaBox className="text-gray-500" />;
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "returned":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleViewDetails = (orderId: string): void => {
    onViewOrderDetails?.(orderId);
    navigate(`/my-orders/${orderId}`)
    console.log("Viewing order details:", orderId);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    setStatusFilter(e.target.value);
  };

  if (currentOrders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <FaShoppingBag className="mx-auto text-6xl text-[#CBDCEB] mb-6" />
            <h2 className="text-2xl font-bold text-[#1B3C53] mb-4">
              No orders found
            </h2>
            <p className="text-gray-600 mb-8">
              {activeTab === "active"
                ? "You haven't placed any orders yet."
                : "No cancelled or returned orders."}
            </p>
            <NavLink
              to="/listings"
              className="inline-flex items-center space-x-2 bg-[#1B3C53] text-white px-8 py-3 rounded-lg hover:bg-[#456882] transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <FaShoppingBag className="text-sm" />
              <span>Start Shopping</span>
            </NavLink>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1B3C53] mb-2">My Orders</h1>
          <p className="text-gray-600">Track and manage your orders</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("active")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === "active"
                    ? "border-[#1B3C53] text-[#1B3C53]"
                    : "border-transparent text-gray-500 hover:text-[#456882]"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <FaTruck className="text-sm" />
                  <span>Active Orders</span>
                  <span className="bg-[#CBDCEB] text-[#1B3C53] px-2 py-1 rounded-full text-xs font-semibold">
                    {activeOrders.length}
                  </span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab("inactive")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === "inactive"
                    ? "border-[#1B3C53] text-[#1B3C53]"
                    : "border-transparent text-gray-500 hover:text-[#456882]"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <FaTimesCircle className="text-sm" />
                  <span>Cancelled/Returned</span>
                  <span className="bg-[#CBDCEB] text-[#1B3C53] px-2 py-1 rounded-full text-xs font-semibold">
                    {inactiveOrders.length}
                  </span>
                </div>
              </button>
            </nav>
          </div>

          {/* Filters */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              {/* Search */}
              <div className="flex-1 relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3C53]/20 focus:border-[#1B3C53] transition-colors duration-200"
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={handleStatusFilterChange}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3C53]/20 focus:border-[#1B3C53] transition-colors duration-200 bg-white"
                >
                  <option value="all">All Status</option>
                  {activeTab === "active" ? (
                    <>
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                    </>
                  ) : (
                    <>
                      <option value="cancelled">Cancelled</option>
                      <option value="returned">Returned</option>
                    </>
                  )}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              {/* Order Header */}
              <div className="px-6 py-4 border-b border-gray-200 bg-[#CBDCEB]/30">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(order.status)}
                      <div>
                        <h3 className="text-lg font-semibold text-[#1B3C53]">
                          Order #{order.orderNumber}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Placed on {formatDate(order.orderDate)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                    <span className="text-lg font-bold text-[#1B3C53]">
                      {formatPrice(order.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="px-6 py-4">
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-[#1B3C53]">
                          {item.name}
                        </h4>
                        <p className="text-sm text-gray-600">{item.brand}</p>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-[#1B3C53]">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Details */}
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="flex items-center space-x-2 text-gray-600 mb-2">
                      <FaMapMarkerAlt className="text-xs" />
                      <span>Delivery Address: {order.shippingAddress}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600 mb-2">
                      <FaReceipt className="text-xs" />
                      <span>Payment: {order.paymentMethod}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <FaPhone className="text-xs" />
                      <span>Seller: {order.seller.name}</span>
                    </div>
                  </div>

                  <div>
                    {order.trackingNumber && (
                      <div className="flex items-center space-x-2 text-gray-600 mb-2">
                        <FaTruck className="text-xs" />
                        <span>Tracking: {order.trackingNumber}</span>
                      </div>
                    )}
                    {order.estimatedDelivery && (
                      <div className="flex items-center space-x-2 text-gray-600 mb-2">
                        <FaCalendarAlt className="text-xs" />
                        <span>
                          Est. Delivery: {formatDate(order.estimatedDelivery)}
                        </span>
                      </div>
                    )}
                    {order.deliveryDate && (
                      <div className="flex items-center space-x-2 text-gray-600 mb-2">
                        <FaCheckCircle className="text-xs" />
                        <span>Delivered: {formatDate(order.deliveryDate)}</span>
                      </div>
                    )}
                    {(order.cancellationReason || order.returnReason) && (
                      <div className="flex items-center space-x-2 text-red-600">
                        <FaExclamationTriangle className="text-xs" />
                        <span>
                          Reason:{" "}
                          {order.cancellationReason || order.returnReason}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Actions */}
              <div className="px-6 py-4 border-t border-gray-200 bg-white">
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => handleViewDetails(order.id)}
                    className="inline-flex items-center space-x-2 bg-[#1B3C53] text-white px-4 py-2 rounded-lg hover:bg-[#456882] transition-all duration-200 font-medium text-sm"
                  >
                    <FaEye className="text-xs" />
                    <span>View Details</span>
                  </button>

                  {order.trackingNumber && order.status === "shipped" && (
                    <button
                      onClick={() => onTrackOrder?.(order.trackingNumber!)}
                      className="inline-flex items-center space-x-2 bg-[#CBDCEB] text-[#1B3C53] px-4 py-2 rounded-lg hover:bg-[#456882]/20 transition-all duration-200 font-medium text-sm"
                    >
                      <FaTruck className="text-xs" />
                      <span>Track Order</span>
                    </button>
                  )}

                  {(order.status === "delivered" ||
                    order.status === "cancelled" ||
                    order.status === "returned") && (
                    <button
                      onClick={() => onReorder?.(order.id)}
                      className="inline-flex items-center space-x-2 bg-[#CBDCEB] text-[#1B3C53] px-4 py-2 rounded-lg hover:bg-[#456882]/20 transition-all duration-200 font-medium text-sm"
                    >
                      <FaRedo className="text-xs" />
                      <span>Reorder</span>
                    </button>
                  )}

                  {order.status === "delivered" && (
                    <button
                      onClick={() => onRateOrder?.(order.id)}
                      className="inline-flex items-center space-x-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg hover:bg-yellow-200 transition-all duration-200 font-medium text-sm"
                    >
                      <FaStar className="text-xs" />
                      <span>Rate & Review</span>
                    </button>
                  )}

                  <button
                    onClick={() => onDownloadInvoice?.(order.id)}
                    className="inline-flex items-center space-x-2 text-[#456882] hover:text-[#1B3C53] px-4 py-2 rounded-lg hover:bg-gray-100 transition-all duration-200 font-medium text-sm"
                  >
                    <FaDownload className="text-xs" />
                    <span>Download Invoice</span>
                  </button>

                  <button
                    onClick={() => onContactSeller?.(order.seller.id)}
                    className="inline-flex items-center space-x-2 text-[#456882] hover:text-[#1B3C53] px-4 py-2 rounded-lg hover:bg-gray-100 transition-all duration-200 font-medium text-sm"
                  >
                    <FaPhone className="text-xs" />
                    <span>Contact Seller</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredOrders.length === 0 && currentOrders.length > 0 && (
          <div className="text-center py-12">
            <FaSearch className="mx-auto text-4xl text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No orders found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
