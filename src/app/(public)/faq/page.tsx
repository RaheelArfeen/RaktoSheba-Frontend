import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import FaqList from "@/components/shared/FaqList";
import PageHeader from "@/components/shared/PageHeader";
import { faqs } from "@/lib/content";

export const metadata: Metadata = {
  title: "Frequently asked questions",
  description: "How blood requests, donor matching, eligibility and privacy work on RaktoSheba.",
};

// FAQPage structured data helps search engines show these answers directly.
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
};

export default function FaqPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <PageHeader
        eyebrow="Questions, answered"
        title="Everything you need to know."
        description="How requests are verified, how donors are matched, and how we keep everyone safe."
      />
      <section className="page-container grid gap-10 py-14 lg:grid-cols-[1.3fr_.7fr] lg:items-start">
        <FaqList />
        <aside className="rounded-[26px] bg-maroon p-7 text-cream lg:sticky lg:top-28">
          <p className="eyebrow text-mint-strong">Still have questions?</p>
          <p className="mt-3 font-display text-3xl leading-[1.02] tracking-[-.04em]">Our team is happy to help.</p>
          <p className="mt-3 text-sm leading-6 text-[#f2d8ca]/80">Send us a message and we&apos;ll reply within one working day.</p>
          <Button asChild className="mt-6 bg-cream text-blood shadow-none hover:bg-white">
            <Link href="/contact">
              Contact us <ArrowRight />
            </Link>
          </Button>
        </aside>
      </section>
    </>
  );
}
