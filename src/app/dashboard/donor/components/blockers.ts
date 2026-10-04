import { DONATION_INTERVAL_DAYS } from "@/lib/blood";
import { addDays, formatDate } from "@/lib/format";
import type { DonorProfile, MyDonation } from "@/types";

/** The donation the donor has said yes to and not yet given, if any. */
export const findActiveDonation = (donations: MyDonation[]) =>
  donations.find((d) => d.status === "SCHEDULED" && d.request.status === "MATCHED") ?? null;

/** Why this donor can't accept a request right now, in plain words, or null if they can. */
export function acceptBlocker(profile: DonorProfile, active: MyDonation | null): string | null {
  if (active) return "You already have an upcoming donation. Finish or withdraw it first.";
  if (!profile.isAvailable) return "Turn on “I'm available” to accept requests.";
  if (!profile.isEligible && profile.lastDonationAt) {
    return `You can donate again from ${formatDate(addDays(profile.lastDonationAt, DONATION_INTERVAL_DAYS))}.`;
  }
  return null;
}
