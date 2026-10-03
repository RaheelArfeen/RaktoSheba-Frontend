import type { Metadata } from "next";
import { CalendarClock, CheckCircle2, Droplets, HeartPulse, PartyPopper } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ApiError } from "@/lib/api";
import { bloodGroupLabel, DONATION_INTERVAL_DAYS } from "@/lib/blood";
import { donorApi } from "@/lib/donors";
import { addDays, daysUntil, formatDate } from "@/lib/format";
import { getSession } from "@/lib/session";

export const metadata: Metadata = { title: "Donor dashboard" };

export default async function DonorDashboard({ searchParams }: PageProps<"/dashboard/donor">) {
  const session = (await getSession())!;
  const { welcome } = await searchParams;
  const profile = await donorApi.me(session.accessToken).catch((e) => {
    if (e instanceof ApiError && e.status === 404) return null; // signed up but no donor profile yet
    throw e;
  });

  const nextEligible = profile?.lastDonationAt ? addDays(profile.lastDonationAt, DONATION_INTERVAL_DAYS) : null;
  const waitDays = nextEligible ? daysUntil(nextEligible) : 0;

  return (
    <div className="space-y-8">
      {welcome && (
        <div className="flex items-start gap-4 rounded-[24px] bg-mint p-5">
          <PartyPopper className="mt-0.5 size-6 shrink-0 text-forest" />
          <div>
            <p className="font-extrabold text-forest-deep">Welcome to RaktoSheba!</p>
            <p className="mt-1 text-sm text-[#4a806c]">Your donor profile is ready. We&apos;ll show you requests your blood can safely help.</p>
          </div>
        </div>
      )}

      <div>
        <Eyebrow>Donor workspace</Eyebrow>
        <h1 className="mt-2 font-display text-5xl tracking-[-.015em]">Good to see you.</h1>
        <p className="mt-2 text-ink-muted">{session.user.email}</p>
      </div>

      {!profile ? (
        <div className="rounded-[26px] border border-dashed border-ink/15 bg-cream p-8">
          <p className="font-display text-2xl tracking-[-.01em]">Your donor profile isn&apos;t set up yet.</p>
          <p className="mt-2 text-sm text-ink-muted">Add your blood group so we can match you with requests. Profile editing arrives in the next update.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[24px] border border-ink/10 bg-cream p-6">
            <Droplets className="size-5 text-blood" />
            <p className="mt-4 text-xs font-bold tracking-[.12em] text-ink-faint uppercase">Blood group</p>
            <p className="mt-1 font-display text-5xl text-blood">{bloodGroupLabel[profile.bloodGroup]}</p>
          </div>
          <div className="rounded-[24px] border border-ink/10 bg-cream p-6">
            <HeartPulse className="size-5 text-forest" />
            <p className="mt-4 text-xs font-bold tracking-[.12em] text-ink-faint uppercase">Availability</p>
            <p className="mt-1 font-display text-3xl">{profile.isAvailable ? "Available" : "Taking a break"}</p>
            <p className="mt-1 text-sm text-ink-muted">{profile.isAvailable ? "You'll see compatible requests." : "You won't get new match alerts."}</p>
          </div>
          <div className="rounded-[24px] border border-ink/10 bg-cream p-6">
            {profile.isEligible ? <CheckCircle2 className="size-5 text-forest" /> : <CalendarClock className="size-5 text-sand-deep" />}
            <p className="mt-4 text-xs font-bold tracking-[.12em] text-ink-faint uppercase">Eligibility</p>
            <p className="mt-1 font-display text-3xl">{profile.isEligible ? "Ready to donate" : `${waitDays} days to go`}</p>
            <p className="mt-1 text-sm text-ink-muted">
              {profile.lastDonationAt ? `Last donated ${formatDate(profile.lastDonationAt)}` : "No donations recorded yet."}
              {!profile.isEligible && nextEligible && ` · eligible from ${formatDate(nextEligible)}`}
            </p>
          </div>
        </div>
      )}

      <ButtonLink href="/requests" variant="outline">
        Browse open requests
      </ButtonLink>
    </div>
  );
}
