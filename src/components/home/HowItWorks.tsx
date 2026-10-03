import SectionHeading from "@/components/shared/SectionHeading";
import { howItWorks } from "@/lib/content";

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-24 bg-maroon py-24 text-cream">
      <div className="page-container">
        <SectionHeading
          layout="split"
          tone="dark"
          eyebrow="How it works"
          title={
            <>
              Simple steps.
              <br />
              Meaningful impact.
            </>
          }
          description="Every handoff is designed to keep people informed, protect donor eligibility, and make the next right action obvious."
        />
        <ol className="mt-16 grid gap-4 md:grid-cols-3">
          {howItWorks.map((item) => (
            <li
              key={item.step}
              className="rounded-[24px] border border-white/15 bg-white/[.07] p-6 transition-colors hover:bg-white/[.11]"
            >
              <span className={`font-display text-5xl ${item.tone}`}>{item.step}</span>
              <h3 className="mt-12 text-lg font-extrabold">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#f2d8ca]/75">{item.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
