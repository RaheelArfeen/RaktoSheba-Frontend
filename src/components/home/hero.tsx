import { Suspense } from "react";
import Image from "next/image";
import { Check, CircleAlert, HeartPulse, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import { EmergencyBadge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";
import { bloodGroupLabel } from "@/lib/blood";
import { unitsLabel } from "@/lib/format";
import { publicApi } from "@/lib/requests";

// Floating cards beside the headline. The request card and donor count come from the live API;
// if the API is down they simply don't render.
async function HeroCards() {
  const [requests, stats] = await Promise.all([publicApi.urgentRequests(1).catch(() => null), publicApi.stats().catch(() => null)]);
  const top = requests?.[0];

  return (
    <div className="relative hidden min-h-[440px] lg:block" aria-hidden>
      {top && (
        <div className="animate-float-slow absolute top-12 right-1 w-[270px] rotate-[5deg] rounded-[26px] border border-white/70 bg-cream/85 p-5 shadow-[0_24px_60px_rgba(91,44,30,.15)] backdrop-blur-xl">
          <div className="mb-5 flex items-start justify-between">
            <span className="grid size-11 place-items-center rounded-2xl bg-blood text-cream">
              <CircleAlert size={22} />
            </span>
            <EmergencyBadge urgency={top.urgency} />
          </div>
          <p className="text-xs font-bold tracking-[.13em] text-ink-faint uppercase">Blood request</p>
          <p className="mt-1 font-display text-xl tracking-[-.01em]">
            {bloodGroupLabel[top.bloodGroup]} · {unitsLabel(top.unitsNeeded)}
          </p>
          <div className="mt-5 flex items-center gap-1.5 border-t border-ink/10 pt-4 text-xs font-semibold text-ink-muted">
            <MapPin size={13} className="shrink-0" />
            <span className="truncate">{top.hospital?.name ?? "Partner hospital"}</span>
          </div>
        </div>
      )}
      <div className="animate-float absolute bottom-16 left-0 w-[268px] -rotate-[6deg] rounded-[26px] border border-white/75 bg-mint/90 p-5 shadow-[0_24px_60px_rgba(43,93,68,.14)] backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="grid size-11 place-items-center rounded-full bg-mint-strong text-forest">
            <Check size={21} strokeWidth={3} />
          </div>
          <div>
            <p className="font-display text-lg tracking-[-.01em] text-forest-deep">Match confirmed</p>
            <p className="mt-0.5 text-xs font-semibold text-forest">A nearby donor accepted</p>
          </div>
        </div>
        <div className="mt-5 h-2 overflow-hidden rounded-full bg-mint-strong">
          <div className="h-full w-[82%] rounded-full bg-forest" />
        </div>
        <p className="mt-2 text-right text-[10px] font-extrabold tracking-[.12em] text-forest uppercase">82% on the way</p>
      </div>
      {stats && (
        <div className="absolute right-8 bottom-1 flex items-center gap-2 rounded-full border border-ink/10 bg-cream/80 px-4 py-2 text-xs font-bold text-ink-muted shadow-lg backdrop-blur">
          <span className="size-2 rounded-full bg-forest" /> {stats.availableDonors} donors available now
        </div>
      )}
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden border-b border-ink/10">
      <div className="absolute inset-0 -z-20 bg-paper" />
      <div className="pointer-events-none absolute top-0 right-[-16%] -z-10 h-full w-[82%]">
        <Image src="/hero-ribbon.webp" alt="" fill priority sizes="82vw" className="object-cover object-center opacity-90 mix-blend-multiply" />
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-paper via-paper/95 to-transparent" />
      <div className="absolute top-28 -right-20 -z-10 size-[420px] rounded-full bg-mint/45 blur-3xl" />

      <Container className="grid min-h-[610px] items-center gap-12 pt-14 pb-20 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,.75fr)] lg:pt-16 lg:pb-24">
        <div className="animate-rise max-w-[680px]">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blood/20 bg-cream/75 px-3.5 py-2 text-xs font-bold tracking-[.14em] text-blood uppercase shadow-sm">
            <Sparkles size={14} /> Blood, when it matters
          </div>
          <h1 className="font-display text-[clamp(2.75rem,5.5vw,5.25rem)] leading-[1.05] tracking-[-.02em]">
            One small act.
            <br />
            <span className="text-blood">A whole life</span> ahead.
          </h1>
          <p className="mt-7 max-w-[520px] text-[17px] leading-8 text-ink-muted">
            RaktoSheba connects hospitals with compatible, nearby donors—so emergency requests move with clarity, care, and less
            waiting.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/emergency" size="lg" className="group">
              Get emergency help <CircleAlert className="transition-transform group-hover:scale-110" />
            </ButtonLink>
            <ButtonLink href="/donate" size="lg" variant="outline">
              I want to donate <HeartPulse className="text-blood" />
            </ButtonLink>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-semibold text-ink-muted">
            <span className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-forest" /> Verified hospital requests
            </span>
            <span className="flex items-center gap-2">
              <MapPin size={16} className="text-forest" /> Proximity-aware matching
            </span>
          </div>
        </div>
        <Suspense
          fallback={
            <div className="relative hidden min-h-[440px] lg:block">
              <Skeleton className="absolute top-12 right-1 h-44 w-[270px] rotate-[5deg] rounded-[26px]" />
              <Skeleton className="absolute bottom-16 left-0 h-36 w-[268px] -rotate-[6deg] rounded-[26px]" />
            </div>
          }
        >
          <HeroCards />
        </Suspense>
      </Container>
    </section>
  );
}
