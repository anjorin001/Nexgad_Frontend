import React from "react";

interface ConfirmModalProps {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: string; 
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmColor = "red",
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-2xl">
        <h3
          className={`text-2xl font-bold text-${confirmColor}-600 mb-4`}
        >
          {title}
        </h3>
        <p className="text-[#456882] mb-6 text-lg leading-relaxed">
          {message}
        </p>

        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className={`flex-1 bg-${confirmColor}-500 text-white py-3 px-4 rounded-lg hover:bg-${confirmColor}-600 transition-all duration-200 font-medium`}
          >
            {confirmText}
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 transition-all duration-200 font-medium"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
