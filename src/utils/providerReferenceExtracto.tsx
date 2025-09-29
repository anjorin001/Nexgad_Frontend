export type PaymentReference =
  | { provider: "paystack"; reference: string }
  | { provider: "flutterwave"; txRef: string; transactionId: string };

export function extractPaymentReference(
  url?: string
): PaymentReference | null {
  const targetUrl =
    url ?? (typeof window !== "undefined" ? window.location.href : "");
  if (!targetUrl) return null;

  const params = new URLSearchParams(new URL(targetUrl).search);

  const paystackRef = params.get("reference");
  if (paystackRef) {
    return { provider: "paystack", reference: paystackRef };
  }

  const txRef = params.get("tx_ref");
  const transactionId = params.get("transaction_id");
  if (txRef && transactionId) {
    return { provider: "flutterwave", txRef, transactionId };
  }

  return null;
}
