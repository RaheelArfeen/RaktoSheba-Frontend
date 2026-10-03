import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { CircleAlert, HeartPulse, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import HeroPreview from "./HeroPreview";

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden border-b border-ink/10">
      <div className="absolute inset-0 -z-20 bg-paper" />
      <div className="pointer-events-none absolute top-0 right-[-16%] -z-10 h-full w-[82%]">
        <Image
          src="/hero-ribbon.webp"
          alt=""
          fill
          priority
          sizes="82vw"
          className="object-cover object-center opacity-90 mix-blend-multiply"
        />
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-paper via-paper/95 to-transparent" />
      <div className="absolute top-28 -right-20 -z-10 size-[420px] rounded-full bg-mint/45 blur-3xl" />

      <div className="page-container grid min-h-[610px] items-center gap-12 pt-14 pb-20 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,.75fr)] lg:pt-16 lg:pb-24">
        <div className="animate-rise max-w-[680px]">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blood/20 bg-cream/75 px-3.5 py-2 text-xs font-bold tracking-[.14em] text-blood uppercase shadow-sm">
            <Sparkles size={14} /> Blood, when it matters
          </div>
          <h1 className="font-display text-[clamp(3.5rem,7vw,6.7rem)] leading-[.91] tracking-[-.065em]">
            One small act.
            <br />
            <span className="text-blood">A whole life</span> ahead.
          </h1>
          <p className="mt-7 max-w-[520px] text-[17px] leading-8 text-ink-muted">
            RaktoSheba connects hospitals with compatible, nearby donors—so emergency requests move with clarity, care,
            and less waiting.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="group">
              <Link href="/emergency">
                Get emergency help <CircleAlert className="size-[17px] transition-transform group-hover:scale-110" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/donate">
                I want to donate <HeartPulse className="size-[17px] text-blood" />
              </Link>
            </Button>
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
        <Suspense fallback={<div className="hidden min-h-[440px] lg:block" />}>
          <HeroPreview />
        </Suspense>
      </div>
    </section>
  );
}
