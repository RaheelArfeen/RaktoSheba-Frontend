import { EMERGENCY_LEVELS, emergencyLevel, requestStatusLabel } from "@/lib/emergency";
import { cn } from "@/lib/cn";
import type { EmergencyLevel, RequestStatus } from "@/types";

/** Small uppercase pill used for emergency levels and request statuses. */
export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-extrabold tracking-[.12em] whitespace-nowrap uppercase",
        className,
      )}
    >
      {children}
    </span>
  );
}

const levelStyles: Record<EmergencyLevel, string> = {
  critical: "bg-blood text-cream",
  severe: "bg-blush text-blood",
  urgent: "bg-sand text-sand-deep",
  standard: "bg-linen text-ink-muted",
};

/** Critical / Severe / Urgent / Standard, from a request's 1–5 urgency. */
export function EmergencyBadge({ urgency }: { urgency: number }) {
  const level = emergencyLevel(urgency);
  return <Badge className={levelStyles[level]}>{EMERGENCY_LEVELS[level].label}</Badge>;
}

const statusStyles: Record<RequestStatus, string> = {
  PENDING: "bg-sand text-sand-deep",
  VERIFIED: "bg-blush text-blood",
  MATCHED: "bg-mint text-forest",
  FULFILLED: "bg-mint text-forest",
  CANCELLED: "bg-linen text-ink-muted",
};

export function StatusBadge({ status }: { status: RequestStatus }) {
  return <Badge className={statusStyles[status]}>{requestStatusLabel[status]}</Badge>;
}
