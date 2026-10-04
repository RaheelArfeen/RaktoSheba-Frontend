import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CircleAlert, SearchCheck } from "lucide-react";
import { Eyebrow } from "@/components/ui/eyebrow";
import { bloodGroupLabel, compatibleRecipients } from "@/lib/blood";
import { donorApi } from "@/lib/donors";
import { isEmergency } from "@/lib/emergency";
import { getSession } from "@/lib/session";
import { acceptBlocker, findActiveDonation } from "../components/blockers";
import { MatchCard } from "../components/match-card";
import { NoProfile } from "../components/no-profile";

export const metadata: Metadata = { title: "Requests I can help" };

export default async function DonorMatchesPage() {
  const session = (await getSession())!;
  const profile = await donorApi.me(session.accessToken).catch(() => null);
  if (!profile) return <NoProfile />;

  const [matches, donations] = await Promise.all([donorApi.matches(session.accessToken), donorApi.donations(session.accessToken)]);
  const blocker = acceptBlocker(profile, findActiveDonation(donations));
  const urgent = matches.filter((m) => isEmergency(m.urgency));
  const group = bloodGroupLabel[profile.bloodGroup];
  const recipients = compatibleRecipients(profile.bloodGroup);

  return (
    <div className="space-y-8">
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

      {matches.length === 0 ? (
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
          <p aria-live="polite" className="text-sm font-semibold text-ink-muted">
            {matches.length} open request{matches.length === 1 ? "" : "s"}
            {urgent.length > 0 && ` · ${urgent.length} urgent`}
          </p>
          <div className="space-y-3">
            {matches.map((match) => (
              <MatchCard key={match.id} match={match} disabledReason={blocker} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
