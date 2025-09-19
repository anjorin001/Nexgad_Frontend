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
import React, { useCallback, useEffect, useMemo, useState } from "react";
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

    useEffect(() => {
      if (checkout) {
        const deliveryOption =
          checkout.deliveryFee === 950 ? "standard" : "express";
        setSelectedDeliveryOption(deliveryOption);
      }
    }, []);

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
      <div className="min-h-screen bg-white py-4 sm:py-6 lg:py-8 px-3 sm:px-4 lg:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 sm:mb-8 lg:mb-12 text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1B3C53] mb-2 sm:mb-4 tracking-tight">
              Secure Checkout
            </h1>
            <p className="text-[#456882] text-base sm:text-lg lg:text-xl font-medium">
              Complete your order with confidence
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
            <div className="lg:col-span-8 space-y-4 sm:space-y-6 lg:space-y-8">
              {/* Step 1: Delivery Address */}
              <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 border border-[#CBDCEB]/30 hover:shadow-xl transition-shadow duration-300">
                <StepHeader
                  step={1}
                  title="DELIVERY ADDRESS"
                  onEdit={toggleAddressEdit}
                  isCompleted={isAddressComplete}
                />

                <div className="ml-0 sm:ml-8 lg:ml-14">
                  {!isAddressComplete && (
                    <div className="mb-4 sm:mb-6 p-3 sm:p-4 lg:p-5 bg-amber-50 border-l-4 border-amber-400 rounded">
                      <p className="text-amber-800 font-semibold text-sm sm:text-base flex items-center gap-2">
                        <span className="w-2 h-2 bg-amber-500 rounded-full flex-shrink-0"></span>
                        Please complete your delivery address to proceed
                      </p>
                    </div>
                  )}

                  <div className="mb-4 sm:mb-6 lg:mb-8">
                    <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 mb-3 sm:mb-4">
                      <MapPin className="w-4 h-4 sm:w-5 h-5 lg:w-6 h-6 text-[#456882] flex-shrink-0" />
                      <p className="font-bold text-[#1B3C53] text-base sm:text-lg lg:text-xl break-words">
                        {`${
                          deliveryAddress.firstName || checkout.firstName || ""
                        } ${
                          deliveryAddress.lastName || checkout.lastName || ""
                        }`}
                      </p>
                    </div>
                  </div>

                  {isEditingAddress ? (
                    <div className="space-y-4 sm:space-y-6 lg:space-y-8 bg-[#CBDCEB]/10 p-4 sm:p-6 lg:p-8 rounded-lg border border-[#CBDCEB]/30">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                          <label className="block text-xs sm:text-sm font-bold text-[#456882] mb-2 sm:mb-3">
                            First Name *
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
                            className="w-full p-3 sm:p-4 border border-[#CBDCEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#456882] focus:border-[#456882] transition-all duration-200 font-medium text-sm sm:text-base"
                            placeholder="Enter first name"
                          />
                        </div>
                        <div>
                          <label className="block text-xs sm:text-sm font-bold text-[#456882] mb-2 sm:mb-3">
                            Last Name *
                          </label>
                          <input
                            type="text"
                            value={
                              deliveryAddress.lastName ||
                              checkout.lastName ||
                              ""
                            } //TODO fix auto generation of feilds
                            onChange={(e) =>
                              handleAddressChange("lastName", e.target.value)
                            }
                            className="w-full p-3 sm:p-4 border border-[#CBDCEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#456882] focus:border-[#456882] transition-all duration-200 font-medium text-sm sm:text-base"
                            placeholder="Enter last name"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-bold text-[#456882] mb-2 sm:mb-3">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          value={deliveryAddress.phone || ""}
                          onChange={(e) =>
                            handleAddressChange("phone", e.target.value)
                          }
                          className="w-full p-3 sm:p-4 border border-[#CBDCEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#456882] focus:border-[#456882] transition-all duration-200 font-medium text-sm sm:text-base"
                          placeholder="Enter phone number"
                        />
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-bold text-[#456882] mb-2 sm:mb-3">
                          Street Address *
                        </label>
                        <textarea
                          value={deliveryAddress.address || ""}
                          onChange={(e) =>
                            handleAddressChange("address", e.target.value)
                          }
                          className="w-full p-3 sm:p-4 border border-[#CBDCEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#456882] focus:border-[#456882] resize-none transition-all duration-200 font-medium text-sm sm:text-base"
                          rows={3}
                          placeholder="Enter your full address"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        <div>
                          <label className="block text-xs sm:text-sm font-bold text-[#456882] mb-2 sm:mb-3">
                            City *
                          </label>
                          <input
                            type="text"
                            value={deliveryAddress.city || ""}
                            onChange={(e) =>
                              handleAddressChange("city", e.target.value)
                            }
                            className="w-full p-3 sm:p-4 border border-[#CBDCEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#456882] focus:border-[#456882] transition-all duration-200 font-medium text-sm sm:text-base"
                            placeholder="Enter city"
                          />
                        </div>
                        <div>
                          <label className="block text-xs sm:text-sm font-bold text-[#456882] mb-2 sm:mb-3">
                            State *
                          </label>
                          <input
                            type="text"
                            value={deliveryAddress.state || ""}
                            onChange={(e) =>
                              handleAddressChange("state", e.target.value)
                            }
                            className="w-full p-3 sm:p-4 border border-[#CBDCEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#456882] focus:border-[#456882] transition-all duration-200 font-medium text-sm sm:text-base"
                            placeholder="Enter state"
                          />
                        </div>
                        <div className="sm:col-span-2 lg:col-span-1">
                          <label className="block text-xs sm:text-sm font-bold text-[#456882] mb-2 sm:mb-3">
                            ZIP Code
                          </label>
                          <input
                            type="text"
                            value={deliveryAddress.zipCode || ""}
                            onChange={(e) =>
                              handleAddressChange("zipCode", e.target.value)
                            }
                            className="w-full p-3 sm:p-4 border border-[#CBDCEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#456882] focus:border-[#456882] transition-all duration-200 font-medium text-sm sm:text-base"
                            placeholder="Enter ZIP"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
                        <button
                          onClick={handleSaveAddress}
                          className="flex-1 sm:flex-none px-6 sm:px-8 py-3 sm:py-4 bg-[#1B3C53] text-white font-bold rounded-lg hover:bg-[#456882] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] text-sm sm:text-base"
                        >
                          Save Address
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="flex-1 sm:flex-none px-6 sm:px-8 py-3 sm:py-4 border border-[#456882] text-[#456882] font-bold rounded-lg hover:bg-[#456882] hover:text-white transition-all duration-200 text-sm sm:text-base"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-[#CBDCEB]/10 rounded-lg p-4 sm:p-6 lg:p-8 border border-[#CBDCEB]/30">
                      <div className="space-y-2 sm:space-y-3">
                        <p className="text-[#1B3C53] font-bold text-base sm:text-lg lg:text-xl break-words">
                          {deliveryAddress.address || "Address not set"}
                        </p>
                        <p className="text-[#456882] font-semibold text-sm sm:text-base lg:text-lg">
                          {deliveryAddress.city}, {deliveryAddress.state}{" "}
                          {deliveryAddress.zipCode}
                        </p>
                        <p className="text-[#456882] font-semibold text-sm sm:text-base">
                          {deliveryAddress.phone}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Step 2: Delivery Options */}
              <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 border border-[#CBDCEB]/30 hover:shadow-xl transition-shadow duration-300">
                <StepHeader step={2} title="DELIVERY OPTIONS" />

                <div className="ml-0 sm:ml-8 lg:ml-14 space-y-4 sm:space-y-6 lg:space-y-8">
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                    <div
                      className={`border-2 rounded-lg p-4 sm:p-6 lg:p-8 cursor-pointer transition-all duration-300 hover:shadow-lg transform hover:scale-[1.02] ${
                        selectedDeliveryOption === "standard"
                          ? "border-[#456882] bg-[#456882]/5 shadow-md"
                          : "border-[#CBDCEB] hover:border-[#456882]/50"
                      }`}
                      onClick={handleStandardDelivery}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-2">
                        <h3 className="font-bold text-[#1B3C53] text-lg sm:text-xl">
                          Standard Delivery
                        </h3>
                        <span className="font-bold text-[#456882] text-lg sm:text-xl">
                          {formatCurrency(deliveryOptions.standard.fee)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-4 text-[#456882]">
                        <Clock className="w-4 h-4 sm:w-5 h-5 lg:w-6 h-6 flex-shrink-0" />
                        <span className="font-semibold text-sm sm:text-base lg:text-lg">
                          {deliveryOptions.standard.days}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`border-2 rounded-lg p-4 sm:p-6 lg:p-8 cursor-pointer transition-all duration-300 hover:shadow-lg transform hover:scale-[1.02] ${
                        selectedDeliveryOption === "express"
                          ? "border-[#456882] bg-[#456882]/5 shadow-md"
                          : "border-[#CBDCEB] hover:border-[#456882]/50"
                      }`}
                      onClick={handleExpressDelivery}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-2">
                        <h3 className="font-bold text-[#1B3C53] text-lg sm:text-xl">
                          Express Delivery
                        </h3>
                        <span className="font-bold text-[#456882] text-lg sm:text-xl">
                          {formatCurrency(deliveryOptions.express.fee)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-4 text-[#456882]">
                        <Clock className="w-4 h-4 sm:w-5 h-5 lg:w-6 h-6 flex-shrink-0" />
                        <span className="font-semibold text-sm sm:text-base lg:text-lg">
                          {deliveryOptions.express.days}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4 sm:p-6 lg:p-8 border-2 border-green-200">
                    <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 mb-2 sm:mb-3">
                      <Package className="w-4 h-4 sm:w-5 h-5 lg:w-6 h-6 text-green-600 flex-shrink-0" />
                      <p className="font-bold text-green-800 text-base sm:text-lg lg:text-xl">
                        Estimated Delivery Date
                      </p>
                    </div>
                    <p className="text-green-700 font-bold text-sm sm:text-base lg:text-lg ml-6 sm:ml-8 lg:ml-10">
                      {formatDate(deliveryRange.end)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 3: Order Review */}
              <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 border border-[#CBDCEB]/30 hover:shadow-xl transition-shadow duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
                  <StepHeader step={3} title="ORDER REVIEW" />
                  <button
                    onClick={toggleOrderDetails}
                    className="flex items-center gap-2 sm:gap-3 text-[#456882] font-bold hover:text-[#1B3C53] transition-colors duration-200 px-3 sm:px-4 py-2 border border-[#CBDCEB] hover:border-[#456882] rounded-lg text-sm sm:text-base"
                  >
                    <span>{showOrderDetails ? "Hide" : "Show"} Details</span>
                    {showOrderDetails ? (
                      <ChevronUp className="w-4 h-4 sm:w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-4 h-4 sm:w-5 h-5" />
                    )}
                  </button>
                </div>

                <div className="ml-0 sm:ml-8 lg:ml-14">
                  <div className="bg-[#CBDCEB]/10 rounded-lg p-4 sm:p-6 lg:p-8 border border-[#CBDCEB]/30">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-2">
                      <p className="font-bold text-[#1B3C53] text-base sm:text-lg lg:text-xl">
                        Order Summary ({checkout?.cart?.items?.length || 0}{" "}
                        items)
                      </p>
                      <span className="font-bold text-[#456882] text-lg sm:text-xl lg:text-2xl">
                        {formatCurrency(checkout?.total || 0)}
                      </span>
                    </div>

                    {showOrderDetails && checkout?.cart?.items && (
                      <div className="space-y-4 sm:space-y-6 border-t border-[#CBDCEB] pt-4 sm:pt-6">
                        {checkout.cart.items.map((item) => (
                          <div
                            key={item.product._id}
                            className="flex items-start sm:items-center gap-3 sm:gap-4 lg:gap-6 p-3 sm:p-4 lg:p-6 bg-white rounded-lg border border-[#CBDCEB]/30 hover:shadow-md transition-shadow duration-200"
                          >
                            <img
                              src={item?.product?.images[0]?.url}
                              alt={
                                item.product?.images[0]?.alt ||
                                item.product.title
                              }
                              className="w-12 h-12 sm:w-16 h-16 lg:w-20 h-20 object-cover rounded-lg border border-[#CBDCEB]/30 flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-[#1B3C53] text-sm sm:text-base lg:text-lg mb-1 sm:mb-2 break-words">
                                {item?.product?.title}
                              </p>
                              <p className="text-[#456882] font-semibold text-xs sm:text-sm">
                                Quantity: {item.quantity}
                              </p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="font-bold text-[#456882] text-sm sm:text-base lg:text-xl">
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

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-4 space-y-4 sm:space-y-6 lg:space-y-8">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-[#CBDCEB]/30">
                  <div className="bg-[#1B3C53] p-4 sm:p-6 lg:p-8">
                    <h3 className="text-xl sm:text-2xl font-bold text-white">
                      Order Summary
                    </h3>
                  </div>

                  <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
                    <div className="flex justify-between text-base sm:text-lg">
                      <span className="text-[#456882] font-semibold">
                        Subtotal ({checkout?.cart?.items?.length || 0} items)
                      </span>
                      <span className="font-bold text-[#1B3C53]">
                        {formatCurrency(checkout?.total || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between text-base sm:text-lg">
                      <span className="text-[#456882] font-semibold">
                        Delivery ({selectedDeliveryOption})
                      </span>
                      <span className="font-bold text-[#1B3C53]">
                        {formatCurrency(deliveryOptions[selectedDeliveryOption].fee || 0)}
                      </span>
                    </div>
                    {checkout?.appliedPromo && (
                      <div className="flex justify-between text-base sm:text-lg text-green-600">
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4 sm:w-5 h-5 flex-shrink-0" />
                          <span className="font-semibold break-words">
                            {checkout.appliedPromo.code}
                          </span>
                        </div>
                        <span className="font-bold flex-shrink-0">
                          -{formatCurrency(checkout.discountInPrice || 0)}
                        </span>
                      </div>
                    )}
                    <div className="border-t-2 border-[#CBDCEB] pt-4 sm:pt-6 flex justify-between font-bold text-xl sm:text-2xl text-[#1B3C53]">
                      <span>Total</span>
                      <span>
                        {formatCurrency(
                          checkout?.total +
                            deliveryOptions[selectedDeliveryOption].fee
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 sm:p-6 lg:p-8 border-t border-[#CBDCEB]/30">
                    {checkout?.appliedPromo ? (
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-green-50 p-4 sm:p-6 rounded-lg border-2 border-green-200 gap-3">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <Tag className="w-5 h-5 sm:w-6 h-6 text-green-600 flex-shrink-0" />
                          <span className="font-bold text-green-800 text-base sm:text-lg break-words">
                            {checkout.appliedPromo.code} Applied
                          </span>
                        </div>
                        <button
                          onClick={handleRemovePromo}
                          disabled={isActionLoading}
                          className="text-red-600 hover:text-red-800 font-bold disabled:opacity-50 transition-colors duration-200 text-sm sm:text-base flex-shrink-0"
                        >
                          {isActionLoading ? "Removing..." : "Remove"}
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3 sm:space-y-4">
                        <label className="block text-xs sm:text-sm font-bold text-[#456882]">
                          Promo Code
                        </label>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <input
                            type="text"
                            placeholder="Enter code"
                            value={promoCode}
                            onChange={handlePromoCodeChange}
                            className="flex-1 px-3 sm:px-4 py-3 sm:py-4 border border-[#CBDCEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#456882] focus:border-[#456882] transition-all duration-200 font-medium text-sm sm:text-base"
                          />
                          <button
                            onClick={handleApplyPromo}
                            disabled={!promoCode.trim() || isActionLoading}
                            className="px-4 sm:px-6 py-3 sm:py-4 bg-[#CBDCEB] text-[#1B3C53] font-bold rounded-lg hover:bg-[#456882] hover:text-white disabled:opacity-50 transition-all duration-200 text-sm sm:text-base whitespace-nowrap"
                          >
                            {isActionLoading ? "Applying..." : "Apply"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-4 sm:p-6 lg:p-8 border-t border-[#CBDCEB]/30">
                    <button
                      onClick={handleConfirmOrder}
                      disabled={!isAddressComplete}
                      className="w-full py-4 sm:py-5 px-4 sm:px-6 bg-[#1B3C53] text-white font-bold text-base sm:text-lg lg:text-xl rounded-lg hover:bg-[#456882] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                    >
                      <span className="block sm:hidden">Complete Order</span>
                      <span className="hidden sm:block">
                        {isSubmitCheckoutLoading
                          ? `Completing Order ${formatCurrency(
                              checkout?.total +
                                deliveryOptions[selectedDeliveryOption].fee || 0
                            )}`
                          : `Complete Order ${formatCurrency(
                              checkout?.total +
                                deliveryOptions[selectedDeliveryOption].fee || 0
                            )}`}
                      </span>
                    </button>

                    <p className="text-xs text-center text-[#456882] mt-4 sm:mt-6 leading-relaxed px-2">
                      By completing your order, you agree to our{" "}
                      <a
                        href="#"
                        className="text-[#1B3C53] hover:underline font-semibold transition-colors duration-200"
                      >
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a
                        href="#"
                        className="text-[#1B3C53] hover:underline font-semibold transition-colors duration-200"
                      >
                        Privacy Policy
                      </a>
                    </p>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="bg-white rounded-lg p-4 sm:p-6 lg:p-8 border border-[#CBDCEB]/30 shadow-lg">
                  <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:gap-6 text-center">
                    <div className="flex flex-col items-center gap-2 sm:gap-3">
                      <div className="w-8 h-8 sm:w-10 lg:w-12 bg-[#CBDCEB]/20 rounded-lg flex items-center justify-center">
                        <Shield className="w-4 sm:w-6 lg:w-8 h-8 text-[#456882]" />
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-[#1B3C53] leading-tight">
                        Secure Payment
                      </span>
                    </div>
                    <div className="flex flex-col items-center gap-2 sm:gap-3">
                      <div className="w-8 sm:w-10 h-10 lg:w-12 bg-[#CBDCEB]/20 rounded-lg flex items-center justify-center">
                        <Truck className="w-4 h-4 sm:w-6 lg:w-8 text-[#456882]" />
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-[#1B3C53] leading-tight">
                        Fast Delivery
                      </span>
                    </div>
                    <div className="flex flex-col items-center gap-2 sm:gap-3">
                      <div className="w-8 sm:w-10 h-10 lg:w-12 bg-[#CBDCEB]/20 rounded-lg flex items-center justify-center">
                        <RotateCcw className="w-4 h-4 sm:w-6 lg:w-8 text-[#456882]" />
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-[#1B3C53] leading-tight">
                        Easy Returns
                      </span>
                    </div>
                  </div>
                  <p className="text-center text-xs text-[#456882] mt-4 sm:mt-6 font-medium px-2">
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
