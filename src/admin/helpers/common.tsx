import { AlertCircle, Ban, Check, Clock, RefreshCw, Truck } from "lucide-react";
import type { Order } from "../components/OrderTable";

export const getStatusIcon = (status: Order["status"]) => {
  switch (status) {
    case "pending":
      return <Clock className="w-3 h-3" />;
    case "processing":
      return <RefreshCw className="w-3 h-3" />;
    case "shipped":
      return <Truck className="w-3 h-3" />;
    case "delivered":
      return <Check className="w-3 h-3" />;
    case "cancelled":
      return <Ban className="w-3 h-3" />;
    case "returned":
      return <AlertCircle className="w-3 h-3" />;
    default:
      return <Clock className="w-3 h-3" />;
  }
};

export const getStatusColor = (status: Order["status"]) => {
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
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};


export const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  "in-progress": "bg-blue-100 text-blue-800 border-blue-200",
  "not-available": "bg-gray-100 text-gray-800 border-gray-200",
  "offer-made": "bg-green-100 text-green-800 border-green-200",
  "offer-declined": "bg-red-100 text-red-800 border-red-200",
  "offer-expired": "bg-orange-100 text-orange-800 border-orange-200",
  paid: "bg-purple-100 text-purple-800 border-purple-200",
  shipped: "bg-teal-100 text-teal-800 border-teal-200",
  completed: "bg-green-100 text-green-800 border-green-200",
};

export const statusFlow: Record<string, string[]> = {
  pending: ["processing", "shipped"],
  processing: ["shipped"],
  shipped: ["delivered", "returned"],
  delivered: [],
  returned: [],
  cancelled: [],
};