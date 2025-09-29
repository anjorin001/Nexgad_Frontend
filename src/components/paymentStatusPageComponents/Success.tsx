import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Loader2, Package, ArrowRight, Home, RefreshCw } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { PaymentDetails } from './types';

export const PaymentSuccess: React.FC<{ details: PaymentDetails }> = ({ details }) => {
  const navigate = useNavigate();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-[#1B3C53] mb-3">Payment Successful!</h1>
          <p className="text-lg text-[#456882]">
            Your order has been confirmed and is being processed
          </p>
        </div>

        {/* Payment Details Card */}
        <div className="bg-white border-2 border-[#CBDCEB] rounded-lg p-6 mb-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-[#CBDCEB]">
              <span className="text-[#456882] font-medium">Amount Paid</span>
              <span className="text-2xl font-bold text-[#1B3C53]">
                {formatCurrency(details.amount)}
              </span>
            </div>

            {details.orderId && (
              <div className="flex justify-between items-center">
                <span className="text-[#456882] font-medium">Order ID</span>
                <span className="text-[#1B3C53] font-semibold">#{details.orderId}</span>
              </div>
            )}

            <div className="flex justify-between items-center">
              <span className="text-[#456882] font-medium">Transaction Reference</span>
              <span className="text-[#1B3C53] font-mono text-sm">{details.reference}</span>
            </div>

            {details.paymentMethod && (
              <div className="flex justify-between items-center">
                <span className="text-[#456882] font-medium">Payment Method</span>
                <span className="text-[#1B3C53] font-semibold capitalize">{details.paymentMethod}</span>
              </div>
            )}

            {details.timestamp && (
              <div className="flex justify-between items-center">
                <span className="text-[#456882] font-medium">Date & Time</span>
                <span className="text-[#1B3C53]">{new Date(details.timestamp).toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-[#CBDCEB]/20 border border-[#CBDCEB] rounded-lg p-4 mb-6">
          <div className="flex gap-3">
            <Package className="w-5 h-5 text-[#456882] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-[#1B3C53] font-medium mb-1">
                What happens next?
              </p>
              <p className="text-sm text-[#456882]">
                we're currently processing your package, 
                You can track your order status in your account.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => navigate(`/my-orders`)}
            className="w-full flex items-center justify-center gap-2 bg-[#1B3C53] text-white py-4 px-6 rounded-lg hover:bg-[#456882] transition-colors duration-200 font-semibold"
          >
            View Order Details
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-center gap-2 bg-[#CBDCEB] text-[#1B3C53] py-4 px-6 rounded-lg hover:bg-[#456882] hover:text-white transition-colors duration-200 font-semibold"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};





