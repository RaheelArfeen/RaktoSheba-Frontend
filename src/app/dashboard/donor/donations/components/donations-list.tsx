"use client";

import Link from "next/link";
import { ArrowRight, CalendarCheck, CheckCircle2, HeartHandshake, MapPin, XCircle } from "lucide-react";
import { FetchingHint, QueryError } from "@/components/dashboard/list-controls";
import { ButtonLink } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiError } from "@/lib/api";
import { bloodGroupLabel } from "@/lib/blood";
import { cn } from "@/lib/cn";
import { unitsLabel, formatDate } from "@/lib/format";
import { useDonorDonations, useDonorProfile } from "@/lib/queries/use-donor";
import type { MyDonation } from "@/types";
import { NoProfile } from "../../components/no-profile";
import { WithdrawButton } from "../../components/withdraw-button";

/** One plain-words state per donation, from the donation and its request. */
function stateOf(d: MyDonation) {
  if (d.status === "COMPLETED" || d.request.status === "FULFILLED")
    return { label: "Donated", icon: CheckCircle2, tone: "bg-mint text-forest", date: d.completedAt ?? d.scheduledAt };
  if (d.status === "CANCELLED" || d.request.status === "CANCELLED")
    return { label: "Cancelled", icon: XCircle, tone: "bg-linen text-ink-muted", date: d.scheduledAt };
  return { label: "Upcoming", icon: CalendarCheck, tone: "bg-sand text-sand-deep", date: d.scheduledAt };
}

export function DonorDonations() {
  const profileQuery = useDonorProfile();

  if (profileQuery.isPending) return <DonationsSkeleton />;

  const noProfile = profileQuery.error instanceof ApiError && profileQuery.error.status === 404;
  if (noProfile) return <NoProfile />;
  if (profileQuery.isError) return <QueryError error={profileQuery.error} onRetry={profileQuery.refetch} />;

  return <DonationsBody />;
}

function DonationsBody() {
  const donationsQuery = useDonorDonations();
  const donations = donationsQuery.data ?? [];

  const states = donations.map(stateOf);
  const given = states.filter((s) => s.label === "Donated").length;
  const upcoming = states.filter((s) => s.label === "Upcoming").length;
  const units = donations.reduce((sum, d, i) => (states[i].label === "Donated" ? sum + d.request.unitsNeeded : sum), 0);

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <Eyebrow>My donations</Eyebrow>
        <h1 className="mt-2 font-display text-3xl tracking-[-.015em] sm:text-4xl">Every time you said yes.</h1>
        <p className="mt-2 flex items-center gap-2 text-ink-muted">
          Your donations, newest first. <FetchingHint active={donationsQuery.isFetching && !donationsQuery.isPending} />
        </p>
      </div>

      <dl className="grid grid-cols-3 gap-3 sm:gap-4">
        {[
          { label: "Donated", value: given },
          { label: "Upcoming", value: upcoming },
          { label: "Units given", value: units },
        ].map((stat) => (
          <div key={stat.label} className="rounded-[22px] border border-ink/10 bg-cream p-4 sm:p-6">
            <dt className="text-[11px] font-bold tracking-[.12em] text-ink-faint uppercase">{stat.label}</dt>
            <dd className="mt-1 font-display text-2xl sm:text-3xl">
              {donationsQuery.isPending ? <Skeleton className="h-9 w-10 rounded-lg" /> : stat.value}
            </dd>
          </div>
        ))}
      </dl>

      {donationsQuery.isError && <QueryError error={donationsQuery.error} onRetry={donationsQuery.refetch} />}

      {donationsQuery.isPending && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[104px] rounded-[22px]" />
          ))}
        </div>
      )}

      {donationsQuery.data &&
        (donations.length === 0 ? (
          <div className="flex flex-col items-center rounded-[26px] border border-dashed border-ink/15 bg-cream px-6 py-14 text-center">
            <span className="grid size-14 place-items-center rounded-2xl bg-blush text-blood">
              <HeartHandshake className="size-6" />
            </span>
            <p className="mt-5 font-display text-xl tracking-[-.01em]">No donations yet</p>
            <p className="mt-2 max-w-sm text-sm leading-6 text-ink-muted">When you say yes to a request, it shows up here so you can keep track.</p>
            <ButtonLink href="/dashboard/donor/matches" className="mt-6">
              See requests I can help <ArrowRight />
            </ButtonLink>
          </div>
        ) : (
          <ol className="space-y-3">
            {donations.map((d, i) => {
              const state = states[i];
              const hospital = d.request.requester.hospital;
              const canWithdraw = state.label === "Upcoming";
              return (
                <li key={d.id} className="flex flex-col gap-4 rounded-[22px] border border-ink/10 bg-cream p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-start gap-4">
                    <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-blush text-lg font-extrabold text-blood">
                      {bloodGroupLabel[d.request.bloodGroup]}
                    </span>
                    <div className="min-w-0">
                      <Link href={`/requests/${d.request.id}`} className="font-bold hover:text-blood hover:underline">
                        {hospital?.name ?? "Partner hospital"}
                      </Link>
                      <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-muted">
                        <MapPin size={13} className="shrink-0" />
                        <span className="truncate">{hospital?.address ?? "Bangladesh"}</span>
                      </p>
                      <p className="mt-1 text-xs font-bold text-ink-faint">
                        {unitsLabel(d.request.unitsNeeded)}
                        {state.date && ` · ${formatDate(state.date)}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {canWithdraw && d.status !== "CANCELLED" && <WithdrawButton donationId={d.id} size="sm" />}
                    <span className={cn("inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-extrabold", state.tone)}>
                      <state.icon size={14} /> {state.label}
                    </span>
                  </div>
                </li>
              );
            })}
          </ol>
        ))}
    </div>
  );
}

function DonationsSkeleton() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="space-y-3">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-10 w-80 max-w-full" />
        <Skeleton className="h-4 w-56" />
      </div>
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-[86px] rounded-[22px]" />
        ))}
      </div>
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[104px] rounded-[22px]" />
        ))}
      </div>
    </div>
  );
}
