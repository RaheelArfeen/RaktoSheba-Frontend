import type { EmergencyLevel, RequestStatus } from "@/types/api";

/**
 * Emergency levels, derived from a request's 1–5 urgency. This is the single
 * definition the whole UI uses for badges, sorting, banners and copy.
 */
export const EMERGENCY_LEVELS: Record<
  EmergencyLevel,
  { label: string; minUrgency: number; description: string; badge: EmergencyLevel }
> = {
  critical: {
    label: "Critical",
    minUrgency: 5,
    description: "Life-threatening — blood is needed right now.",
    badge: "critical",
  },
  severe: {
    label: "Severe",
    minUrgency: 4,
    description: "Needed within hours, e.g. surgery or heavy blood loss.",
    badge: "severe",
  },
  urgent: {
    label: "Urgent",
    minUrgency: 3,
    description: "Needed today for a planned procedure or treatment.",
    badge: "urgent",
  },
  standard: {
    label: "Standard",
    minUrgency: 1,
    description: "Needed soon; there is time to find the right donor.",
    badge: "standard",
  },
};

export function emergencyLevel(urgency: number): EmergencyLevel {
  if (urgency >= 5) return "critical";
  if (urgency >= 4) return "severe";
  if (urgency >= 3) return "urgent";
  return "standard";
}

export const isEmergency = (urgency: number) => urgency >= EMERGENCY_LEVELS.severe.minUrgency;

/** Request lifecycle, in order, for timelines and progress steppers. */
export const REQUEST_LIFECYCLE: { status: Exclude<RequestStatus, "CANCELLED">; label: string; description: string }[] = [
  { status: "PENDING", label: "Requested", description: "The hospital posted the request." },
  { status: "VERIFIED", label: "Verified", description: "An admin verified it and compatible donors were alerted." },
  { status: "MATCHED", label: "Donor matched", description: "A donor accepted and is on the way." },
  { status: "FULFILLED", label: "Fulfilled", description: "The donation is complete." },
];

export const requestStatusLabel: Record<RequestStatus, string> = {
  PENDING: "Awaiting verification",
  VERIFIED: "Open",
  MATCHED: "Donor matched",
  FULFILLED: "Fulfilled",
  CANCELLED: "Cancelled",
};
