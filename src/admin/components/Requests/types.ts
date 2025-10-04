import { Check, CheckCircle, Clock, Filter, Truck, X } from "lucide-react";

export interface RequestFormData {
  productName: string;
  category: string;
  brand: string;
  description: string;
  quantity: string;
  budgetRange: string;
  purchaseDate: string;
  imageLink: string;
}

export const statusIcons = {
  pending: Clock,
  "in-progress": Filter,
  "not-available": X,
  "offer-made": Check,
  "offer-declined": X,
  "offer-expired": Clock,
  paid: CheckCircle,
  shipped: Truck,
  completed: CheckCircle,
};
