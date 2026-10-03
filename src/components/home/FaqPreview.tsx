import Link from "next/link";
import { MessageCircleQuestion } from "lucide-react";
import FaqList from "@/components/shared/FaqList";

export default function FaqPreview() {
  return (
    <section className="page-container pb-24">
      <div className="grid gap-10 lg:grid-cols-[.75fr_1.25fr] lg:items-start">
        <div>
          <p className="eyebrow mb-4 text-blood">Questions, answered</p>
          <h2 className="font-display text-5xl leading-[.96] tracking-[-.06em] sm:text-6xl">A clearer way to care.</h2>
          <p className="mt-6 max-w-[370px] leading-7 text-ink-muted">
            If you are new to the network, start here. The rest of the journey stays simple.
          </p>
          <div className="mt-7 flex items-center gap-3 text-sm font-bold text-ink-muted">
            <MessageCircleQuestion size={19} className="text-blood" /> More questions?{" "}
            <Link href="/faq" className="text-blood hover:underline">
              Read the full FAQ
            </Link>
          </div>
        </div>
        <FaqList limit={4} />
      </div>
    </section>
  );
}
