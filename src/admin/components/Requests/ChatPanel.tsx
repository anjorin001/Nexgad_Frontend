import { Loader2, MessageCircle, Send } from "lucide-react";
import { useState } from "react";
import {
  UserRole,
  type IGadgetRequest,
} from "../../../components/gadgetRequestComponents/gadgetRequestInterface";
import Loader from "../../../components/nexgadMidPageLoader";
import type { ChatMessage } from "../../../hooks/useChat";
import { getStatusClasses } from "../../../utils/SseGetStatusColour";
import { CreateOfferModal } from "./CreateOfferModel";

interface ChatPanelProps {
  isCloseOfferLoading: boolean;
  isCreateOfferLoading: boolean;
  isSending: boolean;
  request: IGadgetRequest;
  text: string;
  messages: ChatMessage[];
  onToggleChat: (enabled: boolean) => void;
  onCreateOffer: (price: string) => Promise<void>;
  onCloseOffer: () => void;
  isToggleChatLoading: boolean;
  onSendMessage: () => void;
  onSetText: (value: string) => void;
  connectionStatus: any;
  isMessageLoading: boolean;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  request,
  onToggleChat,
  onCreateOffer,
  onCloseOffer,
  isCloseOfferLoading,
  isCreateOfferLoading,
  isToggleChatLoading,
  connectionStatus,
  isMessageLoading,
  isSending,
  onSendMessage,
  onSetText,
  messages,
  text,
}) => {
  const [showOfferModal, setShowOfferModal] = useState(false);

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("en-GB", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  const cls = getStatusClasses(connectionStatus as any);
  return (
    <div className="h-full flex flex-col min-h-96 lg:min-h-0">
      {/* Request Info Summary */}
      <div
        className="p-4 border-b flex-shrink-0"
        style={{ backgroundColor: "#CBDCEB" }}
      >
        <h3 className="font-semibold text-lg mb-2" style={{ color: "#263b51" }}>
          {request.productName}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          <div>
            <span className="font-medium" style={{ color: "#456882" }}>
              User:
            </span>{" "}
            <span
              style={{ color: "#263b51" }}
            >{`${request.userId.firstName} ${request.userId.lastName}`}</span>
          </div>
          <div>
            <span className="font-medium" style={{ color: "#456882" }}>
              Category:
            </span>{" "}
            <span style={{ color: "#263b51" }}>{request.category}</span>
          </div>
          <div>
            <span className="font-medium" style={{ color: "#456882" }}>
              Budget:
            </span>{" "}
            <span style={{ color: "#263b51" }}>{request.budgetRange}</span>
          </div>
          <div>
            <span className="font-medium" style={{ color: "#456882" }}>
              Quantity:
            </span>{" "}
            <span style={{ color: "#263b51" }}>{request.quantity}</span>
          </div>
          <div>
            <span
              role="status"
              aria-live="polite"
              className={`inline-flex items-center gap-2 text-sm font-medium px-2.5 py-1 rounded-full ${cls.bg} ${cls.text}`}
              title={cls.label}
            >
              <span
                className={`w-2.5 h-2.5 rounded-full ${cls.dot}`}
                aria-hidden="true"
              />
              <span>{cls.label}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 min-h-0">
        {isMessageLoading || connectionStatus === "connecting" ? (
          <div className="flex justify-center align-middle">
            <div className="col-span-full flex justify-center items-center py-12">
              <Loader size={23} thickness={1} />
            </div>
          </div>
        ) : messages.length > 0 ? (
          messages.map((message) => (
            <div
              key={message._id || Date.now()}
              className={`flex ${
                message.senderRole === UserRole.ADMIN
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs sm:max-w-sm lg:max-w-md px-4 py-2 rounded-lg ${
                  message.senderRole === UserRole.ADMIN
                    ? "bg-blue-500 text-white"
                    : "bg-white border border-gray-200"
                }`}
                style={
                  message.senderRole === UserRole.USER
                    ? { color: "#263b51" }
                    : {}
                }
              >
                <p className="text-sm break-words">{message.message}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.senderRole === UserRole.ADMIN
                      ? "text-blue-100"
                      : "text-gray-500"
                  }`}
                >
                  {formatTimestamp(
                    message.createdAt ?? new Date().toISOString()
                  )}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8" style={{ color: "#456882" }}>
            <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No messages yet</p>
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t bg-white flex-shrink-0">
        <div className="flex flex-col sm:flex-row gap-2 mb-3">
          <input
            type="text"
            value={text}
            onChange={(e) => onSetText(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ color: "#263b51" }}
            onKeyPress={(e) => e.key === "Enter" && onSendMessage()}
            disabled={!request.chatEnabled}
          />
          <button
            onClick={onSendMessage}
            disabled={!request.chatEnabled || !text.trim() || isSending}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex-shrink-0"
          >
            {isSending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
              </>
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onToggleChat(!request.chatEnabled)}
            disabled={isToggleChatLoading}
            className={`inline-flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-md border transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed ${
              request.chatEnabled
                ? "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                : "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
            }`}
            aria-busy={isToggleChatLoading}
          >
            {isToggleChatLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {request.chatEnabled ? "Disabling..." : "Enabling..."}
              </>
            ) : request.chatEnabled ? (
              "Disable Chat"
            ) : (
              "Enable Chat"
            )}
          </button>

          {request.status === "in-progress" && (
            <button
              type="button"
              onClick={() => setShowOfferModal(true)}
              disabled={isCreateOfferLoading}
              className="inline-flex items-center justify-center gap-2 px-3 py-2 text-sm bg-green-50 text-green-700 border border-green-200 rounded-md hover:bg-green-100 transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-busy={isCreateOfferLoading}
            >
              {isCreateOfferLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Offer"
              )}
            </button>
          )}

          {request.status === "in-progress" && (
            <button
              type="button"
              onClick={onCloseOffer}
              disabled={isCloseOfferLoading}
              className="inline-flex items-center justify-center gap-2 px-3 py-2 text-sm bg-red-50 text-red-700 border border-red-200 rounded-md hover:bg-red-100 transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-busy={isCloseOfferLoading}
            >
              {isCloseOfferLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Closing...
                </>
              ) : (
                "Close Offer"
              )}
            </button>
          )}
        </div>
      </div>

      <CreateOfferModal
        isCreateOfferLoading={isCreateOfferLoading}
        isOpen={showOfferModal}
        onClose={() => setShowOfferModal(false)}
        onConfirm={onCreateOffer}
        requestId={request.requestId}
      />
    </div>
  );
};
