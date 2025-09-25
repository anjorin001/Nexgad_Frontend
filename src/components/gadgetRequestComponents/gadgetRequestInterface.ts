export interface RequestFormData {
  productName: string;
  category: string;
  brand: string;
  description: string;
  quantity: number;
  budgetRange: string;
  imageLink: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "admin";
  message: string;
  timestamp: string;
}

export interface UserRequest {
  id: string;
  productName: string;
  category: string;
  status:
    | "pending"
    | "in-progress"
    | "not-available"
    | "offer-made"
    | "offer-declined"
    | "offer-expired"
    | "paid"
    | "shipped"
    | "completed";
  submittedDate: string;
  estimatedResponse?: string;
  notes?: string;
  chatMessages?: ChatMessage[];
  chatEnabled?: boolean;
  offerExpiry?: string;
}

export enum Status {
  PENDING = "pending",
  IN_PROGRESS = "in-progress",
  NOT_AVAILABLE = "not-available",
  OFFER_MADE = "offer-made",
  OFFER_DECLINED = "offer-declined",
  OFFER_EXPIRED = "offer-expired",
  PAID = "paid",
  SHIPPED = "shipped", //TODO remove this order will handle this
  COMPLETED = "completed", //TODO remove this order will handle this
}

export interface gadgetRequestProp {
  onSubmitRequest: (formData: RequestFormData) => void;
  isSubmitted: boolean;
  requestId: string;
  setIsSubmitted: () => void;
  isLoading: boolean;
}
