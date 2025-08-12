import { MessageCircle, Send } from "lucide-react";
import { useState } from "react";
import { CreateOfferModal } from "./CreateOfferModel";
import type { UserRequest } from "./RequestTable";

interface ChatPanelProps {
  request: UserRequest;
  onToggleChat: (enabled: boolean) => void;
  onCreateOffer: (price: string) => void;
  onCloseOffer: () => void;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  request,
  onToggleChat,
  onCreateOffer,
  onCloseOffer,
}) => {
  const [newMessage, setNewMessage] = useState("");
  const [showOfferModal, setShowOfferModal] = useState(false);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In real app, this would call an API
      console.log("Sending message:", newMessage);
      setNewMessage("");
    }
  };

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
            <span style={{ color: "#263b51" }}>{request.userName}</span>
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
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 min-h-0">
        {request.chatMessages && request.chatMessages.length > 0 ? (
          request.chatMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "admin" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs sm:max-w-sm lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === "admin"
                    ? "bg-blue-500 text-white"
                    : "bg-white border border-gray-200"
                }`}
                style={message.sender === "user" ? { color: "#263b51" } : {}}
              >
                <p className="text-sm break-words">{message.message}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.sender === "admin"
                      ? "text-blue-100"
                      : "text-gray-500"
                  }`}
                >
                  {new Date(message.timestamp).toLocaleTimeString()}
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
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ color: "#263b51" }}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            disabled={!request.chatEnabled}
          />
          <button
            onClick={handleSendMessage}
            disabled={!request.chatEnabled || !newMessage.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onToggleChat(!request.chatEnabled)}
            className={`px-3 py-2 text-sm rounded-md border transition-colors flex-shrink-0 ${
              request.chatEnabled
                ? "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                : "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
            }`}
          >
            {request.chatEnabled ? "Disable Chat" : "Enable Chat"}
          </button>

          {request.status === "in-progress" && (
            <button
              onClick={() => setShowOfferModal(true)}
              className="px-3 py-2 text-sm bg-green-50 text-green-700 border border-green-200 rounded-md hover:bg-green-100 transition-colors flex-shrink-0"
            >
              Create Offer
            </button>
          )}

          {request.status === "offer-made" && (
            <button
              onClick={onCloseOffer}
              className="px-3 py-2 text-sm bg-red-50 text-red-700 border border-red-200 rounded-md hover:bg-red-100 transition-colors flex-shrink-0"
            >
              Close Offer
            </button>
          )}
        </div>
      </div>

      <CreateOfferModal
        isOpen={showOfferModal}
        onClose={() => setShowOfferModal(false)}
        onConfirm={onCreateOffer}
        requestId={request.id}
      />
    </div>
  );
};
