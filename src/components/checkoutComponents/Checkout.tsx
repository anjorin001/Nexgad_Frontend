import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Edit3,
  MapPin,
  Package,
  RotateCcw,
  Shield,
  Tag,
  Truck,
} from "lucide-react";
import React, { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import type { DeliveryAddress } from "../../context/AppContextInterface";
import Loader from "../nexgadMidPageLoader";
import type { DeliveryRange, ICheckOut } from "./CheckoutInterface";

interface CheckoutProp {
  removePromoCode: (promocode: string) => void;
  onApplyPromoCode: (promocode: string) => void;
  onConfirmOrder: (
    delivertype: "standard" | "express",
    estimatedDate: Date
  ) => Promise<string>;
  checkout: ICheckOut;
  isLoading: boolean;
  isActionLoading: boolean;
  isSubmitCheckoutLoading: boolean;
}

const CheckoutComponent: React.FC<CheckoutProp> = React.memo(
  ({
    removePromoCode,
    onApplyPromoCode,
    onConfirmOrder,
    checkout,
    isLoading,
    isActionLoading,
    isSubmitCheckoutLoading,
  }) => {
    const [isEditingAddress, setIsEditingAddress] = useState<boolean>(false);
    const [selectedDeliveryOption, setSelectedDeliveryOption] = useState<
      "standard" | "express"
    >("standard");
    const [promoCode, setPromoCode] = useState<string>("");
    const [showOrderDetails, setShowOrderDetails] = useState<boolean>(false);

    const { setDeliveryAddress, deliveryAddress } = useAppContext();
    const navigate = useNavigate();

    // Memoize static delivery options
    const deliveryOptions = useMemo(
      () => ({
        standard: { fee: 950, days: "7-14 business days" },
        express: { fee: 2500, days: "2-5 business days" },
      }),
      []
    );

    // Memoize delivery range calculation
    const deliveryRange = useMemo((): DeliveryRange => {
      const today = new Date();
      const endDate = new Date(today);

      if (selectedDeliveryOption === "express") {
        endDate.setDate(today.getDate() + 5);
      } else {
        endDate.setDate(today.getDate() + 14);
      }

      while (endDate.getDay() === 0 || endDate.getDay() === 6) {
        endDate.setDate(endDate.getDate() - 1);
      }

      return { end: endDate };
    }, [selectedDeliveryOption]);

    // Memoize utility functions
    const formatDate = useCallback((date: Date): string => {
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
      });
    }, []);

    const formatCurrency = useCallback((amount: number): string => {
      return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
      }).format(amount);
    }, []);

    // Memoize address change handler
    const handleAddressChange = useCallback(
      (field: keyof DeliveryAddress, value: string): void => {
        setDeliveryAddress((prev) => ({
          ...prev,
          [field]: value,
        }));
      },
      [setDeliveryAddress]
    );

    // Memoize confirm order handler
    const handleConfirmOrder = useCallback(
      async (e: React.MouseEvent) => {
        e.preventDefault();
        const url = await onConfirmOrder(
          selectedDeliveryOption,
          deliveryRange.end
        );
        if (url) {
          window.location.href = url;
        }
      },
      [onConfirmOrder, selectedDeliveryOption, deliveryRange.end, navigate]
    );

    // Memoize address completion check
    const isAddressComplete = useMemo(
      () =>
        Boolean(
          deliveryAddress.firstName &&
            deliveryAddress.lastName &&
            deliveryAddress.phone &&
            deliveryAddress.address &&
            deliveryAddress.city &&
            deliveryAddress.state &&
            deliveryAddress.zipCode
        ),
      [deliveryAddress]
    );

    // Memoize step header component
    const StepHeader = useCallback(
      ({
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
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full text-white text-sm font-semibold mr-4 ${
                isCompleted ? "bg-green-600" : "bg-[#456882]"
              }`}
            >
              {isCompleted ? <CheckCircle className="w-5 h-5" /> : step}
            </div>
            <h2 className="text-xl font-bold text-[#1B3C53]">{title}</h2>
          </div>
          {onEdit && (
            <button
              onClick={onEdit}
              className="flex items-center space-x-2 text-[#456882] font-semibold hover:text-[#1B3C53] transition-colors duration-200"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit</span>
            </button>
          )}
        </div>
      ),
      []
    );

    const toggleAddressEdit = useCallback(() => {
      setIsEditingAddress((prev) => !prev);
    }, []);

    const toggleOrderDetails = useCallback(() => {
      setShowOrderDetails((prev) => !prev);
    }, []);

    const handleStandardDelivery = useCallback(() => {
      setSelectedDeliveryOption("standard");
    }, []);

    const handleExpressDelivery = useCallback(() => {
      setSelectedDeliveryOption("express");
    }, []);

    const handlePromoCodeChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setPromoCode(e.target.value);
      },
      []
    );

    const handleApplyPromo = useCallback(() => {
      if (promoCode.trim()) {
        onApplyPromoCode(promoCode.trim());
      }
    }, [promoCode, onApplyPromoCode]);

    const handleRemovePromo = useCallback(() => {
      if (checkout?.appliedPromo?.code) {
        removePromoCode(checkout.appliedPromo.code);
      }
    }, [checkout?.appliedPromo?.code, removePromoCode]);

    const handleSaveAddress = useCallback(() => {
      setIsEditingAddress(false);
    }, []);

    const handleCancelEdit = useCallback(() => {
      setIsEditingAddress(false);
    }, []);

    if (isLoading) {
      return <Loader fullScreen={true} size={64} thickness={1} />;
    }

    return (
      <div className="min-h-screen bg-[#ffff] py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-[#1B3C53] mb-2">
              Secure Checkout
            </h1>
            <p className="text-[#456882] text-lg">
              Complete your order with confidence
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-2xl shadow-sm p-8 border border-white/20">
                <StepHeader
                  step={1}
                  title="DELIVERY ADDRESS"
                  onEdit={toggleAddressEdit}
                  isCompleted={isAddressComplete}
                />

                <div className="ml-12">
                  {!isAddressComplete && (
                    <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="text-amber-800 text-sm font-medium">
                        Please complete your delivery address to proceed
                      </p>
                    </div>
                  )}

                  <div className="mb-6">
                    <div className="flex items-center space-x-3 mb-3">
                      <MapPin className="w-5 h-5 text-[#456882]" />
                      <p className="font-semibold text-[#1B3C53] text-lg">
                        {`${
                          deliveryAddress.firstName || checkout.firstName || ""
                        } ${
                          deliveryAddress.lastName || checkout.lastName || ""
                        }`}
                      </p>
                    </div>
                  </div>

                  {isEditingAddress ? (
                    <div className="space-y-6 bg-gray-50 p-6 rounded-xl border">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-[#456882] mb-2">
                            First Name
                          </label>
                          <input
                            type="text"
                            value={
                              deliveryAddress.firstName ||
                              checkout.firstName ||
                              ""
                            }
                            onChange={(e) =>
                              handleAddressChange("firstName", e.target.value)
                            }
                            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#456882] focus:border-transparent transition-all duration-200"
                            placeholder="Enter first name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-[#456882] mb-2">
                            Last Name
                          </label>
                          <input
                            type="text"
                            value={
                              deliveryAddress.lastName ||
                              checkout.lastName ||
                              ""
                            }
                            onChange={(e) =>
                              handleAddressChange("lastName", e.target.value)
                            }
                            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#456882] focus:border-transparent transition-all duration-200"
                            placeholder="Enter last name"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-[#456882] mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={deliveryAddress.phone || checkout?.phone || ""}
                          onChange={(e) =>
                            handleAddressChange("phone", e.target.value)
                          }
                          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#456882] focus:border-transparent transition-all duration-200"
                          placeholder="Enter phone number"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-[#456882] mb-2">
                          Street Address
                        </label>
                        <textarea
                          value={
                            deliveryAddress.address || checkout?.address || ""
                          }
                          onChange={(e) =>
                            handleAddressChange("address", e.target.value)
                          }
                          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#456882] focus:border-transparent resize-none transition-all duration-200"
                          rows={3}
                          placeholder="Enter your full address"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-[#456882] mb-2">
                            City
                          </label>
                          <input
                            type="text"
                            value={deliveryAddress.city || checkout?.city || ""}
                            onChange={(e) =>
                              handleAddressChange("city", e.target.value)
                            }
                            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#456882] focus:border-transparent transition-all duration-200"
                            placeholder="Enter city"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-[#456882] mb-2">
                            State
                          </label>
                          <input
                            type="text"
                            value={
                              deliveryAddress.state || checkout?.state || ""
                            }
                            onChange={(e) =>
                              handleAddressChange("state", e.target.value)
                            }
                            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#456882] focus:border-transparent transition-all duration-200"
                            placeholder="Enter state"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-[#456882] mb-2">
                            ZIP Code
                          </label>
                          <input
                            type="text"
                            value={
                              deliveryAddress.zipCode || checkout?.zipCode || ""
                            }
                            onChange={(e) =>
                              handleAddressChange("zipCode", e.target.value)
                            }
                            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#456882] focus:border-transparent transition-all duration-200"
                            placeholder="Enter ZIP"
                          />
                        </div>
                      </div>

                      <div className="flex space-x-4 pt-4">
                        <button
                          onClick={handleSaveAddress}
                          className="px-8 py-3 bg-[#1B3C53] text-white font-semibold rounded-lg hover:bg-[#2d4f68] transition-colors duration-200"
                        >
                          Save Address
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="px-8 py-3 border-2 border-[#456882] text-[#456882] font-semibold rounded-lg hover:bg-[#456882] hover:text-white transition-all duration-200"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-xl p-6 border">
                      <div className="space-y-2">
                        <p className="text-[#1B3C53] font-medium text-lg">
                          {deliveryAddress.address || "Address not set"}
                        </p>
                        <p className="text-[#456882]">
                          {deliveryAddress.city}, {deliveryAddress.state}{" "}
                          {deliveryAddress.zipCode}
                        </p>
                        <p className="text-[#456882] font-medium">
                          {deliveryAddress.phone}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-8 border border-white/20">
                <StepHeader step={2} title="DELIVERY OPTIONS" />

                <div className="ml-12 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div
                      className={`border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 hover:shadow-md ${
                        selectedDeliveryOption === "standard"
                          ? "border-[#456882] bg-[#456882]/5"
                          : "border-gray-200 hover:border-[#CBDCEB]"
                      }`}
                      onClick={handleStandardDelivery}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-[#1B3C53] text-lg">
                          Standard Delivery
                        </h3>
                        <span className="font-bold text-[#456882] text-lg">
                          {formatCurrency(deliveryOptions.standard.fee)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3 text-[#456882]">
                        <Clock className="w-5 h-5" />
                        <span className="font-medium">
                          {deliveryOptions.standard.days}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 hover:shadow-md ${
                        selectedDeliveryOption === "express"
                          ? "border-[#456882] bg-[#456882]/5"
                          : "border-gray-200 hover:border-[#CBDCEB]"
                      }`}
                      onClick={handleExpressDelivery}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-[#1B3C53] text-lg">
                          Express Delivery
                        </h3>
                        <span className="font-bold text-[#456882] text-lg">
                          {formatCurrency(deliveryOptions.express.fee)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3 text-[#456882]">
                        <Clock className="w-5 h-5" />
                        <span className="font-medium">
                          {deliveryOptions.express.days}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                    <div className="flex items-center space-x-3 mb-2">
                      <Package className="w-5 h-5 text-green-600" />
                      <p className="font-bold text-green-800 text-lg">
                        Estimated Delivery Date
                      </p>
                    </div>
                    <p className="text-green-700 font-semibold">
                      {formatDate(deliveryRange.end)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-8 border border-white/20">
                <div className="flex items-center justify-between mb-6">
                  <StepHeader step={3} title="ORDER REVIEW" />
                  <button
                    onClick={toggleOrderDetails}
                    className="flex items-center space-x-2 text-[#456882] font-semibold hover:text-[#1B3C53] transition-colors duration-200"
                  >
                    <span>{showOrderDetails ? "Hide" : "Show"} Details</span>
                    {showOrderDetails ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                </div>

                <div className="ml-12">
                  <div className="bg-gray-50 rounded-xl p-6 border">
                    <div className="flex items-center justify-between mb-4">
                      <p className="font-bold text-[#1B3C53] text-lg">
                        Order Summary ({checkout?.cart?.items?.length || 0}{" "}
                        items)
                      </p>
                      <span className="font-bold text-[#456882] text-xl">
                        {formatCurrency(checkout?.total || 0)}
                      </span>
                    </div>

                    {showOrderDetails && checkout?.cart?.items && (
                      <div className="space-y-4 border-t border-gray-200 pt-4">
                        {checkout.cart.items.map((item) => (
                          <div
                            key={item.product._id}
                            className="flex items-center space-x-4 p-4 bg-white rounded-lg border"
                          >
                            <img
                              src={item?.product?.images[0]?.url}
                              alt={
                                item.product?.images[0]?.alt ||
                                item.product.title
                              }
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <p className="font-semibold text-[#1B3C53] text-lg">
                                {item?.product?.title}
                              </p>
                              <p className="text-[#456882] font-medium">
                                Quantity: {item.quantity}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-[#456882] text-lg">
                                {formatCurrency(item.price || 0)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-8">
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-white/20">
                  <div className="bg-[#1B3C53] p-6">
                    <h3 className="text-xl font-bold text-white">
                      Order Summary
                    </h3>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="flex justify-between text-lg">
                      <span className="text-[#456882]">
                        Subtotal ({checkout?.cart?.items?.length || 0} items)
                      </span>
                      <span className="font-semibold text-[#1B3C53]">
                        {formatCurrency(checkout?.total || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between text-lg">
                      <span className="text-[#456882]">
                        Delivery ({selectedDeliveryOption})
                      </span>
                      <span className="font-semibold text-[#1B3C53]">
                        {formatCurrency(
                          deliveryOptions[selectedDeliveryOption].fee
                        )}
                      </span>
                    </div>
                    {checkout?.appliedPromo && (
                      <div className="flex justify-between text-lg text-green-600">
                        <div className="flex items-center space-x-2">
                          <Tag className="w-4 h-4" />
                          <span className="font-medium">
                            {checkout.appliedPromo.code}
                          </span>
                        </div>
                        <span className="font-semibold">
                          -{formatCurrency(checkout.discountInPrice || 0)}
                        </span>
                      </div>
                    )}
                    <div className="border-t-2 border-[#CBDCEB] pt-4 flex justify-between font-bold text-xl text-[#1B3C53]">
                      <span>Total</span>
                      <span>
                        {formatCurrency(
                          checkout?.total +
                            deliveryOptions[selectedDeliveryOption].fee
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 border-t border-gray-100">
                    {checkout?.appliedPromo ? (
                      <div className="flex items-center justify-between bg-green-50 p-4 rounded-lg border border-green-200">
                        <div className="flex items-center space-x-3">
                          <Tag className="w-5 h-5 text-green-600" />
                          <span className="font-semibold text-green-800">
                            {checkout.appliedPromo.code} Applied
                          </span>
                        </div>
                        <button
                          onClick={handleRemovePromo}
                          disabled={isActionLoading}
                          className="text-red-600 hover:text-red-800 font-semibold disabled:opacity-50 transition-colors duration-200"
                        >
                          {isActionLoading ? "Removing..." : "Remove"}
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <label className="block text-sm font-semibold text-[#456882]">
                          Promo Code
                        </label>
                        <div className="flex space-x-3">
                          <input
                            type="text"
                            placeholder="Enter code"
                            value={promoCode}
                            onChange={handlePromoCodeChange}
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#456882] focus:border-transparent transition-all duration-200"
                          />
                          <button
                            onClick={handleApplyPromo}
                            disabled={!promoCode.trim() || isActionLoading}
                            className="px-6 py-3 bg-[#CBDCEB] text-[#1B3C53] font-semibold rounded-lg hover:bg-[#b5cde3] disabled:opacity-50 transition-all duration-200"
                          >
                            {isActionLoading ? "Applying..." : "Apply"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-6 border-t border-gray-100">
                    <button
                      onClick={handleConfirmOrder}
                      disabled={!isAddressComplete}
                      className="w-full py-4 px-6 bg-[#1B3C53] text-white font-bold text-lg rounded-xl hover:bg-[#2d4f68] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
                    >
                      {isSubmitCheckoutLoading
                        ? `Completing Order ${formatCurrency(
                            checkout?.total || 0
                          )}`
                        : `Complete Order ${formatCurrency(
                            checkout?.total || 0
                          )}`}
                    </button>

                    <p className="text-xs text-center text-gray-500 mt-4 leading-relaxed">
                      By completing your order, you agree to our{" "}
                      <a
                        href="#"
                        className="text-[#456882] hover:text-[#1B3C53] underline transition-colors duration-200"
                      >
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a
                        href="#"
                        className="text-[#456882] hover:text-[#1B3C53] underline transition-colors duration-200"
                      >
                        Privacy Policy
                      </a>
                    </p>
                  </div>
                </div>

                <div className="mt-6 bg-white rounded-2xl p-6 border border-white/20">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="flex flex-col items-center space-y-2">
                      <Shield className="w-8 h-8 text-[#456882]" />
                      <span className="text-sm font-semibold text-[#1B3C53]">
                        Secure Payment
                      </span>
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                      <Truck className="w-8 h-8 text-[#456882]" />
                      <span className="text-sm font-semibold text-[#1B3C53]">
                        Fast Delivery
                      </span>
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                      <RotateCcw className="w-8 h-8 text-[#456882]" />
                      <span className="text-sm font-semibold text-[#1B3C53]">
                        Easy Returns
                      </span>
                    </div>
                  </div>
                  <p className="text-center text-xs text-gray-500 mt-4">
                    Your information is encrypted and secure
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

CheckoutComponent.displayName = "CheckoutComponent";

export default CheckoutComponent;
