import type { CartData } from "../../context/AppContextInterface";

enum PromoType {
  PERCENTAGE = "percentage",
  FIXED = "fixed",
}

enum CheckoutType {
  CART = "cart",
  OFFER = "offer",
}

export interface DeliveryRange {
  end: Date;
}

export interface PromoCode {
  code: string;
  discount: number;
  type: "percentage" | "fixed";
}

enum CheckoutDeliveryType {
  EXPRESS = 2500,
  STANDARD = 950,
}

export interface IAppliedPromo {
  code: string;
  type: PromoType;
  value: number;
}

export interface IPayment {
  url: string;
  orderId: string;
  expiresAt: string;
}

export interface ICheckOut {
  userId: string;
  type: CheckoutType;
  payment: IPayment | null;
  firstName: string;
  lastName: string;
  phone: string;
  city?: string;
  state?: string;
  address: string;
  zipCode?: number;
  deliveryFee: CheckoutDeliveryType;
  orderDate: string;
  estimatedDelivery?: string;
  cart?: CartData;
  offerItem?: IOfferItem;
  discountInPrice: number;
  total: number;
  appliedPromo: IAppliedPromo | null;
}

export interface ICheckoutFinal {
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
  state: string;
  address: string;
  zipCode?: number;
  deliveryType?: "express" | "standard";
  estimatedDelivery: string;
}

export interface IOfferItem {
  _id: string;
  title: string;
  brand?: string;
  price: number;
  quantity: number;
}
