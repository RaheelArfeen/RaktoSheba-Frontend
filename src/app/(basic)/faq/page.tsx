import type { Metadata } from "next";
import { FaqAccordion } from "@/components/home/faq";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ArrowRight } from "lucide-react";
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
      <section className="relative overflow-hidden border-b border-ink/10">
        <div className="absolute -top-24 -right-24 -z-10 size-[380px] rounded-full bg-mint/40 blur-3xl" />
        <Container className="py-14 sm:py-16">
          <Eyebrow>Questions, answered</Eyebrow>
          <h1 className="mt-4 max-w-[820px] font-display text-5xl leading-[1.08] tracking-[-.02em] sm:text-6xl">Everything you need to know.</h1>
          <p className="mt-5 max-w-[620px] text-[17px] leading-8 text-ink-muted">
            How requests are verified, how donors are matched, and how we keep everyone safe.
          </p>
        </Container>
      </section>
      <Container className="grid gap-10 py-14 lg:grid-cols-[1.3fr_.7fr] lg:items-start">
        <FaqAccordion />
        <aside className="rounded-[26px] bg-maroon p-7 text-cream lg:sticky lg:top-28">
          <Eyebrow className="text-mint-strong">Still have questions?</Eyebrow>
          <p className="mt-3 font-display text-3xl leading-[1.15] tracking-[-.01em]">Our team is happy to help.</p>
          <p className="mt-3 text-sm leading-6 text-[#f2d8ca]/80">Send us a message and we&apos;ll reply within one working day.</p>
          <ButtonLink href="/contact" variant="light" className="mt-6">
            Contact us <ArrowRight />
          </ButtonLink>
        </aside>
      </Container>
    </>
  );
}
