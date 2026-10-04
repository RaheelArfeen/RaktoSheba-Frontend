import { CalendarCheck, MapPin, Navigation } from "lucide-react";
import { bloodGroupLabel } from "@/lib/blood";
import { formatDateTime, unitsLabel } from "@/lib/format";
import type { MyDonation } from "@/types";
import { WithdrawButton } from "./withdraw-button";

/** The donor's current commitment: where to go, and a way out if plans change. */
export function ActiveDonationCard({ donation }: { donation: MyDonation }) {
  const hospital = donation.request.requester.hospital;
  const place = hospital ? `${hospital.name}, ${hospital.address}` : null;

  return (
    <section className="relative overflow-hidden rounded-[28px] bg-forest p-6 text-white sm:p-8" aria-labelledby="active-donation">
      <div className="pointer-events-none absolute -top-20 -right-16 size-64 rounded-full border-[36px] border-white/[.07]" />
      <div className="relative">
        <p className="inline-flex items-center gap-2 text-xs font-extrabold tracking-[.14em] text-mint-strong uppercase">
          <CalendarCheck size={15} /> Your upcoming donation
        </p>
        <h2 id="active-donation" className="mt-3 font-display text-2xl leading-tight tracking-[-.01em] sm:text-3xl">
          {hospital?.name ?? "Partner hospital"} is expecting you
        </h2>
        <p className="mt-3 flex items-center gap-1.5 text-sm text-white/80">
          <MapPin size={14} className="shrink-0" /> {hospital?.address ?? "Bangladesh"}
        </p>
        <p className="mt-1 text-sm text-white/70">
          {unitsLabel(donation.request.unitsNeeded)} of {bloodGroupLabel[donation.request.bloodGroup]} · you said yes{" "}
          {donation.scheduledAt ? formatDateTime(donation.scheduledAt) : "recently"}
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          {place && (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-bold text-forest-deep transition-colors hover:bg-mint"
            >
              <Navigation size={16} /> Get directions
            </a>
          )}
          <WithdrawButton donationId={donation.id} className="border-white/30 bg-transparent text-white hover:border-white/50 hover:bg-white/10" />
        </div>
        <p className="mt-4 text-xs leading-5 text-white/60">Bring a photo ID. Eat well and drink water before you go.</p>
      </div>
    </section>
  );
}
