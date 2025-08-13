import { CheckCircle, Sparkles, X } from "lucide-react";
import React, { useState } from "react";
import { categories, generatePromoCode, type PromoCode } from "./types";

interface CreatePromoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (promo: Omit<PromoCode, "id" | "currentRedemptions">) => void;
}

export const CreatePromoDialog: React.FC<CreatePromoDialogProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    code: "",
    type: "percent" as "percent" | "fixed",
    value: 0,
    startAt: "",
    endAt: "",
    maxRedemptions: 0,
    minOrderTotal: 0,
    status: "inactive" as "active" | "disabled" | "inactive",
    applicableCategories: [] as string[],
    eligibilityRules: undefined as "olduser" | "newuser" | undefined,
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const handleSubmit = () => {
    if (isFormValid) {
      onSave(formData);
      onClose();
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({
      code: "",
      type: "percent",
      value: 0,
      startAt: "",
      endAt: "",
      maxRedemptions: 0,
      minOrderTotal: 0,
      status: "inactive",
      applicableCategories: [],
      eligibilityRules: undefined,
    });
    setCurrentStep(1);
  };

  const handleCategoryToggle = (category: string) => {
    setFormData((prev) => ({
      ...prev,
      applicableCategories: prev.applicableCategories.includes(category)
        ? prev.applicableCategories.filter((c) => c !== category)
        : [...prev.applicableCategories, category],
    }));
  };

  const isFormValid =
    formData.code &&
    formData.value > 0 &&
    formData.startAt &&
    formData.endAt &&
    formData.maxRedemptions > 0;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#263b51]/40 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
      <div className="bg-white rounded-sm shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden animate-in slide-in-from-bottom duration-500">
        {/* Enhanced Header */}
        <div className="relative bg-[#263b51] p-8 text-white">
          <div className="absolute inset-0 bg-gradient-to-r from-[#456882]/20 to-[#263b51]/20"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">Create New Promo Code</h2>
              <p className="text-white/80">
                Step {currentStep} of {totalSteps}:
                {currentStep === 1 && " Basic Information"}
                {currentStep === 2 && " Discount & Validity"}
                {currentStep === 3 && " Categories & Rules"}
              </p>
            </div>
            <button
              onClick={() => {
                onClose();
                resetForm();
              }}
              className="p-3 hover:bg-white/20 rounded-full transition-colors duration-200"
            >
              <X size={24} />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div key={i} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-200 ${
                      currentStep > i + 1
                        ? "bg-green-400 text-white"
                        : currentStep === i + 1
                        ? "bg-white text-[#263b51]"
                        : "bg-white/30 text-white/60"
                    }`}
                  >
                    {currentStep > i + 1 ? "✓" : i + 1}
                  </div>
                  {i < totalSteps - 1 && (
                    <div
                      className={`flex-1 h-1 mx-4 rounded transition-colors duration-200 ${
                        currentStep > i + 1 ? "bg-green-400" : "bg-white/30"
                      }`}
                    ></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(95vh-200px)]">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Code Input */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-bold text-[#263b51] mb-3">
                    Promo Code *
                  </label>
                  <div className="flex gap-3">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={formData.code}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            code: e.target.value.toUpperCase(),
                          }))
                        }
                        className="w-full px-4 py-3 border-2 border-[#CBDCEB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#456882]/30 focus:border-[#456882] transition-all duration-200 bg-gray-50/50 font-mono text-lg"
                        placeholder="Enter custom code or generate one"
                      />
                      {formData.code && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <CheckCircle className="text-green-500" size={20} />
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          code: generatePromoCode(),
                        }))
                      }
                      className="px-6 py-3 bg-gradient-to-r from-[#CBDCEB] to-[#456882]/20 text-[#263b51] rounded-xl hover:from-[#456882] hover:to-[#263b51] hover:text-white transition-all duration-200 border-2 border-[#CBDCEB] hover:border-[#456882] font-semibold flex items-center gap-2"
                    >
                      <Sparkles size={18} />
                      Generate
                    </button>
                  </div>
                </div>

                {/* Max Redemptions */}
                <div>
                  <label className="block text-sm font-bold text-[#263b51] mb-3">
                    Maximum Uses *
                  </label>
                  <input
                    type="number"
                    value={formData.maxRedemptions || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        maxRedemptions: Number(e.target.value),
                      }))
                    }
                    className="w-full px-4 py-3 border-2 border-[#CBDCEB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#456882]/30 focus:border-[#456882] transition-all duration-200 bg-gray-50/50"
                    placeholder="100"
                    min="1"
                  />
                </div>
              </div>
            </div>
          )}
          {/* Step 2: Discount & Validity */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Type and Value */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-bold text-[#263b51] mb-3">
                    Discount Configuration *
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <select
                      value={formData.type}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          type: e.target.value as "percent" | "fixed",
                          value: 0,
                        }))
                      }
                      className="px-4 py-3 border-2 border-[#CBDCEB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#456882]/30 focus:border-[#456882] transition-all duration-200 bg-gray-50/50"
                    >
                      <option value="percent">Percentage Discount</option>
                      <option value="fixed">Fixed Amount (₦)</option>
                    </select>
                    <div className="relative">
                      <input
                        type="number"
                        value={formData.value || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            value: Number(e.target.value),
                          }))
                        }
                        className="w-full px-7 py-3 border-2 border-[#CBDCEB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#456882]/30 focus:border-[#456882] transition-all duration-200 bg-gray-50/50"
                        placeholder={
                          formData.type === "percent" ? "10" : "5000"
                        }
                        min="1"
                        max={formData.type === "percent" ? "100" : undefined}
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#456882] font-medium">
                        {formData.type === "percent" ? "%" : "₦"}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-[#456882]">
                    {formData.type === "percent"
                      ? "Percentage discount from total order value"
                      : "Fixed amount discount in Nigerian Naira"}
                  </div>
                </div>

                {/* Start Date/Time */}
                <div>
                  <label className="block text-sm font-bold text-[#263b51] mb-3">
                    Start Date & Time *
                  </label>
                  <div className="relative">
                    <input
                      type="datetime-local"
                      value={formData.startAt}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          startAt: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 border-2 border-[#CBDCEB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#456882]/30 focus:border-[#456882] transition-all duration-200 bg-gray-50/50"
                      min={new Date().toISOString().slice(0, 16)}
                    />
                  </div>
                </div>

                {/* End Date/Time */}
                <div>
                  <label className="block text-sm font-bold text-[#263b51] mb-3">
                    End Date & Time *
                  </label>
                  <div className="relative">
                    <input
                      type="datetime-local"
                      value={formData.endAt}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          endAt: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 border-2 border-[#CBDCEB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#456882]/30 focus:border-[#456882] transition-all duration-200 bg-gray-50/50"
                      min={
                        formData.startAt ||
                        new Date().toISOString().slice(0, 16)
                      }
                    />
                  </div>
                </div>

                {/* Min Order Total */}
                <div>
                  <label className="block text-sm font-bold text-[#263b51] mb-3">
                    Minimum Order Amount (₦)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={formData.minOrderTotal || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          minOrderTotal: Number(e.target.value),
                        }))
                      }
                      className="w-full px-7 py-3 border-2 border-[#CBDCEB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#456882]/30 focus:border-[#456882] transition-all duration-200 bg-gray-50/50"
                      placeholder="0"
                      min="0"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#456882] font-medium">
                      ₦
                    </div>
                  </div>
                  <div className="text-xs text-[#456882] mt-1">
                    Minimum cart value required to use this promo code
                  </div>
                </div>

                {/* Eligibility Rules */}
                <div>
                  <label className="block text-sm font-bold text-[#263b51] mb-3">
                    Customer Eligibility
                  </label>
                  <select
                    value={formData.eligibilityRules || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        eligibilityRules: e.target.value
                          ? (e.target.value as "olduser" | "newuser")
                          : undefined,
                      }))
                    }
                    className="w-full px-4 py-3 border-2 border-[#CBDCEB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#456882]/30 focus:border-[#456882] transition-all duration-200 bg-gray-50/50"
                  >
                    <option value="">All Customers</option>
                    <option value="newuser">New Customers Only</option>
                    <option value="olduser">Existing Customers Only</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Categories & Rules */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in slide-in-from-right duration-300">
              <div>
                <label className="block text-sm font-bold text-[#263b51] mb-4">
                  Applicable Product Categories
                </label>
                <div className="bg-gray-50/80 rounded-2xl p-6 border-2 border-[#CBDCEB]/50">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {categories.map((category) => (
                      <label
                        key={category}
                        className="flex items-center gap-3 p-3 bg-white rounded-xl border border-[#CBDCEB]/50 hover:border-[#456882]/50 hover:shadow-sm transition-all duration-200 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={formData.applicableCategories.includes(
                            category
                          )}
                          onChange={() => handleCategoryToggle(category)}
                          className="w-4 h-4 text-[#456882] border-[#CBDCEB] rounded focus:ring-[#456882]/30 focus:ring-2"
                        />
                        <span className="text-sm font-medium text-[#263b51] group-hover:text-[#456882] transition-colors duration-200">
                          {category}
                        </span>
                      </label>
                    ))}
                  </div>
                  <div className="mt-4 text-xs text-[#456882]">
                    {formData.applicableCategories.length === 0
                      ? "Select categories where this promo code can be applied. Leave empty for all categories."
                      : `Selected ${formData.applicableCategories.length} categories`}
                  </div>
                </div>
              </div>

              {/* Summary Section */}
              <div className="bg-gradient-to-br from-[#CBDCEB]/20 to-[#456882]/10 rounded-2xl p-6 border border-[#CBDCEB]/50">
                <h4 className="text-lg font-semibold text-[#263b51] mb-4 flex items-center gap-2">
                  <CheckCircle className="text-[#456882]" size={20} />
                  Promo Code Summary
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-[#456882]">Code:</span>
                      <span className="font-mono font-bold text-[#263b51]">
                        {formData.code || "Not set"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#456882]">Discount:</span>
                      <span className="font-bold text-[#263b51]">
                        {formData.value > 0
                          ? formData.type === "percent"
                            ? `${formData.value}%`
                            : `₦${formData.value.toLocaleString()}`
                          : "Not set"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#456882]">Status:</span>
                      <span className="font-bold text-[#263b51] capitalize">
                        {formData.status}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-[#456882]">Max Uses:</span>
                      <span className="font-bold text-[#263b51]">
                        {formData.maxRedemptions || "Not set"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#456882]">Min Order:</span>
                      <span className="font-bold text-[#263b51]">
                        ₦{formData.minOrderTotal.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#456882]">Categories:</span>
                      <span className="font-bold text-[#263b51]">
                        {formData.applicableCategories.length || "All"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Footer with Step Navigation */}
          <div className="relative bg-gradient-to-r from-gray-50 to-white p-4 sm:p-6 border-t border-[#CBDCEB]/30">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
                {currentStep > 1 && (
                  <button
                    onClick={handlePrevious}
                    className="px-4 py-2 sm:px-6 sm:py-3 bg-gray-100 text-[#456882] rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium flex items-center gap-2 w-full sm:w-auto justify-center"
                  >
                    ← Previous
                  </button>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                <button
                  onClick={() => {
                    onClose();
                    resetForm();
                  }}
                  className="px-4 py-2 sm:px-6 sm:py-3 bg-gray-100 text-[#456882] rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium w-full sm:w-auto"
                >
                  Cancel
                </button>

                {currentStep < totalSteps ? (
                  <button
                    onClick={handleNext}
                    disabled={
                      currentStep === 1 &&
                      (!formData.code || !formData.maxRedemptions)
                    }
                    className="px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-[#456882] to-[#263b51] text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold flex items-center gap-2 justify-center w-full sm:w-auto"
                  >
                    Next →
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={!isFormValid}
                    className="px-4 py-2 sm:px-8 sm:py-3 bg-gradient-to-r from-[#263b51] to-[#456882] text-white rounded-xl hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-bold flex items-center gap-2 justify-center w-full sm:w-auto"
                  >
                    <Sparkles size={16} />
                    Create Promo Code
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
