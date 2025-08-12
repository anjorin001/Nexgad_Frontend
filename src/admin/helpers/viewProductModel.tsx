import React from "react";
import { X } from "lucide-react";

interface Location {
  city: string;
  state: string;
}

interface Product {
  title: string;
  brand: string;
  price: number;
  condition: string;
  quantity: number;
  productType: string;
  description: string;
  specifications: Record<string, string>;
  location: Location;
  tags: string[];
}

interface ProductDetailsModalProps {
  show: boolean;
  product: Product | null;
  onClose: () => void;
  formatPrice: (price: number) => string;
  getProductTypeColor: (type: string) => string;
  getProductTypeIcon: (type: string) => React.ReactNode;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  show,
  product,
  onClose,
  formatPrice,
  getProductTypeColor,
  getProductTypeIcon,
}) => {
  if (!show || !product) return null;

  return (
    <div className="fixed inset-0 bg-[#263b51]/40 bg-opacity-30 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold" style={{ color: "#263b51" }}>
              Product Details
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg" style={{ color: "#263b51" }}>
                {product.title}
              </h3>
              <p className="text-gray-600">{product.brand}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium" style={{ color: "#456882" }}>
                  Price
                </label>
                <p>{formatPrice(product.price)}</p>
              </div>
              <div>
                <label className="text-sm font-medium" style={{ color: "#456882" }}>
                  Condition
                </label>
                <p>{product.condition}</p>
              </div>
              <div>
                <label className="text-sm font-medium" style={{ color: "#456882" }}>
                  Quantity
                </label>
                <p>{product.quantity}</p>
              </div>
              <div>
                <label className="text-sm font-medium" style={{ color: "#456882" }}>
                  Product Type
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-white"
                    style={{
                      backgroundColor: getProductTypeColor(product.productType),
                    }}
                  >
                    {getProductTypeIcon(product.productType)}
                    {product.productType}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium" style={{ color: "#456882" }}>
                Description
              </label>
              <p className="mt-1">{product.description}</p>
            </div>

            <div>
              <label className="text-sm font-medium" style={{ color: "#456882" }}>
                Specifications
              </label>
              <div className="mt-1 space-y-1">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <p key={key} className="text-sm">
                    <span className="font-medium">{key}:</span> {value}
                  </p>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium" style={{ color: "#456882" }}>
                Location
              </label>
              <p>
                {product.location.city}, {product.location.state}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium" style={{ color: "#456882" }}>
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mt-1">
                {product.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs rounded-full"
                    style={{ backgroundColor: "#CBDCEB", color: "#263b51" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
