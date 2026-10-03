import type { CheckoutSession, Payment, PaymentPurpose } from "@/types";
import { api } from "./api";

// Payments require a signed-in user; the token comes from the session (Phase 3).
export const paymentsApi = {
  /** Starts a Stripe Checkout session and returns its URL to redirect to. */
  initiate: (token: string, input: { amount: number; purpose: PaymentPurpose; requestId?: string }) =>
    api<CheckoutSession>("/payments/initiate", { method: "POST", token, body: input }),

  /** Fetches a payment; the backend confirms pending ones with Stripe before answering. */
  byId: (token: string, id: string) => api<Payment>(`/payments/${id}`, { token, cache: "no-store" }),
};
