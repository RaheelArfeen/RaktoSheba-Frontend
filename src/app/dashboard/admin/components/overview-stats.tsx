"use client";

import Link from "next/link";
import { ArrowUpRight, Building2, CheckCircle2, ClipboardList, HandHeart, Users } from "lucide-react";
import { QueryError } from "@/components/dashboard/list-controls";
import { Skeleton, StatCardsSkeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/cn";
import { useAdminAnalytics, useAdminTimeSeries } from "@/lib/queries/use-admin";

// ---- small visual helpers --------------------------------------------------

const ratio = (part: number, whole: number) => (whole > 0 ? part / whole : 0);

function weeklyChange(daily: { requests: number; donations: number }[], key: "requests" | "donations") {
  const recent = daily.slice(-7).reduce((sum, day) => sum + day[key], 0);
  const previous = daily.slice(-14, -7).reduce((sum, day) => sum + day[key], 0);
  return { recent, change: recent - previous };
}

/** Donut showing a fraction, e.g. available/total donors. */
function Ring({ fraction, className }: { fraction: number; className: string }) {
  const r = 15.5;
  const c = 2 * Math.PI * r;
  const filled = Math.min(1, Math.max(0, fraction));
  return (
    <svg viewBox="0 0 36 36" aria-hidden className="size-10 -rotate-90">
      <circle cx="18" cy="18" r={r} fill="none" strokeWidth="4" className="stroke-ink/10" />
      <circle
        cx="18"
        cy="18"
        r={r}
        fill="none"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={`${(c * filled).toFixed(1)} ${c.toFixed(1)}`}
        className={className}
      />
    </svg>
  );
}

/** Week-over-week movement chip. */
function Delta({ change }: { change: number }) {
  const tone =
    change > 0 ? "bg-mint text-forest" : change < 0 ? "bg-blush text-blood" : "bg-linen text-ink-muted";
  return (
    <span
      title="Change vs the previous 7 days"
      className={cn("inline-flex items-center gap-0.5 rounded-full px-2.5 py-1 text-[11px] font-extrabold", tone)}
    >
      <ArrowUpRight size={12} className={change < 0 ? "rotate-90" : undefined} />
      {change > 0 ? `+${change}` : change}
    </span>
  );
}

/** Tiny inline trend line — cheaper than a chart lib for a 100x28 strip. */
function Sparkline({ points, className }: { points: number[]; className: string }) {
  const max = Math.max(...points, 1);
  const w = 100;
  const h = 28;
  const step = points.length > 1 ? w / (points.length - 1) : w;
  const d = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${(i * step).toFixed(1)},${(h - 3 - (p / max) * (h - 8)).toFixed(1)}`)
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden className={cn("h-7 w-full", className)}>
      <path d={d} fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" className="stroke-current" />
    </svg>
  );
}

// ---- "needs attention" strip -----------------------------------------------

export function AttentionStrip() {
  const { data, isPending, isError, error, refetch } = useAdminAnalytics();

  if (isPending) return <Skeleton className="h-[172px] rounded-[26px]" />;
  if (isError) return <QueryError error={error} onRetry={refetch} />;

  const cells = [
    {
      count: data.requests.byStatus.PENDING,
      label: "Awaiting verification",
      hint: "requests need an admin check",
      href: "/dashboard/admin/queue",
    },
    {
      count: Math.max(0, data.hospitals.total - data.hospitals.verified),
      label: "Unverified hospitals",
      hint: "licences waiting for review",
      href: "/dashboard/admin/hospitals?filter=unverified",
    },
    {
      count: data.bannedUsers,
      label: "Banned accounts",
      hint: "users currently blocked",
      href: "/dashboard/admin/users?filter=banned",
    },
  ].filter((cell) => cell.count > 0);

  if (cells.length === 0) {
    return (
      <div className="flex items-center gap-4 rounded-[26px] border border-forest/15 bg-mint/60 p-6">
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-mint-strong text-forest-deep">
          <CheckCircle2 size={20} />
        </span>
        <div>
          <p className="font-display text-lg text-forest-deep">All clear.</p>
          <p className="text-sm text-ink-muted">Nothing needs your attention right now — no pending verifications at all.</p>
        </div>
      </div>
    );
  }

  return (
    <section className="relative overflow-hidden rounded-[26px] bg-gradient-to-br from-maroon via-[#54141c] to-blood-deep p-6 text-cream sm:p-7">
      <div aria-hidden className="absolute -top-28 -right-20 size-72 rounded-full bg-blood/50 blur-3xl" />
      <div className="relative">
        <div className="flex items-center gap-2.5">
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-peach opacity-60" />
            <span className="relative inline-flex size-2.5 rounded-full bg-peach" />
          </span>
          <p className="text-[11px] font-extrabold tracking-[.18em] text-[#f2d8ca]/85 uppercase">Needs attention</p>
        </div>
        <div className={cn("mt-5 grid gap-3", cells.length === 2 ? "sm:grid-cols-2" : cells.length >= 3 ? "sm:grid-cols-3" : "")}>
          {cells.map((cell) => (
            <Link
              key={cell.label}
              href={cell.href}
              className="group flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[.07] p-5 transition-colors hover:bg-white/[.12]"
            >
              <div>
                <p className="font-display text-4xl tracking-[-.02em]">{cell.count}</p>
                <p className="mt-1.5 text-sm font-bold">{cell.label}</p>
                <p className="text-xs text-[#f2d8ca]/70">{cell.hint}</p>
              </div>
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white/10 transition-all group-hover:translate-x-0.5 group-hover:bg-white/20">
                <ArrowUpRight size={18} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---- KPI cards --------------------------------------------------------------

export function KpiCards() {
  const analytics = useAdminAnalytics();
  const series = useAdminTimeSeries(30);

  if (analytics.isPending) return <StatCardsSkeleton count={4} />;
  if (analytics.isError) return <QueryError error={analytics.error} onRetry={analytics.refetch} />;

  const a = analytics.data;
  const daily = series.data?.daily ?? [];
  const requests = weeklyChange(daily, "requests");
  const donations = weeklyChange(daily, "donations");
  const liveRequests = a.requests.byStatus.VERIFIED + a.requests.byStatus.MATCHED;

  const pendingDelta = <Skeleton className="h-6 w-14 rounded-full" />;

  const cards = [
    {
      key: "donors",
      icon: Users,
      tone: "bg-mint text-forest",
      label: "Donors",
      value: a.donors.total,
      note: `${a.donors.available} available right now`,
      accessory: <Ring fraction={ratio(a.donors.available, a.donors.total)} className="stroke-forest" />,
      spark: null,
    },
    {
      key: "hospitals",
      icon: Building2,
      tone: "bg-blush text-blood",
      label: "Hospitals",
      value: a.hospitals.total,
      note: `${a.hospitals.verified} verified partners`,
      accessory: <Ring fraction={ratio(a.hospitals.verified, a.hospitals.total)} className="stroke-blood" />,
      spark: null,
    },
    {
      key: "requests",
      icon: ClipboardList,
      tone: "bg-sand text-sand-deep",
      label: "Live requests",
      value: liveRequests,
      note: `${a.requests.total} posted all time · ${requests.recent} this week`,
      accessory: series.isPending ? pendingDelta : <Delta change={requests.change} />,
      spark: daily.slice(-14).map((day) => day.requests),
      sparkClass: "text-blood",
    },
    {
      key: "donations",
      icon: HandHeart,
      tone: "bg-peach text-maroon",
      label: "Donations completed",
      value: a.donationsCompleted,
      note: `${donations.recent} completed this week`,
      accessory: series.isPending ? pendingDelta : <Delta change={donations.change} />,
      spark: daily.slice(-14).map((day) => day.donations),
      sparkClass: "text-forest",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
      {cards.map(({ key, icon: Icon, tone, label, value, note, accessory, spark, sparkClass }) => (
        <div key={key} className="flex flex-col rounded-[24px] border border-ink/10 bg-cream p-4 sm:p-5">
          <div className="flex items-center justify-between gap-2">
            <span className={cn("grid size-9 place-items-center rounded-xl sm:size-10", tone)}>
              <Icon size={18} />
            </span>
            {accessory}
          </div>
          <p className="mt-3 font-display text-2xl tracking-[-.01em] sm:mt-4 sm:text-3xl">{value}</p>
          <p className="mt-1 text-sm font-bold text-ink-muted">{label}</p>
          <p className="mt-0.5 text-xs font-semibold text-ink-faint">{note}</p>
          {spark && (
            <div className={cn("mt-auto pt-3", sparkClass)}>
              <Sparkline points={spark} className="" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
