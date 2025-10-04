import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import CheckoutComponent from "../components/checkoutComponents/Checkout";
import type { ICheckoutFinal } from "../components/checkoutComponents/CheckoutInterface";
import Footer from "../components/Footer";
import Loader from "../components/nexgadMidPageLoader";
import { useAppContext } from "../context/AppContext";
import api from "../utils/api";
import { useToast } from "../utils/ToastNotification";

const Checkout = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isActionLoading, setIsActionLoading] = useState<boolean>(false);
  const [isSubmitCheckoutLoading, setIsSubmitCheckoutLoading] =
    useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [queryParams] = useSearchParams();

  const offerId = queryParams.has("offerId");
  const stamp = queryParams.has("stamp");

  const isOfferCheckout = offerId && stamp;

  const offerIdValue = queryParams.get("offerId");
  const stampValue = queryParams.get("stamp");


  const {
    isAuthenticated,
    setCheckout,
    checkout,
    deliveryAddress,
    setDeliveryAddress,
  } = useAppContext();

  const toast = useToast();
  const navigate = useNavigate();

  const handleNetworkError = useCallback(
    (err: any) => {
      console.error("Network error:", err);

      if (err?.response?.data?.message) {
        toast.error(err.response.data.message);
      } else if (
        err?.code === "ERR_NETWORK" ||
        err?.code === "ECONNABORTED" ||
        (err?.message && err.message.includes("Network Error"))
      ) {
        toast.error(
          "Network connection error. Please check your internet connection."
        );
        window.dispatchEvent(new CustomEvent("network-error"));
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    },
    [toast]
  );

  const handleCheckout = useCallback(async () => {
    if (!isAuthenticated) {
      toast.info("Please login to access checkout");
      navigate("/login");
      return;
    }

    setIsLoading(true);
    setHasError(false);

    try {
      let request: any;

      if (isOfferCheckout) {
        request = await api.get(
          `/checkout/offer?offerId=${offerIdValue}&stamp=${stampValue}`
        );
      } else {
        request = await api.get("/checkout");
      }

      const response = request.data;

      if (response?.data) {
        const checkoutData = response.data;
        console.log("first");
        setCheckout(checkoutData);

        // Set delivery address with proper fallbacks
        setDeliveryAddress({
          firstName: checkoutData?.firstName || "",
          lastName: checkoutData?.lastName || "",
          address: checkoutData?.address || "",
          city: checkoutData?.city || "",
          phone: checkoutData?.phone || "",
          state: checkoutData?.state || "",
          zipCode: checkoutData?.zipCode || "",
        });
      } else {
        setHasError(true);
        toast.error("Invalid checkout data received from server.");
      }
    } catch (err: any) {
      console.error("Checkout fetch error:", err);
      setHasError(true);
      handleNetworkError(err);
    } finally {
      setIsLoading(false);
    }
  }, [
    isAuthenticated,
    navigate,
    toast,
    setCheckout,
    setDeliveryAddress,
    handleNetworkError,
  ]);

  const handleRemovePromoCode = useCallback(
    async (promoCode: string) => {
      if (!promoCode?.trim()) {
        toast.error("Invalid promo code");
        return;
      }

      setIsActionLoading(true);

      try {
        const data = {
          code: promoCode,
        };
        const response = await api.delete("/checkout/remove-promo", { data });

        console.log("Remove promo response:", response.data);

        if (response.data?.checkout) {
          setCheckout(response.data.checkout);
          toast.success("Promo code removed successfully");
        } else if (response.data?.data) {
          setCheckout(response.data.data);
          toast.success("Promo code removed successfully");
        } else {
          toast.error("Failed to remove promo code");
        }
      } catch (err: any) {
        console.error("Remove promo error:", err);
        handleNetworkError(err);
      } finally {
        setIsActionLoading(false);
      }
    },
    [toast, setCheckout, handleNetworkError]
  );

  // Apply promo code
  const handleApplyPromoCode = useCallback(
    async (promoCode: string) => {
      if (!promoCode?.trim()) {
        toast.error("Please enter a promo code");
        return;
      }

      setIsActionLoading(true);

      try {
        const response = await api.post("/checkout/apply-promo", {
          code: promoCode.trim(),
        });

        console.log("Apply promo response:", response.data);

        if (response.data.checkout) {
          setCheckout(response.data.checkout);
          toast.success("Promo code applied successfully");
        } else if (response.data?.data) {
          setCheckout(response.data.data);
          toast.success("Promo code applied successfully");
        } else {
          toast.error("Failed to apply promo code");
        }
      } catch (err: any) {
        console.error("Apply promo error:", err);
        handleNetworkError(err);
      } finally {
        setIsActionLoading(false);
      }
    },
    [toast, setCheckout, handleNetworkError]
  );

  // Submit final checkout
  const handleSubmitCheckout = useCallback(
    async (
      deliveryType: "standard" | "express",
      estimatedDelivery: Date
    ): Promise<string> => {
      // Validate delivery address
      const requiredFields = [
        "firstName",
        "lastName",
        "address",
        "city",
        "phone",
        "state",
        "zipCode",
      ];
      const missingFields = requiredFields.filter(
        (field) => !deliveryAddress[field as keyof typeof deliveryAddress]
      );

      if (missingFields.length > 0) {
        toast.error(
          `Please complete your delivery address: ${missingFields.join(", ")}`
        );
        return "";
      }

      setIsSubmitCheckoutLoading(true);

      try {
        const checkoutData: ICheckoutFinal = {
          ...deliveryAddress,
          deliveryType,
          estimatedDelivery: estimatedDelivery.toISOString(),
        };

        console.log("Finalizing checkout with data:", checkoutData);

        const response = await api.post(
          "/checkout/finalize-checkout",
          checkoutData
        );

        console.log("Finalize checkout response:", response.data);

        if (response.data?.data?.url) {
          toast.success("Order placed successfully!");
          return response.data.data.url;
        } else {
          toast.error("Failed to process checkout. Please try again.");
          return "";
        }
      } catch (err: any) {
        console.error("Finalize checkout error:", err);
        handleNetworkError(err);
        return "";
      } finally {
        setIsSubmitCheckoutLoading(false);
      }
    },
    [deliveryAddress, toast, handleNetworkError]
  );

  // Retry function for error state
  const handleRetry = useCallback(() => {
    setHasError(false);
    handleCheckout();
  }, [handleCheckout]);

  // Initialize checkout on mount
  useEffect(() => {
    handleCheckout();
  }, []); // Remove dependencies to prevent infinite loops

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#ffff]">
        <div className="text-center">
          <Loader fullScreen={false} size={64} thickness={1} />
          <p className="mt-4 text-[#456882] font-medium">Loading checkout...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (hasError || !checkout) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#ffff]">
        <div className="text-center bg-white rounded-2xl p-8 shadow-lg max-w-md mx-4">
          <div className="mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[#1B3C53] mb-2">
              Checkout Unavailable
            </h2>
            <p className="text-[#456882]">
              We couldn't load your checkout information. Please try again.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleRetry}
              className="w-full bg-[#1B3C53] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#2d4f68] transition-colors duration-200"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate("/cart")}
              className="w-full border-2 border-[#456882] text-[#456882] py-3 px-6 rounded-lg font-semibold hover:bg-[#456882] hover:text-white transition-all duration-200"
            >
              Return to Cart
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ffff]">
      <CheckoutComponent
        checkout={checkout}
        removePromoCode={handleRemovePromoCode}
        onApplyPromoCode={handleApplyPromoCode}
        onConfirmOrder={handleSubmitCheckout}
        isLoading={false}
        isActionLoading={isActionLoading}
        isSubmitCheckoutLoading={isSubmitCheckoutLoading}
      />
      <Footer />
    </div>
  );
};

export default Checkout;
