import type { Metadata } from "next";
import { paymentsApi } from "@/lib/payments";
import { getSession } from "@/lib/session";
import { PaymentSuccessView } from "./payment-success-view";

export const metadata: Metadata = { title: "Payment", robots: { index: false } };

// Stripe redirects here after checkout with ?paymentId=… (see backend CLIENT_SUCCESS_URL).
export default async function PaymentSuccessPage({ searchParams }: PageProps<"/payment/success">) {
  const { paymentId } = await searchParams;
  const id = typeof paymentId === "string" ? paymentId : null;
  const session = await getSession();
  // Only the payer (or an admin) can read a payment; if we can't, fall back to a general thank-you.
  const payment = id && session ? await paymentsApi.byId(session.accessToken, id).catch(() => null) : null;
  return <PaymentSuccessView reference={id ? id.slice(0, 8).toUpperCase() : null} payment={payment} />;
}
