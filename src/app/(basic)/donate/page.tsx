import type { Metadata } from "next";
import { Clock, Coffee, Droplets, HeartPulse } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { CompatibilityMatrix } from "./compatibility-matrix";
import { EligibilityChecker } from "./eligibility-checker";

export const metadata: Metadata = {
  title: "Can I donate blood?",
  description: "Check your blood donation eligibility in under a minute, see which blood groups you can help, and learn what to expect.",
};

const steps = [
  { icon: HeartPulse, title: "Quick health check", text: "A nurse checks your blood pressure, pulse and haemoglobin." },
  { icon: Droplets, title: "About 10 minutes", text: "One unit (around 450 ml) is collected while you rest." },
  { icon: Coffee, title: "Rest and refresh", text: "Have a drink and a snack, and take it easy for the day." },
  { icon: Clock, title: "Back in 90 days", text: "Your body rebuilds its supply; we'll tell you when you're eligible again." },
];

export default function DonatePage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-ink/10">
        <div className="absolute -top-24 -right-24 -z-10 size-[380px] rounded-full bg-mint/40 blur-3xl" />
        <Container className="py-14 sm:py-16">
          <Eyebrow>Become a donor</Eyebrow>
          <h1 className="mt-4 max-w-[820px] font-display text-4xl leading-[1.08] tracking-[-.02em] sm:text-5xl lg:text-6xl">Can I donate blood?</h1>
          <p className="mt-5 max-w-[620px] text-[17px] leading-8 text-ink-muted">
            Most healthy adults can. Answer a few questions to find out in under a minute—no account needed.
          </p>
        </Container>
      </section>
      <Container className="grid gap-10 py-14 lg:grid-cols-[1.1fr_.9fr] lg:items-start">
        <EligibilityChecker />
        <div>
          <Eyebrow>What to expect</Eyebrow>
          <h2 className="mt-3 font-display text-4xl leading-[1] tracking-[-.015em]">Under an hour, start to finish.</h2>
          <ol className="mt-8 space-y-3">
            {steps.map(({ icon: Icon, title, text }, i) => (
              <li key={title} className="flex gap-4 rounded-[22px] border border-ink/10 bg-cream p-5">
                <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-blush text-blood">
                  <Icon size={19} />
                </span>
                <div>
                  <p className="font-extrabold">
                    <span className="mr-2 text-ink-faint">0{i + 1}</span>
                    {title}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-ink-muted">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
      <section id="compatibility" className="scroll-mt-24 border-t border-ink/10 bg-sand py-20">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
            <div className="max-w-[620px]">
              <Eyebrow className="mb-4 text-sand-deep">Compatibility chart</Eyebrow>
              <h2 className="font-display text-4xl leading-[1.08] tracking-[-.02em] sm:text-5xl lg:text-6xl">Who can you help?</h2>
            </div>
            <p className="max-w-[420px] leading-7 text-ink-muted">Read across from your blood group. A filled dot means your blood can be given safely to that patient.</p>
          </div>
          <div className="mt-10">
            <CompatibilityMatrix />
          </div>
        </Container>
      </section>
    </>
  );
}
