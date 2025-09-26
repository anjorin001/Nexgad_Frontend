import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { FaEllipsisV, FaHeart, FaShare, FaShoppingCart, FaTrash } from "react-icons/fa";
import type { Product } from "../../context/AppContextInterface";
import { getAvailabilityStyle } from "./common";

export interface ProductListProps {
  isLoading: string[];
  isAddToCartLoading: string[];
  filteredItems: Product[];
  selectedItems: string[];
  showItemActions?: string | null;
  onToggleItemActions?: (id: string | null) => void;

  onProductClick: (item: Product) => void;
  onSelectItem: (id: string) => void;
  onAddToCart: (e: React.MouseEvent, id: string) => void;
  onShare: (e: React.MouseEvent, item: Product) => void;
  onRemoveFromWishlist: (e: React.MouseEvent, id: string) => void;

  formatDate?: (d: string | Date) => string;
  formatPrice?: (n: number) => string;
}

const ProductList: React.FC<ProductListProps> = ({
  isLoading,
  isAddToCartLoading,
  filteredItems,
  selectedItems,
  showItemActions: controlledShowItemActions,
  onToggleItemActions: controlledToggle,

  onProductClick,
  onSelectItem,
  onAddToCart,
  onShare,
  onRemoveFromWishlist,

  formatPrice = (n) =>
    new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "NGN",
    }).format(n),
}) => {
  const [localShowItemActions, setLocalShowItemActions] = useState<
    string | null
  >(null);

  const showItemActions = controlledShowItemActions ?? localShowItemActions;
  const setShowItemActions = (id: string | null) => {
    if (controlledToggle) controlledToggle(id);
    else setLocalShowItemActions(id);
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {filteredItems.map((item) => {
        const style = getAvailabilityStyle(item.availability);
        return (
          <div
            key={item._id}
            className="bg-white rounded-lg border border-[#CBDCEB] hover:border-[#456882]/30 transition-all duration-300 hover:shadow-md cursor-pointer group overflow-hidden"
            onClick={() => onProductClick(item)}
          >
            <div className="p-4">
              <div className="flex space-x-4">
                <div className="flex-shrink-0 space-y-3">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item._id)}
                    onChange={() => onSelectItem(item._id)}
                    onClick={(e) => e.stopPropagation()}
                    className="rounded border-gray-300 text-[#1B3C53] focus:ring-[#1B3C53]"
                  />

                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 overflow-hidden rounded-lg">
                    <img
                      src={item?.images[0]?.url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                  </div>
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1 min-w-0 pr-2">
                      <h3 className="text-base sm:text-lg font-semibold text-[#1B3C53] group-hover:text-[#456882] transition-colors duration-200 mb-1 line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-[#456882]/60 font-medium mb-2">
                        {item.brand}
                      </p>
                    </div>

                    {/* Mobile Actions Menu */}
                    <div className="relative sm:hidden">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowItemActions(
                            showItemActions === item._id ? null : item._id
                          );
                        }}
                        className="p-2 text-gray-400 hover:text-[#456882] rounded-full transition-colors duration-200"
                        aria-expanded={showItemActions === item._id}
                        aria-controls={`item-actions-${item._id}`}
                      >
                        <FaEllipsisV className="text-sm" />
                      </button>

                      {/* Mobile Actions Dropdown */}
                      {showItemActions === item._id && (
                        <div
                          id={`item-actions-${item._id}`}
                          className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-40"
                          role="menu"
                        >
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onAddToCart(e, item._id);
                              setShowItemActions(null);
                            }}
                            disabled={style.text === "Out of Stock"}
                            className={`w-full flex items-center space-x-2 px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors duration-200 ${
                              style.text === "Out of Stock"
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-gray-700"
                            }`}
                          >
                            {selectedItems.some((id) =>
                              isAddToCartLoading.includes(id)
                            ) ? (
                              <Loader2 className="w-6 h-6 animate-spin mr-2" />
                            ) : (
                              <FaShoppingCart className="text-xs" />
                            )}
                            <span>Add to Cart</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onShare(e, item);
                              setShowItemActions(null);
                            }}
                            className="w-full flex items-center space-x-2 px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                          >
                            <FaShare className="text-xs" />
                            <span>Share</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onRemoveFromWishlist(e, item._id);
                              setShowItemActions(null);
                            }}
                            className="w-full flex items-center space-x-2 px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 border-t border-gray-100"
                          >
                            {isLoading.includes(item._id)? (
                              <Loader2 className="w-6 h-6 animate-spin mr-2" />
                            ) : (
                              <FaTrash className="text-xs" />
                            )}
                            <span>Remove</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Location and Date - Mobile Optimized */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0 mb-3 text-xs text-gray-600">
                    <div>
                      <p className={style.className}>{style.text}</p>
                    </div>
                  </div>

                  {/* Price and Desktop Actions */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg sm:text-xl font-bold text-[#1B3C53]">
                        {formatPrice(item.price)}
                      </div>
                      {item.originalPrice && (
                        <div className="text-sm text-gray-500 line-through">
                          {formatPrice(item.originalPrice)}
                        </div>
                      )}
                    </div>

                    <div className="hidden sm:flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCart(e, item._id);
                        }}
                        disabled={style.text === "Out of Stock"}
                        className={`inline-flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 font-medium text-sm ${
                          style.text !== "Out of Stock"
                            ? "bg-[#1B3C53] hover:bg-[#456882] text-white"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        {selectedItems.some((id) =>
                          isAddToCartLoading.includes(id)
                        ) ? (
                          <Loader2 className="w-6 h-6 animate-spin mr-2" />
                        ) : (
                          <FaShoppingCart className="text-xs" />
                        )}
                        <span>Add to Cart</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onShare(e, item);
                        }}
                        className="p-2 text-[#456882] hover:text-[#1B3C53] hover:bg-gray-100 rounded-lg transition-all duration-200"
                        title="Share product"
                      >
                        <FaShare className="text-sm" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveFromWishlist(e, item._id);
                        }}
                        className="p-2 text-[#456882] hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                        title="Remove from wishlist"
                      >
                        {isLoading.includes(item._id)? (
                          <Loader2 className="w-6 h-6 animate-spin mr-2" />
                        ) : (
                          <FaTrash className="text-xs" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="sm:hidden mt-3 pt-3 border-t border-gray-100 flex space-x-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(e, item._id);
                      }}
                      disabled={style.text === "Out of Stock"}
                      className={`flex-1 inline-flex items-center justify-center space-x-2 py-2 px-3 rounded-lg transition-all duration-200 font-medium text-sm ${
                        style.text !== "Out of Stock"
                          ? "bg-[#1B3C53] hover:bg-[#456882] text-white"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {selectedItems.includes(item._id)
                       ? (
                        <Loader2 className="w-6 h-6 animate-spin mr-2" />
                      ) : (
                        <FaShoppingCart className="text-xs" />
                      )}
                      <span>Add to Cart</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onShare(e, item);
                      }}
                      className="p-2 text-[#456882] hover:text-[#1B3C53] hover:bg-gray-100 rounded-lg transition-all duration-200"
                      title="Share"
                    >
                      <FaShare className="text-sm" />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveFromWishlist(e, item._id);
                      }}
                      className="p-2 text-[#456882] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                      title="Remove"
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
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductList;
