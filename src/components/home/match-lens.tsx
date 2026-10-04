"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, HandHeart } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { BLOOD_GROUPS, bloodGroupLabel, compatibleDonors, compatibleRecipients } from "@/lib/blood";
import { cn } from "@/lib/cn";
import type { BloodGroup } from "@/types";

const headline: Partial<Record<BloodGroup, string>> = {
  O_NEGATIVE: "A rare universal gift.",
  O_POSITIVE: "A type many hospitals need.",
  AB_POSITIVE: "A flexible recipient match.",
  AB_NEGATIVE: "One of the rarest types.",
};

const groupCount = (n: number) => (n === 8 ? "everyone" : `${n} group${n === 1 ? "" : "s"}`);

/** Pick a type to see who it can help and who can help it, from the real ABO/Rh rules. */
export function MatchLensSection() {
  const [selected, setSelected] = useState<BloodGroup>("O_POSITIVE");
  const gives = compatibleRecipients(selected);
  const receives = compatibleDonors(selected);

  return (
    <section className="bg-cream py-24">
      <Container className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
      <div>
        <Eyebrow className="mb-4">Try the match lens</Eyebrow>
        <h2 className="font-display text-3xl leading-[1.08] tracking-[-.02em] sm:text-4xl lg:text-5xl">What could your blood type unlock?</h2>
        <p className="mt-6 max-w-[420px] leading-7 text-ink-muted">Tap a type to see who it can help—and who can help it. No account, no form.</p>
        <div className="mt-8 grid max-w-[390px] grid-cols-4 gap-2" role="group" aria-label="Choose a blood type">
          {BLOOD_GROUPS.map((group) => (
            <button
              key={group}
              type="button"
              onClick={() => setSelected(group)}
              aria-pressed={selected === group}
              className={cn(
                "rounded-xl border py-3 text-sm font-extrabold transition-all",
                selected === group
                  ? "border-blood/30 bg-blood text-white shadow-[0_8px_18px_rgba(169,40,54,.18)]"
                  : "border-ink/10 bg-paper text-ink-muted hover:border-blood/25 hover:text-blood",
              )}
            >
              {bloodGroupLabel[group]}
            </button>
          ))}
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[30px] bg-maroon p-7 text-cream sm:p-10" aria-live="polite">
        <div className="absolute -top-20 -right-12 size-64 rounded-full border-[36px] border-white/[.07]" />
        <div className="relative">
          <div className="flex items-start justify-between gap-6">
            <div>
              <Eyebrow className="text-mint-strong">Selected blood type</Eyebrow>
              <p className="mt-3 font-display text-6xl tracking-[-.02em] text-peach">{bloodGroupLabel[selected]}</p>
            </div>
            <span className="grid size-12 place-items-center rounded-2xl bg-white/10 text-mint-strong">
              <HandHeart size={24} />
            </span>
          </div>
          <p className="mt-8 text-lg font-extrabold">{headline[selected] ?? "Your match can still change a day."}</p>
          <div className="mt-6 grid gap-6 border-t border-white/10 pt-6 sm:grid-cols-2">
            <div>
              <p className="text-xs font-bold tracking-[.12em] text-[#f2d8ca]/70 uppercase">Can give to · {groupCount(gives.length)}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {gives.map((g) => (
                  <span key={g} className="rounded-lg bg-peach/20 px-2 py-1 text-xs font-extrabold text-peach">
                    {bloodGroupLabel[g]}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold tracking-[.12em] text-[#f2d8ca]/70 uppercase">Can receive from · {groupCount(receives.length)}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {receives.map((g) => (
                  <span key={g} className="rounded-lg bg-mint-strong/15 px-2 py-1 text-xs font-extrabold text-mint-strong">
                    {bloodGroupLabel[g]}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <Link
            href={`/requests?canHelp=${selected}`}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-cream px-5 py-3 text-sm font-extrabold text-blood transition-all hover:-translate-y-0.5"
          >
            See requests {bloodGroupLabel[selected]} can help <ArrowRight size={16} />
          </Link>
        </div>
      </div>
      </Container>
    </section>
  );
}
