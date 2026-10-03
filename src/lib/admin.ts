import type { Analytics } from "@/types";
import { api } from "./api";

export const adminApi = {
  analytics: (token: string) => api<Analytics>("/admin/analytics", { token, cache: "no-store" }),
};
