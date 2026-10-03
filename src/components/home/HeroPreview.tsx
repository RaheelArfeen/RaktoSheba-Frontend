import { Check, CircleAlert, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { publicApi } from "@/lib/api/public";
import { bloodGroupLabel } from "@/lib/blood";
import { EMERGENCY_LEVELS, emergencyLevel } from "@/lib/emergency";
import { unitsLabel } from "@/lib/format";

// Floating hero cards. The request card and donor count come from the live API;
// if the API is down the cards simply don't render.
export default async function HeroPreview() {
  const [requests, stats] = await Promise.all([
    publicApi.urgentRequests(1).catch(() => null),
    publicApi.stats().catch(() => null),
  ]);
  const top = requests?.[0];
  const level = top ? emergencyLevel(top.urgency) : null;

  return (
    <div className="relative hidden min-h-[440px] lg:block" aria-hidden>
      {top && level && (
        <div className="animate-float-slow absolute top-12 right-1 w-[270px] rotate-[5deg] rounded-[26px] border border-white/70 bg-cream/85 p-5 shadow-[0_24px_60px_rgba(91,44,30,.15)] backdrop-blur-xl">
          <div className="mb-5 flex items-start justify-between">
            <span className="grid size-11 place-items-center rounded-2xl bg-blood text-cream">
              <CircleAlert size={22} />
            </span>
            <Badge variant={EMERGENCY_LEVELS[level].badge}>{EMERGENCY_LEVELS[level].label}</Badge>
          </div>
          <p className="text-xs font-bold tracking-[.13em] text-ink-faint uppercase">Blood request</p>
          <p className="mt-1 font-display text-2xl tracking-[-.035em]">
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
            <p className="font-display text-xl tracking-[-.04em] text-forest-deep">Match confirmed</p>
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
