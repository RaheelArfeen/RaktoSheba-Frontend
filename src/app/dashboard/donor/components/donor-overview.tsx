"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, CalendarClock, CheckCircle2, Droplets, HeartHandshake, Info, PartyPopper } from "lucide-react";
import { FetchingHint, QueryError } from "@/components/dashboard/list-controls";
import { useCurrentUser } from "@/components/dashboard/user-context";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiError } from "@/lib/api";
import { bloodGroupLabel, DONATION_INTERVAL_DAYS } from "@/lib/blood";
import { addDays, daysUntil, formatDate } from "@/lib/format";
import { useDonorDonations, useDonorMatches, useDonorProfile } from "@/lib/queries/use-donor";
import type { DonorProfile } from "@/types";
import { ActiveDonationCard } from "./active-donation-card";
import { AvailabilityToggle } from "./availability-toggle";
import { acceptBlocker, findActiveDonation } from "./blockers";
import { MatchCard } from "./match-card";
import { NoProfile } from "./no-profile";

export function DonorOverview() {
  const user = useCurrentUser();
  const profileQuery = useDonorProfile();

  if (profileQuery.isPending) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <HeaderSkeleton />
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-[150px] rounded-[24px]" />
          ))}
        </div>
        <Skeleton className="h-[94px] rounded-[24px]" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-[112px] rounded-[24px]" />
          ))}
        </div>
      </div>
    );
  }

  const noProfile = profileQuery.error instanceof ApiError && profileQuery.error.status === 404;
  if (noProfile) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <Header email={user.email} />
        <NoProfile />
      </div>
    );
  }

  if (profileQuery.isError) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <Header email={user.email} />
        <QueryError error={profileQuery.error} onRetry={profileQuery.refetch} />
      </div>
    );
  }

  return <OverviewBody profile={profileQuery.data} />;
}

function OverviewBody({ profile }: { profile: DonorProfile }) {
  const user = useCurrentUser();
  const searchParams = useSearchParams();
  const welcome = searchParams.get("welcome");
  const requestId = searchParams.get("request") ?? undefined;

  const matchesQuery = useDonorMatches();
  const donationsQuery = useDonorDonations();

  const matches = matchesQuery.data ?? [];
  const donations = donationsQuery.data ?? [];
  const active = donationsQuery.data ? findActiveDonation(donations) : null;
  const blocker = acceptBlocker(profile, active);
  const completed = donations.filter((d) => d.status === "COMPLETED").length;
  const nextEligible = profile.lastDonationAt ? addDays(profile.lastDonationAt, DONATION_INTERVAL_DAYS) : null;

  // Arrived from a request page's "I can help" button.
  const wanted = requestId ? matches.find((m) => m.id === requestId) : undefined;
  const wantedIsActive = requestId && active?.request.id === requestId;
  const others = matches.filter((m) => m.id !== wanted?.id).slice(0, 3);
  const fetching = matchesQuery.isFetching || donationsQuery.isFetching;

  return (
    <div className="space-y-6 sm:space-y-8">
      {welcome && (
        <div className="flex items-start gap-4 rounded-[24px] bg-mint p-5">
          <PartyPopper className="mt-0.5 size-6 shrink-0 text-forest" />
          <div>
            <p className="font-extrabold text-forest-deep">Welcome to RaktoSheba!</p>
            <p className="mt-1 text-sm text-[#4a806c]">Your donor profile is ready. Below are the requests your blood can safely help.</p>
          </div>
        </div>
      )}

      <Header email={user.email} photoUrl={profile.photoUrl} />

      {requestId && !wanted && !wantedIsActive && !matchesQuery.isPending && (
        <p className="flex items-start gap-3 rounded-2xl bg-linen px-5 py-4 text-sm text-ink-soft">
          <Info size={18} className="mt-px shrink-0 text-ink-muted" />
          That request is no longer open for your blood group—it may already have a donor. Here are others you can help.
        </p>
      )}

      {requestId && matchesQuery.isPending && !donationsQuery.isPending && (
        <Skeleton className="h-[120px] rounded-[24px]" />
      )}

      {wanted && (
        <section aria-labelledby="wanted-heading" className="space-y-3">
          <h2 id="wanted-heading" className="font-display text-xl tracking-[-.01em]">
            Ready to help with this request?
          </h2>
          <MatchCard match={wanted} disabledReason={blocker} highlight />
        </section>
      )}

      {active && <ActiveDonationCard donation={active} />}

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
        <div className="flex flex-col rounded-[24px] border border-ink/10 bg-cream p-4 sm:p-6">
          <span className="grid size-9 place-items-center rounded-xl bg-blush text-blood sm:size-10">
            <Droplets size={18} />
          </span>
          <p className="mt-3 text-xs font-bold tracking-[.12em] text-ink-faint uppercase sm:mt-4">Blood group</p>
          <p className="mt-1 font-display text-3xl text-blood sm:text-4xl">{bloodGroupLabel[profile.bloodGroup]}</p>
        </div>
        <div className="flex flex-col rounded-[24px] border border-ink/10 bg-cream p-4 sm:p-6">
          <span
            className={
              profile.isEligible
                ? "grid size-9 place-items-center rounded-xl bg-mint text-forest sm:size-10"
                : "grid size-9 place-items-center rounded-xl bg-sand text-sand-deep sm:size-10"
            }
          >
            {profile.isEligible ? <CheckCircle2 size={18} /> : <CalendarClock size={18} />}
          </span>
          <p className="mt-3 text-xs font-bold tracking-[.12em] text-ink-faint uppercase sm:mt-4">Can I donate?</p>
          <p className="mt-1 font-display text-2xl">
            {profile.isEligible ? "Yes, you're ready" : `In ${daysUntil(nextEligible!)} days`}
          </p>
          <p className="mt-1 text-xs text-ink-muted sm:text-sm">
            {profile.lastDonationAt ? `Last donated ${formatDate(profile.lastDonationAt)}` : "No donations recorded yet."}
            {!profile.isEligible && nextEligible && ` · ready from ${formatDate(nextEligible)}`}
          </p>
        </div>
        <div className="col-span-2 flex flex-col rounded-[24px] border border-ink/10 bg-cream p-4 sm:p-6 md:col-span-1">
          <span className="grid size-9 place-items-center rounded-xl bg-peach text-maroon sm:size-10">
            <HeartHandshake size={18} />
          </span>
          <p className="mt-3 text-xs font-bold tracking-[.12em] text-ink-faint uppercase sm:mt-4">Donations given</p>
          <div className="mt-1 font-display text-3xl sm:text-4xl">
            {donationsQuery.isPending ? <Skeleton className="h-9 w-12 rounded-xl" /> : completed}
          </div>
          <Link href="/dashboard/donor/donations" className="mt-1 inline-block text-sm font-bold text-blood hover:underline">
            See my history
          </Link>
        </div>
      </div>

      <AvailabilityToggle isAvailable={profile.isAvailable} />

      <section aria-labelledby="matches-heading" className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="matches-heading" className="font-display text-xl tracking-[-.01em] sm:text-2xl">
              Requests you can help
            </h2>
            <p className="mt-1 flex items-center gap-2 text-sm text-ink-muted">
              {matchesQuery.isPending
                ? "Finding requests that match your blood…"
                : matches.length === 0
                  ? "No open requests need your blood group right now."
                  : `${matches.length} open request${matches.length === 1 ? "" : "s"} your ${bloodGroupLabel[profile.bloodGroup]} blood can help, most urgent first.`}
              <FetchingHint active={fetching && !matchesQuery.isPending} />
            </p>
          </div>
          {matches.length > 3 && (
            <Link href="/dashboard/donor/matches" className="inline-flex items-center gap-1 text-sm font-bold text-blood hover:underline">
              See all {matches.length} <ArrowRight size={15} />
            </Link>
          )}
        </div>

        {matchesQuery.isError && <QueryError error={matchesQuery.error} onRetry={matchesQuery.refetch} />}

        {matchesQuery.isPending && (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-[112px] rounded-[24px]" />
            ))}
          </div>
        )}

        {matchesQuery.data &&
          (others.length > 0 ? (
            <div className="space-y-3">
              {others.map((match) => (
                <MatchCard key={match.id} match={match} disabledReason={blocker} />
              ))}
            </div>
          ) : (
            !wanted && (
              <div className="rounded-[24px] border border-dashed border-ink/15 bg-cream p-8 text-center">
                <p className="font-bold">All quiet for now.</p>
                <p className="mt-1 text-sm text-ink-muted">We&apos;ll list new requests here as soon as hospitals post them.</p>
              </div>
            )
          ))}
      </section>
    </div>
  );
}

function Header({ email, photoUrl }: { email: string; photoUrl?: string | null }) {
  return (
    <div className="flex items-center gap-4">
      {photoUrl ? (
        <Image src={photoUrl} alt="" width={64} height={64} className="size-16 shrink-0 rounded-full object-cover ring-4 ring-cream" />
      ) : null}
      <div className="min-w-0">
        <Eyebrow>Donor workspace</Eyebrow>
        <h1 className="mt-2 font-display text-3xl tracking-[-.015em] sm:text-4xl">Good to see you.</h1>
        <p className="mt-1 truncate text-ink-muted">{email}</p>
      </div>
    </div>
  );
}

function HeaderSkeleton() {
  return (
    <div className="flex items-center gap-4">
      <div className="min-w-0 space-y-3">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-10 w-72 max-w-full" />
        <Skeleton className="h-4 w-48" />
      </div>
    </div>
  );
}
