export enum ProductCondition {
  BRAND_NEW = "Brand New",
  FOREIGN_USED = "Foreign Used",
  NIGERIAN_USED = "Nigerian Used",
  REFURBISHED = "Refurbished",
}

export enum ProductAvailability {
  IN_STOCK = "In Stock",
  OUT_OF_STOCK = "Out of Stock",
  LIMITED_STOCK = "Limited Stock",
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

export enum ProductType {
  DEFAULT = "default",
  FEATURED = "featured",
  SPONSORED = "sponsored",
}

export enum ProductSort {
  NEWEST = "newest",
  OLDEST = "oldest",
  PRICE_HIGH = "price-high",
  PRICE_LOW = "price-low",
}

export interface IProductImage {
  id: string;
  url: string;
  alt: string;
}

export interface IProduct {
  _id: string;
    productId: string;
    liked: boolean
  title: string;
  brand: string;
  price: number;
  originalPrice?: number;
  condition: ProductCondition;
  availability: ProductAvailability;
  category: ProductCategory;
  description: string;
  specifications?: Record<string, string>;
  images: IProductImage[];
  location: {
    city: string;
    state: string;
  };
  quantity: number;
  deliveryOptions: {
    pickup: boolean;
    delivery: boolean;
  };
  dateListeddays?: Date;
  sku?: string;
  tags?: string[];
}
