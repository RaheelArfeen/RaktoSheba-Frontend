import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { EMERGENCY_LEVELS } from "@/lib/emergency";
import { publicApi } from "@/lib/requests";

function CalmBanner() {
  return (
    <div className="bg-maroon px-4 py-2 text-center text-[11px] font-semibold tracking-[.18em] text-[#f7d6ba] uppercase">
      <span className="mr-2 inline-block size-1.5 rounded-full bg-mint-strong align-middle" aria-hidden />
      A faster way to find a compatible blood donor
    </div>
  );
}

async function LiveBanner() {
  const critical = await publicApi
    .requestBoard({ minUrgency: EMERGENCY_LEVELS.critical.minUrgency, limit: 1 })
    .then((board) => board.meta.total)
    .catch(() => 0);

  if (critical === 0) return <CalmBanner />;

  return (
    <Link
      href={`/requests?minUrgency=${EMERGENCY_LEVELS.critical.minUrgency}`}
      role="alert"
      className="group flex items-center justify-center gap-2.5 bg-blood px-4 py-2 text-center text-[11px] font-bold tracking-[.14em] text-cream uppercase transition-colors hover:bg-blood-deep"
    >
      <span className="relative flex size-2 shrink-0" aria-hidden>
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-cream opacity-75" />
        <span className="relative inline-flex size-2 rounded-full bg-cream" />
      </span>
      <span>
        {critical} critical request{critical === 1 ? "" : "s"} need{critical === 1 ? "s" : ""} donors now
      </span>
      <span className="hidden items-center gap-1 underline-offset-4 group-hover:underline sm:inline-flex">
        See requests <ArrowRight size={12} />
      </span>
    </Link>
  );
}

/** Site-wide alert above the header: red while any critical request is open, calm maroon otherwise. */
export function EmergencyBanner() {
  return (
    <Suspense fallback={<CalmBanner />}>
      <LiveBanner />
    </Suspense>
  );
}
