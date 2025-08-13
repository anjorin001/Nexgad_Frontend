import { X } from "lucide-react";
import { useState } from "react";

interface CreateOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (price: string) => void;
  requestId: string;
}

export const CreateOfferModal: React.FC<CreateOfferModalProps> = ({ isOpen, onClose, onConfirm, requestId }) => {
  const [price, setPrice] = useState('');

  const handleConfirm = () => {
    if (price.trim()) {
      onConfirm(price);
      setPrice('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#263b51]/40 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-90vw">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold" style={{ color: '#263b51' }}>
            Create Offer - {requestId}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" style={{ color: '#263b51' }}>
            Offer Price
          </label>
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter price (e.g., $299)"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ color: '#263b51' }}
          />
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleConfirm}
            className="flex-1 py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Confirm Offer
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 bg-gray-300 rounded-md hover:bg-gray-400 transition-colors"
            style={{ color: '#263b51' }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};