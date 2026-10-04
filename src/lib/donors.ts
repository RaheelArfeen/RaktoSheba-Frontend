import type { DonorMatchRequest, DonorProfile, MyDonation } from "@/types";
import { api } from "./api";

const fresh = { cache: "no-store" } as const;

export const donorApi = {
  /** The signed-in donor's own profile, including whether they're eligible to donate now. */
  me: (token: string) => api<DonorProfile>("/donors/me", { token, ...fresh }),

  /** Open requests this donor's blood can help: most urgent first, then nearest. */
  matches: (token: string) => api<DonorMatchRequest[]>("/donors/me/matches", { token, ...fresh }),

  /** Every donation this donor has scheduled or completed, newest first. */
  donations: (token: string) => api<MyDonation[]>("/donors/me/donations", { token, ...fresh }),
};
