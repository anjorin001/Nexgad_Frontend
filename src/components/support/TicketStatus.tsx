import { Circle } from "lucide-react";
import { statusConfig, type SupportTicket } from "./types";

interface StatusBadgeProps {
  status: SupportTicket["status"];
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const config = statusConfig[status];
  const IconComponent = config?.icon || Circle;

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${config?.color}`}
    >
      <IconComponent className="w-3 h-3 mr-1" />
      {config?.label}
    </span>
  );
};
