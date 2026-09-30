import { HeartPulse } from "lucide-react";
import { cn } from "@/lib/utils";

// Brand mark: oxblood tile with a heartbeat and a small mint "alive" dot.
export default function Mark({ compact = false, inverted = false }: { compact?: boolean; inverted?: boolean }) {
  return (
    <span className="flex items-center gap-3">
      <span className="relative grid size-10 place-items-center rounded-[13px] bg-blood text-cream shadow-[0_8px_22px_rgba(122,24,34,.2)]">
        <span className="absolute -top-1.5 right-0 size-3 rounded-full bg-mint-strong" />
        <HeartPulse size={22} strokeWidth={2.2} aria-hidden />
      </span>
      {!compact && (
        <span className={cn("font-display text-[22px] tracking-[-.04em]", inverted ? "text-cream" : "text-ink")}>
          RaktoSheba
        </span>
      )}
    </span>
  );
}
