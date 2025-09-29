import { Home, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { PaymentDetails } from "./types";

export const PaymentFailed: React.FC<{
  details: PaymentDetails;
  onRetry: () => void;
}> = ({ details, onRetry }) => {
  const navigate = useNavigate();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        {/* Failed Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-6">
            <XCircle className="w-16 h-16 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-[#1B3C53] mb-3">
            Payment Failed
          </h1>
          <p className="text-lg text-[#456882]">
            We couldn't process your payment. Please try again.
          </p>
        </div>

        {/* Payment Details Card */}
        <div className="bg-white border-2 border-red-200 rounded-lg p-6 mb-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-red-200">
              <span className="text-[#456882] font-medium">Amount</span>
              <span className="text-2xl font-bold text-[#1B3C53]">
                {formatCurrency(details.amount)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[#456882] font-medium">
                Transaction Reference
              </span>
              <span className="text-[#1B3C53] font-mono text-sm">
                {details.reference}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[#456882] font-medium">Status</span>
              <span className="text-red-600 font-semibold">Failed</span>
            </div>
          </div>
        </div>

        {/* Error Info Box */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-red-800 font-medium mb-2">
            Common reasons for payment failure:
          </p>
          <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
            <li>Insufficient funds in your account</li>
            <li>Incorrect card details or expired card</li>
            <li>Network connection issues</li>
            <li>Transaction declined by your bank</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => navigate("/cart")}
            className="w-full flex items-center justify-center gap-2 bg-[#CBDCEB] text-[#1B3C53] py-4 px-6 rounded-lg hover:bg-[#456882] hover:text-white transition-colors duration-200 font-semibold"
          >
            Back to Cart
          </button>

          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center justify-center gap-2 text-[#456882] py-3 hover:text-[#1B3C53] transition-colors duration-200 font-medium"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};
