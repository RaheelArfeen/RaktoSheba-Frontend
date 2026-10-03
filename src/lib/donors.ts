import type { DonorProfile } from "@/types";
import { api } from "./api";

export const donorApi = {
  /** The signed-in donor's own profile, including whether they're eligible to donate now. */
  me: (token: string) => api<DonorProfile>("/donors/me", { token, cache: "no-store" }),
};
