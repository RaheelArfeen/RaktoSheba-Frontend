import type { Metadata } from "next";
import { PaymentCancelView } from "./payment-cancel-view";

export const metadata: Metadata = { title: "Payment cancelled", robots: { index: false } };

// Stripe redirects here if the payer backs out of checkout (see backend CLIENT_CANCEL_URL).
export default function PaymentCancelPage() {
  return <PaymentCancelView />;
}
