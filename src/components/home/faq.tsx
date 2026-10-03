import Link from "next/link";
import { MessageCircleQuestion, Plus } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { faqs } from "@/lib/content";

/** Native <details> accordion: works without JavaScript and is keyboard accessible. Also used by /faq. */
export function FaqAccordion({ limit }: { limit?: number }) {
  return (
    <div className="divide-y divide-ink/10 rounded-[26px] border border-ink/10 bg-cream px-6">
      {faqs.slice(0, limit).map(({ question, answer }) => (
        <details key={question} className="group py-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-sm font-extrabold [&::-webkit-details-marker]:hidden">
            <span>{question}</span>
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-blush text-blood transition-transform group-open:rotate-45">
              <Plus size={15} />
            </span>
          </summary>
          <p className="max-w-[650px] pt-3 text-sm leading-6 text-ink-muted">{answer}</p>
        </details>
      ))}
    </div>
  );
}

export function FaqSection() {
  return (
    <section className="pb-24">
      <Container className="grid gap-10 lg:grid-cols-[.75fr_1.25fr] lg:items-start">
        <div>
          <Eyebrow className="mb-4">Questions, answered</Eyebrow>
          <h2 className="font-display text-4xl leading-[1.08] tracking-[-.02em] sm:text-5xl lg:text-6xl">A clearer way to care.</h2>
          <p className="mt-6 max-w-[370px] leading-7 text-ink-muted">If you are new to the network, start here. The rest of the journey stays simple.</p>
          <div className="mt-7 flex items-center gap-3 text-sm font-bold text-ink-muted">
            <MessageCircleQuestion size={19} className="text-blood" /> More questions?{" "}
            <Link href="/faq" className="text-blood hover:underline">
              Read the full FAQ
            </Link>
          </div>
        </div>
        <FaqAccordion limit={4} />
      </Container>
    </section>
  );
}
