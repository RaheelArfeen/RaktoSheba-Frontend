import { RotateCcw, XCircle } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

/** Shown when the payer backs out of Stripe Checkout. */
export function PaymentCancelView() {
  return (
    <Container className="py-20">
      <div className="mx-auto max-w-lg rounded-[30px] border border-ink/10 bg-cream p-8 text-center sm:p-10">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-blush text-blood">
          <XCircle className="size-8" />
        </span>
        <h1 className="mt-6 font-display text-5xl leading-[.95] tracking-[-.06em]">Payment cancelled.</h1>
        <p className="mt-4 leading-7 text-ink-muted">No money was taken. You can try again whenever you&apos;re ready.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href="/fund">
            <RotateCcw /> Try again
          </ButtonLink>
          <ButtonLink href="/" variant="outline">
            Back home
          </ButtonLink>
        </div>
      </div>
    </Container>
  );
}
