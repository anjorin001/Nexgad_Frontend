import { ChevronDown, Clock, Send, X } from "lucide-react";
import { useState } from "react";
import { FileUpload } from "./FileUpload";
import { complaintCategories, type Order, type TicketFormData } from "./types";

interface TicketFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TicketFormData) => void;
  orderId?: string;
  orderInfo?: Order;
}

export const TicketFormModal: React.FC<TicketFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  orderId,
  orderInfo,
}) => {
  const [formData, setFormData] = useState<
    Omit<TicketFormData, "userId" | "status">
  >({
    orderId: orderId || "",
    category: "General Support",
    description: "",
    attachments: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formData.description.trim()) return;

    setIsSubmitting(true);

    try {
      const ticketData: TicketFormData = {
        ...formData,
        orderId: orderId,
        userId: "USER-456", // This would come from auth state
        status: "open",
      };

      await onSubmit(ticketData);

      // Reset form
      setFormData({
        orderId: orderId || "",
        category: "General Support",
        description: "",
        attachments: [],
      });
      onClose();
    } catch (error) {
      console.error("Error submitting ticket:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed  inset-0 bg-[#263b51]/40 backdrop-blur-md  flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div
          className="p-4 sm:p-6 border-b flex justify-between items-center flex-shrink-0"
          style={{ backgroundColor: "#CBDCEB" }}
        >
          <div>
            <h2 className="text-xl font-semibold" style={{ color: "#263b51" }}>
              {orderId ? "Report Order Issue" : "Submit Support Ticket"}
            </h2>
            {orderInfo && (
              <p className="text-sm mt-1" style={{ color: "#456882" }}>
                Order: {orderInfo.productName} ({orderInfo.id})
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="space-y-6">
            {/* Category Selection */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "#263b51" }}
              >
                Issue Category *
              </label>
              <div className="relative">
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      category: e.target.value as TicketFormData["category"],
                    }))
                  }
                  className="w-full appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ color: "#263b51" }}
                  required
                >
                  {complaintCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none"
                  style={{ color: "#456882" }}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "#263b51" }}
              >
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Please describe your issue in detail..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
                style={{ color: "#263b51" }}
                required
              />
            </div>

            {/* File Upload */}
            <FileUpload
              files={formData.attachments}
              onFilesChange={(files) =>
                setFormData((prev) => ({ ...prev, attachments: files }))
              }
            />

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!formData.description.trim() || isSubmitting}
                className="flex-1 flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors order-2 sm:order-1"
              >
                {isSubmitting ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Ticket
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-gray-300 rounded-md hover:bg-gray-400 transition-colors order-1 sm:order-2"
                style={{ color: "#263b51" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
