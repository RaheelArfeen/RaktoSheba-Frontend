"use client";

import { useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { FetchingHint, QueryError } from "@/components/dashboard/list-controls";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/cn";
import { useAdminTimeSeries } from "@/lib/queries/use-admin";

const RANGES = [7, 30, 90] as const;
type Range = (typeof RANGES)[number];

const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "Asia/Dhaka" });

type TooltipEntry = { dataKey?: string | number; value?: number | string; color?: string };

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-2xl border border-ink/10 bg-cream px-4 py-3 shadow-[0_16px_40px_rgba(62,41,36,.16)]">
      <p className="text-xs font-extrabold tracking-wide text-ink-muted uppercase">{label ? shortDate(label) : ""}</p>
      <div className="mt-2 space-y-1">
        {payload.map((entry) => (
          <p key={String(entry.dataKey)} className="flex items-center gap-2 text-sm font-bold text-ink">
            <span className="size-2.5 rounded-full" style={{ background: entry.color }} />
            {entry.dataKey === "requests" ? "Requests" : "Donations"}
            <span className="ml-auto pl-4 font-display">{entry.value}</span>
          </p>
        ))}
      </div>
    </div>
  );
}

export function ActivityChart({ className }: { className?: string }) {
  const [range, setRange] = useState<Range>(30);
  const { data, isPending, isError, isFetching, error, refetch } = useAdminTimeSeries(range);

  if (isPending) {
    return (
      <section className={cn("rounded-[24px] border border-ink/10 bg-cream p-5 sm:p-6", className)}>
        <Skeleton className="h-6 w-52" />
        <Skeleton className="mt-2 h-3 w-72 max-w-full" />
        <Skeleton className="mt-6 h-[220px] rounded-2xl sm:h-[260px]" />
      </section>
    );
  }
  if (isError) {
    return (
      <section className={className}>
        <QueryError error={error} onRetry={refetch} />
      </section>
    );
  }

  const daily = data.daily;
  const totalRequests = daily.reduce((sum, day) => sum + day.requests, 0);
  const totalDonations = daily.reduce((sum, day) => sum + day.donations, 0);

  return (
    <section className={cn("rounded-[24px] border border-ink/10 bg-cream p-5 sm:p-6", className)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display text-lg tracking-[-.01em]">Request &amp; donation activity</h2>
            <FetchingHint active={isFetching} />
          </div>
          <p className="mt-1 text-sm text-ink-muted">
            {totalRequests} request{totalRequests === 1 ? "" : "s"} · {totalDonations} donation
            {totalDonations === 1 ? "" : "s"} in the last {range} days
          </p>
        </div>
        <div className="flex rounded-full border border-ink/10 bg-paper p-1">
          {RANGES.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setRange(option)}
              aria-pressed={option === range}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors",
                option === range ? "bg-cream text-blood shadow-sm" : "text-ink-muted hover:text-ink",
              )}
            >
              {option}d
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-4 text-xs font-bold text-ink-muted">
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-blood" /> Requests
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-forest" /> Donations
        </span>
      </div>

      <div className={cn("mt-2 h-[220px] transition-opacity sm:h-[260px]", isFetching && "opacity-60")}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={daily} margin={{ top: 8, right: 4, bottom: 0, left: -14 }}>
            <defs>
              <linearGradient id="fillRequests" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a92836" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#a92836" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="fillDonations" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#287c5d" stopOpacity={0.28} />
                <stop offset="95%" stopColor="#287c5d" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#eee6dc" strokeDasharray="4 6" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              minTickGap={32}
              tick={{ fontSize: 11, fill: "#806b61", fontWeight: 700 }}
              tickFormatter={shortDate}
            />
            <YAxis
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              width={38}
              tick={{ fontSize: 11, fill: "#806b61", fontWeight: 700 }}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ stroke: "#a92836", strokeOpacity: 0.16, strokeWidth: 2 }} />
            <Area
              type="monotone"
              dataKey="requests"
              stroke="#a92836"
              strokeWidth={2.5}
              fill="url(#fillRequests)"
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
            <Area
              type="monotone"
              dataKey="donations"
              stroke="#287c5d"
              strokeWidth={2.5}
              fill="url(#fillDonations)"
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
