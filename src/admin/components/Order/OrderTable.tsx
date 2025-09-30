import { ChevronDown, Eye, Package } from "lucide-react";
import React, { useState } from "react";
import type {
  Order,
  OrderStatus,
} from "../../../components/orderComponents/OrderInterfaces";
import {
  getStatusColor,
  getStatusIcon,
  statusFlow,
} from "../../helpers/common";

interface OrdersTableProps {
  orders: Order[];
  selectedOrders: string[];
  onSelectOrder: (orderId: string) => void;
  onSelectAll: (checked: boolean) => void;
  onViewMore: (order: string) => void;
  onBulkStatusUpdate: (status: OrderStatus) => void;
}

export const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  selectedOrders,
  onSelectOrder,
  onSelectAll,
  onViewMore,
  onBulkStatusUpdate,
}) => {
  const [showBulkActions, setShowBulkActions] = useState(false);

  const isAllSelected =
    orders.length > 0 && selectedOrders.length === orders.length;
  const isIndeterminate =
    selectedOrders.length > 0 && selectedOrders.length < orders.length;

  const handleBulkStatusUpdate = (status: Order["orderStatus"]) => {
    if (onBulkStatusUpdate) {
      onBulkStatusUpdate(status);
    }
    setShowBulkActions(false);
  };

  const allSameStatus =
    selectedOrders.length > 0 &&
    selectedOrders.every(
      (id) =>
        orders.find((order) => order._id === id)?.orderStatus ===
        orders.find((order) => order._id === selectedOrders[0])?.orderStatus
    );

  const commonStatus = allSameStatus
    ? orders.find((order) => order._id === selectedOrders[0])?.orderStatus
    : null;

  const allowedNextStatuses = statusFlow[commonStatus ?? ""] || [];

  return (
    <div
      className="bg-white rounded-lg border"
      style={{ borderColor: "#CBDCEB" }}
    >
      {selectedOrders.length > 0 && commonStatus && (
        <div
          className="p-4 border-b flex items-center justify-between"
          style={{ borderColor: "#CBDCEB", backgroundColor: "#CBDCEB20" }}
        >
          <span className="text-sm font-medium" style={{ color: "#263b51" }}>
            {selectedOrders.length} order(s) selected
          </span>
          <div className="relative">
            <button
              onClick={() => setShowBulkActions(!showBulkActions)}
              className="px-4 py-2 text-white rounded-md text-sm font-medium flex items-center gap-2"
              style={{ backgroundColor: "#263b51" }}
            >
              Update Status
              <ChevronDown className="w-4 h-4" />
            </button>

            {showBulkActions && (
              <div
                className="absolute right-0 top-full mt-1 bg-white border rounded-md shadow-lg z-10 min-w-40"
                style={{ borderColor: "#CBDCEB" }}
              >
                {allowedNextStatuses.map((status) => (
                  <button
                    key={status}
                    onClick={() =>
                      handleBulkStatusUpdate(status as Order["orderStatus"])
                    }
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm"
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead style={{ backgroundColor: "#CBDCEB20" }}>
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = isIndeterminate;
                  }}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="rounded"
                />
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                style={{ color: "#263b51" }}
              >
                S/N
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                style={{ color: "#263b51" }}
              >
                Order Number
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                style={{ color: "#263b51" }}
              >
                Customer
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                style={{ color: "#263b51" }}
              >
                Status
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                style={{ color: "#263b51" }}
              >
                Order Date
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                style={{ color: "#263b51" }}
              >
                Total
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                style={{ color: "#263b51" }}
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: "#CBDCEB" }}>
            {orders.map((order, index) => (
              <tr key={order._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedOrders.includes(order._id)}
                    onChange={() => onSelectOrder(order._id)}
                    className="rounded"
                  />
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap text-sm"
                  style={{ color: "#263b51" }}
                >
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div
                    className="text-sm font-medium"
                    style={{ color: "#263b51" }}
                  >
                    {order.orderNumber}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm" style={{ color: "#263b51" }}>
                    {`${order.firstName} ${order.lastName}`}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      order.orderStatus
                    )}`}
                  >
                    {getStatusIcon(order.orderStatus)}
                    {order.orderStatus}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {new Date(order.orderDate).toLocaleDateString()}
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap text-sm font-medium"
                  style={{ color: "#263b51" }}
                >
                  ₦{order.totalAmount.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      onViewMore(order._id);
                    }}
                    className="inline-flex items-center gap-2 px-3 py-1 text-white rounded-md text-sm font-medium hover:opacity-90"
                    style={{ backgroundColor: "#263b51" }}
                  >
                    <Eye className="w-4 h-4" />
                    View More
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {orders.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500">No orders found</p>
        </div>
      )}
    </div>
  );
};

// OrderDetailsModal Component
