import {
  Calendar,
  ChevronDown,
  DollarSign,
  Loader2,
  Package,
  Percent,
  Tag,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import Loader from "../../../components/nexgadMidPageLoader";
import type { PromoStatus } from "../../../Schema";
import type { PromoCode } from "./types";

interface ViewPromoDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  promoCode: PromoCode;
  onToggleStatus: (newStatus: PromoStatus) => void;
  isStatusUpdating?: boolean;
  isVeiwMoreLoading: boolean;
}

export const ViewPromoDetailModal: React.FC<ViewPromoDetailModalProps> = ({
  isOpen,
  onClose,
  promoCode,
  onToggleStatus,
  isStatusUpdating = false,
  isVeiwMoreLoading,
}) => {
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  if (!isOpen) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "inactive":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "disabled":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "expired":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getAllowedNextStatuses = () => {
    const now = new Date();
    const startDate = new Date(promoCode?.startAt);
    const endDate = new Date(promoCode?.endAt);
    const isExpired = now > endDate;
    const isActive = now >= startDate;

    if (promoCode?.status === "active" || promoCode?.status === "inactive") {
      return ["disabled"];
    } else if (promoCode?.status === "disabled") {
      if (isExpired) {
        return [];
      }
      if (!isActive) {
        return ["inactive"];
      }
      return ["active"];
    }
    return [];
  };

  const allowedStatuses = getAllowedNextStatuses();

  if (!promoCode && isVeiwMoreLoading) {
    return null;
  }

  return (
      <div className="fixed inset-0 bg-[#263b51]/40 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-lg">
        {isVeiwMoreLoading ? (
          <div className="fixed inset-0 bg-[#263b51]/40 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-white col-span-full flex justify-center items-center rounded-lg max-w-2xl w-full h-[80vh] overflow-y-auto">
              <Loader size={64} thickness={1} />
            </div>
          </div>
        ) : (
          <>
            <div className="bg-[#1B3C53] p-6 rounded-t-lg sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#456882] rounded-lg flex items-center justify-center">
                    <Tag className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      Promo Code Details
                    </h2>
                    <p className="text-white/80 text-sm">
                      View and manage promo code
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Code and Status */}
              <div className="bg-[#CBDCEB]/20 border border-[#CBDCEB] rounded-lg p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-[#456882] mb-2">Promo Code</p>
                    <p className="text-3xl font-bold text-[#1B3C53] font-mono">
                      {promoCode.code}
                    </p>
                  </div>

                  {/* Status Toggle */}
                  <div className="relative">
                    <button
                      onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                      disabled={
                        isStatusUpdating || allowedStatuses.length === 0
                      }
                      className={`px-4 py-2 rounded-lg font-semibold border-2 flex items-center gap-2 transition-colors ${getStatusColor(
                        promoCode.status
                      )} disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <span className="capitalize">{promoCode.status}</span>
                      {allowedStatuses.length > 0 && !isStatusUpdating && (
                        <ChevronDown className="w-4 h-4" />
                      )}
                      {isStatusUpdating && (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      )}
                    </button>

                    {showStatusDropdown && allowedStatuses.length > 0 && (
                      <div className="absolute right-0 top-full mt-1 bg-white border-2 border-[#CBDCEB] rounded-lg shadow-lg z-10 min-w-[140px]">
                        {allowedStatuses.map((status) => (
                          <button
                            key={status}
                            disabled={isStatusUpdating}
                            onClick={() => {
                              onToggleStatus(status as PromoStatus);
                              setShowStatusDropdown(false);
                            }}
                            className="w-full px-4 py-2 text-left hover:bg-[#CBDCEB]/30 text-sm font-medium text-[#1B3C53] first:rounded-t-lg last:rounded-b-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <span className="capitalize">{status}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {promoCode.status === "expired" && (
                  <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-800 text-sm font-medium">
                      This promo code has expired and cannot be reactivated.
                    </p>
                  </div>
                )}
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Discount Type */}
                <div className="bg-white border border-[#CBDCEB] rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    {promoCode.type === "percent" ? (
                      <Percent className="w-5 h-5 text-[#456882]" />
                    ) : (
                      <DollarSign className="w-5 h-5 text-[#456882]" />
                    )}
                    <p className="text-sm font-semibold text-[#456882]">
                      Discount Type
                    </p>
                  </div>
                  <p className="text-2xl font-bold text-[#1B3C53]">
                    {promoCode.type === "percent"
                      ? `${promoCode.value}%`
                      : formatCurrency(promoCode.value)}
                  </p>
                  <p className="text-xs text-[#456882] mt-1">
                    {promoCode.type === "percent"
                      ? "Percentage discount"
                      : "Fixed amount discount"}
                  </p>
                </div>

                {/* Min Order Total */}
                <div className="bg-white border border-[#CBDCEB] rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Package className="w-5 h-5 text-[#456882]" />
                    <p className="text-sm font-semibold text-[#456882]">
                      Minimum Order
                    </p>
                  </div>
                  <p className="text-2xl font-bold text-[#1B3C53]">
                    {formatCurrency(promoCode.minOrderTotal)}
                  </p>
                  <p className="text-xs text-[#456882] mt-1">
                    Required to use this promo
                  </p>
                </div>

                {/* Redemptions */}
                <div className="bg-white border border-[#CBDCEB] rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="w-5 h-5 text-[#456882]" />
                    <p className="text-sm font-semibold text-[#456882]">
                      Redemptions
                    </p>
                  </div>
                  <p className="text-2xl font-bold text-[#1B3C53]">
                    {promoCode.currentRedemptions} / {promoCode.maxRedemptions}
                  </p>
                  <div className="mt-2 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#456882] h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${
                          (promoCode.currentRedemptions /
                            promoCode.maxRedemptions) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>

                {/* Eligibility */}
                <div className="bg-white border border-[#CBDCEB] rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="w-5 h-5 text-[#456882]" />
                    <p className="text-sm font-semibold text-[#456882]">
                      Eligibility
                    </p>
                  </div>
                  <p className="text-lg font-bold text-[#1B3C53] capitalize">
                    {promoCode.eligibilityRules || "All Users"}
                  </p>
                  <p className="text-xs text-[#456882] mt-1">
                    {promoCode.eligibilityRules === "newuser"
                      ? "Only for new users"
                      : promoCode.eligibilityRules === "olduser"
                      ? "Only for existing users"
                      : "Available to all users"}
                  </p>
                </div>
              </div>

              {/* Date Range */}
              <div className="bg-white border border-[#CBDCEB] rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="w-5 h-5 text-[#456882]" />
                  <p className="text-sm font-bold text-[#456882]">
                    Valid Period
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-[#456882] mb-1">Start Date</p>
                    <p className="text-sm font-semibold text-[#1B3C53]">
                      {formatDate(promoCode.startAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#456882] mb-1">End Date</p>
                    <p className="text-sm font-semibold text-[#1B3C53]">
                      {formatDate(promoCode.endAt)}
                    </p>
                  </div>
                </div>
              </div>

              {promoCode.applicableCategories.length > 0 && (
                <div className="bg-white border border-[#CBDCEB] rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Package className="w-5 h-5 text-[#456882]" />
                    <p className="text-sm font-bold text-[#456882]">
                      Applicable Categories
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {promoCode.applicableCategories.map((category, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-[#CBDCEB]/30 text-[#1B3C53] rounded-lg text-sm font-medium"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#456882]">
                  <div>
                    <span className="font-semibold">Created:</span>{" "}
                    {formatDate(promoCode.createdAt.toString())}
                  </div>
                  <div>
                    <span className="font-semibold">Last Updated:</span>{" "}
                    {formatDate(promoCode.updatedAt.toString())}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-b-lg border-t border-gray-200">
              <button
                onClick={onClose}
                className="w-full md:w-auto px-6 py-3 bg-[#1B3C53] text-white rounded-lg hover:bg-[#456882] transition-colors font-semibold"
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
