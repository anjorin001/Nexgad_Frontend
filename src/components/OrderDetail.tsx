import {
  CheckCircle,
  Clock,
  CreditCard,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  RotateCcw,
  Truck,
  XCircle,
} from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "./nexgadMidPageLoader";
import type { Order } from "./orderComponents/OrderInterfaces";

interface OrderDetailComponentProp {
  isCancelOrderLoading: boolean;
  isPageLoading: boolean;
  onCancelOrder: (orderId: string, cancelReason?: string) => void;
  order: Order;
}

const OrderDetailComponent: React.FC<OrderDetailComponentProp> = ({
  isCancelOrderLoading,
  onCancelOrder,
  isPageLoading,
  order,
}) => {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const navigate = useNavigate();

  if (isPageLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center ">
        <Loader size={64} thickness={1} />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-[#1B3C53] text-lg">Order not found.</span>
      </div>
    );
  }

  const getStatusIcon = (status: Order["orderStatus"]) => {
    switch (status) {
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "processing":
        return <Package className="w-5 h-5 text-blue-500" />;
      case "shipped":
        return <Truck className="w-5 h-5 text-purple-500" />;
      case "delivered":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "cancelled":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "returned":
        return <RotateCcw className="w-5 h-5 text-orange-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: Order["orderStatus"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "shipped":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "returned":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleCancelOrder = (orderId: string) => {
    if (cancelReason.trim()) {
      onCancelOrder(orderId, cancelReason);
    } else {
      onCancelOrder(orderId);
    }
    setShowCancelModal(false)
  };

  const canCancelOrder =
    order?.orderStatus === "pending" || order?.orderStatus === "processing";
  const canTrackOrder =
    order?.orderStatus === "shipped" && order?.trackingNumber;

  const orderProgress = [
    { step: "Order Placed", date: order.orderDate, completed: true },
    {
      step: "Processing",
      date: order?.orderStatus === "pending" ? undefined : order?.orderDate,
      completed: ["processing", "shipped", "delivered"].includes(
        order.orderStatus
      ),
    },
    {
      step: "Shipped",
      date: order?.orderStatus === "shipped" ? order?.orderDate : undefined,
      completed: ["shipped", "delivered"].includes(order?.orderStatus),
    },
    {
      step: "Delivered",
      date: order?.deliveryDate,
      completed: order?.orderStatus === "delivered",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Order Details
              </h1>
              <p className="text-gray-600">{order.orderNumber}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Status */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  {getStatusIcon(order.orderStatus)}
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">
                      Order Status
                    </h2>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                        order.orderStatus
                      )}`}
                    >
                      {order.orderStatus.charAt(0).toUpperCase() +
                        order.orderStatus.slice(1)}
                    </span>
                  </div>
                </div>
                {canTrackOrder && (
                  <button className="bg-[#263b51] text-white px-4 py-2 rounded-md hover:bg-[#456882] transition-colors font-medium">
                    Track Package
                  </button>
                )}
              </div>

              {/* Progress Timeline */}
              <div className="relative">
                <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gray-200"></div>
                <div className="space-y-6">
                  {orderProgress.map((step, index) => (
                    <div key={index} className="relative flex items-start">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                          step.completed
                            ? "bg-green-500 border-green-500"
                            : "bg-white border-gray-300"
                        }`}
                      >
                        {step.completed && (
                          <CheckCircle className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <div className="ml-4">
                        <p
                          className={`font-medium ${
                            step.completed ? "text-gray-800" : "text-gray-500"
                          }`}
                        >
                          {step.step}
                        </p>
                        {step.date && (
                          <p className="text-sm text-gray-500">
                            {formatDate(step.date)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {order.estimatedDelivery && order.orderStatus !== "delivered" && (
                <div className="mt-6 p-4 bg-blue-50 rounded-md">
                  <p className="text-sm text-[#263b51]">
                    <strong>Estimated Delivery:</strong>{" "}
                    {formatDate(order.estimatedDelivery)}
                  </p>
                </div>
              )}
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Order Items ({order.items.length})
              </h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center gap-4 p-4 border border-gray-200 rounded-md"
                  >
                    <img
                      src={item.image?.[0]?.url || ""}
                      alt={item.image?.[0]?.alt || item.title}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Brand: {item.brand}
                      </p>
                      <p className="text-gray-600 text-sm">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-gray-800">
                        {formatPrice(item.price)}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-sm text-gray-500">each</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping & Payment Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="w-5 h-5 text-gray-600" />
                  <h3 className="font-bold text-gray-800">Shipping Address</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  {order.shippingAddress}
                </p>
                {order.trackingNumber && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-700">
                      Tracking Number:
                    </p>
                    <p className="font-mono text-blue-600">
                      {order.trackingNumber}
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <CreditCard className="w-5 h-5 text-gray-600" />
                  <h3 className="font-bold text-gray-800">Payment Method</h3>
                </div>
                {order?.transaction?.paymentMethod && (
                  <p className="text-gray-600">
                    {order?.transaction?.paymentMethod}
                  </p>
                )}

                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700">
                    Order Date:
                  </p>
                  <p className="text-gray-600">{formatDate(order.orderDate)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-gray-800 mb-4">Order Summary</h3>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item._id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.title} × {item.quantity}
                    </span>
                    <span className="font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
                <hr className="my-3" />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-[#263b51]">
                    {formatPrice(order.totalAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* <button className="w-full bg-[#263b51] text-white py-3 px-4 rounded-md hover:bg-[#456882] transition-colors font-medium flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                Download Invoice
              </button> */}

              {canCancelOrder && (
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="w-full bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 transition-colors font-medium"
                >
                  Cancel Order
                </button>
              )}

              {order.orderStatus === "delivered" && (
                <button className="w-full bg-orange-600 text-white py-3 px-4 rounded-md hover:bg-orange-700 transition-colors font-medium flex items-center justify-center gap-2">
                  <RotateCcw className="w-4 h-4" />
                  Request Return
                </button>
              )}

              <button className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-200 transition-colors font-medium">
                Need Help?
              </button>
            </div>

            {/* Quick Contact */}
            <div className="bg-gradient-to-r from-[#263b51] to-[#263b51] rounded-2xl p-6 text-white">
              <h3 className="font-bold mb-3">Need Support?</h3>
              <p className="text-sm text-blue-100 mb-4">
                Our customer service team is here to help
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>+234 800 123 4567</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>support@nexgad.ng</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  <button onClick={() => navigate("/support")}>
                    click here to complain
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div className="fixed inset-0  bg-[#263b51]/40 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-[#edf0f4] rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Cancel Order
            </h3>
            <p className="text-gray-600 mb-4">
              Please tell us why you're canceling this order:
            </p>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Reason for cancellation..."
              className="w-full p-3 border border-gray-200 rounded-md resize-none h-24"
              rows={3}
            />
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                }}
                className="flex-1 bg-[#263b51] text-white py-3 px-4 rounded-md hover:bg-[#16293d] transition-colors font-medium"
              >
                Keep Order
              </button>
              <button
                onClick={() => handleCancelOrder(order._id)}
                disabled={isCancelOrderLoading}
                className="inline-flex flex-1 bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 transition-colors font-medium"
              >
                {isCancelOrderLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin mr-2" />
                ) : (
                  ""
                )}
                Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetailComponent;
