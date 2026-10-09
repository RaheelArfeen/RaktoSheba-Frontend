"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  Ban,
  ClipboardList,
  Clock,
  Droplets,
  HandHeart,
  Info,
  MapPin,
  PartyPopper,
  Plus,
  Settings2,
} from "lucide-react";
import { FetchingHint, QueryError } from "@/components/dashboard/list-controls";
import { RequestCard } from "@/components/request/request-card";
import { ButtonLink } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiError } from "@/lib/api";
import { cn } from "@/lib/cn";
import { hospitalTypeLabel } from "@/lib/hospitals";
import { useHospitalProfile, useHospitalRequestStats, useHospitalRequests } from "@/lib/queries/use-hospital";
import type { Hospital, RequestStatus, VerificationStatus } from "@/types";
import { toPublicRequest } from "./public-request";

const PIPELINE: { status: RequestStatus; label: string; bar: string }[] = [
  { status: "PENDING", label: "Pending verification", bar: "bg-sand-deep/70" },
  { status: "VERIFIED", label: "Open to donors", bar: "bg-blood" },
  { status: "MATCHED", label: "Donor matched", bar: "bg-blush-deep" },
  { status: "FULFILLED", label: "Fulfilled", bar: "bg-forest" },
  { status: "CANCELLED", label: "Cancelled", bar: "bg-ink/20" },
];

const VERIFICATION_BANNER: Record<
  VerificationStatus,
  { icon: typeof BadgeCheck; wrap: string; iconTone: string; title: string; titleTone: string; text: string }
> = {
  VERIFIED: {
    icon: BadgeCheck,
    wrap: "border-forest/20 bg-mint",
    iconTone: "text-forest",
    title: "Verified hospital",
    titleTone: "text-forest-deep",
    text: "Your requests go to compatible donors as soon as our team verifies each one.",
  },
  PENDING: {
    icon: Clock,
    wrap: "border-sand-deep/20 bg-sand",
    iconTone: "text-sand-deep",
    title: "Waiting for verification",
    titleTone: "text-sand-deep",
    text: "An admin checks every new hospital before its requests reach donors. This usually takes less than a day.",
  },
  REJECTED: {
    icon: Ban,
    wrap: "border-blood/20 bg-blush",
    iconTone: "text-blood",
    title: "Verification rejected",
    titleTone: "text-blood",
    text: "Our team couldn't verify these details, so your requests stay off the donor board. Update your hospital profile and we'll review it again.",
  },
};

export function HospitalOverview() {
  const profileQuery = useHospitalProfile();

  if (profileQuery.isPending) return <OverviewSkeleton />;

  const noProfile = profileQuery.error instanceof ApiError && profileQuery.error.status === 404;
  if (noProfile) return <NoProfileView />;

  if (profileQuery.isError) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <HeaderSkeleton />
        <QueryError error={profileQuery.error} onRetry={profileQuery.refetch} />
      </div>
    );
  }

  return <OverviewBody hospital={profileQuery.data} />;
}

function OverviewBody({ hospital }: { hospital: Hospital }) {
  const searchParams = useSearchParams();
  const welcome = searchParams.get("welcome");

  const statsQuery = useHospitalRequestStats();
  const recentQuery = useHospitalRequests({ page: 1, limit: 5, sortBy: "createdAt", sortOrder: "desc" });

  const stats = statsQuery.data;
  const recent = recentQuery.data?.data ?? [];
  const fetching =
    (statsQuery.isFetching && !statsQuery.isPending) || (recentQuery.isFetching && !recentQuery.isPending);

  const cards = stats
    ? [
        {
          key: "total",
          icon: ClipboardList,
          tone: "bg-blush text-blood",
          label: "Total requests",
          value: stats.total,
          note: "Posted by your hospital",
        },
        {
          key: "pending",
          icon: Clock,
          tone: "bg-sand text-sand-deep",
          label: "Awaiting verification",
          value: stats.byStatus.PENDING,
          note: "An admin checks every new request",
        },
        {
          key: "live",
          icon: Droplets,
          tone: "bg-peach text-maroon",
          label: "Live requests",
          value: stats.byStatus.VERIFIED + stats.byStatus.MATCHED,
          note: `${stats.openUnits} unit${stats.openUnits === 1 ? "" : "s"} still needed`,
        },
        {
          key: "done",
          icon: HandHeart,
          tone: "bg-mint text-forest",
          label: "Donations completed",
          value: stats.donationsCompleted,
          note: "Through your requests",
        },
      ]
    : [];

  const maxCount = stats ? Math.max(...PIPELINE.map((row) => stats.byStatus[row.status]), 1) : 1;
  const banner = VERIFICATION_BANNER[hospital.verificationStatus];
  const BannerIcon = banner.icon;
  const typeLabel = hospitalTypeLabel(hospital.type);

  return (
    <div className="space-y-6 sm:space-y-8">
      {welcome && (
        <div className="flex items-start gap-4 rounded-[24px] bg-mint p-5">
          <PartyPopper className="mt-0.5 size-6 shrink-0 text-forest" />
          <div>
            <p className="font-extrabold text-forest-deep">Welcome to RaktoSheba!</p>
            <p className="mt-1 text-sm text-[#4a806c]">Your hospital account is ready. Our team will verify it shortly.</p>
          </div>
        </div>
      )}

      <header>
        <Eyebrow>Hospital workspace</Eyebrow>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="font-display text-3xl tracking-[-.015em] sm:text-4xl">{hospital.name || "Your hospital"}</h1>
          {typeLabel && (
            <span className="rounded-full bg-linen px-3 py-1 text-xs font-extrabold text-ink-soft">{typeLabel}</span>
          )}
          <FetchingHint active={fetching} />
        </div>
        <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-ink-muted">
          <span className="inline-flex items-center gap-1.5">
            <MapPin size={15} /> {hospital.address}
          </span>
          {hospital.district && <span className="text-ink-faint">· {hospital.district}</span>}
          {hospital.upazila && <span className="text-ink-faint">· {hospital.upazila}</span>}
        </p>
      </header>

      <div className={cn("flex items-start gap-4 rounded-[24px] border p-6", banner.wrap)}>
        <BannerIcon className={cn("size-6 shrink-0", banner.iconTone)} />
        <div>
          <p className={cn("font-extrabold", banner.titleTone)}>{banner.title}</p>
          <p className="mt-1 text-sm text-ink-muted">{banner.text}</p>
        </div>
      </div>

      {statsQuery.isPending && (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[130px] rounded-[24px] sm:h-[142px]" />
          ))}
        </div>
      )}

      {statsQuery.isError && <QueryError error={statsQuery.error} onRetry={statsQuery.refetch} />}

      {stats && (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
          {cards.map(({ key, icon: Icon, tone, label, value, note }) => (
            <div key={key} className="flex flex-col rounded-[24px] border border-ink/10 bg-cream p-4 sm:p-5">
              <span className={cn("grid size-9 place-items-center rounded-xl sm:size-10", tone)}>
                <Icon size={18} />
              </span>
              <p className="mt-3 font-display text-2xl tracking-[-.01em] sm:mt-4 sm:text-3xl">{value}</p>
              <p className="mt-1 text-sm font-bold text-ink-muted">{label}</p>
              <p className="mt-0.5 text-xs font-semibold text-ink-faint">{note}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <section aria-labelledby="recent-heading" className="space-y-4 lg:col-span-2">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 id="recent-heading" className="font-display text-xl tracking-[-.01em] sm:text-2xl">
                Recent requests
              </h2>
              <p className="mt-1 flex items-center gap-2 text-sm text-ink-muted">
                {recentQuery.isPending
                  ? "Loading your requests…"
                  : recent.length === 0
                    ? "Nothing posted yet."
                    : "Your five latest requests, newest first."}
                <FetchingHint active={recentQuery.isFetching && !recentQuery.isPending} />
              </p>
            </div>
            <div className="flex w-full items-center justify-between gap-4 sm:w-auto sm:justify-start">
              {stats && stats.total > 0 && (
                <Link
                  href="/dashboard/hospital/requests"
                  className="inline-flex items-center gap-1 text-sm font-bold text-blood hover:underline"
                >
                  See all requests <ArrowRight size={15} />
                </Link>
              )}
              <ButtonLink href="/dashboard/hospital/requests/new" size="sm" className="flex-1 sm:flex-none">
                <Plus /> New request
              </ButtonLink>
            </div>
          </div>

          {recentQuery.isPending && (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-[112px] rounded-[24px]" />
              ))}
            </div>
          )}

          {recentQuery.isError && <QueryError error={recentQuery.error} onRetry={recentQuery.refetch} />}

          {recentQuery.data &&
            (recent.length > 0 ? (
              <div className={cn("space-y-3 transition-opacity", recentQuery.isFetching && "opacity-60")}>
                {recent.map((r) => (
                  <RequestCard key={r.id} request={toPublicRequest(r)} href={`/dashboard/hospital/requests/${r.id}`} />
                ))}
              </div>
            ) : (
              <div className="rounded-[24px] border border-dashed border-ink/15 bg-cream p-8 text-center">
                <p className="font-bold">No requests yet.</p>
                <p className="mt-1 text-sm text-ink-muted">Post your first blood request to get matched with donors.</p>
              </div>
            ))}
        </section>

        <aside className="space-y-4">
          <section className="rounded-[24px] border border-ink/10 bg-cream p-6">
            <h2 className="font-display text-lg tracking-[-.01em]">Request pipeline</h2>
            <p className="mt-1 text-sm text-ink-muted">Where every request stands right now.</p>

            {statsQuery.isPending ? (
              <div className="mt-5 space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-2 w-full rounded-full" />
                  </div>
                ))}
              </div>
            ) : stats ? (
              <>
                <dl className="mt-5 space-y-4">
                  {PIPELINE.map((row) => {
                    const count = stats.byStatus[row.status];
                    return (
                      <div key={row.status}>
                        <div className="flex items-center justify-between text-sm">
                          <dt className="font-bold text-ink-muted">{row.label}</dt>
                          <dd className="font-display">{count}</dd>
                        </div>
                        <div className="mt-1.5 h-2 rounded-full bg-linen">
                          <div
                            className={cn("h-2 rounded-full transition-[width] duration-500", row.bar)}
                            style={{ width: `${(count / maxCount) * 100}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </dl>
                {stats.byStatus.PENDING > 0 && (
                  <p className="mt-5 flex items-start gap-2 rounded-2xl bg-sand/60 px-4 py-3 text-xs leading-5 font-semibold text-sand-deep">
                    <Info size={14} className="mt-0.5 shrink-0" />
                    {stats.byStatus.PENDING} request{stats.byStatus.PENDING === 1 ? "" : "s"} waiting for an admin
                    check — donors are alerted the moment it&apos;s verified.
                  </p>
                )}
              </>
            ) : null}
          </section>

          <section className="rounded-[24px] border border-ink/10 bg-cream p-6">
            <h2 className="font-display text-lg tracking-[-.01em]">Quick actions</h2>
            <div className="mt-4 space-y-2">
              <ButtonLink href="/dashboard/hospital/requests/new" className="w-full">
                <Plus /> Post a blood request
              </ButtonLink>
              <ButtonLink href="/dashboard/hospital/requests" variant="outline" className="w-full">
                Browse all requests
              </ButtonLink>
              <ButtonLink href="/dashboard/hospital/profile" variant="ghost" className="w-full">
                <Settings2 /> Hospital profile
              </ButtonLink>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

function NoProfileView() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <header>
        <Eyebrow>Hospital workspace</Eyebrow>
        <h1 className="mt-2 font-display text-3xl tracking-[-.015em] sm:text-4xl">Your hospital</h1>
      </header>
      <div className="rounded-[26px] border border-dashed border-ink/15 bg-cream p-8">
        <p className="font-display text-xl tracking-[-.01em]">Your hospital profile isn&apos;t set up yet.</p>
        <p className="mt-2 max-w-xl text-sm leading-6 text-ink-muted">
          We couldn&apos;t find hospital details on your account. Contact support at{" "}
          <a
            href="mailto:support@raktosheba.org"
            className="font-semibold text-blood underline-offset-2 hover:underline"
          >
            support@raktosheba.org
          </a>{" "}
          and we&apos;ll attach them — then you can post requests.
        </p>
      </div>
    </div>
  );
}

function HeaderSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-3 w-36" />
      <Skeleton className="h-10 w-80 max-w-full" />
      <Skeleton className="h-4 w-56" />
    </div>
  );
}

function OverviewSkeleton() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <HeaderSkeleton />
      <Skeleton className="h-[92px] rounded-[24px]" />
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[130px] rounded-[24px] sm:h-[142px]" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[112px] rounded-[24px]" />
          ))}
        </div>
        <div className="space-y-4">
          <Skeleton className="h-[280px] rounded-[24px]" />
          <Skeleton className="h-[196px] rounded-[24px]" />
        </div>
      </div>
    </div>
  );
}
