import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight, Building2, HandHeart, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import LiveStats, { LiveStatsSkeleton } from "@/components/home/LiveStats";
import PageHeader from "@/components/shared/PageHeader";
import SectionHeading from "@/components/shared/SectionHeading";

export const metadata: Metadata = {
  title: "About",
  description: "Why RaktoSheba exists, how the network works, and the principles that keep donors and patients safe.",
};

const principles = [
  { title: "Verify first", text: "Every request is checked by our team before a single donor is notified. No hoaxes, no panic forwarding." },
  { title: "Right donor, not every donor", text: "We notify only people who are compatible, eligible and nearby—so alerts stay meaningful." },
  { title: "Donor wellbeing", text: "The 90-day rule is enforced automatically. Nobody is asked to donate before their body is ready." },
  { title: "Privacy by default", text: "Public boards never show who donated. A donor's details reach only the hospital they agreed to help." },
];

const roles = [
  { icon: HandHeart, tone: "bg-mint text-forest", title: "Donors", text: "Keep a blood group and availability on file, see compatible requests, and accept in one tap." },
  { icon: Building2, tone: "bg-blush text-blood", title: "Hospitals", text: "Post a request once, follow verification, and see matched donors with a clear status timeline." },
  { icon: ShieldCheck, tone: "bg-sand text-sand-deep", title: "Admins", text: "Verify hospitals and requests, keep the network trustworthy, and watch emergency levels in real time." },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About RaktoSheba"
        title="Blood shouldn't depend on who you happen to know."
        description="When a patient needs blood, families often scramble through phone contacts and social media posts. RaktoSheba replaces that scramble with one verified, compatible, nearby match."
      />
      <Suspense fallback={<LiveStatsSkeleton />}>
        <LiveStats />
      </Suspense>
      <section className="page-container py-20">
        <SectionHeading layout="split" eyebrow="Our principles" title="Care, built into the system." description="RaktoSheba is designed so the safe path is also the fastest one." />
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {principles.map((p, i) => (
            <div key={p.title} className="rounded-[24px] border border-ink/10 bg-cream p-7">
              <span className="font-display text-4xl text-blood">0{i + 1}</span>
              <h3 className="mt-6 text-lg font-extrabold">{p.title}</h3>
              <p className="mt-2 leading-7 text-ink-muted">{p.text}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="border-y border-ink/10 bg-cream py-20">
        <div className="page-container">
          <SectionHeading eyebrow="Three roles, one network" title="Everyone sees what they need." />
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {roles.map(({ icon: Icon, tone, title, text }) => (
              <div key={title} className="rounded-[24px] border border-ink/10 bg-paper p-7">
                <span className={`grid size-12 place-items-center rounded-2xl ${tone}`}>
                  <Icon size={22} />
                </span>
                <h3 className="mt-8 font-display text-3xl tracking-[-.04em]">{title}</h3>
                <p className="mt-3 leading-7 text-ink-muted">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="page-container py-20 text-center">
        <h2 className="mx-auto max-w-2xl font-display text-5xl leading-[.95] tracking-[-.06em]">Ready to be someone&apos;s match?</h2>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/donate">
              Check if you can donate <ArrowRight />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/requests">See open requests</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
