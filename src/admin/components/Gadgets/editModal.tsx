import { Check, Loader2, X } from "lucide-react";
import React from "react";
import { ProductCategory } from "../../../enum/products.enum";

type ProductType = "default" | "sponsored" | "featured";

interface EditProductModalProps {
  show: boolean;
  product: { title: string; brand: string; _id: string } | null;
  quantity: number;
  productCategory: string;
  isSavingProductLoading: boolean;
  onClose: () => void;
  onQuantityChange: (value: number) => void;
  onProductCategoryChange: (value: ProductCategory) => void;
  onSave: (productId: string) => void;
}

export const EditProductModal: React.FC<EditProductModalProps> = ({
  show,
  product,
  quantity,
  productCategory,
  isSavingProductLoading,
  onClose,
  onQuantityChange,
  onProductCategoryChange,
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
                Product Category
              </label>
              <select
                value={productCategory}
                onChange={(e) =>
                  onProductCategoryChange(e.target.value as ProductCategory)
                }
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                style={{ borderColor: "#CBDCEB" }}
              >
                {Object.entries(ProductCategory).map(([key, value]) => (
                  <option defaultValue={productCategory} value={value}>{key}</option>
                ))}
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
                onClick={() => onSave(product._id)}
                className="flex-1 px-4 py-2 text-white rounded-md font-medium flex items-center justify-center gap-2"
                style={{ backgroundColor: "#263b51" }}
              >
                {isSavingProductLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving....
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Save
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
