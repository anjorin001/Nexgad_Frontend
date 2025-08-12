import React from "react";
import { FaMapMarkerAlt, FaHeart, FaShare } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import dummyImage from "../assets/dummyImage.jpeg";

// Types
interface Product {
  id: string;
  title: string;
  brand: string;
  price: number;
  location: string;
  image: string;
  productType?: "default" | "sponsored" | "featured";
}

interface CompactProductCardsProps {
  maxItems?: number;
  onProductClick?: (productId: string) => void;
  onShare?: (productId: string, title: string, price: number, slug: string) => void;
  title?: string;
  showTitle?: boolean;
}

// Utility function for creating product slugs
const slugifyProduct = (title: string, id: string): string => {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return `${slug}-${id}`;
};

const CompactProductCards: React.FC<CompactProductCardsProps> = ({
  maxItems = 6,
  onProductClick,
  onShare,
  title = "You might also like",
  showTitle = true
}) => {
  const navigate = useNavigate();

  // Sample product data - replace with your actual data
  const allProducts: Product[] = [
     {
      id: "1",
      title: "MacBook Pro M2 14-inch",
      brand: "Apple",
      price: 850000,
      location: "Lagos, Victoria Island",
      image: dummyImage,
      productType: "sponsored",
    },
    {
      id: "2",
      title: "iPhone 14 Pro Max 256GB",
      brand: "Apple",
      price: 650000,
      location: "Abuja, Wuse 2",
      image: dummyImage,
      productType: "sponsored",
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
      productType: "featured",
    },
    {
      id: "5",
      title: "Sony WH-1000XM5 Headphones",
      brand: "Sony",
      price: 180000,
      location: "Kano, Fagge",
      image: dummyImage,
      productType: "sponsored",
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
       productType: "featured",
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
      productType: "sponsored",
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

  // Get the specified number of products
  const displayProducts = allProducts.slice(0, maxItems);

  const formatPrice = (price: number): string => {
    return price.toLocaleString("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    });
  };

  const handleProductClick = (product: Product): void => {
    const productUrl = `/listings/${slugifyProduct(product.title, product.id)}`;
    
    if (onProductClick) {
      onProductClick(product.id);
    }
    
    navigate(productUrl);
  };

  const handleShare = (e: React.MouseEvent, product: Product): void => {
    e.stopPropagation();
    const slug = slugifyProduct(product.title, product.id);
    
    if (onShare) {
      onShare(product.id, product.title, product.price, slug);
    }
  };

  const handleWishlist = (e: React.MouseEvent, productId: string): void => {
    e.stopPropagation();
    // Add wishlist logic here
    console.log("Added to wishlist:", productId);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {showTitle && (
        <div className="px-4 py-3 border-b border-gray-200 bg-[#CBDCEB]/30">
          <h3 className="text-lg font-semibold text-[#1B3C53]">{title}</h3>
        </div>
      )}
      
      <div className="p-4">
        <div className="grid grid-cols-1 gap-4">
          {displayProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => handleProductClick(product)}
              className="bg-white rounded-lg border border-[#CBDCEB] hover:border-[#456882]/30 transition-all duration-300 hover:shadow-md cursor-pointer group overflow-hidden"
            >
              <div className="flex space-x-3 p-3">
                {/* Compact Image */}
                <div className="relative flex-shrink-0 w-20 h-20 overflow-hidden rounded-lg">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Compact Badges */}
                  {(product.productType) && (
                    <div className="absolute top-1 left-1">
                      {product.productType === "featured" && (
                        <span className="bg-[#1B3C53] text-white text-xs font-semibold px-1.5 py-0.5 rounded-full text-[10px]">
                          Featured
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      {/* Title and Brand */}
                      <h4 className="text-sm font-semibold text-[#1B3C53] group-hover:text-[#456882] transition-colors duration-200 line-clamp-2 mb-1">
                        {product.title}
                      </h4>
                      <p className="text-xs text-[#456882]/60 font-medium mb-2">
                        {product.brand}
                      </p>

                      {/* Location */}
                      <div className="flex items-center text-[#456882]/70 text-xs mb-2">
                        <FaMapMarkerAlt className="text-xs mr-1" />
                        <span className="truncate">{product.location}</span>
                      </div>

                      {/* Price */}
                      <div className="text-sm font-bold text-[#1B3C53]">
                        {formatPrice(product.price)}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={(e) => handleWishlist(e, product.id)}
                        className="w-6 h-6 bg-white border border-gray-200 hover:bg-gray-50 rounded-full flex items-center justify-center text-[#456882] hover:text-[#1B3C53] transition-colors duration-200"
                        title="Add to Wishlist"
                      >
                        <FaHeart className="text-xs" />
                      </button>
                      <button
                        onClick={(e) => handleShare(e, product)}
                        className="w-6 h-6 bg-white border border-gray-200 hover:bg-gray-50 rounded-full flex items-center justify-center text-[#456882] hover:text-[#1B3C53] transition-colors duration-200"
                        title="Share Product"
                      >
                        <FaShare className="text-xs" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View More Button (only show if there are more products) */}
        {allProducts.length > maxItems && (
          <div className="mt-4 pt-3 border-t border-gray-200">
            <button
              onClick={() => navigate('/listings')}
              className="w-full text-center py-2 px-3 text-sm font-medium text-[#456882] hover:text-[#1B3C53] hover:bg-[#CBDCEB]/30 rounded-lg transition-all duration-200"
            >
              View More Products
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompactProductCards;