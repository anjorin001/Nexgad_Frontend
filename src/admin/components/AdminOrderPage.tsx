import { useCallback, useEffect, useState } from "react";
import { OrdersTable } from "./Order/OrderTable";

import { Filter, Search } from "lucide-react";
import Loader from "../../components/nexgadMidPageLoader";
import {
  OrderStatus,
  type Order,
} from "../../components/orderComponents/OrderInterfaces";
import { useToast } from "../../utils/ToastNotification";
import api from "../../utils/api";
import { OrderDetailsModal } from "./Order/OrderDetailsModal";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | Order["orderStatus"]
  >("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [isVeiwMoreLoading, setIsViewMoreloading] = useState<boolean>(false);
  const [isPageLoading, setIspageLoading] = useState<boolean>(false);
  const [isStatusUpdating, setIsStatusUpdating] = useState<boolean>(false);
  const [viewedOrderId, setViewOrderId] = useState<string[]>([]);

  const limit = 10;

  const toast = useToast();

  const handleGetOrders = useCallback(
    async (pageArg = page, resetOrders = false) => {
      setIspageLoading(true);
      try {
        const queryParams: Record<string, any> = {
          page: pageArg,
          limit,
          ...(searchTerm ? { search: searchTerm } : {}),
          ...(statusFilter !== "all" ? { status: statusFilter } : {}),
        };

        const queryString = new URLSearchParams(queryParams).toString();
        const response = await api.get(`/order/all?${queryString}`);
        const data = response.data;

        setOrders((prev) =>
          resetOrders ? data.data : [...prev, ...data.data]
        );
        setHasMore(Boolean(data.pagination?.hasMore));
      } catch (error: any) {
        console.error("Error getting orders", error);

        if (error.response) {
          toast.error(error.response.data.message || "Something went wrong");
        } else if (
          error.code === "ERR_NETWORK" ||
          error.code === "ECONNABORTED" ||
          error.message.includes("Network Error")
        ) {
          window.dispatchEvent(new CustomEvent("network-error"));
        } else {
          toast.error("Unexpected error occurred.");
        }
      } finally {
        setIspageLoading(false);
      }
    },
    [page, searchTerm, statusFilter, limit, toast]
  );

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedOrders(checked ? orders.map((order) => order._id) : []);
  };

  const handleViewMore = async (orderId: string) => {
    setIsViewMoreloading(true);
    setIsModalOpen(true);

    try {
      const request = await api.get(`order/${orderId}`);
      const response = request.data;
      setSelectedOrder(response.data);
      setViewOrderId([response.data._id]);
    } catch (error: any) {
      console.error("Error getting orders", error);

      if (error.response) {
        toast.error(error.response.data.message || "Something went wrong");
      } else if (
        error.code === "ERR_NETWORK" ||
        error.code === "ECONNABORTED" ||
        error.message.includes("Network Error")
      ) {
        window.dispatchEvent(new CustomEvent("network-error"));
      } else {
        toast.error("Unexpected error occurred.");
      }
    } finally {
      setIsViewMoreloading(false);
    }
  };

  const handleInMemoryStatusUpdate = (
    status: OrderStatus,
    orderId?: string
  ) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (orderId) {
          return order._id === orderId
            ? { ...order, orderStatus: status }
            : order;
        } else {
          return selectedOrders.includes(order._id)
            ? { ...order, orderStatus: status }
            : order;
        }
      })
    );

    if (!orderId) {
      setSelectedOrders([]);
    }
  };

  const handleBulkStatusUpdate = (status: OrderStatus) => {
    handleInMemoryStatusUpdate(status);
  };

  const handleStatusUpdate = async (status: OrderStatus) => {
    setIsStatusUpdating(true);

    try {
      const request = await api.patch("/order/update/status", {
        orderId: viewedOrderId.length > 0 ? viewedOrderId : selectedOrders,
        status,
      });

      toast.success("order status updated successfully");
      handleBulkStatusUpdate(status);
    } catch (error: any) {
      console.error("Error getting orders", error);

      if (error.response) {
        toast.error(error.response.data.message || "Something went wrong");
      } else if (
        error.code === "ERR_NETWORK" ||
        error.code === "ECONNABORTED" ||
        error.message.includes("Network Error")
      ) {
        window.dispatchEvent(new CustomEvent("network-error"));
      } else {
        toast.error("Unexpected error occurred.");
      }
    } finally {
      setIsStatusUpdating(false);
    }
  };

  const handleLoadMore = () => {
    if (isPageLoading || !hasMore) return;
    setPage((prev) => prev + 1);
  };

  useEffect(() => {
    handleGetOrders(page);
  }, [page]);

  useEffect(() => {
    if (searchTerm !== "" || statusFilter !== "all") {
      const timeoutId = setTimeout(() => {
        setPage(1);
        handleGetOrders(1, true);
      }, 500);
      return () => clearTimeout(timeoutId);
    } else {
      setPage(1);
      handleGetOrders(1, true);
    }
  }, [searchTerm, statusFilter]);

  const statusOptions: Array<{
    value: "all" | Order["orderStatus"];
    label: string;
  }> = [
    { value: "all", label: "All Status" },
    { value: OrderStatus.PENDING, label: "Pending" },
    { value: OrderStatus.PROCESSING, label: "Processing" },
    { value: OrderStatus.SHIPPED, label: "Shipped" },
    { value: OrderStatus.DELIVERED, label: "Delivered" },
    { value: OrderStatus.CANCELLED, label: "Cancelled" },
    { value: OrderStatus.RETURNED, label: "Returned" },
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
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    setPage(1);
                    handleGetOrders(1, true);
                  }
                }}
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
                  setStatusFilter(
                    e.target.value as "all" | Order["orderStatus"]
                  )
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

      {isPageLoading ? (
        <div className="col-span-full flex justify-center items-center py-12">
          <Loader size={64} thickness={1} />
        </div>
      ) : (
        <OrdersTable
          orders={orders}
          selectedOrders={selectedOrders}
          onSelectOrder={handleSelectOrder}
          onSelectAll={handleSelectAll}
          onViewMore={handleViewMore}
          onBulkStatusUpdate={handleStatusUpdate}
        />
      )}

      {isVeiwMoreLoading ? (
        <div className="fixed inset-0 bg-[#263b51]/40 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white col-span-full flex justify-center items-center rounded-lg max-w-2xl w-full h-[80vh] overflow-y-auto">
            <Loader size={64} thickness={1} />
          </div>
        </div>
      ) : (
        isModalOpen &&
        selectedOrder && (
          <OrderDetailsModal
            isStatusUpdating={isStatusUpdating}
            order={selectedOrder}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedOrder(null);
              setViewOrderId([])
            }}
            onStatusUpdate={(status) => {
              handleStatusUpdate(status);
              setIsModalOpen(false);
              setSelectedOrder(null);
            }}
          />
        )
      )}

      {hasMore && (
        <div className="w-full flex justify-center mt-8">
          <button
            onClick={handleLoadMore}
            disabled={isPageLoading}
            className="px-8 py-3 bg-[#263b51] hover:bg-[#456882] text-white rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
          >
            {isPageLoading ? (
              <>
                <Loader size={20} thickness={2} />
                <span>Loading...</span>
              </>
            ) : (
              <span>Load More Orders</span>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
