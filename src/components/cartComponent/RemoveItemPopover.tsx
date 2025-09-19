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
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full mx-4 border border-[#CBDCEB]">
        <div className="bg-[#1B3C53] p-6 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Remove from cart</h3>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded bg-[#456882] hover:bg-[#CBDCEB] hover:text-[#1B3C53] transition-colors duration-200 flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded bg-[#CBDCEB]/30 flex items-center justify-center">
              <Trash2 className="w-8 h-8 text-[#456882]" />
            </div>
            <p className="text-lg text-[#1B3C53] leading-relaxed">
              Do you really want to remove <span className="font-semibold">{itemName}</span> from cart?
            </p>
          </div>

          <div className="space-y-3">
            {onSaveForLater && (
              <button
                onClick={() => {
                  onSaveForLater();
                  onClose();
                }}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-[#CBDCEB] text-[#1B3C53] rounded font-semibold hover:bg-[#456882] hover:text-white transition-colors duration-200"
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
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-red-600 text-white rounded font-semibold hover:bg-red-700 transition-colors duration-200"
            >
              <Trash2 className="w-5 h-5" />
              Remove Item
            </button>

            <button
              onClick={onClose}
              className="w-full py-3 px-4 bg-gray-100 text-[#456882] rounded font-semibold hover:bg-gray-200 transition-colors duration-200"
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
