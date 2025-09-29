import { Loader2 } from "lucide-react";
import React from "react";

interface DeleteModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  show,
  onClose,
  onConfirm,
  title = "Are you sure you want to delete?"
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-[#263b51]/40 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-[#edf0f4] rounded-2xl p-6 max-w-md w-full">
        <p className="text-xl font-bold text-gray-800 mb-4">{title}</p>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 bg-[#263b51] text-white py-3 px-4 rounded-md hover:bg-[#172839] transition-colors font-medium"
          >
            Keep Product
          </button>
          <button
            onClick={() => (onConfirm(), onClose())}
            className="flex-1 bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 transition-colors font-medium"
          >
            Delete Product
          </button>
        </div>
      </div>
    </div>
  );
};
