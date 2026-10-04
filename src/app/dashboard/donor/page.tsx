import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarClock, CheckCircle2, Droplets, HeartHandshake, Info, PartyPopper } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ApiError } from "@/lib/api";
import { bloodGroupLabel, DONATION_INTERVAL_DAYS } from "@/lib/blood";
import { donorApi } from "@/lib/donors";
import { addDays, daysUntil, formatDate } from "@/lib/format";
import { getSession } from "@/lib/session";
import { ActiveDonationCard } from "./components/active-donation-card";
import { AvailabilityToggle } from "./components/availability-toggle";
import { acceptBlocker, findActiveDonation } from "./components/blockers";
import { MatchCard } from "./components/match-card";

export const metadata: Metadata = { title: "Donor dashboard" };

export default async function DonorDashboard({ searchParams }: PageProps<"/dashboard/donor">) {
  const session = (await getSession())!;
  const { welcome, request: requestParam } = await searchParams;
  const requestId = typeof requestParam === "string" ? requestParam : undefined;

  const profile = await donorApi.me(session.accessToken).catch((e) => {
    if (e instanceof ApiError && e.status === 404) return null; // signed up but no donor profile yet
    throw e;
  });

  if (!profile) {
    return (
      <div className="space-y-8">
        <Header email={session.user.email} />
        <div className="rounded-[26px] border border-dashed border-ink/15 bg-cream p-8">
          <p className="font-display text-xl tracking-[-.01em]">Let&apos;s finish your donor profile.</p>
          <p className="mt-2 text-sm text-ink-muted">Tell us your blood group so we can show you the requests you can help.</p>
          <ButtonLink href="/onboarding?next=/dashboard/donor" className="mt-6">
            Add my blood group <ArrowRight />
          </ButtonLink>
        </div>
      </div>
    );
  }

  const [matches, donations] = await Promise.all([donorApi.matches(session.accessToken), donorApi.donations(session.accessToken)]);
  const active = findActiveDonation(donations);
  const blocker = acceptBlocker(profile, active);
  const completed = donations.filter((d) => d.status === "COMPLETED").length;
  const nextEligible = profile.lastDonationAt ? addDays(profile.lastDonationAt, DONATION_INTERVAL_DAYS) : null;

  // Arrived from a request page's "I can help" button.
  const wanted = requestId ? matches.find((m) => m.id === requestId) : undefined;
  const wantedIsActive = requestId && active?.request.id === requestId;
  const others = matches.filter((m) => m.id !== wanted?.id).slice(0, 3);

  return (
    <div className="space-y-8">
      {welcome && (
        <div className="flex items-start gap-4 rounded-[24px] bg-mint p-5">
          <PartyPopper className="mt-0.5 size-6 shrink-0 text-forest" />
          <div>
            <p className="font-extrabold text-forest-deep">Welcome to RaktoSheba!</p>
            <p className="mt-1 text-sm text-[#4a806c]">Your donor profile is ready. Below are the requests your blood can safely help.</p>
          </div>
        </div>
      )}

      <Header email={session.user.email} photoUrl={profile.photoUrl} />

      {requestId && !wanted && !wantedIsActive && (
        <p className="flex items-start gap-3 rounded-2xl bg-linen px-5 py-4 text-sm text-ink-soft">
          <Info size={18} className="mt-px shrink-0 text-ink-muted" />
          That request is no longer open for your blood group—it may already have a donor. Here are others you can help.
        </p>
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

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[24px] border border-ink/10 bg-cream p-6">
          <Droplets className="size-5 text-blood" />
          <p className="mt-4 text-xs font-bold tracking-[.12em] text-ink-faint uppercase">Blood group</p>
          <p className="mt-1 font-display text-3xl text-blood sm:text-4xl">{bloodGroupLabel[profile.bloodGroup]}</p>
        </div>
        <div className="rounded-[24px] border border-ink/10 bg-cream p-6">
          {profile.isEligible ? <CheckCircle2 className="size-5 text-forest" /> : <CalendarClock className="size-5 text-sand-deep" />}
          <p className="mt-4 text-xs font-bold tracking-[.12em] text-ink-faint uppercase">Can I donate?</p>
          <p className="mt-1 font-display text-2xl">
            {profile.isEligible ? "Yes, you're ready" : `In ${daysUntil(nextEligible!)} days`}
          </p>
          <p className="mt-1 text-sm text-ink-muted">
            {profile.lastDonationAt ? `Last donated ${formatDate(profile.lastDonationAt)}` : "No donations recorded yet."}
            {!profile.isEligible && nextEligible && ` · ready from ${formatDate(nextEligible)}`}
          </p>
        </div>
        <div className="rounded-[24px] border border-ink/10 bg-cream p-6">
          <HeartHandshake className="size-5 text-forest" />
          <p className="mt-4 text-xs font-bold tracking-[.12em] text-ink-faint uppercase">Donations given</p>
          <p className="mt-1 font-display text-3xl sm:text-4xl">{completed}</p>
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
            <p className="mt-1 text-sm text-ink-muted">
              {matches.length === 0
                ? "No open requests need your blood group right now."
                : `${matches.length} open request${matches.length === 1 ? "" : "s"} your ${bloodGroupLabel[profile.bloodGroup]} blood can help, most urgent first.`}
            </p>
          </div>
          {matches.length > 3 && (
            <Link href="/dashboard/donor/matches" className="inline-flex items-center gap-1 text-sm font-bold text-blood hover:underline">
              See all {matches.length} <ArrowRight size={15} />
            </Link>
          )}
        </div>
        {others.length > 0 ? (
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
        )}
      </section>
    </div>
  );
}

function Header({ email, photoUrl }: { email: string; photoUrl?: string | null }) {
  return (
    <div className="flex items-center gap-4">
      {photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- Cloudinary URL; next/image would need remote config
        <img src={photoUrl} alt="" className="size-16 shrink-0 rounded-full object-cover ring-4 ring-cream" />
      ) : null}
      <div className="min-w-0">
        <Eyebrow>Donor workspace</Eyebrow>
        <h1 className="mt-2 font-display text-3xl tracking-[-.015em] sm:text-4xl">Good to see you.</h1>
        <p className="mt-1 truncate text-ink-muted">{email}</p>
      </div>
    </div>
  );
}
