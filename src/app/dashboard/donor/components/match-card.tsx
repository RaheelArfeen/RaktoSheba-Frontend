import Link from "next/link";
import { Clock3, MapPin, Navigation } from "lucide-react";
import { EmergencyBadge } from "@/components/ui/badge";
import { bloodGroupLabel } from "@/lib/blood";
import { cn } from "@/lib/cn";
import { emergencyLevel } from "@/lib/emergency";
import { timeAgo, unitsLabel } from "@/lib/format";
import type { DonorMatchRequest } from "@/types";
import { AcceptButton } from "./accept-button";

/** One request the donor can help, with distance and an "I can help" button. */
export function MatchCard({
  match,
  disabledReason,
  highlight,
}: {
  match: DonorMatchRequest;
  disabledReason?: string | null;
  /** Set when the donor arrived from this request's page. */
  highlight?: boolean;
}) {
  const level = emergencyLevel(match.urgency);
  const hospital = match.hospital?.name ?? "Partner hospital";

  return (
    <article
      id={`request-${match.id}`}
      className={cn(
        "flex flex-col gap-5 rounded-[24px] border bg-cream p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6",
        highlight ? "border-blood/40 ring-4 ring-blood/10" : "border-ink/10",
      )}
    >
      <div className="flex min-w-0 items-start gap-4">
        <div
          className={cn(
            "grid size-14 shrink-0 place-items-center rounded-[18px] text-xl font-extrabold",
            level === "critical" || level === "severe" ? "bg-blush text-blood" : level === "urgent" ? "bg-sand text-sand-deep" : "bg-mint text-forest",
          )}
        >
          {bloodGroupLabel[match.bloodGroup]}
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Link href={`/requests/${match.id}`} className="font-bold hover:text-blood hover:underline">
              {hospital}
            </Link>
            <EmergencyBadge urgency={match.urgency} />
          </div>
          <p className="mt-1.5 flex items-center gap-1.5 text-sm text-ink-muted">
            <MapPin size={14} className="shrink-0" />
            <span className="truncate">{match.hospital?.address ?? "Bangladesh"}</span>
          </p>
          <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-bold text-ink-faint">
            <span>{unitsLabel(match.unitsNeeded)} needed</span>
            <span className="inline-flex items-center gap-1">
              <Clock3 size={12} /> {timeAgo(match.createdAt)}
            </span>
            {match.distanceKm != null && (
              <span className="inline-flex items-center gap-1 text-forest">
                <Navigation size={12} /> {match.distanceKm} km away
              </span>
            )}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-1.5 sm:items-end">
        <AcceptButton requestId={match.id} hospital={hospital} disabledReason={disabledReason} className="w-full sm:w-auto" />
      </div>
    </article>
  );
}
