"use client";

import Link from "next/link";
import { ArrowRight, CircleAlert, SearchCheck } from "lucide-react";
import { FetchingHint, QueryError } from "@/components/dashboard/list-controls";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiError } from "@/lib/api";
import { bloodGroupLabel, compatibleRecipients } from "@/lib/blood";
import { isEmergency } from "@/lib/emergency";
import { useDonorDonations, useDonorMatches, useDonorProfile } from "@/lib/queries/use-donor";
import type { DonorProfile } from "@/types";
import { acceptBlocker, findActiveDonation } from "../../components/blockers";
import { MatchCard } from "../../components/match-card";
import { NoProfile } from "../../components/no-profile";

export function DonorMatches() {
  const profileQuery = useDonorProfile();

  if (profileQuery.isPending) return <MatchesSkeleton />;

  const noProfile = profileQuery.error instanceof ApiError && profileQuery.error.status === 404;
  if (noProfile) return <NoProfile />;
  if (profileQuery.isError) return <QueryError error={profileQuery.error} onRetry={profileQuery.refetch} />;

  return <MatchesBody profile={profileQuery.data} />;
}

function MatchesBody({ profile }: { profile: DonorProfile }) {
  const matchesQuery = useDonorMatches();
  const donationsQuery = useDonorDonations();

  const matches = matchesQuery.data ?? [];
  const blocker = acceptBlocker(profile, findActiveDonation(donationsQuery.data ?? []));
  const urgent = matches.filter((m) => isEmergency(m.urgency));
  const group = bloodGroupLabel[profile.bloodGroup];
  const recipients = compatibleRecipients(profile.bloodGroup);
  const fetching = matchesQuery.isFetching;

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <Eyebrow>Requests I can help</Eyebrow>
        <h1 className="mt-2 font-display text-3xl tracking-[-.015em] sm:text-4xl">Your blood could help today.</h1>
        <p className="mt-2 max-w-2xl text-ink-muted">
          As {group}, you can give to {recipients.length === 8 ? "every blood group" : recipients.map((g) => bloodGroupLabel[g]).join(", ")}. These open requests match, most urgent first{profile.lat != null ? ", then nearest" : ""}.
        </p>
      </div>

      {blocker && (
        <div className="flex items-start gap-3 rounded-2xl bg-sand px-5 py-4 text-sm text-sand-deep">
          <CircleAlert size={18} className="mt-px shrink-0" />
          <p>
            <strong>You can&apos;t accept a request right now.</strong> {blocker}{" "}
            <Link href="/dashboard/donor" className="font-bold underline underline-offset-2">
              Go to overview
            </Link>
          </p>
        </div>
      )}

      {profile.lat == null && (
        <p className="text-sm text-ink-muted">
          Tip:{" "}
          <Link href="/dashboard/donor/profile" className="font-bold text-blood hover:underline">
            add your location
          </Link>{" "}
          to see how far away each hospital is.
        </p>
      )}

      {matchesQuery.isError && <QueryError error={matchesQuery.error} onRetry={matchesQuery.refetch} />}

      {matchesQuery.isPending && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[122px] rounded-[24px]" />
          ))}
        </div>
      )}

      {matchesQuery.data &&
        (matches.length === 0 ? (
          <div className="flex flex-col items-center rounded-[26px] border border-dashed border-ink/15 bg-cream px-6 py-14 text-center">
            <span className="grid size-14 place-items-center rounded-2xl bg-mint text-forest">
              <SearchCheck className="size-6" />
            </span>
            <p className="mt-5 font-display text-xl tracking-[-.01em]">No requests need {group} right now</p>
            <p className="mt-2 max-w-sm text-sm leading-6 text-ink-muted">That&apos;s good news. We&apos;ll list new requests here as soon as hospitals post them.</p>
            <Link href="/requests" className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-blood hover:underline">
              See every request on the board <ArrowRight size={15} />
            </Link>
          </div>
        ) : (
          <>
            <p aria-live="polite" className="flex items-center gap-2 text-sm font-semibold text-ink-muted">
              {matches.length} open request{matches.length === 1 ? "" : "s"}
              {urgent.length > 0 && ` · ${urgent.length} urgent`}
              <FetchingHint active={fetching} />
            </p>
            <div className="space-y-3">
              {matches.map((match) => (
                <MatchCard key={match.id} match={match} disabledReason={blocker} />
              ))}
            </div>
          </>
        ))}
    </div>
  );
}

function MatchesSkeleton() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="space-y-3">
        <Skeleton className="h-3 w-40" />
        <Skeleton className="h-10 w-96 max-w-full" />
        <Skeleton className="h-4 w-full max-w-2xl" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-[122px] rounded-[24px]" />
        ))}
      </div>
    </div>
  );
}
