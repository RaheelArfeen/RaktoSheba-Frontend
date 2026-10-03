import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Thank you", robots: { index: false } };

// Stripe redirects here after checkout with ?paymentId=… (see backend CLIENT_SUCCESS_URL).
export default async function PaymentSuccessPage({ searchParams }: PageProps<"/payment/success">) {
  const { paymentId } = await searchParams;
  const reference = typeof paymentId === "string" ? paymentId.slice(0, 8).toUpperCase() : null;

  return (
    <section className="page-container py-20">
      <div className="mx-auto max-w-lg rounded-[30px] bg-mint p-8 text-center sm:p-10">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-mint-strong text-forest">
          <CheckCircle2 className="size-8" />
        </span>
        <h1 className="mt-6 font-display text-5xl leading-[.95] tracking-[-.06em] text-forest-deep">Thank you.</h1>
        <p className="mt-4 leading-7 text-[#4a806c]">
          Your contribution helps the next donor reach the next patient. Stripe will email your receipt.
        </p>
        {reference && (
          <p className="mt-5 inline-block rounded-full bg-cream/70 px-4 py-1.5 text-xs font-bold tracking-[.12em] text-forest uppercase">
            Reference {reference}
          </p>
        )}
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild variant="secondary">
            <Link href="/requests">
              <HeartHandshake /> See who needs blood
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Back home</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
