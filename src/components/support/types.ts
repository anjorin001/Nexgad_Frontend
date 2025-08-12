import { AlertCircle, CheckCircle, Clock, X } from "lucide-react";

export interface Order {
  id: string;
  productName: string;
  orderDate: string;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
}

export interface TicketFormData {
  orderId?: string;
  userId: string;
  category: 'Wrong Item' | 'Damaged Item' | 'Late Delivery' | 'Payment Issue' | 'General Support';
  description: string;
  attachments: File[];
  status: 'open';
}

export interface FileUploadProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
}

export interface SupportTicket {
  id: string;
  orderId?: string;
  orderInfo?: Order;
  userId: string;
  category: string;
  description: string;
  attachments: string[];
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
}

export const complaintCategories = [
  'Wrong Item',
  'Damaged Item', 
  'Late Delivery',
  'Payment Issue',
  'General Support'
] as const;

export const statusConfig = {
  'open': { 
    color: 'bg-blue-100 text-blue-800 border-blue-200', 
    icon: AlertCircle,
    label: 'Open' 
  },
  'in_progress': { 
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
    icon: Clock,
    label: 'In Progress' 
  },
  'resolved': { 
    color: 'bg-green-100 text-green-800 border-green-200', 
    icon: CheckCircle,
    label: 'Resolved' 
  },
  'closed': { 
    color: 'bg-gray-100 text-gray-800 border-gray-200', 
    icon: X,
    label: 'Closed' 
  }
};