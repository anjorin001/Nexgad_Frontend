type ConnectionStatus =
  | "connecting"
  | "open"
  | "closed"
  | "error"
  | "chat-disabled";

export function getStatusClasses(status: ConnectionStatus) {
  switch (status) {
    case "connecting":
      return { bg: "bg-yellow-100", text: "text-yellow-800", dot: "bg-yellow-500", label: "Connecting" };
    case "open":
      return { bg: "bg-green-100", text: "text-green-800", dot: "bg-green-500", label: "Connected" };
    case "closed":
      return { bg: "bg-gray-100", text: "text-gray-700", dot: "bg-gray-400", label: "Closed" };
    case "error":
      return { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500", label: "Error" };
    case "chat-disabled":
      return { bg: "bg-indigo-50", text: "text-indigo-700", dot: "bg-indigo-500", label: "Chat disabled" };
    default:
      return { bg: "bg-gray-100", text: "text-gray-700", dot: "bg-gray-400", label: String(status) };
  }
}
