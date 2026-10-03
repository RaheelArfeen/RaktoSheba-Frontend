import Link from "next/link";
import { ChevronRight, Clock3, MapPin } from "lucide-react";
import { EmergencyBadge, StatusBadge } from "@/components/ui/badge";
import { bloodGroupLabel } from "@/lib/blood";
import { emergencyLevel } from "@/lib/emergency";
import { timeAgo, unitsLabel } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { PublicRequest } from "@/types";

const groupTone = {
  critical: "bg-blush text-blood",
  severe: "bg-blush text-blood",
  urgent: "bg-sand text-sand-deep",
  standard: "bg-mint text-forest",
};

/** One blood request on a board. Links to its public detail page. */
export function RequestCard({ request }: { request: PublicRequest }) {
  const level = emergencyLevel(request.urgency);
  const open = request.status === "VERIFIED";
  const pulsing = open && level === "critical";

  return (
    <Link
      href={`/requests/${request.id}`}
      className={cn(
        "group flex flex-col gap-4 rounded-[24px] border bg-cream p-5 shadow-[0_14px_40px_rgba(91,44,30,.05)] transition-all hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(91,44,30,.1)] sm:flex-row sm:items-center sm:justify-between",
        pulsing ? "border-blood/30" : "border-ink/10",
      )}
    >
      <div className="flex min-w-0 items-center gap-4">
        <div className={cn("relative grid size-14 shrink-0 place-items-center rounded-[18px] text-xl font-extrabold", groupTone[level])}>
          {bloodGroupLabel[request.bloodGroup]}
          {pulsing && (
            <span className="absolute -top-1 -right-1 flex size-3">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-blood opacity-60" />
              <span className="relative inline-flex size-3 rounded-full bg-blood" />
            </span>
          )}
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate font-bold">{request.hospital?.name ?? "Partner hospital"}</p>
            {open ? <EmergencyBadge urgency={request.urgency} /> : <StatusBadge status={request.status} />}
          </div>
          <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-ink-faint">
            <MapPin size={12} className="shrink-0" />
            <span className="truncate">{request.hospital?.address ?? "Bangladesh"}</span>
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between gap-5 border-t border-ink/10 pt-3 sm:border-t-0 sm:pt-0">
        <div>
          <p className="font-display text-lg whitespace-nowrap">{unitsLabel(request.unitsNeeded)}</p>
          <p className="text-[10px] font-bold tracking-[.12em] text-ink-faint uppercase">Needed</p>
        </div>
        <div className="flex items-center gap-3">
          <p className="flex items-center gap-1 text-xs font-bold whitespace-nowrap text-ink-muted">
            <Clock3 size={13} /> {timeAgo(request.createdAt)}
          </p>
          <ChevronRight size={18} className="text-ink-faint transition-transform group-hover:translate-x-0.5 group-hover:text-blood" />
        </div>
      </div>
    </Link>
  );
}
