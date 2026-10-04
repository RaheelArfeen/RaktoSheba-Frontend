import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarCheck, CheckCircle2, HeartHandshake, MapPin, XCircle } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { bloodGroupLabel } from "@/lib/blood";
import { cn } from "@/lib/cn";
import { donorApi } from "@/lib/donors";
import { formatDate, unitsLabel } from "@/lib/format";
import { getSession } from "@/lib/session";
import type { MyDonation } from "@/types";
import { NoProfile } from "../components/no-profile";

export const metadata: Metadata = { title: "My donations" };

/** One plain-words state per donation, from the donation and its request. */
function stateOf(d: MyDonation) {
  if (d.status === "COMPLETED" || d.request.status === "FULFILLED")
    return { label: "Donated", icon: CheckCircle2, tone: "bg-mint text-forest", date: d.completedAt ?? d.scheduledAt };
  if (d.status === "CANCELLED" || d.request.status === "CANCELLED")
    return { label: "Cancelled", icon: XCircle, tone: "bg-linen text-ink-muted", date: d.scheduledAt };
  return { label: "Upcoming", icon: CalendarCheck, tone: "bg-sand text-sand-deep", date: d.scheduledAt };
}

export default async function DonorDonationsPage() {
  const session = (await getSession())!;
  const profile = await donorApi.me(session.accessToken).catch(() => null);
  if (!profile) return <NoProfile />;

  const donations = await donorApi.donations(session.accessToken);
  const states = donations.map(stateOf);
  const given = states.filter((s) => s.label === "Donated").length;
  const upcoming = states.filter((s) => s.label === "Upcoming").length;
  const units = donations.reduce((sum, d, i) => (states[i].label === "Donated" ? sum + d.request.unitsNeeded : sum), 0);

  return (
    <div className="space-y-8">
      <div>
        <Eyebrow>My donations</Eyebrow>
        <h1 className="mt-2 font-display text-3xl tracking-[-.015em] sm:text-4xl">Every time you said yes.</h1>
        <p className="mt-2 text-ink-muted">Your donations, newest first.</p>
      </div>

      <dl className="grid grid-cols-3 gap-3 sm:gap-4">
        {[
          { label: "Donated", value: given },
          { label: "Upcoming", value: upcoming },
          { label: "Units given", value: units },
        ].map((stat) => (
          <div key={stat.label} className="rounded-[22px] border border-ink/10 bg-cream p-4 sm:p-6">
            <dt className="text-[11px] font-bold tracking-[.12em] text-ink-faint uppercase">{stat.label}</dt>
            <dd className="mt-1 font-display text-2xl sm:text-3xl">{stat.value}</dd>
          </div>
        ))}
      </dl>

      {donations.length === 0 ? (
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
                <span className={cn("inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-extrabold", state.tone)}>
                  <state.icon size={14} /> {state.label}
                </span>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
