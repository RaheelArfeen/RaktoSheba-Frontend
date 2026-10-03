import type { Hospital } from "@/types";
import { api } from "./api";

export const hospitalApi = {
  /** The signed-in hospital's own profile, including verification status. */
  me: (token: string) => api<Hospital>("/hospitals/me", { token, cache: "no-store" }),
};
