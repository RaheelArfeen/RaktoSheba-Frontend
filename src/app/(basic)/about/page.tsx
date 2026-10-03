import type { Metadata } from "next";
import { ArrowRight, Building2, HandHeart, ShieldCheck } from "lucide-react";
import { StatsSection } from "@/components/home/stats";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";

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
      <section className="relative overflow-hidden border-b border-ink/10">
        <div className="absolute -top-24 -right-24 -z-10 size-[380px] rounded-full bg-mint/40 blur-3xl" />
        <Container className="py-14 sm:py-16">
          <Eyebrow>About RaktoSheba</Eyebrow>
          <h1 className="mt-4 max-w-[820px] font-display text-4xl leading-[1.08] tracking-[-.02em] sm:text-5xl lg:text-6xl">
            Blood shouldn&apos;t depend on who you happen to know.
          </h1>
          <p className="mt-5 max-w-[620px] text-[17px] leading-8 text-ink-muted">
            When a patient needs blood, families often scramble through phone contacts and social media posts. RaktoSheba replaces that
            scramble with one verified, compatible, nearby match.
          </p>
        </Container>
      </section>

      <StatsSection />

      <Container className="py-20">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
          <div className="max-w-[620px]">
            <Eyebrow className="mb-4">Our principles</Eyebrow>
            <h2 className="font-display text-4xl leading-[1.08] tracking-[-.02em] sm:text-5xl lg:text-6xl">Care, built into the system.</h2>
          </div>
          <p className="max-w-[420px] leading-7 text-ink-muted">RaktoSheba is designed so the safe path is also the fastest one.</p>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {principles.map((p, i) => (
            <div key={p.title} className="rounded-[24px] border border-ink/10 bg-cream p-7">
              <span className="font-display text-4xl text-blood">0{i + 1}</span>
              <h3 className="mt-6 text-lg font-extrabold">{p.title}</h3>
              <p className="mt-2 leading-7 text-ink-muted">{p.text}</p>
            </div>
          ))}
        </div>
      </Container>

      <section className="border-y border-ink/10 bg-cream py-20">
        <Container>
          <Eyebrow className="mb-4">Three roles, one network</Eyebrow>
          <h2 className="font-display text-4xl leading-[1.08] tracking-[-.02em] sm:text-5xl lg:text-6xl">Everyone sees what they need.</h2>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {roles.map(({ icon: Icon, tone, title, text }) => (
              <div key={title} className="rounded-[24px] border border-ink/10 bg-paper p-7">
                <span className={`grid size-12 place-items-center rounded-2xl ${tone}`}>
                  <Icon size={22} />
                </span>
                <h3 className="mt-8 font-display text-3xl tracking-[-.01em]">{title}</h3>
                <p className="mt-3 leading-7 text-ink-muted">{text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <Container className="py-20 text-center">
        <h2 className="mx-auto max-w-2xl font-display text-4xl sm:text-5xl leading-[1.08] tracking-[-.02em]">Ready to be someone&apos;s match?</h2>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href="/donate" size="lg">
            Check if you can donate <ArrowRight />
          </ButtonLink>
          <ButtonLink href="/requests" size="lg" variant="outline">
            See open requests
          </ButtonLink>
        </div>
      </Container>
    </>
  );
}
