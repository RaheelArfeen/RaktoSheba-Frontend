import { CheckCircle2, HeartHandshake } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

/** Shown after Stripe Checkout succeeds. `reference` is the short payment id from the redirect. */
export function PaymentSuccessView({ reference }: { reference: string | null }) {
  return (
    <Container className="py-20">
      <div className="mx-auto max-w-lg rounded-[30px] bg-mint p-8 text-center sm:p-10">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-mint-strong text-forest">
          <CheckCircle2 className="size-8" />
        </span>
        <h1 className="mt-6 font-display text-5xl leading-[.95] tracking-[-.06em] text-forest-deep">Thank you.</h1>
        <p className="mt-4 leading-7 text-[#4a806c]">Your contribution helps the next donor reach the next patient. Stripe will email your receipt.</p>
        {reference && (
          <p className="mt-5 inline-block rounded-full bg-cream/70 px-4 py-1.5 text-xs font-bold tracking-[.12em] text-forest uppercase">Reference {reference}</p>
        )}
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href="/requests" variant="forest">
            <HeartHandshake /> See who needs blood
          </ButtonLink>
          <ButtonLink href="/" variant="outline">
            Back home
          </ButtonLink>
        </div>
      </div>
    </Container>
  );
}
