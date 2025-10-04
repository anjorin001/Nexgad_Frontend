import { Check, Clock, TrendingUp, X } from "lucide-react";
export interface RequestFormData {
  productName: string;
  category: string;
  brand: string;
  description: string;
  quantity: number;
  budgetRange: string;
  imageLink: string;
}

export enum UserRole {
  USER = "user",
  ADMIN = "admin",
  SUPER_ADMIN = "super_admin",
}

export interface IChatMessage {
  _id?: string;
  senderId: string;
  senderRole: UserRole;
  message: string;
  delivered?: boolean;
  read?: boolean;
  meta?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

export enum UserRequestStatusNotes {
  PENDING = "Request received and queued for processing",
  IN_PROGRESS = "Checking with suppliers for availability",
  OFFER_MADE = "Offer created! Check your email for payment link.",
  NOT_AVAILABLE = "Currently not available in Nigeria market",
  OFFER_DECLINED = "Price negotiation unsuccessful. Request closed by admin.",
  OFFER_EXPIRED = "Payment not completed within 48 hours. Offer has expired.",
  PAID = "Payment confirmed! Your order is being prepared for shipment.",
}

export enum ProductCategory {
  SMARTPHONES_TABLETS = "Smartphones & Tablets",
  LAPTOPS_COMPUTERS = "Laptops & Computers",
  AUDIO_HEADPHONES = "Audio & Headphones",
  GAMING_CONSOLES = "Gaming & Consoles",
  CAMERAS_PHOTOGRAPHY = "Cameras & Photography",
  HOME_APPLIANCES = "Home Appliances",
  TV_ENTERTAINMENT = "TV & Entertainment",
  ACCESSORIES = "Accessories",
  SMART_HOME = "Smart Home",
  WEARABLES = "Wearables",
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
}

export interface IGadgetRequest {
  _id?: string;
  userId: User;
  requestId: string;
  productName: string;
  category: ProductCategory;
  brand?: string;
  status: Status;
  description: string;
  quantity: number;
  budgetRange: string;
  imageLink?: string;
  estimatedResponse?: string; // ISO string
  notes?: UserRequestStatusNotes;
  chatMessages?: IChatMessage[];
  chatEnabled?: boolean;
  offerExpiry?: string; // ISO string
  stamp?: string;
  agreedPrice?: number;
  createdAt?: string; // from timestamps
  updatedAt?: string;
}

export enum Status {
  PENDING = "pending",
  IN_PROGRESS = "in-progress",
  NOT_AVAILABLE = "not-available",
  OFFER_MADE = "offer-made",
  OFFER_DECLINED = "offer-declined",
  OFFER_EXPIRED = "offer-expired",
  PAID = "paid"
}

export const budgetRanges = [
  "Under ₦25,000",
  "₦25,000 - ₦50,000",
  "₦50,000 - ₦100,000",
  "₦100,000 - ₦250,000",
  "₦250,000 - ₦500,000",
  "₦500,000 - ₦1,000,000",
  "Above ₦1,000,000",
  "No Budget Limit",
];

export const getStatusConfig = (status: string) => {
  switch (status) {
    case Status.PENDING:
      return {
        color: "bg-yellow-100 text-yellow-800",
        label: "Pending",
        icon: Clock,
      };
    case Status.IN_PROGRESS:
      return {
        color: "bg-blue-100 text-blue-800",
        label: "In Progress",
        icon: TrendingUp,
      };
    case Status.NOT_AVAILABLE:
      return {
        color: "bg-red-100 text-red-800",
        label: "Not Available",
        icon: X,
      };
    case Status.OFFER_MADE:
      return {
        color: "bg-green-100 text-green-800",
        label: "Offer Made - Check Email",
        icon: Check,
      };
    case Status.OFFER_DECLINED:
      return {
        color: "bg-orange-100 text-orange-800",
        label: "Offer Declined",
        icon: X,
      };
    case Status.OFFER_EXPIRED:
      return {
        color: "bg-gray-100 text-gray-800",
        label: "Offer Expired",
        icon: Clock,
      };
    case Status.PAID:
      return {
        color: "bg-emerald-100 text-emerald-800",
        label: "Payment Confirmed",
        icon: Check,
      };
    default:
      return {
        color: "bg-gray-100 text-gray-800",
        label: "Unknown",
        icon: Clock,
      };
  }
};
