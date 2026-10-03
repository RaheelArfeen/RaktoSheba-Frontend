import type { Metadata } from "next";
import Link from "next/link";
import { RotateCcw, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Payment cancelled", robots: { index: false } };

// Stripe redirects here if the payer backs out of checkout (see backend CLIENT_CANCEL_URL).
export default function PaymentCancelPage() {
  return (
    <section className="page-container py-20">
      <div className="mx-auto max-w-lg rounded-[30px] border border-ink/10 bg-cream p-8 text-center sm:p-10">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-blush text-blood">
          <XCircle className="size-8" />
        </span>
        <h1 className="mt-6 font-display text-5xl leading-[.95] tracking-[-.06em]">Payment cancelled.</h1>
        <p className="mt-4 leading-7 text-ink-muted">No money was taken. You can try again whenever you&apos;re ready.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/fund">
              <RotateCcw /> Try again
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
