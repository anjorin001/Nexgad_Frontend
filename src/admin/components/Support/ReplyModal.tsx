import { Loader2, Send, X } from "lucide-react";
import type React from "react";

interface ReplyModalProp {
  replyTicketNumber: string;
  replyTicketId: string;
  onClose: () => void; // setReplyTicketId(null)
  onSendReply: () => void;
  isReplyLoading: boolean;
  onSetReplyMessage: (wrd: string) => void;
  replyMessage: string;
}

export const ReplyModal: React.FC<ReplyModalProp> = ({
  onClose,
  replyTicketNumber,
  isReplyLoading,
  onSendReply,
  onSetReplyMessage,
  replyMessage,
}) => {
  return (
    <div className="fixed  inset-0 bg-[#263b51]/40 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold" style={{ color: "#263b51" }}>
              Reply to Ticket {replyTicketNumber}
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "#456882" }}
            >
              Your Message
            </label>
            <textarea
              value={replyMessage}
              onChange={(e) => onSetReplyMessage(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 h-32"
              style={{ borderColor: "#CBDCEB" }}
              placeholder="Type your response here..."
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border rounded-md font-medium"
              style={{ borderColor: "#CBDCEB", color: "#456882" }}
            >
              Cancel
            </button>
            <button
              onClick={() => onSendReply()}
              className="flex-1 px-4 py-2 text-white rounded-md font-medium flex items-center justify-center gap-2"
              style={{ backgroundColor: "#263b51" }}
              disabled={replyMessage === null || !replyMessage.trim() || isReplyLoading}
            >
              {isReplyLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Reply
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReplyModal;
