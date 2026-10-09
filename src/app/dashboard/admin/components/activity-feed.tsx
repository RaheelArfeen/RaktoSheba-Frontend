"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { QueryError } from "@/components/dashboard/list-controls";
import { Skeleton } from "@/components/ui/skeleton";
import { auditActionMeta } from "@/lib/audit";
import { cn } from "@/lib/cn";
import { timeAgo } from "@/lib/format";
import { useAuditLog } from "@/lib/queries/use-admin";

export function ActivityFeed() {
  const { data, isPending, isError, error, refetch } = useAuditLog({ page: 1, limit: 6 });

  return (
    <section className="flex flex-col rounded-[24px] border border-ink/10 bg-cream p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-lg tracking-[-.01em]">Recent activity</h2>
          <p className="mt-1 text-sm text-ink-muted">The last few actions across the network</p>
        </div>
        <Link
          href="/dashboard/admin/payments?tab=audit"
          className="flex items-center gap-1 text-xs font-extrabold text-blood hover:text-blood-deep"
        >
          Full log <ArrowRight size={13} />
        </Link>
      </div>

      {isPending && (
        <div className="mt-5 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 rounded-xl" />
          ))}
        </div>
      )}

      {isError && (
        <div className="mt-4">
          <QueryError error={error} onRetry={refetch} />
        </div>
      )}

      {data &&
        (data.data.length === 0 ? (
          <p className="mt-5 rounded-2xl border border-dashed border-ink/15 bg-paper px-4 py-6 text-center text-sm text-ink-muted">
            No activity recorded yet.
          </p>
        ) : (
          <ol className="relative mt-5 space-y-1">
            <span aria-hidden className="absolute top-2 bottom-2 left-[7px] w-px bg-ink/10" />
            {data.data.map((log) => {
              const meta = auditActionMeta(log.action);
              return (
                <li key={log.id} className="relative flex gap-3.5 py-1.5 pl-0">
                  <span className={cn("relative z-10 mt-1 size-[15px] shrink-0 rounded-full border-[3px] border-cream", meta.dot)} />
                  <div className="min-w-0">
                    <p className="truncate text-sm text-ink">
                      <span className="font-bold">{log.actor.email}</span>{" "}
                      <span className="text-ink-muted">{meta.label}</span>
                    </p>
                    <p className="mt-0.5 text-xs font-semibold text-ink-faint">
                      {timeAgo(log.createdAt)} · {log.targetType}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        ))}
    </section>
  );
}
