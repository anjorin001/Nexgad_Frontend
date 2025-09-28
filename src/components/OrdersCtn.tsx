import React, { useState } from "react";
import {
  FaBox,
  FaCalendarAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaEye,
  FaFilter,
  FaMapMarkerAlt,
  FaReceipt,
  FaRedo,
  FaSearch,
  FaShoppingBag,
  FaTimesCircle,
  FaTruck,
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import Loader from "./nexgadMidPageLoader";
import {
  OrderStatus,
  type Order,
  type OrderItem,
} from "./orderComponents/OrderInterfaces";

interface OrdersPageProps {
  isPageLoading: boolean;
  allOrders: Order[];
  onTrackOrder?: (trackingNumber: string) => void;
  onContactSeller?: (sellerId: string) => void;
  onDownloadInvoice?: (orderId: string) => void;
  onRateOrder?: (orderId: string) => void;
  hasMore: boolean;
  loadMore: () => void;
  isLoadMoreLoading: boolean;
  // isReorderLoading: string[];
  // onReorder: (order: Order) => void;
}

const OrdersPage: React.FC<OrdersPageProps> = ({
  isPageLoading,
  onTrackOrder,
  allOrders,
  hasMore,
  loadMore,
  isLoadMoreLoading,
  onContactSeller,
  onDownloadInvoice,
  onRateOrder,
  // isReorderLoading,
  // onReorder,
}) => {
  const [activeTab, setActiveTab] = useState<"active" | "inactive">("active");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const navigate = useNavigate();

  const activeOrders = allOrders.filter((order) =>
    [
      OrderStatus.AWAITING_PAYMENT,
      OrderStatus.PENDING,
      OrderStatus.PROCESSING,
      OrderStatus.SHIPPED,
      OrderStatus.DELIVERED,
    ].includes(order.orderStatus)
  );

  const inactiveOrders = allOrders.filter((order) =>
    [OrderStatus.CANCELLED, OrderStatus.RETURNED].includes(order.orderStatus)
  );

  const currentOrders = activeTab === "active" ? activeOrders : inactiveOrders;

  // Filter orders based on search and status
  const filteredOrders = currentOrders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesStatus =
      statusFilter === "all" || order.orderStatus === statusFilter;
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
    navigate(`/my-orders/${orderId}`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    setStatusFilter(e.target.value);
  };

  if (isPageLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center ">
        <Loader size={64} thickness={1} />
      </div>
    );
  }

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
              key={order._id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              {/* Order Header */}
              <div className="px-6 py-4 border-b border-gray-200 bg-[#CBDCEB]/30">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(order.orderStatus)}
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
                        order.orderStatus
                      )}`}
                    >
                      {order.orderStatus.charAt(0).toUpperCase() +
                        order.orderStatus.slice(1)}
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
                  {order.items.map((item: OrderItem) => (
                    <div key={item._id} className="flex items-center space-x-4">
                      <img
                        loading="lazy"
                        src={item.image?.[0]?.url || ""}
                        alt={item.image?.[0]?.alt || item.title}
                        className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-[#1B3C53]">
                          {item.title}
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
                    {order?.transaction?.paymentMethod && (
                      <div className="flex items-center space-x-2 text-gray-600 mb-2">
                        <FaReceipt className="text-xs" />
                        <span>Payment: {order?.transaction?.paymentMethod}</span>
                      </div>
                    )}
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
                    onClick={() => handleViewDetails(order._id)}
                    className="inline-flex items-center space-x-2 bg-[#1B3C53] text-white px-4 py-2 rounded-lg hover:bg-[#456882] transition-all duration-200 font-medium text-sm"
                  >
                    <FaEye className="text-xs" />
                    <span>View Details</span>
                  </button>

                  {order.trackingNumber &&
                    order.orderStatus === OrderStatus.SHIPPED && (
                      <button
                        onClick={() => onTrackOrder?.(order.trackingNumber!)}
                        className="inline-flex items-center space-x-2 bg-[#CBDCEB] text-[#1B3C53] px-4 py-2 rounded-lg hover:bg-[#456882]/20 transition-all duration-200 font-medium text-sm"
                      >
                        <FaTruck className="text-xs" />
                        <span>Track Order</span>
                      </button>
                    )}

                  {/* {(order.status === "delivered" ||
                    order.status === "cancelled" ||
                    order.status === "returned") && (
                    <button
                      disabled={isReorderLoading.includes(order.id)}
                      onClick={() => onReorder?.(order)}
                      className="inline-flex items-center space-x-2 bg-[#CBDCEB] text-[#1B3C53] px-4 py-2 rounded-lg hover:bg-[#456882]/20 transition-all duration-200 font-medium text-sm"
                    >
                      {isReorderLoading.includes(order.id) ? (
                        <Loader2 className="w-6 h-6 animate-spin mr-2" />
                      ) : (
                        <FaRedo className="text-xs" />
                      )}
                      <span>Reorder</span>
                    </button>
                  )} */}

                  {/* {order.status === "delivered" && (
                    <button
                      onClick={() => onRateOrder?.(order.id)}
                      className="inline-flex items-center space-x-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg hover:bg-yellow-200 transition-all duration-200 font-medium text-sm"
                    >
                      <FaStar className="text-xs" />
                      <span>Rate & Review</span>
                    </button>
                  )} */}

                  {/* <button
                    onClick={() => onDownloadInvoice?.(order.id)}
                    className="inline-flex items-center space-x-2 text-[#456882] hover:text-[#1B3C53] px-4 py-2 rounded-lg hover:bg-gray-100 transition-all duration-200 font-medium text-sm"
                  >
                    <FaDownload className="text-xs" />
                    <span>Download Invoice</span>
                  </button> */}

                  {/* <button
                    onClick={() => onContactSeller?.(order.seller.id)}
                    className="inline-flex items-center space-x-2 text-[#456882] hover:text-[#1B3C53] px-4 py-2 rounded-lg hover:bg-gray-100 transition-all duration-200 font-medium text-sm"
                  >
                    <FaPhone className="text-xs" />
                    <span>Contact Seller</span>
                  </button> */}
                </div>
              </div>
            </div>
          ))}
        </div>

        {hasMore && (
          <div className="w-full flex justify-center mt-8">
            <button
              onClick={loadMore}
              disabled={isLoadMoreLoading}
              className="px-8 py-3 bg-[#1B3C53] hover:bg-[#456882] text-white rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
            >
              <span>Load More Orders</span>
            </button>
          </div>
        )}

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
