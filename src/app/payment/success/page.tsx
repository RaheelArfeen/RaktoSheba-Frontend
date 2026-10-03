import type { Metadata } from "next";
import { PaymentSuccessView } from "./payment-success-view";

export const metadata: Metadata = { title: "Thank you", robots: { index: false } };

// Stripe redirects here after checkout with ?paymentId=… (see backend CLIENT_SUCCESS_URL).
export default async function PaymentSuccessPage({ searchParams }: PageProps<"/payment/success">) {
  const { paymentId } = await searchParams;
  const reference = typeof paymentId === "string" ? paymentId.slice(0, 8).toUpperCase() : null;
  return <PaymentSuccessView reference={reference} />;
}
