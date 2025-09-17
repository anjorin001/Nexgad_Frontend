import { Bookmark, Trash2, X } from "lucide-react";
import React from "react";

interface CartRemovePopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onRemove: () => void;
  onSaveForLater?: () => void;
  itemName?: string;
}

const CartRemovePopover: React.FC<CartRemovePopoverProps> = ({
  isOpen,
  onClose,
  onRemove,
  onSaveForLater,
  itemName = "this item",
}) => {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden border border-[#CBDCEB]">
        <div className="bg-[#1B3C53] p-6 text-white">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Remove from cart</h3>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200 flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#CBDCEB]/30 flex items-center justify-center">
              <Trash2 className="w-8 h-8 text-[#456882]" />
            </div>
            <p className="text-lg text-[#1B3C53] leading-relaxed">
              Do you really want to remove{" "}
              <span className="font-semibold">{itemName}</span> from cart?
            </p>
          </div>

          <div className="space-y-3">
            {onSaveForLater && (
              <button
                onClick={() => {
                  onSaveForLater();
                  onClose();
                }}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-[#CBDCEB] text-[#1B3C53] rounded-xl font-semibold hover:bg-[#456882] hover:text-white transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <Bookmark className="w-5 h-5" />
                Save for later
              </button>
            )}

            <button
              onClick={() => {
                onRemove();
                onClose();
              }}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
            >
              <Trash2 className="w-5 h-5" />
              Remove Item
            </button>

            <button
              onClick={onClose}
              className="w-full py-3 px-4 bg-gray-100 text-[#456882] rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartRemovePopover;
