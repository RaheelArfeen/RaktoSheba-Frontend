import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { howItWorks } from "@/lib/content";

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="scroll-mt-24 bg-maroon py-24 text-cream">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
          <div className="max-w-[620px]">
            <Eyebrow className="mb-4 text-mint-strong">How it works</Eyebrow>
            <h2 className="font-display text-5xl leading-[1.08] tracking-[-.02em] sm:text-6xl">
              Simple steps.
              <br />
              Meaningful impact.
            </h2>
          </div>
          <p className="max-w-[420px] leading-7 text-[#f2d8ca]/80">
            Every handoff is designed to keep people informed, protect donor eligibility, and make the next right action obvious.
          </p>
        </div>
        <ol className="mt-16 grid gap-4 md:grid-cols-3">
          {howItWorks.map((item) => (
            <li key={item.step} className="rounded-[24px] border border-white/15 bg-white/[.07] p-6 transition-colors hover:bg-white/[.11]">
              <span className={`font-display text-5xl ${item.tone}`}>{item.step}</span>
              <h3 className="mt-12 text-lg font-extrabold">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#f2d8ca]/75">{item.text}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
