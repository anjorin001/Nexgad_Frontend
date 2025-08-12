import { CheckCircle, X } from "lucide-react";
import React from "react";

interface SuccessToastProps {
  show: boolean;
  message: string;
  onClose: () => void;
}

export const SuccessToast: React.FC<SuccessToastProps> = ({
  show,
  message,
  onClose,
}) => {
  React.useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-md shadow-lg flex items-center z-50">
      <CheckCircle className="w-5 h-5 mr-2" />
      <span>{message}</span>
      <button onClick={onClose} className="ml-3 hover:text-green-200">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
