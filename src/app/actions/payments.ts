"use server";

import { redirect } from "next/navigation";
import { ApiError } from "@/lib/api";
import { paymentsApi } from "@/lib/payments";
import { getSession } from "@/lib/session";
import { fundSchema, type FundInput } from "@/lib/validations";

/** Creates a Stripe Checkout session for a fund contribution and sends the payer to Stripe. */
export async function startCheckout(values: FundInput): Promise<{ error: string } | void> {
  const session = await getSession();
  if (!session) {
    redirect(`/auth/login?next=${encodeURIComponent(`/fund?amount=${values.amount}&purpose=${values.purpose}`)}`);
  }

  const parsed = fundSchema.safeParse(values);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the amount and try again." };

  let checkoutUrl: string | null;
  try {
    ({ checkoutUrl } = await paymentsApi.initiate(session.accessToken, parsed.data));
  } catch (error) {
    return { error: error instanceof ApiError ? error.message : "We couldn't start the payment. Please try again." };
  }
  if (!checkoutUrl) return { error: "Stripe didn't return a checkout page. Please try again." };
  redirect(checkoutUrl);
}
