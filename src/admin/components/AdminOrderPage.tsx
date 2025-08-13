import { useMemo, useState } from "react";
import { dummyOrders } from "../helpers/dummyData";
import { OrdersTable, type Order } from "./Order/OrderTable";

import { Filter, Search } from "lucide-react";
import { OrderDetailsModal } from "./Order/OrderDetailsModal";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(dummyOrders);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Order["status"]>(
    "all"
  );
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedOrders(checked ? filteredOrders.map((order) => order.id) : []);
  };

  const handleViewMore = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleStatusUpdate = (status: Order["status"], orderId?: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (orderId) {
          return order.id === orderId ? { ...order, status } : order;
        } else {
          return selectedOrders.includes(order.id)
            ? { ...order, status }
            : order;
        }
      })
    );

    if (!orderId) {
      setSelectedOrders([]);
    }
  };

  const handleBulkStatusUpdate = (status: Order["status"]) => {
    handleStatusUpdate(status);
  };

  const statusOptions: Array<{
    value: "all" | Order["status"];
    label: string;
  }> = [
    { value: "all", label: "All Status" },
    { value: "pending", label: "Pending" },
    { value: "processing", label: "Processing" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
    { value: "returned", label: "Returned" },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: "#263b51" }}>
          Orders Management
        </h1>
        <p className="text-gray-600">View and manage customer orders</p>
      </div>

      {/* Filters */}
      <div
        className="bg-white rounded-lg border p-6 mb-6"
        style={{ borderColor: "#CBDCEB" }}
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by order number or customer name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2"
                style={{ borderColor: "#CBDCEB" }}
              />
            </div>
          </div>
          <div className="md:w-48">
            <div className="relative">
              <Filter className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as "all" | Order["status"])
                }
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 appearance-none"
                style={{ borderColor: "#CBDCEB" }}
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <OrdersTable
        orders={filteredOrders}
        selectedOrders={selectedOrders}
        onSelectOrder={handleSelectOrder}
        onSelectAll={handleSelectAll}
        onViewMore={handleViewMore}
        onBulkStatusUpdate={handleBulkStatusUpdate}
      />

      {/* Order Details Modal */}
      {isModalOpen && selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedOrder(null);
          }}
          onStatusUpdate={(status) => {
            handleStatusUpdate(status, selectedOrder.id);
            setIsModalOpen(false);
            setSelectedOrder(null);
          }}
        />
      )}
    </div>
  );
}
