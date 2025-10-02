import { AlertCircle, CheckCircle, Clock, X } from "lucide-react";
import type { OrderStatus } from "../orderComponents/OrderInterfaces";

export interface Order {
  _id: string;
  orderNumber: string;
  orderDate: string;
  orderStatus: OrderStatus;
  total: number;
}

export enum ComplaintCategory {
  WRONG_ITEM = "Wrong Item",
  DAMAGED_ITEM = "Damaged Item",
  LATE_DELIVERRY = "Late Delivery",
  PAYMENT_ISSUE = "Payment Issue",
  GENERAL_SUPPORT = "General Support",
}

export interface TicketFormData {
  order?: string;
  category: ComplaintCategory;
  description: string;
}

export interface FileUploadProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
}

export enum SupportTicketStatus {
  OPEN = "open",
  IN_PROGRESS = "in_progress",
  RESOLVED = "resolved",
  CLOSED = "closed",
}

export interface SupportTicket {
  _id: string;
  ticketId: string;
  order?: Order;
  userId: string;
  category: string;
  description: string;
  images: string[];
  status: SupportTicketStatus;
  createdAt: string;
  updatedAt: string;
}

export const complaintCategories = [
  "Wrong Item",
  "Damaged Item",
  "Late Delivery",
  "Payment Issue",
  "General Support",
] as const;

export const statusConfig = {
  open: {
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: AlertCircle,
    label: "Open",
  },
  in_progress: {
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: Clock,
    label: "In Progress",
  },
  resolved: {
    color: "bg-green-100 text-green-800 border-green-200",
    icon: CheckCircle,
    label: "Resolved",
  },
  closed: {
    color: "bg-gray-100 text-gray-800 border-gray-200",
    icon: X,
    label: "Closed",
  },
};
