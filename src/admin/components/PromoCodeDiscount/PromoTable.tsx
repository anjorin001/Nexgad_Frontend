import { Calendar, CheckCircle, Copy, Eye, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { getStatusColor, type PromoCode } from "./types";

interface PromoTableProps {
  promoCodes: PromoCode[];
  onVeiwPromoDetail: (promo: PromoCode) => void;
  openPromoDeleteModal: (promo: PromoCode) => void;
}

export const PromoTable: React.FC<PromoTableProps> = ({
  promoCodes,
  onVeiwPromoDetail,
  openPromoDeleteModal,
}) => {
  const [copiedCode, setCopiedCode] = useState<string>("");

  const handleCopyCode = async (code: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(""), 2000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  return (
    <div className="bg-white rounded-lg shadow-xl border border-[#CBDCEB]/30 overflow-hidden">
      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px]">
          <thead className="bg-gray-50/80">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-[#263b51] uppercase tracking-wider border-b border-gray-200">
                Promo Code
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-[#263b51] uppercase tracking-wider border-b border-gray-200">
                Validity Period
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-[#263b51] uppercase tracking-wider border-b border-gray-200">
                Discount
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-[#263b51] uppercase tracking-wider border-b border-gray-200">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-[#263b51] uppercase tracking-wider border-b border-gray-200">
                Usage Analytics
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-[#263b51] uppercase tracking-wider border-b border-gray-200">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {promoCodes.map((promo, index) => {
              const startDate = formatDate(promo.startAt);
              const endDate = formatDate(promo.endAt);
              const statusInfo = getStatusColor(promo.status);
              const usagePercent = Math.min(
                (promo.currentRedemptions / promo.maxRedemptions) * 100,
                100
              );

              return (
                <tr
                  key={promo._id}
                  className="group hover:bg-gradient-to-r hover:from-[#CBDCEB]/10 hover:to-transparent transition-all duration-200"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Promo Code Column */}
                  <td className="px-6 py-6 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0"></div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#263b51] text-lg font-mono tracking-wide">
                            {promo.code}
                          </span>
                          <button
                            onClick={() => handleCopyCode(promo.code)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-[#CBDCEB]/50 rounded"
                          >
                            {copiedCode === promo.code ? (
                              <CheckCircle
                                size={14}
                                className="text-green-600"
                              />
                            ) : (
                              <Copy size={14} className="text-[#456882]" />
                            )}
                          </button>
                        </div>
                        <div className="text-sm text-[#456882] mt-1">
                          Min order: ₦{promo.minOrderTotal.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Validity Period Column */}
                  <td className="px-6 py-6 whitespace-nowrap">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar size={14} className="text-[#456882]" />
                        <div>
                          <div className="font-medium text-[#263b51]">
                            {startDate.date}
                          </div>
                          <div className="text-xs text-[#456882]">
                            {startDate.time}
                          </div>
                        </div>
                        <span className="text-[#456882] mx-2">→</span>
                        <div>
                          <div className="font-medium text-[#263b51]">
                            {endDate.date}
                          </div>
                          <div className="text-xs text-[#456882]">
                            {endDate.time}
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Discount Column */}
                  <td className="px-6 py-6 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="bg-gradient-to-r from-[#CBDCEB] to-[#456882]/20 rounded-lg px-3 py-2">
                        <div className="font-bold text-[#263b51] text-lg">
                          {promo.type === "percent"
                            ? `${promo.value}%`
                            : `₦${promo.value.toLocaleString()}`}
                        </div>
                        <div className="text-xs text-[#456882]">
                          {promo.type === "percent"
                            ? "Percentage"
                            : "Fixed Amount"}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Status Column */}
                  <td className="px-6 py-6 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${statusInfo.dotColor} animate-pulse`}
                      ></div>
                      {promo.status && (
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${statusInfo.className}`}
                        >
                          {statusInfo.icon}
                          {promo.status.charAt(0).toUpperCase() +
                            promo.status.slice(1)}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Usage Analytics Column */}
                  <td className="px-6 py-6 whitespace-nowrap">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-[#263b51]">
                          {promo.currentRedemptions} / {promo.maxRedemptions}
                        </span>
                        <span className="text-[#456882] font-medium">
                          {usagePercent.toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-[#456882] to-[#263b51] h-2 rounded-full transition-all duration-500 ease-out shadow-sm"
                          style={{ width: `${usagePercent}%` }}
                        >
                          <div className="h-full bg-white/20 animate-pulse"></div>
                        </div>
                      </div>
                      <div className="text-xs text-[#456882]">
                        {promo.maxRedemptions - promo.currentRedemptions}{" "}
                        remaining
                      </div>
                    </div>
                  </td>

                  {/* Actions Column */}
                  <td className="px-6 py-6 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onVeiwPromoDetail(promo)}
                        className="group/btn flex items-center gap-1 px-3 py-2 bg-[#CBDCEB]/50 hover:bg-[#456882] text-[#456882] hover:text-white rounded-lg transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
                      >
                        <Eye size={14} />
                        <span>Details</span>
                      </button>
                      <button
                        onClick={() => openPromoDeleteModal(promo)}
                        className="p-2 text-red-500 hover:text-white hover:bg-red-500 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
