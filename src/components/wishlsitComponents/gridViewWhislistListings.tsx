import { Loader2 } from "lucide-react";
import React from "react";
import { FaHeart, FaShare, FaShoppingCart } from "react-icons/fa";
import type { Product } from "../../context/AppContextInterface";
import { getAvailabilityStyle } from "./common";

export interface ProductGridProps {
  isLoading: string[];
  isAddToCartLoading: string[];
  filteredItems: Product[];
  selectedItems: string[];
  onProductClick: (item: Product) => void;
  onSelectItem: (id: string) => void;
  onAddToCart: (e: React.MouseEvent, id: string) => void;
  onShare: (e: React.MouseEvent, item: Product) => void;
  onRemoveFromWishlist: (e: React.MouseEvent, id: string) => void;
  formatDate?: (d: string | Date) => string;
  formatPrice?: (n: number) => string;
  className?: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  isLoading,
  isAddToCartLoading,
  filteredItems,
  selectedItems,
  onProductClick,
  onSelectItem,
  onAddToCart,
  onShare,
  onRemoveFromWishlist,
  formatDate = (d) =>
    new Date(d).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    }),
  formatPrice = (n) =>
    new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "USD",
    }).format(n),
  className = "",
}) => {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 ${className}`}
    >
      {filteredItems.map((item) => {
        const style = getAvailabilityStyle(item.availability);
        return (
          <div
            key={item._id}
            className="relative bg-white rounded-lg border border-[#CBDCEB] hover:border-[#456882]/30 transition-all duration-300 hover:shadow-lg cursor-pointer group overflow-hidden"
            onClick={() => onProductClick(item)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                onProductClick(item);
              }
            }}
          >
            {/* Selection Checkbox */}
            <div className="absolute top-3 left-3 z-10">
              <input
                type="checkbox"
                checked={selectedItems.includes(item._id)}
                onChange={(e) => {
                  e.stopPropagation();
                  onSelectItem(item._id);
                }}
                onClick={(e) => e.stopPropagation()}
                aria-label={`Select ${item.title}`}
                className="rounded border-gray-300 text-[#1B3C53] focus:ring-[#1B3C53]"
              />
            </div>

            {/* Image Container */}
            <div className="relative overflow-hidden">
              <img
                src={item?.images[0]?.url}
                alt={item.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />

              <div className="absolute top-3 right-3 flex flex-col gap-2">
                {item.originalPrice && (
                  <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                    -{item.originalPrice - item.price} ₦
                  </span>
                )}
              </div>

              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className={style.className}>{style.text}</span>
              </div>

              {/* Action Buttons (appear on hover) */}
              <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(e, item._id);
                  }}
                  disabled={style.text === "Out of Stock"}
                  className={`flex-1 py-2 px-3 rounded-lg transition-all duration-200 font-medium text-sm flex items-center justify-center space-x-2 ${
                    style.text !== "Out of Stock"
                      ? "bg-[#1B3C53] hover:bg-[#456882] text-white"
                      : "bg-gray-400 text-gray-200 cursor-not-allowed"
                  }`}
                >
                  {selectedItems.some((id) =>
                    isAddToCartLoading.includes(id)
                  ) ? (
                    <Loader2 className="w-6 h-6 animate-spin mr-2" />
                  ) : (
                    <FaShoppingCart className="text-xs" />
                  )}
                  <span className="hidden sm:inline">Add to Cart</span>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onShare(e, item);
                  }}
                  className="w-10 h-10 bg-white/90 hover:bg-white rounded-lg flex items-center justify-center text-[#456882] hover:text-[#1B3C53] transition-colors duration-200"
                  aria-label={`Share ${item.title}`}
                >
                  <FaShare className="text-sm" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              {/* Title and Brand */}
              <div className="mb-3">
                <h3 className="text-base font-semibold text-[#1B3C53] mb-1 group-hover:text-[#456882] transition-colors duration-200 line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-sm text-[#456882]/60 font-medium">
                  {item.brand}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-bold text-[#1B3C53]">
                    {formatPrice(item.price)}
                  </div>
                  {item.originalPrice && (
                    <div className="text-sm text-gray-500 line-through">
                      {formatPrice(item.originalPrice)}
                    </div>
                  )}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFromWishlist(e, item._id);
                  }}
                  className="p-2 text-[#456882] hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-200"
                  title="Remove from wishlist"
                  aria-label={`Remove ${item.title} from wishlist`}
                >
                  {isLoading.includes(item._id) ? (
                    <Loader2 className="w-6 h-6 animate-spin mr-2" />
                  ) : (
                    <FaHeart className="text-xs" />
                  )}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductGrid;
