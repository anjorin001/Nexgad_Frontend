import React, { useState } from "react";
import {
  FaArrowLeft,
  FaCreditCard,
  FaHeart,
  FaMinus,
  FaPlus,
  FaShoppingBag,
  FaTrash,
  FaTruck,
} from "react-icons/fa";
import { FaShield } from "react-icons/fa6";
import { NavLink, useNavigate } from "react-router-dom";

// Type definitions
interface CartItem {
  id: number;
  name: string;
  price: number;
  originalPrice: number | null;
  quantity: number;
  image: string;
  category: string;
  inStock: boolean;
  shipping: "free" | "standard";
}

interface CartPageProps {
  initialCartItems?: CartItem[];
  onUpdateCart?: (items: CartItem[]) => void;
}

const CartPage: React.FC<CartPageProps> = ({
  initialCartItems = [],
  onUpdateCart,
}) => {
  // Sample cart data - in real app, this would come from state management
  const [cartItems, setCartItems] = useState<CartItem[]>(
    initialCartItems.length > 0
      ? initialCartItems
      : [
          {
            id: 1,
            name: "Wireless Bluetooth Headphones",
            price: 89.99,
            originalPrice: 129.99,
            quantity: 2,
            image:
              "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop",
            category: "Electronics",
            inStock: true,
            shipping: "free",
          },
          {
            id: 2,
            name: "Premium Coffee Maker",
            price: 249.99,
            originalPrice: null,
            quantity: 1,
            image:
              "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&h=200&fit=crop",
            category: "Appliances",
            inStock: true,
            shipping: "standard",
          },
          {
            id: 3,
            name: "Organic Cotton T-Shirt",
            price: 24.99,
            originalPrice: 34.99,
            quantity: 3,
            image:
              "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop",
            category: "Clothing",
            inStock: false,
            shipping: "free",
          },
        ]
  );

  const navigate = useNavigate();
  // Calculate totals
  const subtotal: number = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping: number = cartItems.some(
    (item) => item.shipping === "standard"
  )
    ? 9.99
    : 0;
  const tax: number = (subtotal) * 0.08; // 8% tax
  const total: number = subtotal + shipping + tax;

  // Cart item functions
  const updateQuantity = (id: number, newQuantity: number): void => {
    if (newQuantity === 0) {
      removeItem(id);
      return;
    }
    const updatedItems = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item
    );
    setCartItems(updatedItems);
    onUpdateCart?.(updatedItems);
  };

  const removeItem = (id: number): void => {
    const updatedItems = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedItems);
    onUpdateCart?.(updatedItems);
  };


  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <FaShoppingBag className="mx-auto text-6xl text-[#CBDCEB] mb-6" />
            <h2 className="text-2xl font-bold text-[#1B3C53] mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added anything to your cart yet.
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <NavLink
            to="/listings"
            className="inline-flex items-center space-x-2 text-[#456882] hover:text-[#1B3C53] transition-colors duration-200 mb-4"
          >
            <FaArrowLeft className="text-sm" />
            <span>Continue Shopping</span>
          </NavLink>
          <h1 className="text-3xl font-bold text-[#1B3C53]">Shopping Cart</h1>
          <p className="text-gray-600 mt-2">
            {cartItems.length} item{cartItems.length !== 1 ? "s" : ""} in your
            cart
          </p>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-[#CBDCEB]/30">
                <h2 className="text-lg font-semibold text-[#1B3C53]">Items</h2>
              </div>

              <div className="divide-y divide-gray-200">
                {cartItems.map((item: CartItem) => (
                  <div
                    key={item.id}
                    className="p-6 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="flex items-start space-x-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-medium text-[#1B3C53] hover:text-[#456882] cursor-pointer">
                              {item.name}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              {item.category}
                            </p>

                            {/* Stock Status */}
                            {item.inStock ? (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-2">
                                In Stock
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 mt-2">
                                Out of Stock
                              </span>
                            )}

                            {/* Shipping Info */}
                            <div className="flex items-center mt-2 text-sm text-gray-600">
                              <FaTruck className="mr-1" />
                              {item.shipping === "free"
                                ? "Free Shipping"
                                : "Standard Shipping"}
                            </div>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <div className="text-lg font-semibold text-[#1B3C53]">
                              ₦{item.price.toFixed(2)}
                            </div>
                            {item.originalPrice && (
                              <div className="text-sm text-gray-500 line-through">
                                ₦{item.originalPrice.toFixed(2)}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Quantity and Actions */}
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center space-x-3">
                            {/* Quantity Controls */}
                            <div className="flex items-center border border-gray-300 rounded-lg">
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity - 1)
                                }
                                className="p-2 hover:bg-gray-100 transition-colors duration-200 rounded-l-lg"
                                disabled={!item.inStock}
                                type="button"
                              >
                                <FaMinus className="text-xs text-[#456882]" />
                              </button>
                              <span className="px-4 py-2 font-medium text-[#1B3C53] min-w-[60px] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity + 1)
                                }
                                className="p-2 hover:bg-gray-100 transition-colors duration-200 rounded-r-lg"
                                disabled={!item.inStock}
                                type="button"
                              >
                                <FaPlus className="text-xs text-[#456882]" />
                              </button>
                            </div>

                            {/* Item Total */}
                            <div className="text-sm text-gray-600">
                              Total:{" "}
                              <span className="font-semibold text-[#1B3C53]">
                                ₦{(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center space-x-2">
                            <button
                              className="p-2 text-gray-400 hover:text-[#456882] transition-colors duration-200"
                              title="Add to Wishlist"
                              type="button"
                            >
                              <FaHeart className="text-sm" />
                            </button>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200"
                              title="Remove Item"
                              type="button"
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
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-8">
              <div className="px-6 py-4 border-b border-gray-200 bg-[#CBDCEB]/30">
                <h2 className="text-lg font-semibold text-[#1B3C53]">
                  Order Summary
                </h2>
              </div>

              <div className="p-6">
                {/* Price Breakdown */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-[#1B3C53]">
                      ₦{subtotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-[#1B3C53]">
                      {shipping === 0 ? "Free" : `₦${shipping.toFixed(2)}`}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium text-[#1B3C53]">
                      ₦{tax.toFixed(2)}
                    </span>
                  </div>

                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-lg font-semibold">
                      <span className="text-[#1B3C53]">Total</span>
                      <span className="text-[#1B3C53]">
                        ₦{total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  className="w-full mt-6 bg-[#1B3C53] text-white py-3 px-4 rounded-lg hover:bg-[#456882] transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-105 flex items-center justify-center space-x-2"
                  type="button"
                  onClick={() => {
                    navigate("/checkout/summary");
                  }}
                >
                  <FaCreditCard className="text-sm" />
                  <span>Proceed to Checkout</span>
                </button>

                {/* Security Badge */}
                <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-600">
                  <FaShield className="text-green-500" />
                  <span>Secure checkout</span>
                </div>

                {/* Payment Methods */}
                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500 mb-2">We accept</p>
                  <div className="flex justify-center space-x-2">
                    <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
                      V
                    </div>
                    <div className="w-8 h-5 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">
                      M
                    </div>
                    <div className="w-8 h-5 bg-blue-500 rounded text-white text-xs flex items-center justify-center font-bold">
                      A
                    </div>
                    <div className="w-8 h-5 bg-orange-500 rounded text-white text-xs flex items-center justify-center font-bold">
                      P
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
