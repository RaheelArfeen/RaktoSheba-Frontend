import type { Metadata } from "next";
import { Bus, MessageSquareText, ShieldCheck } from "lucide-react";
import FundForm from "@/components/fund/FundForm";
import PageHeader from "@/components/shared/PageHeader";

export const metadata: Metadata = {
  title: "Emergency fund",
  description: "Support the RaktoSheba emergency fund: donor transport, urgent coordination and the alerts that connect donors to patients.",
};

const uses = [
  { icon: Bus, title: "Getting donors there", text: "Transport for donors travelling to a hospital in an emergency, so cost is never the reason someone can't help." },
  { icon: MessageSquareText, title: "Reaching the right people", text: "SMS and email alerts to compatible donors, sent the moment a request is verified." },
  { icon: ShieldCheck, title: "Keeping it trustworthy", text: "Verifying hospitals and requests, so every alert a donor receives is real." },
];

export default function FundPage() {
  return (
    <>
      <PageHeader
        eyebrow="Emergency fund"
        title="When you can't give blood, you can still help."
        description="Your contribution keeps the network fast and free for patients and hospitals. Every payment is processed securely by Stripe."
      />
      <section className="page-container grid gap-10 py-14 lg:grid-cols-[.9fr_1.1fr] lg:items-start">
        <div>
          <p className="eyebrow text-blood">Where your money goes</p>
          <h2 className="mt-3 font-display text-4xl leading-[1] tracking-[-.05em]">Small gifts, fast matches.</h2>
          <ul className="mt-8 space-y-3">
            {uses.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-4 rounded-[22px] border border-ink/10 bg-cream p-5">
                <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-mint text-forest">
                  <Icon size={19} />
                </span>
                <div>
                  <p className="font-extrabold">{title}</p>
                  <p className="mt-1 text-sm leading-6 text-ink-muted">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <FundForm />
      </section>
    </>
  );
}
