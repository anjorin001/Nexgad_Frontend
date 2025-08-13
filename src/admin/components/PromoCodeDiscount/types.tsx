import { AlertCircle, CheckCircle, Clock4, XCircle } from "lucide-react";

export interface PromoCode {
  id: string;
  code: string;
  type: "percent" | "fixed";
  value: number;
  startAt: string;
  endAt: string;
  maxRedemptions: number;
  currentRedemptions: number;
  minOrderTotal: number;
  status: "active" | "disabled" | "expired" | "inactive";
  applicableCategories: string[];
  eligibilityRules?: "olduser" | "newuser";
}

export const categories = [
  "Smartphones & Tablets",
  "Laptops & Computers",
  "Audio & Headphones",
  "Gaming & Consoles",
  "Cameras & Photography",
  "Home Appliances",
  "TV & Entertainment",
  "Accessories",
  "Smart Home",
  "Wearables",
];

export const getStatusColor = (status: PromoCode["status"]) => {
  switch (status) {
    case "active":
      return {
        className:
          "bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm",
        icon: <CheckCircle size={14} className="text-emerald-600" />,
        dotColor: "bg-emerald-400",
      };
    case "disabled":
      return {
        className:
          "bg-amber-50 text-amber-700 border border-amber-200 shadow-sm",
        icon: <AlertCircle size={14} className="text-amber-600" />,
        dotColor: "bg-amber-400",
      };
    case "expired":
      return {
        className: "bg-red-50 text-red-700 border border-red-200 shadow-sm",
        icon: <XCircle size={14} className="text-red-600" />,
        dotColor: "bg-red-400",
      };
    case "inactive":
      return {
        className:
          "bg-slate-50 text-slate-600 border border-slate-200 shadow-sm",
        icon: <Clock4 size={14} className="text-slate-500" />,
        dotColor: "bg-slate-400",
      };
    default:
      return {
        className:
          "bg-slate-50 text-slate-600 border border-slate-200 shadow-sm",
        icon: <Clock4 size={14} className="text-slate-500" />,
        dotColor: "bg-slate-400",
      };
  }
};

// Generate random promo code with better algorithm
export const generatePromoCode = () => {
  const prefixes = ["SAVE", "GET", "WIN", "MEGA", "SUPER", "FLASH", "VIP"];
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  let suffix = "";
  for (let i = 0; i < 4; i++) {
    suffix += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return prefix + suffix;
};
