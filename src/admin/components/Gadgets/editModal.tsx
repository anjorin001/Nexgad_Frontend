import React from "react";
import { X, Check } from "lucide-react";

type ProductType = "default" | "sponsored" | "featured";

interface EditProductModalProps {
  show: boolean;
  product: { title: string; brand: string } | null;
  quantity: number;
  productType: ProductType;
  onClose: () => void;
  onQuantityChange: (value: number) => void;
  onProductTypeChange: (value: ProductType) => void;
  onSave: () => void;
}

export const EditProductModal: React.FC<EditProductModalProps> = ({
  show,
  product,
  quantity,
  productType,
  onClose,
  onQuantityChange,
  onProductTypeChange,
  onSave,
}) => {
  if (!show || !product) return null;

  return (
    <div className="fixed inset-0 bg-[#263b51]/40 bg-opacity-30 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold" style={{ color: "#263b51" }}>
              Update Product
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
              <h3 className="font-medium mb-2" style={{ color: "#263b51" }}>
                {product.title}
              </h3>
              <p className="text-sm text-gray-600">{product.brand}</p>
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "#456882" }}
              >
                Quantity
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) =>
                  onQuantityChange(parseInt(e.target.value) || 0)
                }
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                style={{ borderColor: "#CBDCEB" }}
                min="0"
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "#456882" }}
              >
                Product Type
              </label>
              <select
                value={productType}
                onChange={(e) =>
                  onProductTypeChange(e.target.value as ProductType)
                }
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                style={{ borderColor: "#CBDCEB" }}
              >
                <option value="default">Default</option>
                <option value="sponsored">Sponsored</option>
                <option value="featured">Featured</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border rounded-md font-medium"
                style={{ borderColor: "#CBDCEB", color: "#456882" }}
              >
                Cancel
              </button>
              <button
                onClick={onSave}
                className="flex-1 px-4 py-2 text-white rounded-md font-medium flex items-center justify-center gap-2"
                style={{ backgroundColor: "#263b51" }}
              >
                <Check className="w-4 h-4" />
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
