export interface PaymentDetails {
  status: 'success' | 'failed' | 'pending';
  amount: number;
  reference: string;
  orderId?: string;
  transactionId?: string;
  paymentMethod?: string;
  timestamp?: string;
}