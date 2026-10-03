import { CheckCircle2, Clock, HeartHandshake, XCircle } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { Payment } from "@/types";

const states = {
  PAID: { icon: CheckCircle2, title: "Thank you.", text: "Your payment went through. It helps the next donor reach the next patient.", tone: "bg-mint", ink: "text-forest-deep", sub: "text-[#4a806c]", iconTone: "bg-mint-strong text-forest" },
  PENDING: { icon: Clock, title: "Almost there.", text: "Stripe is still confirming your payment. Refresh this page in a moment.", tone: "bg-sand", ink: "text-sand-deep", sub: "text-ink-muted", iconTone: "bg-gold text-sand-deep" },
  FAILED: { icon: XCircle, title: "Payment didn't go through.", text: "No money was taken. You can try again from the fund page.", tone: "bg-blush", ink: "text-blood-deep", sub: "text-ink-muted", iconTone: "bg-blush-deep text-blood" },
};

/**
 * Shown after Stripe Checkout. With a signed-in payer we show the real status
 * (the backend confirms it with Stripe); otherwise a general thank-you.
 */
export function PaymentSuccessView({ reference, payment }: { reference: string | null; payment: Payment | null }) {
  const state = states[payment?.status ?? "PAID"];
  const Icon = state.icon;

  return (
    <Container className="py-20">
      <div className={cn("mx-auto max-w-lg rounded-[30px] p-8 text-center sm:p-10", state.tone)}>
        <span className={cn("mx-auto grid size-16 place-items-center rounded-full", state.iconTone)}>
          <Icon className="size-8" />
        </span>
        <h1 className={cn("mt-6 font-display text-5xl leading-[.95] tracking-[-.06em]", state.ink)}>{state.title}</h1>
        <p className={cn("mt-4 leading-7", state.sub)}>{state.text}</p>
        {payment && (
          <p className={cn("mt-5 font-display text-3xl", state.ink)}>
            {formatCurrency(payment.amount, payment.currency)}
            <span className="ml-2 font-sans text-xs font-bold tracking-[.12em] uppercase opacity-70">{payment.purpose === "EMERGENCY_FUND" ? "Emergency fund" : "Platform"}</span>
          </p>
        )}
        {reference && <p className="mt-5 inline-block rounded-full bg-cream/70 px-4 py-1.5 text-xs font-bold tracking-[.12em] text-ink-muted uppercase">Reference {reference}</p>}
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          {payment?.status === "FAILED" ? (
            <ButtonLink href="/fund">Try again</ButtonLink>
          ) : (
            <ButtonLink href="/requests" variant="forest">
              <HeartHandshake /> See who needs blood
            </ButtonLink>
          )}
          <ButtonLink href="/" variant="outline">
            Back home
          </ButtonLink>
        </div>
      </div>
    </Container>
  );
}
