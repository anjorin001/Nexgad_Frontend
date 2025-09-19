export interface FilterState {
  category: string;
  priceRange: {
    min: string;
    max: string;
  };
  location: string;
  condition: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  _id: string;
}

export interface DeliveryOptions {
  pickup: boolean;
  delivery: boolean;
}

export interface Product {
  _id: string;
  productId: string;
  title: string;
  brand: string;
  availability: string;
  category: string;
  images: ProductImage[];
  originalPrice: number;
  deliveryOptions: DeliveryOptions;
}

export interface CartItem {
  product: Product;
  quantity: number;
  price: number;
}

export interface DeliveryAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: number | null;
  phone: string;
}

export interface CartData {
  _id: string;
  userId: string;
  items: CartItem[];
  total: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface UserData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  address1: string;
  address2: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export type SortState = "newest" | "oldest" | "price-low" | "price-high";
