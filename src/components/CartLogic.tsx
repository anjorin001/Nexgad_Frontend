import React, { useState } from "react";
import {
  ArrowLeft,
  CreditCard,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  Truck,
  Shield,
  Package,
  MapPin
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import type { CartData, CartItem } from "../context/AppContextInterface";
import CartRemovePopover from "./cartComponent/RemoveItemPopover";

interface CartPageProps {
  initialCartItems?: CartItem[] | null;
  onIncreamentQuantity: (listingId: string) => void;
  ondecreamentQuantity: (listingId: string) => void;
  isActionLoading: boolean;
  onRemoveItem: (listingId: string, saveForLater: boolean) => void;
  cart: CartData;
}

enum ProductAvailability {
  IN_STOCK = "In Stock",
  OUT_OF_STOCK = "Out of Stock",
  LIMITED_STOCK = "Limited Stock", 
}

const CartPage: React.FC<CartPageProps> = ({
  initialCartItems = [],
  onIncreamentQuantity,
  ondecreamentQuantity,
  onRemoveItem,
  isActionLoading,
  cart,
}) => {
  const navigate = useNavigate();
  const [showRemoveItemPopover, setShowRemoveItemPopover] = useState<boolean>(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedItemName, setSelectedItemName] = useState<string | null>(null);


  console.log("second") //TODO check which runs frist between child and parent to debugg render isuues

  const getAvailabilityStyle = (availability: string) => {
    switch (availability) {
      case ProductAvailability.IN_STOCK:
        return {
          className: "inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-[#CBDCEB] text-[#1B3C53] border border-[#456882]/20",
          text: "In Stock",
        };
      case ProductAvailability.LIMITED_STOCK:
        return {
          className: "inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-yellow-50 text-yellow-800 border border-yellow-200",
          text: "Limited Stock",
        };
      case ProductAvailability.OUT_OF_STOCK:
        return {
          className: "inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200",
          text: "Out of Stock",
        };
      default:
        return {
          className: "inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-50 text-gray-600 border border-gray-200",
          text: "Unknown",
        };
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <NavLink
            to="/listings"
            className="inline-flex items-center gap-2 text-[#456882] hover:text-[#1B3C53] transition-colors duration-200 mb-6 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </NavLink>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-[#1B3C53] mb-2">Shopping Cart</h1>
              <p className="text-[#456882]/70 text-lg">
                {initialCartItems.length} item{initialCartItems.length !== 1 ? "s" : ""} in your cart
              </p>
            </div>
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl shadow-sm border border-[#CBDCEB]/30 overflow-hidden">
              <div className="px-8 py-6 bg-gradient-to-r from-[#CBDCEB]/20 to-white border-b border-[#CBDCEB]/30">
                <h2 className="text-xl font-bold text-[#1B3C53] flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Cart Items
                </h2>
              </div>

              <div className="divide-y divide-[#CBDCEB]/30">
                {initialCartItems.map((item: CartItem) => {
                  const style = getAvailabilityStyle(item.product.availability);
                  return (
                    <div
                      key={item.product._id}
                      className="p-8 hover:bg-[#CBDCEB]/10 transition-all duration-200"
                    >
                      <div className="flex items-start gap-6">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <img
                            id={item?.product?.images[0]?.id}
                            src={item?.product?.images[0]?.url}
                            alt={item?.product?.images[0]?.alt}
                            className="w-24 h-24 object-cover rounded-xl border-2 border-[#CBDCEB]/30 shadow-sm"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-xl font-bold text-[#1B3C53] hover:text-[#456882] cursor-pointer mb-2">
                                {item.product.title}
                              </h3>
                              <p className="text-[#456882]/60 font-medium mb-3">
                                {item.product.category}
                              </p>

                              {/* Stock Status */}
                              <div className="mb-3">
                                <span className={style.className}>
                                  {style.text}
                                </span>
                              </div>

                              {/* Delivery Info */}
                              <div className="flex items-center gap-2 text-sm text-[#456882]/70 bg-[#CBDCEB]/20 px-3 py-2 rounded-lg w-fit">
                                <Truck className="w-4 h-4" />
                                <span>
                                  {item?.product?.deliveryOptions?.pickup && item?.product?.deliveryOptions?.delivery
                                    ? "Pickup & Delivery available"
                                    : item?.product?.deliveryOptions?.pickup
                                    ? "Pickup only"
                                    : "Delivery only"}
                                </span>
                              </div>
                            </div>

                            {/* Price */}
                            <div className="text-right">
                              <div className="text-2xl font-bold text-[#1B3C53]">
                                {formatPrice(item.price)}
                              </div>
                              {item?.product?.originalPrice && (
                                <div className="text-sm text-[#456882]/50 line-through">
                                  {formatPrice(item?.product?.originalPrice)}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Quantity and Actions */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6">
                              {/* Quantity Controls */}
                              <div className="flex items-center bg-[#CBDCEB]/20 rounded-xl border border-[#CBDCEB]/40">
                                <button
                                  onClick={() => ondecreamentQuantity(item.product._id)}
                                  className="p-3 hover:bg-[#456882] hover:text-white transition-all duration-200 rounded-l-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                  disabled={isActionLoading || item.quantity <= 1}
                                  type="button"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="px-6 py-3 font-bold text-[#1B3C53] min-w-[80px] text-center text-lg">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => onIncreamentQuantity(item.product._id)}
                                  className="p-3 hover:bg-[#456882] hover:text-white transition-all duration-200 rounded-r-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                  disabled={isActionLoading}
                                  type="button"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>

                              <div className="text-[#456882]/70">
                                Subtotal: <span className="font-bold text-[#1B3C53] text-lg">{formatPrice(item.price * item.quantity)}</span>
                              </div>
                            </div>

                            <button
                              onClick={() => {
                                setSelectedItemId(item.product._id);
                                setSelectedItemName(item.product.title);
                                setShowRemoveItemPopover(true);
                              }}
                              className="p-3 text-[#456882]/50 hover:text-red-500 hover:bg-red-50 transition-all duration-200 rounded-xl"
                              title="Remove Item"
                              type="button"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <div className="bg-white rounded-2xl shadow-sm border border-[#CBDCEB]/30 overflow-hidden sticky top-8">
              <div className="px-8 py-6 bg-gradient-to-r from-[#CBDCEB]/20 to-white border-b border-[#CBDCEB]/30">
                <h2 className="text-xl font-bold text-[#1B3C53]">Order Summary</h2>
              </div>

              <div className="p-8">
                {/* Price Breakdown */}
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-[#456882]">
                    <span>Subtotal ({initialCartItems.length} items)</span>
                    <span className="font-semibold">{formatPrice(cart.total)}</span>
                  </div>
                  <div className="flex justify-between text-[#456882]">
                    <span>Shipping</span>
                    <span className="text-green-600 font-semibold">FREE</span>
                  </div>
                  <div className="border-t border-[#CBDCEB]/30 pt-4">
                    <div className="flex justify-between text-2xl font-bold text-[#1B3C53]">
                      <span>Total</span>
                      <span>{formatPrice(cart.total)}</span>
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  className="w-full bg-gradient-to-r from-[#1B3C53] to-[#456882] text-white py-4 px-6 rounded-xl hover:shadow-xl transition-all duration-300 font-semibold text-lg flex items-center justify-center gap-3 transform hover:scale-[1.02] active:scale-[0.98]"
                  type="button"
                  onClick={() => navigate("/checkout/summary")}
                >
                  <CreditCard className="w-5 h-5" />
                  <span>Proceed to Checkout</span>
                </button>

                {/* Security & Payment Info */}
                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-center gap-2 text-[#456882]/70">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium">Secure checkout guaranteed</span>
                  </div>

                  <div className="text-center">
                    <p className="text-xs text-[#456882]/60 mb-3 font-medium">Accepted Payment Methods</p>
                    <div className="flex justify-center gap-3">
                      {[
                        { name: "Visa", color: "bg-blue-600", letter: "V" },
                        { name: "Mastercard", color: "bg-red-600", letter: "M" },
                        { name: "American Express", color: "bg-blue-500", letter: "A" },
                        { name: "PayPal", color: "bg-[#456882]", letter: "P" },
                      ].map((method) => (
                        <div
                          key={method.name}
                          className={`w-10 h-6 ${method.color} rounded text-white text-xs flex items-center justify-center font-bold shadow-sm`}
                          title={method.name}
                        >
                          {method.letter}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Remove Item Popover */}
      {showRemoveItemPopover && selectedItemId && (
        <CartRemovePopover
          isOpen={showRemoveItemPopover}
          onClose={() => {
            setShowRemoveItemPopover(false);
            setSelectedItemId(null);
            setSelectedItemName(null);
          }}
          onSaveForLater={() => {
            onRemoveItem(selectedItemId, true);
            setShowRemoveItemPopover(false);
            setSelectedItemId(null);
            setSelectedItemName(null);
          }}
          onRemove={() => {
            onRemoveItem(selectedItemId, false);
            setShowRemoveItemPopover(false);
            setSelectedItemId(null);
            setSelectedItemName(null);
          }}
          itemName={selectedItemName}
        />
      )}
    </div>
  );
};

export default CartPage;