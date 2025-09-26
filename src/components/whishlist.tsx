import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import {
  FaFilter,
  FaHeart,
  FaList,
  FaSearch,
  FaShoppingBag,
  FaShoppingCart,
  FaTrash,
} from "react-icons/fa";
import { MdGridOn } from "react-icons/md";
import { NavLink, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import type { Product } from "../context/AppContextInterface";
import Loader from "./nexgadMidPageLoader";
import {
  getAvailabilityStyle,
  ProductAvailability,
} from "./wishlsitComponents/common";
import FiltersPanel from "./wishlsitComponents/filterPanel";
import ProductGrid from "./wishlsitComponents/gridViewWhislistListings";
import ProductList from "./wishlsitComponents/listViewWishlistings";

interface WishlistPageProps {
  isPageLoading: boolean;
  Product: Product[];
  isAddToCartLoading: string[];
  isLoading: string[];
  onAddToCart: (itemId: string[]) => void;
  onRemoveFromWishlist: (itemId: string[]) => void;
  onShare: (e: React.MouseEvent, item: Product) => void;
  onClearWishlist: () => void;
}

type ViewMode = "grid" | "list";
type SortOption = "newest" | "oldest" | "price-low" | "price-high" | "name";

const WishlistPage: React.FC<WishlistPageProps> = ({
  isPageLoading,
  Product,
  isLoading,
  isAddToCartLoading,
  onAddToCart,
  onRemoveFromWishlist,
  onShare,
  onClearWishlist,
}) => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [stockFilter, setStockFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [showItemActions, setShowItemActions] = useState<string | null>(null);
  const { setWishlistItems } = useAppContext();

  const categories = [
    "all",
    ...Array.from(new Set(Product.map((item) => item.category))),
  ];

  const filteredItems = Product.filter((item) => {
    const style = getAvailabilityStyle(item.availability);
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || item.category === categoryFilter;
    const matchesStock =
      stockFilter === "all" ||
      (stockFilter === "in-stock" && style.text === "In Stock") ||
      (stockFilter === "out-of-stock" && style.text === "Out of Stock");
    return matchesSearch && matchesCategory && matchesStock;
  });

  const slugifyProduct = (title: string, id: string): string => {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    return `${slug}-${id}`;
  };

  const handleProductClick = (item: Product): void => {
    const productUrl = `/listings/${slugifyProduct(item.title, item._id)}`;

    navigate(productUrl);
  };

  const handleAddToCart = (e: React.MouseEvent, itemId: string): void => {
    e.stopPropagation();
    onAddToCart?.([itemId]);
  };

  const handleRemoveFromWishlist = (
    e: React.MouseEvent,
    itemId: string
  ): void => {
    e.stopPropagation();
    onRemoveFromWishlist?.([itemId]);
  };

  const handleSelectItem = (itemId: string): void => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = (): void => {
    setSelectedItems(
      selectedItems.length === filteredItems.length
        ? []
        : filteredItems.map((item) => item._id)
    );
  };

  const handleAddSelectedToCart = (): void => {
    selectedItems.forEach((itemId) => {
      const item = Product.find((item) => item._id === itemId);
      const style = getAvailabilityStyle(item.availability);
      if (item && style.text === "Out of Stock") {
        selectedItems.filter((e) => e !== itemId);
      }
    });
    onAddToCart(selectedItems);
    setSelectedItems([]);
  };

  const handleRemoveSelected = (): void => {
    onRemoveFromWishlist(selectedItems);
    setSelectedItems([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {isPageLoading ? (
        <div className="min-h-screen flex items-center justify-center">
          <Loader size={64} thickness={1} />
        </div>
      ) : Product.length === 0 ? (
        <div className="min-h-screen bg-gray-50 py-8 bg-gradient-to-br from-slate-50 to-blue-50 p-4">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-16">
              <FaHeart className="mx-auto text-6xl text-[#CBDCEB] mb-6" />
              <h2 className="text-2xl font-bold text-[#1B3C53] mb-4">
                Your wishlist is empty
              </h2>
              <p className="text-gray-600 mb-8">
                Save items you love for later by clicking the heart icon.
              </p>
              <NavLink
                to="/listings"
                className="inline-flex items-center space-x-2 bg-[#1B3C53] text-white px-8 py-3 rounded-lg hover:bg-[#456882] transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <FaShoppingBag className="text-sm" />
                <span>Start Shopping</span>
              </NavLink>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#1B3C53] mb-2">
                  My Wishlist
                </h1>
                <p className="text-gray-600 text-sm sm:text-base">
                  {filteredItems.length} item
                  {filteredItems.length !== 1 ? "s" : ""} saved for later
                </p>
              </div>

              {Product.length > 0 && (
                <button
                  onClick={onClearWishlist}
                  className="text-red-600 hover:text-red-800 font-medium transition-colors duration-200 text-sm sm:text-base"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>

          {/* Mobile Controls */}
          <div className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
            {/* Search Bar - Always Visible */}
            <div className="p-4 border-b border-gray-100">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  placeholder="Search wishlist..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3C53]/20 focus:border-[#1B3C53] transition-colors duration-200"
                />
              </div>
            </div>

            {/* View Mode and Filter Toggle */}
            <div className="p-4 flex items-center justify-between">
              {/* View Mode Toggle */}
              <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === "grid"
                      ? "bg-[#1B3C53] text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <MdGridOn className="text-lg" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === "list"
                      ? "bg-[#1B3C53] text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <FaList className="text-lg" />
                </button>
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 bg-[#CBDCEB] text-[#1B3C53] px-4 py-2 rounded-lg hover:bg-[#456882]/20 transition-all duration-200 font-medium"
              >
                <FaFilter className="text-sm" />
                <span className="hidden sm:inline">Filters</span>
                {(categoryFilter !== "all" ||
                  stockFilter !== "all" ||
                  sortBy !== "newest") && (
                  <span className="bg-[#456882] text-white text-xs rounded-full w-2 h-2"></span>
                )}
              </button>
            </div>

            {showFilters && (
              <FiltersPanel
                categories={categories}
                categoryFilter={categoryFilter}
                stockFilter={stockFilter}
                sortBy={sortBy}
                onCategoryChange={setCategoryFilter}
                onStockChange={setStockFilter}
                onSortChange={setSortBy}
                onClearFilters={() => {
                  setCategoryFilter("all");
                  setStockFilter("all");
                  setSortBy("newest");
                }}
              />
            )}

            {/* Bulk Actions - Mobile Optimized */}
            {selectedItems.length > 0 && (
              <div className="p-4 bg-[#CBDCEB]/30 border-t border-gray-100">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === filteredItems.length}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-[#1B3C53] focus:ring-[#1B3C53]"
                    />
                    <span className="text-sm text-gray-600">
                      {selectedItems.length} selected
                    </span>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={handleAddSelectedToCart}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-1 bg-[#1B3C53] text-white px-4 py-2 rounded-lg hover:bg-[#456882] transition-all duration-200 text-sm font-medium"
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
                      onClick={handleRemoveSelected}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all duration-200 text-sm font-medium"
                    >
                      {isLoading.length > 0 ? (
                        <Loader2 className="w-6 h-6 animate-spin mr-2" />
                      ) : (
                        <FaTrash className="text-xs" />
                      )}

                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Items Display */}
          {viewMode === "grid" ? (
            <ProductGrid
              isLoading={isLoading}
              isAddToCartLoading={isAddToCartLoading}
              filteredItems={filteredItems}
              selectedItems={selectedItems}
              onProductClick={handleProductClick}
              onSelectItem={handleSelectItem}
              onAddToCart={handleAddToCart}
              onShare={(e, items: Product) => {
                onShare(e, items);
              }}
              onRemoveFromWishlist={(e, id) => {
                handleRemoveFromWishlist(e, id);
              }}
              formatDate={(d) => new Date(d).toLocaleDateString()}
              formatPrice={(n) => `₦${n.toFixed(2)}`}
            />
          ) : (
            <ProductList
              isLoading={isLoading}
              isAddToCartLoading={isAddToCartLoading}
              filteredItems={filteredItems}
              selectedItems={selectedItems}
              showItemActions={showItemActions}
              onToggleItemActions={setShowItemActions}
              onProductClick={handleProductClick}
              onSelectItem={handleSelectItem}
              onAddToCart={handleAddToCart}
              onShare={(e, id) => onShare(e, id)}
              onRemoveFromWishlist={handleRemoveFromWishlist}
              formatDate={(d) => new Date(d).toLocaleDateString()}
              formatPrice={(n) => `₦${n.toFixed(2)}`}
            />
          )}

          {/* No Results */}
          {filteredItems.length === 0 && Product.length > 0 && (
            <div className="text-center py-12">
              <FaSearch className="mx-auto text-4xl text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No items found
              </h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search or filter criteria
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setCategoryFilter("all");
                  setStockFilter("all");
                  setSortBy("newest");
                }}
                className="text-[#456882] hover:text-[#1B3C53] font-medium transition-colors duration-200"
              >
                Clear all filters
              </button>
            </div>
          )}

          {filteredItems.length > 0 && (
            <div className="mt-8 bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-gray-600 text-center sm:text-left">
                  {
                    filteredItems.filter(
                      (item) =>
                        item.availability === ProductAvailability.IN_STOCK
                    ).length
                  }{" "}
                  of {filteredItems.length} items available
                </div>

                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                  <button
                    onClick={() => {
                      const inStockItems = filteredItems
                        .filter(
                          (item) =>
                            item.availability !==
                            ProductAvailability.OUT_OF_STOCK
                        )
                        .map((e) => e._id);

                      onAddToCart(inStockItems);
                    }}
                    disabled={
                      filteredItems.filter(
                        (item) =>
                          item.availability !== ProductAvailability.OUT_OF_STOCK
                      ).length === 0
                    }
                    className="inline-flex items-center justify-center space-x-2 bg-[#1B3C53] text-white px-6 py-3 rounded-lg hover:bg-[#456882] transition-all duration-200 font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {filteredItems
                      .filter(
                        (item) =>
                          item.availability !== ProductAvailability.OUT_OF_STOCK
                      )
                      .some((item) => isAddToCartLoading.includes(item._id)) ? (
                      <Loader2 className="w-6 h-6 animate-spin mr-2" />
                    ) : (
                      <FaShoppingCart className="text-xs" />
                    )}
                    <span>Add All Available to Cart</span>
                  </button>

                  <NavLink
                    to="/listings"
                    className="inline-flex items-center justify-center space-x-2 bg-[#CBDCEB] text-[#1B3C53] px-6 py-3 rounded-lg hover:bg-[#456882]/20 transition-all duration-200 font-medium"
                  >
                    <FaShoppingBag className="text-sm" />
                    <span>Continue Shopping</span>
                  </NavLink>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {showItemActions && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowItemActions(null)}
        />
      )}
    </div>
  );
};

export default WishlistPage;
