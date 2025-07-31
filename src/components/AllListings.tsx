import React from "react";
import { FaMapMarkerAlt, FaShoppingCart } from "react-icons/fa";
import { FaHeart, FaShare } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import dummyImage from "../assets/dummyImage.jpeg";
import { useShareProduct } from "../hooks/useShareProduct";
import { slugifyProduct } from "../utils/Slugify";
interface Listing {
  id: string;
  title: string;
  brand: string;
  price: number;
  location: string;
  image: string;
  isSponsored?: boolean;
  isFeatured?: boolean;
}

interface LatestListingsProps {
  onViewAll?: () => void;
  onListingClick?: (listingId: string) => void;
  onAddToCart?: (listingId: string) => void;
}

const LatestListings: React.FC<LatestListingsProps> = ({
  onListingClick,
  onAddToCart,
}) => {
  const navigate = useNavigate();
  const { handleShare } = useShareProduct();
  // Dummy data - you can replace with your actual data
  const listings: Listing[] = [
    {
      id: "1",
      title: "MacBook Pro M2 14-inch",
      brand: "Apple",
      price: 850000,
      location: "Lagos, Victoria Island",
      image: dummyImage,
      isSponsored: true,
      isFeatured: true,
    },
    {
      id: "2",
      title: "iPhone 14 Pro Max 256GB",
      brand: "Apple",
      price: 650000,
      location: "Abuja, Wuse 2",
      image: dummyImage,
      isSponsored: true,
    },
    {
      id: "3",
      title: "Samsung Galaxy S23 Ultra",
      brand: "Samsung",
      price: 580000,
      location: "Lagos, Ikeja",
      image: dummyImage,
    },
    {
      id: "4",
      title: "Dell XPS 13 Laptop",
      brand: "Dell",
      price: 420000,
      location: "Port Harcourt, GRA",
      image: dummyImage,
      isFeatured: true,
    },
    {
      id: "5",
      title: "Sony WH-1000XM5 Headphones",
      brand: "Sony",
      price: 180000,
      location: "Kano, Fagge",
      image: dummyImage,
      isSponsored: true,
    },
    {
      id: "6",
      title: "iPad Air 5th Generation",
      brand: "Apple",
      price: 320000,
      location: "Lagos, Lekki",
      image: dummyImage,
    },
    {
      id: "7",
      title: "Gaming Laptop RTX 4060",
      brand: "ASUS",
      price: 750000,
      location: "Abuja, Garki",
      image: "/api/placeholder/300/200",
    },
    {
      id: "8",
      title: "Apple Watch Series 9",
      brand: "Apple",
      price: 250000,
      location: "Lagos, Maryland",
      image: dummyImage,
      isFeatured: true,
    },
    {
      id: "9",
      title: "Nintendo Switch OLED",
      brand: "Nintendo",
      price: 180000,
      location: "Ibadan, Bodija",
      image: dummyImage,
    },
    {
      id: "10",
      title: "Canon EOS R6 Camera",
      brand: "Canon",
      price: 920000,
      location: "Lagos, Surulere",
      image: dummyImage,
      isSponsored: true,
    },
    {
      id: "11",
      title: "Surface Pro 9",
      brand: "Microsoft",
      price: 480000,
      location: "Abuja, Maitama",
      image: dummyImage,
    },
    {
      id: "12",
      title: "AirPods Pro 2nd Gen",
      brand: "Apple",
      price: 120000,
      location: "Lagos, Yaba",
      image: dummyImage,
    },
  ];

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

  //   const handleViewAll = () => {
  //     if (onViewAll) {
  //       onViewAll();
  //     }
  //   };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
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

          <div>
            <select
              className="border border-[#CBDCEB] rounded-lg px-4 py-2 text-[#1B3C53] bg-white focus:outline-none focus:ring-2 focus:ring-[#456882] transition"
              // onChange={handleSortChange} // Optional: add handler for sorting
              defaultValue="newest"
            >
              <option value="newest">Newest first</option>
              <option value="lowest">Lowest price first</option>
              <option value="highest">Highest price first</option>
            </select>
          </div>
        </div>
        {/* Listings Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {listings.map((listing) => (
            <div
              key={listing.id}
              onClick={() => handleListingClick(listing.title, listing.id)}
              className="bg-white rounded-2xl border border-[#CBDCEB] hover:border-[#456882]/30 transition-all duration-300 hover:shadow-xl cursor-pointer group overflow-hidden"
            >
              {/* Image Container */}
              <div className="relative overflow-hidden">
                <img
                  src={listing.image}
                  alt={listing.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {listing.isSponsored && (
                    <span className="bg-[#456882] text-white text-xs font-semibold px-3 py-1 rounded-full">
                      Sponsored
                    </span>
                  )}
                  {listing.isFeatured && (
                    <span className="bg-[#1B3C53] text-white text-xs font-semibold px-3 py-1 rounded-full">
                      Featured
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-[#456882] hover:text-[#1B3C53] transition-colors duration-200">
                    <FaHeart className="text-sm" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const slug = slugifyProduct(listing.title, listing.id);
                      handleShare(
                        listing.id,
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
                  <p className="text-sm text-[#456882]/60 font-medium">
                    {listing.brand}
                  </p>
                </div>

                {/* Location */}
                <div className="flex items-center text-[#456882]/70 text-sm mb-4">
                  <FaMapMarkerAlt className="text-xs mr-2" />
                  <span className="truncate">{listing.location}</span>
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
        {/* Load More Button */}
        {/*TODO load more listings as users scroll down to the buttom */}
      </div>
    </section>
  );
};

export default LatestListings;
