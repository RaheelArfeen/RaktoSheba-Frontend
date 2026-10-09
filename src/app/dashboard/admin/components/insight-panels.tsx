"use client";

import { QueryError } from "@/components/dashboard/list-controls";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/cn";
import { bloodGroupLabel } from "@/lib/blood";
import { EMERGENCY_LEVELS } from "@/lib/emergency";
import { useAdminTimeSeries } from "@/lib/queries/use-admin";
import type { EmergencyLevel } from "@/types";

const LEVEL_ORDER: EmergencyLevel[] = ["critical", "severe", "urgent", "standard"];

const levelDot: Record<EmergencyLevel, string> = {
  critical: "bg-blood",
  severe: "bg-blush-deep",
  urgent: "bg-sand-deep",
  standard: "bg-ink-faint",
};

function PanelShell({
  title,
  subtitle,
  children,
  className,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-[24px] border border-ink/10 bg-cream p-5 sm:p-6", className)}>
      <h2 className="font-display text-lg tracking-[-.01em]">{title}</h2>
      <p className="mt-1 text-sm text-ink-muted">{subtitle}</p>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function PanelSkeleton() {
  return (
    <div className="rounded-[24px] border border-ink/10 bg-cream p-5 sm:p-6">
      <Skeleton className="h-5 w-44" />
      <Skeleton className="mt-2 h-3 w-56 max-w-full" />
      <div className="mt-5 space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-9 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

/** Open requests split by emergency level — the earlier the level, the hotter the colour. */
export function EmergencyPanel() {
  const { data, isPending, isError, error, refetch } = useAdminTimeSeries(30);

  if (isPending) return <PanelSkeleton />;
  if (isError) return <QueryError error={error} onRetry={refetch} />;

  const counts = data.openByEmergencyLevel;
  const total = LEVEL_ORDER.reduce((sum, level) => sum + counts[level], 0);

  return (
    <PanelShell title="Open by emergency" subtitle={total === 0 ? "No open requests right now" : `${total} open request${total === 1 ? "" : "s"} across the network`}>
      {total === 0 ? (
        <p className="rounded-2xl border border-dashed border-ink/15 bg-paper px-4 py-6 text-center text-sm text-ink-muted">
          Nothing open — every request is matched, fulfilled or closed.
        </p>
      ) : (
        <div className="space-y-4">
          <div className="flex h-2.5 overflow-hidden rounded-full bg-paper">
            {LEVEL_ORDER.map((level) =>
              counts[level] > 0 ? (
                <span
                  key={level}
                  title={`${EMERGENCY_LEVELS[level].label}: ${counts[level]}`}
                  style={{ flexGrow: counts[level] }}
                  className={levelDot[level]}
                />
              ) : null,
            )}
          </div>
          {LEVEL_ORDER.map((level) => {
            const count = counts[level];
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            return (
              <div key={level} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 font-bold text-ink">
                    <span className={cn("size-2.5 rounded-full", levelDot[level])} />
                    {EMERGENCY_LEVELS[level].label}
                  </span>
                  <span className="text-xs font-semibold text-ink-muted">
                    <span className="font-display text-sm text-ink">{count}</span> · {pct}%
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-paper">
                  <div className={cn("h-full rounded-full", levelDot[level])} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </PanelShell>
  );
}

/** Which blood groups currently carry the most open demand. */
export function BloodDemandPanel() {
  const { data, isPending, isError, error, refetch } = useAdminTimeSeries(30);

  if (isPending) return <PanelSkeleton />;
  if (isError) return <QueryError error={error} onRetry={refetch} />;

  const groups = [...data.byBloodGroup].sort((a, b) => b.open - a.open || b.total - a.total);
  const max = Math.max(...groups.map((group) => group.open), 1);
  const hasOpen = groups.some((group) => group.open > 0);

  return (
    <PanelShell title="Open demand by blood group" subtitle="Open and matched requests still needing donors">
      {!hasOpen ? (
        <p className="rounded-2xl border border-dashed border-ink/15 bg-paper px-4 py-6 text-center text-sm text-ink-muted">
          No open demand — the board is fully covered.
        </p>
      ) : (
        <div className="space-y-3">
          {groups.map((group) => (
            <div key={group.bloodGroup} className="flex items-center gap-3">
              <span className="w-9 shrink-0 font-display text-sm text-blood">{bloodGroupLabel[group.bloodGroup]}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-paper">
                <div
                  className={cn(
                    "h-full rounded-full",
                    group.open > 0 ? "bg-gradient-to-r from-blood-deep to-blood" : "bg-transparent",
                  )}
                  style={{ width: `${(group.open / max) * 100}%` }}
                />
              </div>
              <span className="w-16 shrink-0 text-right text-xs font-semibold text-ink-muted">
                <span className="font-display text-sm text-ink">{group.open}</span> open
              </span>
            </div>
          ))}
        </div>
      )}
    </PanelShell>
  );
}
