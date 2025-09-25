import { Check, Clock } from "lucide-react";
import type React from "react";

interface SubmitedModalProps {
  onClose: () => void;
  requestId: string;
}

export const SubmitedModal: React.FC<SubmitedModalProps> = ({
  onClose,
  requestId,
}) => {
  return (
    <div>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Request Submitted Successfully!
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              We've received your gadget request and our team is already working
              on it.
            </p>
            <div className="bg-blue-50 rounded-2xl p-6 mb-6">
              <p className="text-sm text-gray-500 mb-2">Your Request ID</p>
              <p className="text-2xl font-mono font-bold text-blue-600">
                {requestId}
              </p>
            </div>
            <div className="flex items-center justify-center text-amber-600 mb-6">
              <Clock className="w-5 h-5 mr-2" />
              <span className="font-medium">We'll reply within 48 hours</span>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => onClose()}
                className="w-full bg-[#263b51] text-white font-semibold py-4 px-6 rounded-2x transition-all duration-300 transform hover:scale-105"
              >
                Submit Another Request
              </button>
              <button className="w-full bg-gray-100 text-gray-700 font-semibold py-4 px-6 rounded-2xl hover:bg-gray-200 transition-colors">
                Browse Our Gadgets
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitedModal;
