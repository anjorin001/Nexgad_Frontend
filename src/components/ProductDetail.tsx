import {
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Flag,
  Heart,
  Loader2,
  MapPin,
  Package,
  Share2,
  Store,
  Truck,
  ZoomIn,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { useAppContext } from "../context/AppContext";
import { useShareProduct } from "../hooks/useShareProduct";
import { formatPrice } from "../utils/FormatPrice";
import { formatRelativeDate } from "../utils/formatRelativeDate";
import { slugifyProduct } from "../utils/Slugify";
import Loader from "./nexgadMidPageLoader";
import type { IProduct } from "./productDetail/productDetailInterface";

interface ProductDetailProps {
  isAddToCartLoading: string[];
  isPageLoading: boolean;
  isLikeLoading: boolean;
  product: IProduct;
  onAddToCart?: (productId: string[]) => void;
  onAddToWishlist?: (productId: string, currentlyLiked: boolean) => void;
  onReportItem?: (productId: string) => void;
}

export const ProductDetailCtn: React.FC<ProductDetailProps> = ({
  isAddToCartLoading,
  isPageLoading,
  isLikeLoading,
  product,
  onAddToCart,
  onAddToWishlist,
  onReportItem,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "specifications">(
    "description"
  );
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);
  const { linkCopied } = useAppContext();
  const { handleShare } = useShareProduct();

  useEffect(() => {
    if (product) {
      setIsWishlisted(!!product.liked);
    }
  }, [product?.liked]);

  if (isPageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size={64} thickness={1} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-[#1B3C53] text-lg">Product not found.</span>
      </div>
    );
  }
  const getDiscountPercentage = () => {
    if (product?.originalPrice && product?.originalPrice > product?.price) {
      return Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      );
    }
    return 0;
  };
  console.log(isPageLoading);

  const getAvailabilityColor = () => {
    switch (product.availability) {
      case "In Stock":
        return "text-green-600 bg-green-50";
      case "Limited Stock":
        return "text-yellow-600 bg-yellow-50";
      case "Out of Stock":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getConditionColor = () => {
    switch (product.condition) {
      case "Brand New":
        return "text-green-600 bg-green-50";
      case "Foreign Used":
        return "text-blue-600 bg-blue-50";
      case "Nigerian Used":
        return "text-orange-600 bg-orange-50";
      case "Refurbished":
        return "text-purple-600 bg-purple-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const handleImageChange = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setSelectedImageIndex((prev) =>
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    } else {
      setSelectedImageIndex((prev) =>
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Media Section */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative bg-white rounded-2xl border border-[#CBDCEB] overflow-hidden">
            <div className="aspect-square relative">
              <img
                loading="lazy"
                id={product?.images[selectedImageIndex]?.id}
                src={product?.images[selectedImageIndex]?.url}
                alt={product?.images[selectedImageIndex]?.alt}
                className="w-full h-full object-cover"
              />

              {/* Image Navigation */}
              {product?.images.length > 1 && (
                <>
                  <button
                    onClick={() => handleImageChange("prev")}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-[#1B3C53] shadow-lg transition-all duration-200"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleImageChange("next")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-[#1B3C53] shadow-lg transition-all duration-200"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Zoom Button */}
              <button
                onClick={() => setIsZoomed(true)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-[#1B3C53] shadow-lg transition-all duration-200"
              >
                <ZoomIn className="w-5 h-5" />
              </button>

              {/* Discount Badge */}
              {getDiscountPercentage() > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  -{getDiscountPercentage()}%
                </div>
              )}
            </div>
          </div>

          {/* Image Thumbnails */}
          {product?.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product?.images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden transition-all duration-200 ${
                    selectedImageIndex === index
                      ? "border-[#1B3C53]"
                      : "border-[#CBDCEB] hover:border-[#456882]"
                  }`}
                >
                  <img
                    loading="lazy"
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Information Section */}
        <div className="space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#1B3C53] leading-tight">
                {product.title}
              </h1>
              <div className="flex gap-2 ml-4">
                <button
                  disabled={isLikeLoading}
                  onClick={() => {
                    onAddToWishlist(product._id, isWishlisted);
                    setIsWishlisted((prev) => !prev);
                  }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                    isWishlisted
                      ? "bg-[#1B3C53] text-white hover:bg-[#456882]"
                      : "bg-[#CBDCEB] text-[#456882] hover:bg-[#456882] hover:text-white"
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`}
                  />
                </button>
                <button
                  onClick={() => {
                    const slug = slugifyProduct(product.title, product._id);
                    return handleShare(
                      product._id,
                      product.title,
                      product.price,
                      slug
                    );
                  }}
                  className="w-10 h-10 bg-[#CBDCEB] hover:bg-[#456882] text-[#456882] hover:text-white rounded-full flex items-center justify-center transition-all duration-200"
                >
                  {linkCopied ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Share2 className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
            <p className="text-lg text-[#456882] font-medium">
              {product.brand || "N/A"}
            </p>
            <p className="text-sm text-[#456882]/60">
              {product.category || "N/A"}
            </p>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-[#1B3C53]">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice &&
                product.originalPrice > product.price && (
                  <span className="text-lg text-gray-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
            </div>
          </div>

          {/* Status Badges */}
          <div className="flex flex-wrap gap-3">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getConditionColor()}`}
            >
              {product.condition || "N/A"}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getAvailabilityColor()}`}
            >
              {product.availability || "N/A"}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getAvailabilityColor()}`}
            >
              {product.quantity} left
            </span>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => onAddToCart?.([product._id])}
              disabled={product.availability === "Out of Stock"}
              className="w-full bg-[#1B3C53] hover:bg-[#456882] disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg font-semibold text-lg flex items-center justify-center gap-2 transition-all duration-200"
            >
              {isAddToCartLoading.includes(product._id) ? (
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
              ) : (
                <FaShoppingCart className="text-xs" />
              )}
              <span>Add to Cart</span>
            </button>
          </div>

          {/* Location & Delivery */}
          <div className="bg-[#CBDCEB]/30 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2 text-[#1B3C53]">
              <MapPin className="w-5 h-5" />
              <span className="font-medium">
                {product.location?.city && product.location?.state
                  ? `${product.location.city}, ${product.location.state}`
                  : "N/A"}
              </span>
            </div>
            <div className="flex gap-4 text-sm">
              {product.deliveryOptions.pickup && (
                <div className="flex items-center gap-1 text-[#456882]">
                  <Store className="w-4 h-4" />
                  <span>Pickup Available</span>
                </div>
              )}
              {product.deliveryOptions.delivery && (
                <div className="flex items-center gap-1 text-[#456882]">
                  <Truck className="w-4 h-4" />
                  <span>Delivery Available</span>
                </div>
              )}
            </div>
          </div>

          {/* Product Meta */}
          <div className="text-sm text-[#456882]/70 space-y-1">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Listed {formatRelativeDate(product.dateListeddays)}</span>
            </div>
            {product.sku ? (
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                <span>Item ID: {product.sku || "N/A"}</span>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>

      {/* Description & Specifications */}
      <div className="mt-12">
        <div className="flex border-b border-[#CBDCEB]">
          <button
            onClick={() => setActiveTab("description")}
            className={`px-6 py-3 font-medium transition-colors duration-200 ${
              activeTab === "description"
                ? "text-[#1B3C53] border-b-2 border-[#1B3C53]"
                : "text-[#456882] hover:text-[#1B3C53]"
            }`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab("specifications")}
            className={`px-6 py-3 font-medium transition-colors duration-200 ${
              activeTab === "specifications"
                ? "text-[#1B3C53] border-b-2 border-[#1B3C53]"
                : "text-[#456882] hover:text-[#1B3C53]"
            }`}
          >
            Specifications
          </button>
        </div>

        <div className="py-6">
          {activeTab === "description" ? (
            <div className="prose max-w-none">
              <p className="text-[#1B3C53] leading-relaxed whitespace-pre-line">
                {product.description || "No description provided."}
              </p>

              {/* Tags */}
              {product.tags.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold text-[#1B3C53] mb-3">Tags:</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-[#CBDCEB] text-[#1B3C53] rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div
                  key={key}
                  className="flex justify-between py-2 border-b border-[#CBDCEB]/50"
                >
                  <span className="font-medium text-[#456882]">{key}:</span>
                  <span className="text-[#1B3C53]">{value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Report Item */}
      <div className="mt-8 pt-6 border-t border-[#CBDCEB]">
        <button
          onClick={() => onReportItem?.(product._id)}
          className="flex items-center gap-2 text-[#456882]/70 hover:text-red-500 text-sm transition-colors duration-200"
        >
          <Flag className="w-4 h-4" />
          Report this item
        </button>
      </div>

      {/* Zoom Modal */}
      {isZoomed && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setIsZoomed(false)}
        >
          <div className="max-w-4xl max-h-full">
            <img
              loading="lazy"
              src={product?.images[selectedImageIndex]?.url}
              alt={product?.images[selectedImageIndex]?.alt}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};
