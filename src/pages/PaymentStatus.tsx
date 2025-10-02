import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PaymentFailed } from "../components/paymentStatusPageComponents/Failed";
import { PaymentPending } from "../components/paymentStatusPageComponents/PaymentPending";
import { PaymentSuccess } from "../components/paymentStatusPageComponents/Success";
import type { PaymentDetails } from "../components/paymentStatusPageComponents/types";
import api from "../utils/api";
import { extractPaymentReference } from "../utils/providerReferenceExtracto";
import { useToast } from "../utils/ToastNotification";

interface callbackDataProp {
  provider: "flutterwave" | "paystack";
  txRef?: string;
  transactionId?: string;
  reference?: string;
}

export const PaymentStatusPage: React.FC = () => {
  const navigate = useNavigate();
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  let callbackData: callbackDataProp;

  const verifyPayment = async () => {
    setIsLoading(true);

    try {
      if (!callbackData) {
        throw new Error("No payment reference found");
      }

      if (callbackData.provider === "flutterwave") {
        const data = {
          transactionRefrence: callbackData.txRef,
          transactionId: callbackData.transactionId,
        };

        console.log("data to send", data);

        const request = await api.post(`/payment/verify`, data);
        const response = request.data.data;

        setPaymentDetails(response);
      } else if (callbackData.provider === "paystack") {
        const data = {
          transactionRefrence: callbackData.reference,
          transactionId: null,
        };

        const request = await api.post(`/payment/verify`, data);
        const response = request.data.data;

        setPaymentDetails(response);
      }
    } catch (err: any) {
      console.error("Payment verification error:", err);

      if (err?.response?.data?.message === "Transaction not found") {
        setPaymentDetails({
          status: "failed",
          amount: 0,
          reference: "UNKNOWN",
        });
      } else if (
        err?.code === "ERR_NETWORK" ||
        err?.code === "ECONNABORTED" ||
        err?.code === "ERR_BAD_RESPONSE" ||
        (err?.message && err.message.includes("Network Error"))
      ) {
        toast.error(
          "Network connection error. Please check your internet connection."
        );
        window.dispatchEvent(new CustomEvent("network-error"));
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    callbackData = extractPaymentReference();
    console.log("reff", callbackData);
    verifyPayment();
  }, []);

  const handleRetry = () => {
    navigate("/checkout/s");
  };

  if (isLoading || !paymentDetails) {
    return <PaymentPending />;
  }

  if (paymentDetails.status === "success") {
    return <PaymentSuccess details={paymentDetails} />;
  }

  return <PaymentFailed details={paymentDetails} onRetry={handleRetry} />;
};

export default PaymentStatusPage;
