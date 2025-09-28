export enum OrderStatus {
  AWAITING_PAYMENT = "awaiting-payment",
  PENDING = "pending",
  PROCESSING = "processing",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
  RETURNED = "returned",
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
}

export interface OrderItem {
  _id: string;
  title: string;
  brand?: string;
  price: number;
  quantity: number;
  image: ProductImage[];
}

export enum PaymentStatus {
  PENDING = "pending",
  FAILED = "failed",
  SUCCESS = "success",
}

export interface Transaction {
  amount: number;

  paymentMethod: string;

  paymentStatus: PaymentStatus;
}

export interface Order {
  _id: string;
  userId: string;
  firstName: string;
  lastName: string;
  orderNumber: string;
  orderStatus: OrderStatus;
  transaction?: Transaction;
  items: OrderItem[];
  totalAmount: number;
  orderDate: string;
  deliveryDate?: string;
  estimatedDelivery: string;
  shippingAddress: string;
  trackingNumber?: string;
  city: string;
  state: string;
  zipCode: number;
  deliveryFee: number;
  discountInPrice?: number;
  appliedPromo?: string;
  cancellationReason?: string;
  returnReason?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
