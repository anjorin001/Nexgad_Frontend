import React from "react";
import { FaMapMarkerAlt, FaShoppingCart } from "react-icons/fa";
import { FaHeart, FaShare } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { useShareProduct } from "../hooks/useShareProduct";
import { slugifyProduct } from "../utils/Slugify";
import Loader from "./nexgadMidPageLoader";
import NotFoundListings from "./NotFoundProduct";

interface LatestListingsProps {
  onViewAll?: () => void;
  onListingClick?: (listingId: string) => void;
  onAddToCart?: (listingId: string) => void;
  isLoading: boolean;
  hasMore: boolean;
  onSortChange: (sortOption: string) => void;
  loadMore: () => void;
  resetFilter: () => void;
}

const LatestListings: React.FC<LatestListingsProps> = ({
  onListingClick,
  onAddToCart,
  isLoading,
  hasMore,
  onSortChange,
  loadMore,
  resetFilter
}) => {
  const navigate = useNavigate();
  const { handleShare } = useShareProduct();
  const { sort, Listings } = useAppContext();

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
    console.log(productUrl);
  };

  const handleAddToCart = (e: React.MouseEvent, listingId: string) => {
    e.stopPropagation();
    // Add your cart logic here
    console.log("Adding to cart:", listingId);
    // Call the prop function if provided
    if (onAddToCart) {
      onAddToCart(listingId);
    }
  };

  return (
    <section className="py-16 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1B3C53] mb-2">
              Listings
            </h2>
            {/* Mobile view */}
            <p className="text-lg text-[#456882]/70 sm:hidden">
              NexGad Marketplace
            </p>
            {/* Desktop/tablet view */}
            <p className="text-lg text-[#456882]/70 hidden sm:block">
              Discover the newest gadgets added to our marketplace
            </p>
          </div>

          <div className="hidden md:block">
            <select
              className="border border-[#CBDCEB] rounded-lg px-4 py-2 text-[#1B3C53] bg-white focus:outline-none focus:ring-2 focus:ring-[#456882] transition"
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
          <>
            <Loader />
          </>
        ) : Listings.length === 0 ? (
          <>
            <NotFoundListings onResetFilters={resetFilter}/>
          </>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {Listings.map((listing) => (
              <div
                key={listing.id}
                onClick={() => handleListingClick(listing.title, listing.id)}
                className="bg-white rounded-2xl border border-[#CBDCEB] hover:border-[#456882]/30 transition-all duration-300 hover:shadow-xl cursor-pointer group overflow-hidden"
              >
                {/* Image Container */}
                <div className="relative overflow-hidden">
                  <img
                    src={listing.images[0].url}
                    alt={listing.images[0].alt}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Action Buttons */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-[#456882] hover:text-[#1B3C53] transition-colors duration-200">
                      <FaHeart className="text-sm" />
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
                      className="w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-[#456882] hover:text-[#1B3C53] transition-colors duration-200"
                    >
                      <FaShare className="text-sm" />
                    </button>
                  </div>

                  {/* Quick Add to Cart - appears on hover */}
                  <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={(e) => handleAddToCart(e, listing.id)}
                      className="w-full bg-[#1B3C53] hover:bg-[#456882] text-white py-2 px-4 rounded-lg transition-all duration-200 font-medium text-sm flex items-center justify-center space-x-2"
                    >
                      <FaShoppingCart className="text-sm" />
                      <span>Quick Add</span>
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-3 sm:p-5">
                  {/* Title and Brand */}
                  <div className="mb-3">
                    <h3 className="text-base sm:text-lg font-semibold text-[#1B3C53] mb-1 group-hover:text-[#456882] transition-colors duration-200 line-clamp-2">
                      {listing.title}
                    </h3>
                    {listing.brand && (
                      <p className="text-sm text-[#456882]/60 font-medium">
                        {listing.brand}
                      </p>
                    )}
                  </div>

                  {/* Location */}
                  <div className="flex items-center text-[#456882]/70 text-sm mb-4">
                    <FaMapMarkerAlt className="text-xs mr-2" />
                    <span className="truncate">{listing.location.city}</span>
                  </div>

                  {/* Price and Add to Cart Button - Always stacked */}
                  <div className="flex flex-col gap-3">
                    <div className="text-xl font-bold text-[#1B3C53]">
                      {formatPrice(listing.price)}
                    </div>

                    {/* Main Add to Cart Button */}
                    <button
                      onClick={(e) => handleAddToCart(e, listing.id)}
                      className="flex items-center justify-center space-x-2 bg-[#1B3C53] hover:bg-[#456882] text-white px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm w-full"
                    >
                      <FaShoppingCart className="text-xs" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {hasMore && (
          <div className="w-full flex justify-center mt-8">
            <button
              onClick={loadMore}
              disabled={isLoading}
              className="px-8 py-3 bg-[#1B3C53] hover:bg-[#456882] text-white rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
            >
              <span>Load More Listings</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default LatestListings;
