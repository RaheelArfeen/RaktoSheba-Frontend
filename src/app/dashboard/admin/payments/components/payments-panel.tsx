"use client";

import { CircleX, Clock3, HandCoins, HeartPulse, Receipt } from "lucide-react";
import { EmptyState, FetchingHint, FilterChips, PaginationBar, QueryError } from "@/components/dashboard/list-controls";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Skeleton, StatCardsSkeleton } from "@/components/ui/skeleton";
import { auditActionMeta } from "@/lib/audit";
import { cn } from "@/lib/cn";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/format";
import { useAdminPayments, useAuditLog, usePaymentStats } from "@/lib/queries/use-admin";
import { useUrlState } from "@/lib/url-state";
import type { PaymentPurpose, PaymentStatus } from "@/types";

type Tab = "payments" | "audit";

const TABS: { label: string; value: Tab }[] = [
  { label: "Payments", value: "payments" },
  { label: "Audit log", value: "audit" },
];

const STATUS_VALUES: PaymentStatus[] = ["PENDING", "PAID", "FAILED"];
const PURPOSE_VALUES: PaymentPurpose[] = ["PLATFORM_DONATION", "EMERGENCY_FUND"];

const purposeLabel: Record<PaymentPurpose, string> = {
  PLATFORM_DONATION: "Platform donation",
  EMERGENCY_FUND: "Emergency fund",
};

const purposeTone: Record<PaymentPurpose, string> = {
  PLATFORM_DONATION: "bg-blush text-blood",
  EMERGENCY_FUND: "bg-sand text-sand-deep",
};

const statusLabel: Record<PaymentStatus, string> = {
  PAID: "Paid",
  PENDING: "Pending",
  FAILED: "Failed",
};

const statusClass: Record<PaymentStatus, string> = {
  PAID: "bg-mint text-forest",
  PENDING: "bg-sand text-sand-deep",
  FAILED: "bg-linen text-ink-muted",
};

export function PaymentsPanel() {
  const { get, update } = useUrlState();
  const tab: Tab = get("tab") === "audit" ? "audit" : "payments";
  const page = Math.max(1, parseInt(get("page") ?? "1", 10) || 1);

  return (
    <div className="space-y-6">
      <div>
        <Eyebrow>Financials &amp; audit</Eyebrow>
        <h1 className="mt-2 font-display text-3xl tracking-[-.015em] sm:text-4xl">Payments &amp; audit log</h1>
        <p className="mt-2 text-sm text-ink-muted">Every gateway transaction and every admin action, in one place.</p>
      </div>

      <StatsRow />

      <FilterChips
        label="Section"
        options={TABS}
        value={tab}
        onChange={(next) => update({ tab: next === "payments" ? undefined : next, page: undefined })}
      />

      {tab === "payments" ? <PaymentsTab page={page} /> : <AuditTab page={page} />}
    </div>
  );
}

// ---- Aggregates -------------------------------------------------------------

function StatsRow() {
  const { data, isPending, isError, error, refetch } = usePaymentStats();

  if (isPending) return <StatCardsSkeleton count={4} />;
  if (isError || !data) return <QueryError error={error} onRetry={refetch} />;

  const cards = [
    {
      key: "collected",
      icon: HandCoins,
      tone: "bg-mint text-forest",
      label: "Total collected",
      value: formatCurrency(data.totalCollected),
      note: `${data.byStatus.PAID.count} successful payments`,
    },
    {
      key: "payments",
      icon: Receipt,
      tone: "bg-blush text-blood",
      label: "Payments",
      value: String(data.totalPayments),
      note: `${data.byPurpose.PLATFORM_DONATION.count} platform · ${data.byPurpose.EMERGENCY_FUND.count} emergency`,
    },
    {
      key: "pending",
      icon: Clock3,
      tone: "bg-sand text-sand-deep",
      label: "Awaiting confirmation",
      value: String(data.byStatus.PENDING.count),
      note: `${formatCurrency(data.byStatus.PENDING.amount)} in flight`,
    },
    {
      key: "failed",
      icon: CircleX,
      tone: "bg-linen text-ink-muted",
      label: "Failed",
      value: String(data.byStatus.FAILED.count),
      note: `${formatCurrency(data.byStatus.FAILED.amount)} not collected`,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
      {cards.map(({ key, icon: Icon, tone, label, value, note }) => (
        <div key={key} className="flex flex-col rounded-[24px] border border-ink/10 bg-cream p-4 sm:p-5">
          <span className={cn("grid size-9 place-items-center rounded-xl sm:size-10", tone)}>
            <Icon size={18} />
          </span>
          <p className="mt-3 font-display text-2xl tracking-[-.015em] sm:mt-4 lg:text-3xl">{value}</p>
          <p className="mt-1 text-sm font-bold text-ink-muted">{label}</p>
          <p className="mt-0.5 text-xs font-semibold text-ink-faint">{note}</p>
        </div>
      ))}
    </div>
  );
}

// ---- Payments tab -----------------------------------------------------------

function PaymentsTab({ page }: { page: number }) {
  const { get, update } = useUrlState();
  const rawStatus = get("status");
  const rawPurpose = get("purpose");
  const status: PaymentStatus | "all" = STATUS_VALUES.includes(rawStatus as PaymentStatus)
    ? (rawStatus as PaymentStatus)
    : "all";
  const purpose: PaymentPurpose | "all" = PURPOSE_VALUES.includes(rawPurpose as PaymentPurpose)
    ? (rawPurpose as PaymentPurpose)
    : "all";

  const { data, isPending, isFetching, isError, error, refetch } = useAdminPayments({
    page,
    limit: 10,
    status: status === "all" ? undefined : status,
    purpose: purpose === "all" ? undefined : purpose,
  });

  const total = data?.meta.total ?? 0;
  const totalPages = data?.meta.totalPage ?? Math.ceil(total / 10);
  const filtered = status !== "all" || purpose !== "all";
  const fetching = isFetching && !isPending;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2.5">
          <FilterChips
            className="sm:flex-1 lg:flex-none"
            label="Payment status"
            options={[{ label: "All statuses", value: "all" as const }, ...STATUS_VALUES.map((s) => ({ label: statusLabel[s], value: s }))]}
            value={status}
            onChange={(next) => update({ status: next === "all" ? undefined : next, page: undefined })}
          />
          <FilterChips
            className="sm:flex-1 lg:flex-none"
            label="Payment purpose"
            options={[{ label: "All purposes", value: "all" as const }, ...PURPOSE_VALUES.map((p) => ({ label: purposeLabel[p], value: p }))]}
            value={purpose}
            onChange={(next) => update({ purpose: next === "all" ? undefined : next, page: undefined })}
          />
        </div>
        <div className="flex items-center gap-3">
          {data && (
            <p className="text-sm font-semibold text-ink-muted">
              {total} payment{total === 1 ? "" : "s"}
            </p>
          )}
          <FetchingHint active={fetching} />
        </div>
      </div>

      {isPending && <RowSkeleton height="h-[92px]" count={5} />}

      {isError && <QueryError error={error} onRetry={refetch} />}

      {data && data.data.length === 0 && (
        <>
          {total > 0 ? (
            <EmptyState
              title="Nothing on this page"
              hint="This page is past the end of the list — head back to the first page."
              action={
                <Button variant="soft" size="sm" onClick={() => update({ page: undefined })}>
                  Back to page 1
                </Button>
              }
            />
          ) : (
            <EmptyState
              title={filtered ? "No payments match these filters" : "No payments yet"}
              hint={
                filtered
                  ? "Try a different status or purpose, or clear the filters to see everything."
                  : "Donations made through the platform will appear here."
              }
              action={
                filtered ? (
                  <Button variant="soft" size="sm" onClick={() => update({ status: undefined, purpose: undefined, page: undefined })}>
                    Clear filters
                  </Button>
                ) : undefined
              }
            />
          )}
        </>
      )}

      {data && data.data.length > 0 && (
        <div className={cn("space-y-3 transition-opacity", fetching && "opacity-60")}>
          {data.data.map((payment) => (
            <div
              key={payment.id}
              className="flex flex-col gap-4 rounded-[24px] border border-ink/10 bg-cream p-5 transition-colors hover:border-ink/20 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 items-center gap-4">
                <span className={cn("grid size-11 shrink-0 place-items-center rounded-[15px]", purposeTone[payment.purpose])}>
                  {payment.purpose === "PLATFORM_DONATION" ? <HandCoins size={18} /> : <HeartPulse size={18} />}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-bold text-ink">{payment.user?.email ?? payment.userId}</p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    <Badge className={purposeTone[payment.purpose]}>{purposeLabel[payment.purpose]}</Badge>
                    <span className="text-xs font-semibold text-ink-muted">{formatDate(payment.createdAt)}</span>
                    {payment.gatewayRef && (
                      <span className="hidden truncate font-mono text-[10px] font-bold text-ink-faint sm:inline">
                        {payment.gatewayRef}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex shrink-0 items-center justify-between gap-4 sm:flex-col sm:items-end sm:gap-1.5">
                <p className="font-display text-xl tracking-[-.01em]">
                  {formatCurrency(payment.amount, payment.currency)}
                </p>
                <Badge className={statusClass[payment.status]}>{statusLabel[payment.status]}</Badge>
              </div>
            </div>
          ))}
        </div>
      )}

      <PaginationBar page={page} totalPages={totalPages} onPage={(next) => update({ page: next > 1 ? next : undefined })} />
    </div>
  );
}

// ---- Audit tab --------------------------------------------------------------

function AuditTab({ page }: { page: number }) {
  const { update } = useUrlState();
  const { data, isPending, isFetching, isError, error, refetch } = useAuditLog({ page, limit: 15 });

  const total = data?.meta.total ?? 0;
  const totalPages = data?.meta.totalPage ?? Math.ceil(total / 15);
  const fetching = isFetching && !isPending;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        {data && (
          <p className="text-sm font-semibold text-ink-muted">
            {total} entr{total === 1 ? "y" : "ies"}
          </p>
        )}
        <FetchingHint active={fetching} />
      </div>

      {isPending && <RowSkeleton height="h-[82px]" count={6} />}

      {isError && <QueryError error={error} onRetry={refetch} />}

      {data && data.data.length === 0 && (
        <>
          {total > 0 ? (
            <EmptyState
              title="Nothing on this page"
              hint="This page is past the end of the list — head back to the first page."
              action={
                <Button variant="soft" size="sm" onClick={() => update({ page: undefined })}>
                  Back to page 1
                </Button>
              }
            />
          ) : (
            <EmptyState
              title="No audit entries yet"
              hint="Verifications, bans, fulfilments and withdrawals will show up here as they happen."
            />
          )}
        </>
      )}

      {data && data.data.length > 0 && (
        <ul className={cn("space-y-2 transition-opacity", fetching && "opacity-60")}>
          {data.data.map((log) => {
            const meta = auditActionMeta(log.action);
            return (
              <li
                key={log.id}
                className="flex gap-4 rounded-[20px] border border-ink/10 bg-cream px-4 py-3.5 transition-colors hover:border-ink/20 sm:px-5 sm:py-4"
              >
                <span aria-hidden className={cn("mt-1.5 size-2.5 shrink-0 rounded-full", meta.dot)} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                    <p className="min-w-0 truncate text-sm text-ink">
                      <span className="font-bold">{log.actor.email}</span>{" "}
                      <span className="text-ink-muted">{meta.label}</span>
                    </p>
                    <code className="rounded-full bg-paper px-2.5 py-0.5 font-mono text-[10px] font-bold text-blood">
                      {log.action}
                    </code>
                  </div>
                  <p className="mt-1 flex flex-wrap items-center gap-x-2 text-xs font-semibold text-ink-faint">
                    <span className="max-w-[240px] truncate">
                      {log.targetType} · {log.targetId}
                    </span>
                    <span aria-hidden>—</span>
                    <span>{formatDateTime(log.createdAt)}</span>
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <PaginationBar page={page} totalPages={totalPages} onPage={(next) => update({ page: next > 1 ? next : undefined })} />
    </div>
  );
}

// ---- Shared -----------------------------------------------------------------

function RowSkeleton({ height, count }: { height: string; count: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className={cn("rounded-[24px]", height)} />
      ))}
    </div>
  );
}
