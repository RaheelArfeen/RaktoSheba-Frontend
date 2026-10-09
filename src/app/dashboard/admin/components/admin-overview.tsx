"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Skeleton } from "@/components/ui/skeleton";
import { QueryError } from "@/components/dashboard/list-controls";
import { cn } from "@/lib/cn";
import { useAdminAnalytics, useAdminQueue } from "@/lib/queries/use-admin";
import { QueueRow } from "@/app/dashboard/admin/queue/components/queue-row";
import { ActivityChart } from "./activity-chart";
import { ActivityFeed } from "./activity-feed";
import { BloodDemandPanel, EmergencyPanel } from "./insight-panels";
import { AttentionStrip, KpiCards } from "./overview-stats";

function QueuePreview({ className }: { className?: string }) {
  const { data, isPending, isError, error, refetch } = useAdminQueue({ page: 1, limit: 5 });
  const analytics = useAdminAnalytics();

  return (
    <section className={cn("flex flex-col rounded-[24px] border border-ink/10 bg-cream p-6", className)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-lg tracking-[-.01em]">Verification queue</h2>
          <p className="mt-1 text-sm text-ink-muted">Highest-urgency requests waiting for a check</p>
        </div>
        <div className="flex items-center gap-3">
          {analytics.data && (
            <span className="rounded-full bg-sand px-3 py-1 text-xs font-extrabold text-sand-deep">
              {analytics.data.requests.byStatus.PENDING} pending
            </span>
          )}
          <Link
            href="/dashboard/admin/queue"
            className="flex items-center gap-1 text-xs font-extrabold text-blood hover:text-blood-deep"
          >
            Open queue <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {isPending && (
        <div className="mt-5 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[84px] rounded-[24px]" />
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
            Queue is clear — no requests are waiting for verification.
          </p>
        ) : (
          <div className="mt-5 space-y-3">
            {data.data.map((request) => (
              <QueueRow key={request.id} request={request} />
            ))}
          </div>
        ))}
    </section>
  );
}

export function AdminOverview() {
  return (
    <div className="space-y-8">
      <header>
        <Eyebrow>Admin workspace</Eyebrow>
        <h1 className="mt-2 font-display text-3xl tracking-[-.015em] sm:text-4xl">The network, at a glance.</h1>
        <p className="mt-2 max-w-2xl text-sm text-ink-muted">
          Verifications, live demand and the people behind every donation — all in one place.
        </p>
      </header>

      <AttentionStrip />

      <KpiCards />

      <div className="grid gap-4 lg:grid-cols-3">
        <ActivityChart className="lg:col-span-2" />
        <div className="space-y-4">
          <EmergencyPanel />
          <BloodDemandPanel />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <QueuePreview className="lg:col-span-2" />
        <ActivityFeed />
      </div>
    </div>
  );
}
