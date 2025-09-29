import React from "react";
import { FaMapMarkerAlt, FaRegHeart, FaShoppingCart } from "react-icons/fa";
import { FaHeart, FaShare } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { useShareProduct } from "../hooks/useShareProduct";
import { AddToCartRequest } from "../utils/AddToCartRequest";
import { slugifyProduct } from "../utils/Slugify";
import Loader from "./nexgadMidPageLoader";
import NotFoundListings from "./NotFoundProduct";

interface AllListingsProps {
  onViewAll?: () => void;
  onListingClick?: (listingId: string) => void;
  onAddToCart?: (listingId: string) => void;
  isLoading: boolean;
  hasMore: boolean;
  onSortChange: (sortOption: string) => void;
  loadMore: () => void;
  resetFilter: () => void;
  onListingLike: (listingId: string, currentlyLiked: boolean) => void;
}

const AllListings: React.FC<AllListingsProps> = ({
  onListingClick,
  onAddToCart,
  isLoading,
  hasMore,
  onSortChange,
  loadMore,
  resetFilter,
  onListingLike,
}) => {
  const navigate = useNavigate();
  const { handleShare } = useShareProduct();
  const { handleAddToCart } = AddToCartRequest();
  const { sort, Listings, isListingLikeLoading, cart, isAddToCartLoading } =
    useAppContext();

  const formatPrice = (price: number) => {
    return price.toLocaleString("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    });
  };

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "price-high", label: "Highest price first" },
    { value: "price-low", label: "Lowest price first" },
  ];

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSortChange(e.target.value);
  };

  const handleListingClick = (listingTitle: string, listingId: string) => {
    const productUrl = `/listings/${slugifyProduct(listingTitle, listingId)}`;

    if (onListingClick) {
      onListingClick(listingId);
    }
    if (listingId) {
      navigate(productUrl);
    }
  };

  return (
    <section className="py-8 sm:py-12 lg:py-16 px-3 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-12 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1B3C53] mb-2">
              Listings
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-[#456882]/70">
              {/* Mobile: shorter text */}
              <span className="sm:hidden">NexGad Marketplace</span>
              {/* Desktop: full text */}
              <span className="hidden sm:inline">
                Discover the newest gadgets added to our marketplace
              </span>
            </p>
          </div>

          {/* Sort dropdown - now visible on mobile too */}
          <div className="w-full sm:w-auto">
            <select
              className="w-full sm:w-auto border border-[#CBDCEB] rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base text-[#1B3C53] bg-white focus:outline-none focus:ring-2 focus:ring-[#456882] transition"
              onChange={handleSortChange}
              value={sort}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Listings Grid */}
        {isLoading ? (
          <div className="h-60 sm:h-80 flex items-center justify-center">
            <Loader size={48} thickness={1} className="sm:w-16 sm:h-16" />
          </div>
        ) : Listings.length === 0 ? (
          <NotFoundListings onResetFilters={resetFilter} />
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {Listings.map((listing) => (
              <div
                key={listing._id}
                onClick={() =>
                  handleListingClick(listing.title, listing.productId)
                }
                className="bg-white rounded-lg sm:rounded-2xl border border-[#CBDCEB] hover:border-[#456882]/30 transition-all duration-300 hover:shadow-xl cursor-pointer group overflow-hidden"
              >
                {/* Image Container */}
                <div className="relative overflow-hidden">
                  <div className="relative w-full h-40 sm:h-48">
                    <img
                      src={listing.images[0]?.url}
                      alt={listing.images[0]?.alt || "Product image"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        const fallback =
                          target.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = "flex";
                      }}
                    />
                    <div className="absolute inset-0 hidden items-center justify-center bg-gray-100 text-gray-500 text-xs sm:text-sm">
                      No Image
                    </div>
                  </div>

                  {/* Action Buttons - Hidden on mobile, shown on hover for desktop */}
                  <div className="absolute top-2 sm:top-3 right-2 sm:right-3 flex flex-col gap-1.5 sm:gap-2 opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      disabled={isListingLikeLoading}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onListingLike(listing._id, listing?.liked);
                      }}
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full cursor-pointer flex items-center justify-center transition-colors duration-200 ${
                        listing.liked
                          ? "bg-[#1B3C53] text-white hover:bg-[#456882]"
                          : "bg-white border-2 border-[#456882] text-[#456882] hover:bg-white/95"
                      }`}
                    >
                      {listing.liked ? (
                        <FaHeart className="text-xs sm:text-sm" />
                      ) : (
                        <FaRegHeart className="text-xs sm:text-sm" />
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const slug = slugifyProduct(
                          listing.title,
                          listing.productId
                        );
                        handleShare(
                          listing.productId,
                          listing.title,
                          listing.price,
                          slug
                        );
                      }}
                      className="w-7 h-7 sm:w-8 sm:h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-[#456882] hover:text-[#1B3C53] transition-colors duration-200"
                    >
                      <FaShare className="text-xs sm:text-sm" />
                    </button>
                  </div>

                  {/* Quick Add to Cart - Desktop only on hover */}
                  <div className="hidden sm:block absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {cart?.items?.find((p) => p.product._id === listing._id) ? (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-medium text-sm flex items-center justify-center space-x-2"
                      >
                        <FaShoppingCart className="text-sm" />
                        <span>In Cart</span>
                      </button>
                    ) : (
                      <button
                        disabled={isAddToCartLoading.includes(listing._id)}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleAddToCart([listing._id]);
                        }}
                        className="w-full flex items-center justify-center space-x-2 bg-[#1B3C53] hover:bg-[#456882] disabled:bg-[#456882]/70 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg transition-all duration-200 font-medium text-sm"
                      >
                        {isAddToCartLoading.includes(listing._id) ? (
                          <>
                            <svg
                              className="animate-spin h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                            <span>Adding...</span>
                          </>
                        ) : (
                          <>
                            <FaShoppingCart className="text-xs" />
                            <span>Quick Add</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-2.5 sm:p-3 lg:p-5">
                  {/* Title and Brand */}
                  <div className="mb-2 sm:mb-3">
                    <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-[#1B3C53] mb-1 group-hover:text-[#456882] transition-colors duration-200 line-clamp-2 leading-tight">
                      {listing.title}
                    </h3>
                    {listing.brand && (
                      <p className="text-xs sm:text-sm text-[#456882]/60 font-medium truncate">
                        {listing.brand}
                      </p>
                    )}
                  </div>

                  {/* Location */}
                  <div className="flex items-center text-[#456882]/70 text-xs sm:text-sm mb-2 sm:mb-4">
                    <FaMapMarkerAlt className="text-xs mr-1.5 flex-shrink-0" />
                    <span className="truncate">{listing.location.city}</span>
                  </div>

                  {/* Price */}
                  <div className="text-base sm:text-lg lg:text-xl font-bold text-[#1B3C53] mb-2 sm:mb-3">
                    {formatPrice(listing.price)}
                  </div>

                  {/* Add to Cart Button - Always visible on mobile */}
                  {cart?.items?.find((p) => p.product._id === listing._id) ? (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      className="w-full bg-green-600 text-white py-2 px-2 sm:px-4 rounded-lg font-medium text-xs sm:text-sm flex items-center justify-center space-x-1.5 sm:space-x-2"
                    >
                      <FaShoppingCart className="text-xs flex-shrink-0" />
                      <span>In Cart</span>
                    </button>
                  ) : (
                    <button
                      disabled={isAddToCartLoading.includes(listing._id)}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleAddToCart([listing._id]);
                      }}
                      className="w-full flex items-center justify-center space-x-1.5 sm:space-x-2 bg-[#1B3C53] hover:bg-[#456882] disabled:bg-[#456882]/70 disabled:cursor-not-allowed text-white py-2 px-2 sm:px-4 rounded-lg transition-all duration-200 font-medium text-xs sm:text-sm"
                    >
                      {isAddToCartLoading.includes(listing._id) ? (
                        <>
                          <svg
                            className="animate-spin h-3.5 w-3.5 sm:h-4 sm:w-4 text-white flex-shrink-0"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          <span className="truncate">Adding...</span>
                        </>
                      ) : (
                        <>
                          <FaShoppingCart className="text-xs flex-shrink-0" />
                          <span className="truncate">Add to Cart</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {hasMore && (
          <div className="w-full flex justify-center mt-6 sm:mt-8 px-3">
            <button
              onClick={loadMore}
              disabled={isLoading}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-[#1B3C53] hover:bg-[#456882] text-white rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              <span>Load More Listings</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default AllListings;
