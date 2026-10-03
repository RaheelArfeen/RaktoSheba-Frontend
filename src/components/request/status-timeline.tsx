import { Check, X } from "lucide-react";
import { REQUEST_LIFECYCLE } from "@/lib/emergency";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { PublicRequestDetail } from "@/types";

/** Vertical progress through the request lifecycle. Cancelled requests show where they stopped. */
export function StatusTimeline({ request }: { request: PublicRequestDetail }) {
  const cancelled = request.status === "CANCELLED";
  const reached = cancelled ? 0 : REQUEST_LIFECYCLE.findIndex((s) => s.status === request.status);
  const when: Partial<Record<string, string | null>> = {
    PENDING: request.createdAt,
    MATCHED: request.donation?.scheduledAt ?? null,
    FULFILLED: request.donation?.completedAt ?? null,
  };

  return (
    <ol className="relative space-y-6">
      {REQUEST_LIFECYCLE.map((step, i) => {
        const done = i <= reached;
        const current = i === reached && !cancelled;
        return (
          <li key={step.status} className="relative flex gap-4">
            {i < REQUEST_LIFECYCLE.length - 1 && (
              <span aria-hidden className={cn("absolute top-9 left-[15px] h-[calc(100%-12px)] w-0.5", i < reached && !cancelled ? "bg-forest" : "bg-ink/10")} />
            )}
            <span
              className={cn(
                "relative z-10 grid size-8 shrink-0 place-items-center rounded-full border-2",
                done ? "border-forest bg-forest text-white" : "border-ink/15 bg-cream text-ink-faint",
                current && "ring-4 ring-forest/15",
              )}
            >
              {done ? <Check size={15} strokeWidth={3} /> : <span className="text-xs font-extrabold">{i + 1}</span>}
            </span>
            <div className="pb-1">
              <p className={cn("font-extrabold", !done && "text-ink-faint")}>{step.label}</p>
              <p className="mt-0.5 text-sm text-ink-muted">{step.description}</p>
              {done && when[step.status] && <p className="mt-1 text-xs font-semibold text-ink-faint">{formatDateTime(when[step.status] as string)}</p>}
            </div>
          </li>
        );
      })}
      {cancelled && (
        <li className="flex gap-4">
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-blood text-cream">
            <X size={15} strokeWidth={3} />
          </span>
          <div>
            <p className="font-extrabold text-blood">Cancelled</p>
            <p className="mt-0.5 text-sm text-ink-muted">This request is no longer active.</p>
          </div>
        </li>
      )}
    </ol>
  );
}
