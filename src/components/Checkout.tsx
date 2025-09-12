import {
  AlertCircle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  CreditCard,
  Edit3,
  MapPin,
  Package,
  Tag,
} from "lucide-react";
import React, { useState } from "react";

interface DeliveryAddress {
  fullName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
  color?: string;
}

interface DeliveryRange {
  start: Date;
  end: Date;
}

interface PromoCode {
  code: string;
  discount: number;
  type: "percentage" | "fixed";
}

const CheckoutComponent: React.FC = () => {
  const [isEditingAddress, setIsEditingAddress] = useState<boolean>(false);
  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState<
    "standard" | "express"
  >("standard");
  const [promoCode, setPromoCode] = useState<string>("");
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [promoError, setPromoError] = useState<string>("");
  const [showOrderDetails, setShowOrderDetails] = useState<boolean>(false);
  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress>({
    fullName: "Favour Anjorin",
    address: "Jumai estate cf1, Double filling station, maraba, nasarawa",
    city: "Nasarawa",
    state: "KEFI",
    zipCode: "100001",
    phone: "+234 7081831117",
  });

  // Sample cart items with more details
  const cartItems: CartItem[] = [
    {
      id: 1,
      name: "Men's Fashion Sneakers Running Shoes",
      price: 9025,
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop",
      quantity: 1,
      size: "42",
      color: "Black/White",
    },
    {
      id: 2,
      name: "MacBook Pro 13-inch M2",
      price: 200000,
      image:
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100&h=100&fit=crop",
      quantity: 1,
      color: "Space Gray",
    },
  ];

  // Sample promo codes
  const validPromoCodes: PromoCode[] = [
    { code: "SAVE10", discount: 10, type: "percentage" },
    { code: "FIRST500", discount: 500, type: "fixed" },
    { code: "WELCOME", discount: 15, type: "percentage" },
  ];

  const deliveryOptions = {
    standard: { fee: 950, days: "7-14 days" },
    express: { fee: 2500, days: "2-5 days" },
  };

  const subtotal: number = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const deliveryFee: number = deliveryOptions[selectedDeliveryOption].fee;
  const tax: number = Math.round(subtotal * 0.075); // 7.5% VAT
  const promoDiscount: number = appliedPromo
    ? appliedPromo.type === "percentage"
      ? Math.round(subtotal * (appliedPromo.discount / 100))
      : appliedPromo.discount
    : 0;
  const total: number = subtotal + deliveryFee + tax - promoDiscount;

  const getDeliveryRange = (): DeliveryRange => {
    const today: Date = new Date();
    const startDate: Date = new Date(today);
    const endDate: Date = new Date(today);

    if (selectedDeliveryOption === "express") {
      startDate.setDate(today.getDate() + 2);
      endDate.setDate(today.getDate() + 5);
    } else {
      startDate.setDate(today.getDate() + 7);
      endDate.setDate(today.getDate() + 14);
    }

    // Find first weekday for start
    while (startDate.getDay() === 0 || startDate.getDay() === 6) {
      startDate.setDate(startDate.getDate() + 1);
    }

    // Find last weekday for end
    while (endDate.getDay() === 0 || endDate.getDay() === 6) {
      endDate.setDate(endDate.getDate() - 1);
    }

    return { start: startDate, end: endDate };
  };

  const deliveryRange: DeliveryRange = getDeliveryRange();

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
    });
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    }).format(amount);
  };

  const handleAddressChange = (
    field: keyof DeliveryAddress,
    value: string
  ): void => {
    setDeliveryAddress((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePromoCodeApply = (): void => {
    setPromoError("");
    const foundPromo = validPromoCodes.find(
      (p) => p.code.toLowerCase() === promoCode.toLowerCase()
    );

    if (foundPromo) {
      setAppliedPromo(foundPromo);
      setPromoCode("");
    } else {
      setPromoError("Invalid promo code");
    }
  };

  const removePromoCode = (): void => {
    setAppliedPromo(null);
    setPromoError("");
  };

  const StepHeader = ({
    step,
    title,
    isCompleted = true,
    onEdit,
  }: {
    step: number;
    title: string;
    isCompleted?: boolean;
    onEdit?: () => void;
  }) => (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center">
        <div
          className={`flex items-center justify-center w-6 h-6 rounded-full text-white text-sm font-medium mr-3 ${
            isCompleted ? "bg-green-500" : ""
          }`}
          style={isCompleted ? {} : { backgroundColor: "#456882" }}
        >
          {isCompleted ? <CheckCircle className="w-4 h-4" /> : step}
        </div>
        <h3 className="text-lg font-semibold" style={{ color: "#1B3C53" }}>
          {step}. {title}
        </h3>
      </div>
      {onEdit && (
        <button
          onClick={onEdit}
          className="flex items-center space-x-1 font-medium hover:opacity-80 transition-opacity"
          style={{ color: "#456882" }}
        >
          <Edit3 className="w-4 h-4" />
          <span>Change</span>
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: "#1B3C53" }}>
            Checkout
          </h1>
          <p className="text-gray-600">
            Complete your order in just a few steps
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Main Content */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* Step 1: Customer Address */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <StepHeader
                  step={1}
                  title="CUSTOMER ADDRESS"
                  onEdit={() => setIsEditingAddress(!isEditingAddress)}
                  isCompleted={Boolean(
                    deliveryAddress.fullName &&
                      deliveryAddress.phone &&
                      deliveryAddress.address &&
                      deliveryAddress.city &&
                      deliveryAddress.state &&
                      deliveryAddress.zipCode
                  )}
                />

                <div className="ml-9">
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <MapPin
                        className="w-4 h-4"
                        style={{ color: "#456882" }}
                      />
                      <p className="font-medium text-gray-900">
                        {deliveryAddress.fullName}
                      </p>
                    </div>
                  </div>

                  {isEditingAddress ? (
                    <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label
                            className="block text-sm font-medium mb-2"
                            style={{ color: "#456882" }}
                          >
                            Full Name
                          </label>
                          <input
                            type="text"
                            value={deliveryAddress.fullName}
                            onChange={(e) =>
                              handleAddressChange("fullName", e.target.value)
                            }
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                            style={
                              {
                                "--tw-ring-color": "#456882",
                              } as React.CSSProperties
                            }
                          />
                        </div>
                        <div>
                          <label
                            className="block text-sm font-medium mb-2"
                            style={{ color: "#456882" }}
                          >
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            value={deliveryAddress.phone}
                            onChange={(e) =>
                              handleAddressChange("phone", e.target.value)
                            }
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                            style={
                              {
                                "--tw-ring-color": "#456882",
                              } as React.CSSProperties
                            }
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          className="block text-sm font-medium mb-2"
                          style={{ color: "#456882" }}
                        >
                          Address
                        </label>
                        <textarea
                          value={deliveryAddress.address}
                          onChange={(e) =>
                            handleAddressChange("address", e.target.value)
                          }
                          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 resize-none"
                          style={
                            {
                              "--tw-ring-color": "#456882",
                            } as React.CSSProperties
                          }
                          rows={2}
                        />
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <label
                            className="block text-sm font-medium mb-2"
                            style={{ color: "#456882" }}
                          >
                            City
                          </label>
                          <input
                            type="text"
                            value={deliveryAddress.city}
                            onChange={(e) =>
                              handleAddressChange("city", e.target.value)
                            }
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                            style={
                              {
                                "--tw-ring-color": "#456882",
                              } as React.CSSProperties
                            }
                          />
                        </div>
                        <div>
                          <label
                            className="block text-sm font-medium mb-2"
                            style={{ color: "#456882" }}
                          >
                            State
                          </label>
                          <input
                            type="text"
                            value={deliveryAddress.state}
                            onChange={(e) =>
                              handleAddressChange("state", e.target.value)
                            }
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                            style={
                              {
                                "--tw-ring-color": "#456882",
                              } as React.CSSProperties
                            }
                          />
                        </div>
                        <div>
                          <label
                            className="block text-sm font-medium mb-2"
                            style={{ color: "#456882" }}
                          >
                            ZIP Code
                          </label>
                          <input
                            type="text"
                            value={deliveryAddress.zipCode}
                            onChange={(e) =>
                              handleAddressChange("zipCode", e.target.value)
                            }
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                            style={
                              {
                                "--tw-ring-color": "#456882",
                              } as React.CSSProperties
                            }
                          />
                        </div>
                      </div>

                      <div className="flex space-x-3">
                        <button
                          onClick={() => setIsEditingAddress(false)}
                          className="px-6 py-2 rounded-md text-white font-medium hover:opacity-90 transition-opacity"
                          style={{ backgroundColor: "#1B3C53" }}
                        >
                          Save Address
                        </button>
                        <button
                          onClick={() => setIsEditingAddress(false)}
                          className="px-6 py-2 rounded-md border font-medium hover:bg-gray-50 transition-colors"
                          style={{ borderColor: "#456882", color: "#456882" }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-700 mb-2">
                        {deliveryAddress.address}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {deliveryAddress.city}, {deliveryAddress.state}{" "}
                        {deliveryAddress.zipCode}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {deliveryAddress.phone}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Step 2: Delivery Options */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <StepHeader step={2} title="DELIVERY OPTIONS" />

                <div className="ml-9 space-y-4">
                  {/* Delivery Speed Options */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        selectedDeliveryOption === "standard"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200"
                      }`}
                      style={{
                        borderColor:
                          selectedDeliveryOption === "standard"
                            ? "#456882"
                            : undefined,
                        backgroundColor:
                          selectedDeliveryOption === "standard"
                            ? "#CBDCEB"
                            : undefined,
                      }}
                      onClick={() => setSelectedDeliveryOption("standard")}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4
                          className="font-medium"
                          style={{ color: "#1B3C53" }}
                        >
                          Standard Delivery
                        </h4>
                        <span
                          className="font-semibold"
                          style={{ color: "#456882" }}
                        >
                          {formatCurrency(deliveryOptions.standard.fee)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{deliveryOptions.standard.days}</span>
                      </div>
                    </div>

                    <div
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        selectedDeliveryOption === "express"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200"
                      }`}
                      style={{
                        borderColor:
                          selectedDeliveryOption === "express"
                            ? "#456882"
                            : undefined,
                        backgroundColor:
                          selectedDeliveryOption === "express"
                            ? "#CBDCEB"
                            : undefined,
                      }}
                      onClick={() => setSelectedDeliveryOption("express")}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4
                          className="font-medium"
                          style={{ color: "#1B3C53" }}
                        >
                          Express Delivery
                        </h4>
                        <span
                          className="font-semibold"
                          style={{ color: "#456882" }}
                        >
                          {formatCurrency(deliveryOptions.express.fee)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{deliveryOptions.express.days}</span>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Schedule */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Package
                        className="w-4 h-4"
                        style={{ color: "#456882" }}
                      />
                      <p className="font-medium" style={{ color: "#1B3C53" }}>
                        Estimated Delivery
                      </p>
                    </div>
                    <p className="text-sm text-gray-600">
                      Between {formatDate(deliveryRange.start)} and{" "}
                      {formatDate(deliveryRange.end)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 3: Order Review */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <StepHeader step={3} title="ORDER REVIEW" />
                  <button
                    onClick={() => setShowOrderDetails(!showOrderDetails)}
                    className="flex items-center space-x-1 text-sm font-medium hover:opacity-80"
                    style={{ color: "#456882" }}
                  >
                    <span>{showOrderDetails ? "Hide" : "Show"} Details</span>
                    {showOrderDetails ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <div className="ml-9">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-medium" style={{ color: "#1B3C53" }}>
                        Order Summary ({cartItems.length} items)
                      </p>
                      <span
                        className="font-semibold"
                        style={{ color: "#456882" }}
                      >
                        {formatCurrency(subtotal)}
                      </span>
                    </div>

                    {showOrderDetails && (
                      <div
                        className="space-y-3 border-t pt-3"
                        style={{ borderColor: "#E5E7EB" }}
                      >
                        {cartItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center space-x-3"
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded-md"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm text-gray-900 truncate">
                                {item.name}
                              </p>
                              <div className="flex items-center space-x-2 text-xs text-gray-500">
                                <span>Qty: {item.quantity}</span>
                                {item.size && <span>• Size: {item.size}</span>}
                                {item.color && <span>• {item.color}</span>}
                              </div>
                            </div>
                            <div className="text-right">
                              <p
                                className="font-semibold text-sm"
                                style={{ color: "#456882" }}
                              >
                                {formatCurrency(item.price)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Step 4: Payment Method */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <StepHeader step={4} title="PAYMENT METHOD" />

                <div className="ml-9">
                  <div className="text-center py-8">
                    <div
                      className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: "#CBDCEB" }}
                    >
                      <CreditCard
                        className="w-8 h-8"
                        style={{ color: "#456882" }}
                      />
                    </div>
                    <h4
                      className="text-lg font-medium mb-2"
                      style={{ color: "#1B3C53" }}
                    >
                      Payment Integration Ready
                    </h4>
                    <p className="text-gray-600 max-w-md mx-auto">
                      Payment options and forms will be displayed here.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Order Summary (Fixed Position) */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-4">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div
                  className="p-4 border-b"
                  style={{ backgroundColor: "#1B3C53" }}
                >
                  <h3 className="text-lg font-semibold text-white">
                    Order Summary
                  </h3>
                </div>

                {/* Order Totals */}
                <div className="p-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span className="font-semibold">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Delivery ({selectedDeliveryOption})</span>
                    <span className="font-semibold">
                      {formatCurrency(deliveryFee)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax (7.5% VAT)</span>
                    <span className="font-semibold">{formatCurrency(tax)}</span>
                  </div>
                  {appliedPromo && (
                    <div className="flex justify-between text-sm text-green-600">
                      <div className="flex items-center space-x-1">
                        <Tag className="w-3 h-3" />
                        <span>{appliedPromo.code}</span>
                      </div>
                      <span className="font-semibold">
                        -{formatCurrency(promoDiscount)}
                      </span>
                    </div>
                  )}
                  <div
                    className="border-t pt-3 flex justify-between font-semibold text-lg"
                    style={{ color: "#1B3C53" }}
                  >
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>

                {/* Promo Code */}
                <div className="p-4 border-t">
                  {appliedPromo ? (
                    <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Tag className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">
                          {appliedPromo.code} Applied
                        </span>
                      </div>
                      <button
                        onClick={removePromoCode}
                        className="text-xs text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          placeholder="Enter promo code"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2"
                          style={
                            {
                              "--tw-ring-color": "#456882",
                            } as React.CSSProperties
                          }
                        />
                        <button
                          onClick={handlePromoCodeApply}
                          disabled={!promoCode.trim()}
                          className="px-4 py-2 text-sm font-medium rounded-md hover:opacity-90 disabled:opacity-50 transition-opacity"
                          style={{
                            backgroundColor: "#CBDCEB",
                            color: "#1B3C53",
                          }}
                        >
                          Apply
                        </button>
                      </div>
                      {promoError && (
                        <div className="flex items-center space-x-1 mt-2 text-xs text-red-600">
                          <AlertCircle className="w-3 h-3" />
                          <span>{promoError}</span>
                        </div>
                      )}
                      <div className="mt-2 text-xs text-gray-500">
                        Try: SAVE10, FIRST500, or WELCOME
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Order Button */}
                <div className="p-4 border-t">
                  <button
                    className="w-full py-3 px-6 rounded-lg font-semibold text-white transition-all hover:opacity-90 hover:shadow-lg"
                    style={{ backgroundColor: "#1B3C53" }}
                  >
                    Confirm Order • {formatCurrency(total)}
                  </button>
                  <p className="text-xs text-gray-500 text-center mt-3">
                    By proceeding, you agree to our{" "}
                    <a
                      href="#"
                      className="hover:opacity-80 underline"
                      style={{ color: "#456882" }}
                    >
                      Terms & Conditions
                    </a>{" "}
                    and{" "}
                    <a
                      href="#"
                      className="hover:opacity-80 underline"
                      style={{ color: "#456882" }}
                    >
                      Privacy Policy
                    </a>
                  </p>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="mt-4 bg-white rounded-lg p-4 border border-gray-100">
                <div className="text-center">
                  <div className="flex justify-center space-x-4 text-xs text-gray-500 mb-2">
                    <span>🔒 Secure Checkout</span>
                    <span>📦 Free Returns</span>
                    <span>⚡ Fast Delivery</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    Your payment info is safe and encrypted
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutComponent;
