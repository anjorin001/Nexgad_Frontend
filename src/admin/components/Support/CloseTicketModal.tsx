import React, { useState } from 'react';
import { X, AlertTriangle, Trash2, Calendar, Tag, Percent, DollarSign, Users, Package, ChevronDown, Loader2 } from 'lucide-react';

interface CloseTicketProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  ticketId: string;
  isLoading?: boolean;
}

export const CloseTicketModal: React.FC<CloseTicketProps> = ({
  isOpen,
  onClose,
  onConfirm,
  ticketId,
  isLoading = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full shadow-lg">
        {/* Header */}
        <div className="bg-[#1B3C53] p-6 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">Close Ticket</h2>
            </div>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="p-2 hover:bg-white/20 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <p className="text-[#456882] text-lg mb-4">
              Are you sure you want to close this ticket ?
            </p>
            <div className="bg-[#CBDCEB]/20 border border-[#CBDCEB] rounded-lg p-4">
              <p className="text-sm text-[#456882] mb-2">Ticket ID:</p>
              <p className="text-[#1B3C53] font-bold text-xl font-mono">{ticketId}</p>
            </div>
          </div>


          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-gray-200 text-[#456882] rounded-lg hover:bg-gray-300 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Closing...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Close
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

