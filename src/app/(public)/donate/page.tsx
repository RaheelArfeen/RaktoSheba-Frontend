import type { Metadata } from "next";
import { Clock, Coffee, Droplets, HeartPulse } from "lucide-react";
import CompatibilityMatrix from "@/components/donate/CompatibilityMatrix";
import EligibilityChecker from "@/components/donate/EligibilityChecker";
import PageHeader from "@/components/shared/PageHeader";
import SectionHeading from "@/components/shared/SectionHeading";

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
      <PageHeader
        eyebrow="Become a donor"
        title="Can I donate blood?"
        description="Most healthy adults can. Answer a few questions to find out in under a minute—no account needed."
      />
      <section className="page-container grid gap-10 py-14 lg:grid-cols-[1.1fr_.9fr] lg:items-start">
        <EligibilityChecker />
        <div>
          <p className="eyebrow text-blood">What to expect</p>
          <h2 className="mt-3 font-display text-4xl leading-[1] tracking-[-.05em]">Under an hour, start to finish.</h2>
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
      </section>
      <section id="compatibility" className="scroll-mt-24 border-t border-ink/10 bg-sand py-20">
        <div className="page-container">
          <SectionHeading
            layout="split"
            eyebrow="Compatibility chart"
            eyebrowClassName="text-sand-deep"
            title="Who can you help?"
            description="Read across from your blood group. A filled dot means your blood can be given safely to that patient."
          />
          <div className="mt-10">
            <CompatibilityMatrix />
          </div>
        </div>
      </section>
    </>
  );
}
