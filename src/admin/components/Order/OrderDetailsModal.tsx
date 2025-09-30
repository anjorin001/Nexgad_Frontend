import { ChevronDown, CreditCard, MapPin, Truck, X } from "lucide-react";
import React, { useState } from "react";
import Loader from "../../../components/nexgadMidPageLoader";
import type {
  Order,
  OrderStatus,
} from "../../../components/orderComponents/OrderInterfaces";
import {
  getStatusColor,
  getStatusIcon,
  statusFlow,
} from "../../helpers/common";

interface OrderDetailsModalProps {
  isStatusUpdating: boolean;
  order: Order;
  onClose: () => void;
  onStatusUpdate: (status: OrderStatus) => void;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  isStatusUpdating,
  order,
  onClose,
  onStatusUpdate,
}) => {
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const allowedNextStatuses = statusFlow[order.orderStatus] || [];

  const handleStatusUpdate = (status: OrderStatus) => {
    onStatusUpdate(status);
    setShowStatusDropdown(false);
  };
  

  return (
    <div className="fixed inset-0 bg-[#263b51]/40 backdrop-blur-md flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div
            className="flex items-center justify-between p-6 border-b"
            style={{ borderColor: "#CBDCEB" }}
          >
            <h2 className="text-2xl font-bold" style={{ color: "#263b51" }}>
              Order Details
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div>
                  <h3
                    className="text-lg font-semibold mb-3"
                    style={{ color: "#263b51" }}
                  >
                    Order Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order Number:</span>
                      <span
                        className="font-medium"
                        style={{ color: "#263b51" }}
                      >
                        {order.orderNumber}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Customer:</span>
                      <span
                        className="font-medium"
                        style={{ color: "#263b51" }}
                      >
                        {`${order.firstName} ${order.lastName}`}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Status:</span>
                      <div className="relative">
                        <button
                          onClick={() =>
                            setShowStatusDropdown(!showStatusDropdown)
                          }
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            order.orderStatus
                          )}`}
                        >
                          {getStatusIcon(order.orderStatus)}
                          {order.orderStatus}
                          <ChevronDown className="w-3 h-3" />
                        </button>
                        {showStatusDropdown && (
                          <div
                            className="absolute right-0 top-full mt-1 bg-white border rounded-md shadow-lg z-10 min-w-32"
                            style={{ borderColor: "#CBDCEB" }}
                          >
                            {allowedNextStatuses.map((status) => (
                              <button
                                disabled={isStatusUpdating}
                                key={status}
                                onClick={() =>
                                  handleStatusUpdate(
                                    status as OrderStatus
                                  )
                                }
                                className="w-full px-3 py-2 text-left hover:bg-gray-50 text-xs"
                              >
                                {status.charAt(0).toUpperCase() +
                                  status.slice(1)}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order Date:</span>
                      <span
                        className="font-medium"
                        style={{ color: "#263b51" }}
                      >
                        {new Date(order.orderDate).toLocaleDateString()}
                      </span>
                    </div>
                    {order.deliveryDate && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Delivered Date:</span>
                        <span
                          className="font-medium"
                          style={{ color: "#263b51" }}
                        >
                          {new Date(order.deliveryDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    {order.estimatedDelivery && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Estimated Delivery:
                        </span>
                        <span
                          className="font-medium"
                          style={{ color: "#263b51" }}
                        >
                          {new Date(
                            order.estimatedDelivery
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment & Delivery */}
                <div>
                  <h4
                    className="font-semibold mb-2"
                    style={{ color: "#263b51" }}
                  >
                    Payment & Delivery
                  </h4>
                  <div className="space-y-2 text-sm">
                    {order.transaction !== null && (
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-gray-500" />
                        <span>{order?.transaction?.paymentMethod}</span>
                      </div>
                    )}
                    {order.trackingNumber && (
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-gray-500" />
                        <span>Tracking: {order.trackingNumber}</span>
                      </div>
                    )}
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                      <span>{order.shippingAddress}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Items */}
            <div>
              <h3
                className="text-lg font-semibold mb-4"
                style={{ color: "#263b51" }}
              >
                Order Items
              </h3>
              <div
                className="border rounded-lg overflow-hidden"
                style={{ borderColor: "#CBDCEB" }}
              >
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead style={{ backgroundColor: "#CBDCEB20" }}>
                      <tr>
                        <th
                          className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                          style={{ color: "#263b51" }}
                        >
                          Product
                        </th>
                        <th
                          className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                          style={{ color: "#263b51" }}
                        >
                          Brand
                        </th>
                        <th
                          className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                          style={{ color: "#263b51" }}
                        >
                          Price
                        </th>
                        <th
                          className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                          style={{ color: "#263b51" }}
                        >
                          Qty
                        </th>
                        <th
                          className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                          style={{ color: "#263b51" }}
                        >
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody
                      className="divide-y"
                      style={{ borderColor: "#CBDCEB" }}
                    >
                      {order.items.map((item) => (
                        <tr key={item._id}>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 relative">
                                <img
                                  src={item.image[0]?.url}
                                  alt={item.image[0]?.alt || "Product image"}
                                  className="w-full h-full object-cover rounded"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = "none";
                                    const fallback =
                                      target.nextElementSibling as HTMLElement;
                                    if (fallback) fallback.style.display = "flex";
                                  }}
                                />
                                <div className="absolute inset-0 hidden items-center justify-center bg-gray-100 text-gray-500 text-xs">
                                  No Image
                                </div>
                              </div>
                              <span
                                className="font-medium"
                                style={{ color: "#263b51" }}
                              >
                                {item.title}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-600">
                            {item.brand}
                          </td>
                          <td
                            className="px-4 py-4 text-sm"
                            style={{ color: "#263b51" }}
                          >
                            ₦{item.price.toLocaleString()}
                          </td>
                          <td
                            className="px-4 py-4 text-sm"
                            style={{ color: "#263b51" }}
                          >
                            {item.quantity}
                          </td>
                          <td
                            className="px-4 py-4 text-sm font-medium"
                            style={{ color: "#263b51" }}
                          >
                            ₦{(item.price * item.quantity).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot style={{ backgroundColor: "#CBDCEB20" }}>
                      <tr>
                        <td
                          colSpan={4}
                          className="px-4 py-3 text-right font-semibold"
                          style={{ color: "#263b51" }}
                        >
                          Total Amount:
                        </td>
                        <td
                          className="px-4 py-3 text-lg font-bold"
                          style={{ color: "#263b51" }}
                        >
                          ₦{order.totalAmount.toLocaleString()}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};
