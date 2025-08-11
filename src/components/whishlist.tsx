import React, { useState } from "react";
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaEllipsisV,
  FaExclamationTriangle,
  FaFilter,
  FaHeart,
  FaList,
  FaMapMarkerAlt,
  FaSearch,
  FaShare,
  FaShoppingBag,
  FaShoppingCart,
  FaTrash,
} from "react-icons/fa";
import { MdGridOn } from "react-icons/md";
import { NavLink, useNavigate } from "react-router-dom";

// Types
interface WishlistItem {
  id: string;
  title: string;
  brand: string;
  price: number;
  originalPrice?: number;
  location: string;
  image: string;
  dateAdded: string;
  inStock: boolean;
  discount?: number;
  isSponsored?: boolean;
  isFeatured?: boolean;
  seller: {
    name: string;
    id: string;
    rating: number;
  };
  category: string;
}

interface WishlistPageProps {
  onAddToCart?: (itemId: string) => void;
  onRemoveFromWishlist?: (itemId: string) => void;
  onProductClick?: (itemId: string) => void;
  onShare?: (
    itemId: string,
    title: string,
    price: number,
    slug: string
  ) => void;
  onClearWishlist?: () => void;
}

type ViewMode = "grid" | "list";
type SortOption = "newest" | "oldest" | "price-low" | "price-high" | "name";

const WishlistPage: React.FC<WishlistPageProps> = ({
  onAddToCart,
  onRemoveFromWishlist,
  onProductClick,
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

  // Sample wishlist data
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([
    {
      id: "1",
      title: "MacBook Pro M2 14-inch Space Gray",
      brand: "Apple",
      price: 850000,
      originalPrice: 950000,
      location: "Lagos, Victoria Island",
      image:
        "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=300&h=300&fit=crop",
      dateAdded: "2024-07-20",
      inStock: true,
      discount: 11,
      isSponsored: true,
      isFeatured: true,
      seller: {
        name: "TechHub Lagos",
        id: "seller-1",
        rating: 4.8,
      },
      category: "Laptops",
    },
    {
      id: "2",
      title: "iPhone 14 Pro Max 256GB Deep Purple",
      brand: "Apple",
      price: 650000,
      location: "Abuja, Wuse 2",
      image:
        "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop",
      dateAdded: "2024-07-18",
      inStock: true,
      isSponsored: true,
      seller: {
        name: "Mobile World Abuja",
        id: "seller-2",
        rating: 4.6,
      },
      category: "Smartphones",
    },
    {
      id: "3",
      title: "Samsung Galaxy S23 Ultra 512GB",
      brand: "Samsung",
      price: 580000,
      originalPrice: 650000,
      location: "Lagos, Ikeja",
      image:
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop",
      dateAdded: "2024-07-15",
      inStock: false,
      discount: 11,
      seller: {
        name: "Galaxy Store Lagos",
        id: "seller-3",
        rating: 4.5,
      },
      category: "Smartphones",
    },
    {
      id: "4",
      title: "Sony WH-1000XM5 Wireless Headphones",
      brand: "Sony",
      price: 180000,
      location: "Kano, Fagge",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
      dateAdded: "2024-07-12",
      inStock: true,
      isFeatured: true,
      seller: {
        name: "Audio Pro Kano",
        id: "seller-4",
        rating: 4.7,
      },
      category: "Headphones",
    },
    {
      id: "5",
      title: "iPad Air 5th Generation 256GB",
      brand: "Apple",
      price: 320000,
      originalPrice: 380000,
      location: "Lagos, Lekki",
      image:
        "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&h=300&fit=crop",
      dateAdded: "2024-07-10",
      inStock: true,
      discount: 16,
      seller: {
        name: "Tablet Store Lekki",
        id: "seller-5",
        rating: 4.4,
      },
      category: "Tablets",
    },
    {
      id: "6",
      title: "Canon EOS R6 Mark II Camera Body",
      brand: "Canon",
      price: 920000,
      location: "Lagos, Surulere",
      image:
        "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=300&h=300&fit=crop",
      dateAdded: "2024-07-08",
      inStock: false,
      seller: {
        name: "Camera House Lagos",
        id: "seller-6",
        rating: 4.9,
      },
      category: "Cameras",
    },
  ]);

  // Get unique categories for filter
  const categories = [
    "all",
    ...Array.from(new Set(wishlistItems.map((item) => item.category))),
  ];

  // Filter and sort items
  const filteredItems = wishlistItems
    .filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" || item.category === categoryFilter;
      const matchesStock =
        stockFilter === "all" ||
        (stockFilter === "in-stock" && item.inStock) ||
        (stockFilter === "out-of-stock" && !item.inStock);
      return matchesSearch && matchesCategory && matchesStock;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
          );
        case "oldest":
          return (
            new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime()
          );
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  const formatPrice = (price: number): string => {
    return price.toLocaleString("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    });
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const slugifyProduct = (title: string, id: string): string => {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    return `${slug}-${id}`;
  };

  const handleProductClick = (item: WishlistItem): void => {
    const productUrl = `/listings/${slugifyProduct(item.title, item.id)}`;

    if (onProductClick) {
      onProductClick(item.id);
    }

    navigate(productUrl);
  };

  const handleAddToCart = (e: React.MouseEvent, itemId: string): void => {
    e.stopPropagation();
    onAddToCart?.(itemId);
    console.log("Added to cart:", itemId);
  };

  const handleRemoveFromWishlist = (
    e: React.MouseEvent,
    itemId: string
  ): void => {
    e.stopPropagation();
    setWishlistItems((items) => items.filter((item) => item.id !== itemId));
    onRemoveFromWishlist?.(itemId);
  };

  const handleShare = (e: React.MouseEvent, item: WishlistItem): void => {
    e.stopPropagation();
    const slug = slugifyProduct(item.title, item.id);
    onShare?.(item.id, item.title, item.price, slug);
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
        : filteredItems.map((item) => item.id)
    );
  };

  const handleAddSelectedToCart = (): void => {
    selectedItems.forEach((itemId) => {
      const item = wishlistItems.find((item) => item.id === itemId);
      if (item && item.inStock) {
        onAddToCart?.(itemId);
      }
    });
    setSelectedItems([]);
  };

  const handleRemoveSelected = (): void => {
    setWishlistItems((items) =>
      items.filter((item) => !selectedItems.includes(item.id))
    );
    selectedItems.forEach((itemId) => onRemoveFromWishlist?.(itemId));
    setSelectedItems([]);
  };

  if (wishlistItems.length === 0) {
    return (
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
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
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

            {wishlistItems.length > 0 && (
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

          {/* Collapsible Filters */}
          {showFilters && (
            <div className="p-4 border-t border-gray-100 bg-gray-50">
              <div className="space-y-4">
                {/* Category and Stock Filters */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#456882] mb-2">
                      Category
                    </label>
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3C53]/20 focus:border-[#1B3C53] transition-colors duration-200 bg-white"
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category === "all" ? "All Categories" : category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#456882] mb-2">
                      Availability
                    </label>
                    <select
                      value={stockFilter}
                      onChange={(e) => setStockFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3C53]/20 focus:border-[#1B3C53] transition-colors duration-200 bg-white"
                    >
                      <option value="all">All Items</option>
                      <option value="in-stock">In Stock</option>
                      <option value="out-of-stock">Out of Stock</option>
                    </select>
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <label className="block text-sm font-medium text-[#456882] mb-2">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3C53]/20 focus:border-[#1B3C53] transition-colors duration-200 bg-white"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name">Name: A to Z</option>
                  </select>
                </div>

                {/* Clear Filters */}
                {(categoryFilter !== "all" ||
                  stockFilter !== "all" ||
                  sortBy !== "newest") && (
                  <button
                    onClick={() => {
                      setCategoryFilter("all");
                      setStockFilter("all");
                      setSortBy("newest");
                    }}
                    className="text-[#456882] hover:text-[#1B3C53] font-medium text-sm transition-colors duration-200"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            </div>
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
                    <FaShoppingCart className="text-xs" />
                    <span>Add to Cart</span>
                  </button>
                  <button
                    onClick={handleRemoveSelected}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all duration-200 text-sm font-medium"
                  >
                    <FaTrash className="text-xs" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Items Display */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg border border-[#CBDCEB] hover:border-[#456882]/30 transition-all duration-300 hover:shadow-lg cursor-pointer group overflow-hidden"
                onClick={() => handleProductClick(item)}
              >
                {/* Selection Checkbox */}
                <div className="absolute top-3 left-3 z-10">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => handleSelectItem(item.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="rounded border-gray-300 text-[#1B3C53] focus:ring-[#1B3C53]"
                  />
                </div>

                {/* Image Container */}
                <div className="relative overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Badges */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2">
                    {item.discount && (
                      <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                        -{item.discount}%
                      </span>
                    )}
                    {item.isSponsored && (
                      <span className="bg-[#456882] text-white text-xs font-semibold px-2 py-1 rounded-full">
                        Sponsored
                      </span>
                    )}
                    {item.isFeatured && (
                      <span className="bg-[#1B3C53] text-white text-xs font-semibold px-2 py-1 rounded-full">
                        Featured
                      </span>
                    )}
                  </div>

                  {/* Stock Status Overlay */}
                  {!item.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Out of Stock
                      </span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
                    <button
                      onClick={(e) => handleAddToCart(e, item.id)}
                      disabled={!item.inStock}
                      className={`flex-1 py-2 px-3 rounded-lg transition-all duration-200 font-medium text-sm flex items-center justify-center space-x-2 ${
                        item.inStock
                          ? "bg-[#1B3C53] hover:bg-[#456882] text-white"
                          : "bg-gray-400 text-gray-200 cursor-not-allowed"
                      }`}
                    >
                      <FaShoppingCart className="text-xs" />
                      <span className="hidden sm:inline">Add to Cart</span>
                    </button>
                    <button
                      onClick={(e) => handleShare(e, item)}
                      className="w-10 h-10 bg-white/90 hover:bg-white rounded-lg flex items-center justify-center text-[#456882] hover:text-[#1B3C53] transition-colors duration-200"
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

                  {/* Location and Date */}
                  <div className="space-y-1 mb-4 text-xs text-gray-600">
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="mr-2 flex-shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </div>
                    <div className="flex items-center">
                      <FaCalendarAlt className="mr-2 flex-shrink-0" />
                      <span>Added {formatDate(item.dateAdded)}</span>
                    </div>
                  </div>

                  {/* Price and Remove Button */}
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
                      onClick={(e) => handleRemoveFromWishlist(e, item.id)}
                      className="p-2 text-[#456882] hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-200"
                      title="Remove from wishlist"
                    >
                      <FaHeart className="text-sm" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View - Mobile Optimized */
          <div className="space-y-3 sm:space-y-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg border border-[#CBDCEB] hover:border-[#456882]/30 transition-all duration-300 hover:shadow-md cursor-pointer group overflow-hidden"
                onClick={() => handleProductClick(item)}
              >
                <div className="p-4">
                  <div className="flex space-x-4">
                    {/* Checkbox and Image */}
                    <div className="flex-shrink-0 space-y-3">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleSelectItem(item.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="rounded border-gray-300 text-[#1B3C53] focus:ring-[#1B3C53]"
                      />

                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 overflow-hidden rounded-lg">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {!item.inStock && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <FaExclamationTriangle className="text-white text-sm" />
                          </div>
                        )}
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
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowItemActions(
                                showItemActions === item.id ? null : item.id
                              );
                            }}
                            className="p-2 text-gray-400 hover:text-[#456882] rounded-full transition-colors duration-200"
                          >
                            <FaEllipsisV className="text-sm" />
                          </button>

                          {/* Mobile Actions Dropdown */}
                          {showItemActions === item.id && (
                            <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-40">
                              <button
                                onClick={(e) => {
                                  handleAddToCart(e, item.id);
                                  setShowItemActions(null);
                                }}
                                disabled={!item.inStock}
                                className={`w-full flex items-center space-x-2 px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors duration-200 ${
                                  !item.inStock
                                    ? "text-gray-400 cursor-not-allowed"
                                    : "text-gray-700"
                                }`}
                              >
                                <FaShoppingCart className="text-xs" />
                                <span>Add to Cart</span>
                              </button>
                              <button
                                onClick={(e) => {
                                  handleShare(e, item);
                                  setShowItemActions(null);
                                }}
                                className="w-full flex items-center space-x-2 px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                              >
                                <FaShare className="text-xs" />
                                <span>Share</span>
                              </button>
                              <button
                                onClick={(e) => {
                                  handleRemoveFromWishlist(e, item.id);
                                  setShowItemActions(null);
                                }}
                                className="w-full flex items-center space-x-2 px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 border-t border-gray-100"
                              >
                                <FaTrash className="text-xs" />
                                <span>Remove</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Location and Date - Mobile Optimized */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0 mb-3 text-xs text-gray-600">
                        <div className="flex items-center">
                          <FaMapMarkerAlt className="mr-2 flex-shrink-0" />
                          <span className="truncate">{item.location}</span>
                        </div>
                        <div className="flex items-center">
                          <FaCalendarAlt className="mr-2 flex-shrink-0" />
                          <span>Added {formatDate(item.dateAdded)}</span>
                        </div>
                        <div
                          className={`flex items-center ${
                            item.inStock ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {item.inStock ? (
                            <FaCheckCircle className="mr-1" />
                          ) : (
                            <FaExclamationTriangle className="mr-1" />
                          )}
                          {item.inStock ? "In Stock" : "Out of Stock"}
                        </div>
                      </div>

                      {/* Badges - Mobile Optimized */}
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        {item.discount && (
                          <span className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded-full">
                            {item.discount}% Off
                          </span>
                        )}
                        {item.isFeatured && (
                          <span className="bg-[#1B3C53] text-white text-xs font-semibold px-2 py-1 rounded-full">
                            Featured
                          </span>
                        )}
                        {item.isSponsored && (
                          <span className="bg-[#456882] text-white text-xs font-semibold px-2 py-1 rounded-full">
                            Sponsored
                          </span>
                        )}
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

                        {/* Desktop Action Buttons */}
                        <div className="hidden sm:flex items-center space-x-2">
                          <button
                            onClick={(e) => handleAddToCart(e, item.id)}
                            disabled={!item.inStock}
                            className={`inline-flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 font-medium text-sm ${
                              item.inStock
                                ? "bg-[#1B3C53] hover:bg-[#456882] text-white"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                          >
                            <FaShoppingCart className="text-xs" />
                            <span>Add to Cart</span>
                          </button>

                          <button
                            onClick={(e) => handleShare(e, item)}
                            className="p-2 text-[#456882] hover:text-[#1B3C53] hover:bg-gray-100 rounded-lg transition-all duration-200"
                            title="Share product"
                          >
                            <FaShare className="text-sm" />
                          </button>

                          <button
                            onClick={(e) =>
                              handleRemoveFromWishlist(e, item.id)
                            }
                            className="p-2 text-[#456882] hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                            title="Remove from wishlist"
                          >
                            <FaHeart className="text-sm" />
                          </button>
                        </div>
                      </div>

                      {/* Mobile Action Buttons */}
                      <div className="sm:hidden mt-3 pt-3 border-t border-gray-100 flex space-x-2">
                        <button
                          onClick={(e) => handleAddToCart(e, item.id)}
                          disabled={!item.inStock}
                          className={`flex-1 inline-flex items-center justify-center space-x-2 py-2 px-3 rounded-lg transition-all duration-200 font-medium text-sm ${
                            item.inStock
                              ? "bg-[#1B3C53] hover:bg-[#456882] text-white"
                              : "bg-gray-300 text-gray-500 cursor-not-allowed"
                          }`}
                        >
                          <FaShoppingCart className="text-xs" />
                          <span>Add to Cart</span>
                        </button>

                        <button
                          onClick={(e) => handleShare(e, item)}
                          className="p-2 text-[#456882] hover:text-[#1B3C53] hover:bg-gray-100 rounded-lg transition-all duration-200"
                          title="Share"
                        >
                          <FaShare className="text-sm" />
                        </button>

                        <button
                          onClick={(e) => handleRemoveFromWishlist(e, item.id)}
                          className="p-2 text-[#456882] hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                          title="Remove"
                        >
                          <FaTrash className="text-sm" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {filteredItems.length === 0 && wishlistItems.length > 0 && (
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

        {/* Quick Actions Footer - Mobile Optimized */}
        {filteredItems.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-gray-600 text-center sm:text-left">
                {filteredItems.filter((item) => item.inStock).length} of{" "}
                {filteredItems.length} items available
              </div>

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => {
                    const inStockItems = filteredItems.filter(
                      (item) => item.inStock
                    );
                    inStockItems.forEach((item) => onAddToCart?.(item.id));
                  }}
                  disabled={
                    filteredItems.filter((item) => item.inStock).length === 0
                  }
                  className="inline-flex items-center justify-center space-x-2 bg-[#1B3C53] text-white px-6 py-3 rounded-lg hover:bg-[#456882] transition-all duration-200 font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <FaShoppingCart className="text-sm" />
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

      {/* Click Outside to Close Mobile Actions */}
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
