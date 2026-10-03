import Link from "next/link";
import { HeartPulse } from "lucide-react";
import { cn } from "@/lib/cn";

/** Brand mark: oxblood tile with a heartbeat and a small mint "alive" dot. */
export function Logo({ compact = false, className, onClick }: { compact?: boolean; className?: string; onClick?: () => void }) {
  return (
    <Link href="/" onClick={onClick} aria-label="RaktoSheba home" className={cn("flex items-center gap-3", className)}>
      <span className="relative grid size-10 place-items-center rounded-[13px] bg-blood text-cream shadow-[0_8px_22px_rgba(122,24,34,.2)]">
        <span className="absolute -top-1.5 right-0 size-3 rounded-full bg-mint-strong" />
        <HeartPulse size={22} strokeWidth={2.2} aria-hidden />
      </span>
      {!compact && <span className="font-display text-lg tracking-[-.01em] text-ink">RaktoSheba</span>}
    </Link>
  );
}
