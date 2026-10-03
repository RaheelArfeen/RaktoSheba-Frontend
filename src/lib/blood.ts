import type { BloodGroup } from "@/types";

/** Display order used across the site: universal donor first. */
export const BLOOD_GROUPS: BloodGroup[] = [
  "O_NEGATIVE",
  "O_POSITIVE",
  "A_NEGATIVE",
  "A_POSITIVE",
  "B_NEGATIVE",
  "B_POSITIVE",
  "AB_NEGATIVE",
  "AB_POSITIVE",
];

export const bloodGroupLabel: Record<BloodGroup, string> = {
  A_POSITIVE: "A+",
  A_NEGATIVE: "A−",
  B_POSITIVE: "B+",
  B_NEGATIVE: "B−",
  AB_POSITIVE: "AB+",
  AB_NEGATIVE: "AB−",
  O_POSITIVE: "O+",
  O_NEGATIVE: "O−",
};

export const isBloodGroup = (value: unknown): value is BloodGroup =>
  typeof value === "string" && value in bloodGroupLabel;

/**
 * ABO/Rh rule: a donor can give to a recipient who carries every antigen the donor carries.
 * Mirrors the backend's compatibility engine.
 */
export function canDonate(donor: BloodGroup, recipient: BloodGroup): boolean {
  const [donorAbo, donorRh] = donor.split("_");
  const [recipientAbo, recipientRh] = recipient.split("_");
  const aboOk = donorAbo === "O" || recipientAbo === "AB" || donorAbo === recipientAbo;
  const rhOk = donorRh === "NEGATIVE" || recipientRh === "POSITIVE";
  return aboOk && rhOk;
}

export const compatibleRecipients = (donor: BloodGroup) => BLOOD_GROUPS.filter((r) => canDonate(donor, r));
export const compatibleDonors = (recipient: BloodGroup) => BLOOD_GROUPS.filter((d) => canDonate(d, recipient));

/** Days a donor must wait between donations (enforced by the backend). */
export const DONATION_INTERVAL_DAYS = 90;
