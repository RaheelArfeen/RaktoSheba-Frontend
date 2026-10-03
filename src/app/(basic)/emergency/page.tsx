import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight, Building2, Droplets, IdCard, Phone, Stethoscope, Users } from "lucide-react";
import { RequestCard } from "@/components/request/request-card";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { RequestCardSkeleton } from "@/components/ui/skeleton";
import { EMERGENCY_LEVELS } from "@/lib/emergency";
import { publicApi } from "@/lib/requests";
import { contact } from "@/lib/site";
import { SummaryWizard } from "./summary-wizard";

export const metadata: Metadata = {
  title: "Emergency blood help",
  description: `Need blood urgently? Call ${contact.emergencyLine}, see live emergency requests, and prepare a clear summary to share with a hospital.`,
};

const whileYouWait = [
  { icon: Stethoscope, title: "Stay with the medical team", text: "Doctors decide the exact blood group and amount. Keep them informed of offers of help." },
  { icon: IdCard, title: "Keep documents ready", text: "Patient ID, admission details and any blood-group report speed things up." },
  { icon: Users, title: "Ask family and friends", text: "Relatives with a compatible blood group are often the fastest donors." },
  { icon: Droplets, title: "Know the compatible groups", text: "O− can give to anyone. Check the chart to see who else can help." },
];

async function EmergencyRequests() {
  const board = await publicApi.requestBoard({ minUrgency: EMERGENCY_LEVELS.severe.minUrgency, limit: 4 }).catch(() => null);
  if (!board || board.data.length === 0) {
    return (
      <p className="rounded-[24px] border border-dashed border-ink/15 bg-paper p-8 text-center text-sm font-semibold text-ink-muted">
        No critical or severe requests are open right now.
      </p>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
      {board.data.map((request) => (
        <RequestCard key={request.id} request={request} />
      ))}
    </div>
  );
}

export default function EmergencyPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-maroon text-cream">
        <div className="absolute -top-32 -right-24 size-[460px] rounded-full border-[60px] border-white/[.05]" />
        <Container className="relative grid gap-10 py-16 lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:py-20">
          <div>
            <p className="flex items-center gap-2 text-xs font-extrabold tracking-[.18em] text-mint-strong uppercase">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-mint-strong opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-mint-strong" />
              </span>
              Emergency help · no login needed
            </p>
            <h1 className="mt-5 font-display text-5xl leading-[1.05] tracking-[-.02em] sm:text-7xl">Need blood urgently?</h1>
            <p className="mt-6 max-w-[520px] text-[17px] leading-8 text-[#f2d8ca]/85">
              Call our emergency line first. Then prepare a clear summary below so hospitals and family know exactly what&apos;s needed.
            </p>
          </div>
          <a
            href={`tel:${contact.emergencyLine}`}
            className="group flex items-center gap-5 rounded-[28px] bg-cream p-6 text-ink shadow-[0_24px_60px_rgba(0,0,0,.25)] transition-transform hover:-translate-y-1 sm:p-8"
          >
            <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-blood text-cream">
              <Phone className="size-7" />
            </span>
            <span>
              <Eyebrow>Tap to call · 24/7</Eyebrow>
              <span className="mt-1 block font-display text-6xl leading-none tracking-[-.015em]">{contact.emergencyLine}</span>
              <span className="mt-2 block text-sm font-semibold text-ink-muted">RaktoSheba emergency coordination</span>
            </span>
          </a>
        </Container>
      </section>

      <Container className="grid gap-10 py-14 lg:grid-cols-2 lg:items-start">
        <div>
          <Eyebrow>Step 2 · Prepare a summary</Eyebrow>
          <h2 className="mt-3 font-display text-4xl leading-[1] tracking-[-.015em]">One clear message, ready to share.</h2>
          <p className="mt-4 max-w-md leading-7 text-ink-muted">
            Three quick questions. You&apos;ll get a short summary you can send by SMS, WhatsApp or read out on a call.
          </p>
          <div className="mt-8">
            <SummaryWizard />
          </div>
        </div>
        <div>
          <Eyebrow>While you wait</Eyebrow>
          <h2 className="mt-3 font-display text-4xl leading-[1] tracking-[-.015em]">What helps most right now.</h2>
          <ul className="mt-8 space-y-3">
            {whileYouWait.map(({ icon: Icon, title, text }) => (
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
          <Link href="/donate#compatibility" className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-blood hover:underline">
            Open the compatibility chart <ArrowRight size={15} />
          </Link>
        </div>
      </Container>

      <section className="border-t border-ink/10 bg-cream py-14">
        <Container>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <Eyebrow>Live now</Eyebrow>
              <h2 className="mt-3 font-display text-4xl tracking-[-.015em]">Critical and severe requests</h2>
            </div>
            <Link href={`/requests?minUrgency=${EMERGENCY_LEVELS.severe.minUrgency}`} className="text-sm font-extrabold text-blood hover:underline">
              See all emergencies →
            </Link>
          </div>
          <div className="mt-8">
            <Suspense
              fallback={
                <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                  <RequestCardSkeleton />
                  <RequestCardSkeleton />
                </div>
              }
            >
              <EmergencyRequests />
            </Suspense>
          </div>
        </Container>
      </section>

      <Container className="py-14">
        <div className="flex flex-col items-start justify-between gap-6 rounded-[28px] bg-blush p-7 sm:flex-row sm:items-center sm:p-10">
          <div className="flex items-start gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-blush-deep text-blood">
              <Building2 size={22} />
            </span>
            <div>
              <p className="font-display text-3xl tracking-[-.01em] text-blood-deep">Are you a hospital?</p>
              <p className="mt-1 max-w-lg text-sm leading-6 text-[#87584e]">Register to post verified requests that reach compatible donors near you within minutes.</p>
            </div>
          </div>
          <ButtonLink href="/auth/register?role=hospital">
            Register your hospital <ArrowRight />
          </ButtonLink>
        </div>
      </Container>
    </>
  );
}
