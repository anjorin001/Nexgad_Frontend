import React from "react";
import { FaMapMarkerAlt, FaShoppingCart } from "react-icons/fa";
import { FaHeart, FaShare } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { useShareProduct } from "../hooks/useShareProduct";
import { slugifyProduct } from "../utils/Slugify";

interface LatestListingsProps {
  onViewAll?: () => void; 
  onListingClick?: (listingId: string) => void; 
  onAddToCart?: (listingId: string) => void;
}

const LatestListings: React.FC<LatestListingsProps> = ({
  onViewAll,
  onListingClick,
  onAddToCart,
}) => {
  const navigate = useNavigate();
  const { handleShare } = useShareProduct();
  const { LatestListings } = useAppContext();

  const formatPrice = (price: number) => {
    return price.toLocaleString("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    });
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

  const handleAddToCart = (e: React.MouseEvent, listingId: string) => {
    e.stopPropagation();
    // Add your cart logic here
    console.log("Adding to cart:", listingId);
    // Call the prop function if provided
    if (onAddToCart) {
      onAddToCart(listingId);
    }
  };

  const handleViewAll = () => {
    navigate("/listings");
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1B3C53] mb-2">
              Latest Listings
            </h2>
            <p className="text-lg text-[#456882]/70">
              Discover the newest gadgets added to our marketplace
            </p>
          </div>
          <button
            onClick={handleViewAll}
            className="text-[#1B3C53] hover:text-[#456882] font-semibold text-lg transition-colors duration-200 hover:underline"
          >
            View all
          </button>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {LatestListings.map((listing) => (
            <div
              key={listing.id}
              onClick={() =>
                handleListingClick(listing.title, listing.productId)
              }
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

                {/* Price and Add to Cart Button */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="text-xl sm:text-2xl font-bold text-[#1B3C53]">
                    {formatPrice(listing.price)}
                  </div>

                  {/* Main Add to Cart Button */}
                  <button
                    onClick={(e) => handleAddToCart(e, listing.id)}
                    className="flex items-center justify-center space-x-2 bg-[#1B3C53] hover:bg-[#456882] text-white px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 font-medium text-xs sm:text-sm min-w-[100px] sm:min-w-[120px]"
                  >
                    <FaShoppingCart className="text-xs" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <button
            onClick={handleViewAll}
            className="bg-[#1B3C53] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#456882] transition-all duration-200 hover:shadow-lg transform hover:scale-105"
          >
            Load More Listings
          </button>
        </div>
      </div>
    </section>
  );
};

export default LatestListings;
