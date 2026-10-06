import type { Analytics, BloodRequest, Hospital, TimeSeries, UserProfile } from "@/types";
import { api, apiPaginated } from "./api";

export const adminApi = {
  analytics: (token: string) => api<Analytics>("/admin/analytics", { token, cache: "no-store" }),
  timeSeries: (token: string, days = 30) =>
    api<TimeSeries>("/admin/analytics/time-series", { token, cache: "no-store", query: { days } }),

  // Verification queue
  queue: (token: string, query?: { page?: number; limit?: number }) =>
    apiPaginated<BloodRequest[]>("/admin/requests/pending", { token, cache: "no-store", query }),
  verifyRequest: (token: string, id: string) =>
    api<BloodRequest>("/admin/requests/" + id + "/verify", { method: "PATCH", token, cache: "no-store" }),
  cancelRequest: (token: string, id: string) =>
    api<BloodRequest>("/admin/requests/" + id + "/cancel", { method: "PATCH", token, cache: "no-store" }),

  // Hospital management
  verifyHospital: (token: string, id: string) =>
    api<Hospital>("/admin/hospitals/" + id + "/verify", { method: "PATCH", token, cache: "no-store" }),

  // User management
  banUser: (token: string, userId: string) =>
    api<UserProfile>("/admin/users/" + userId + "/ban", { method: "PATCH", token, cache: "no-store" }),
  unbanUser: (token: string, userId: string) =>
    api<UserProfile>("/admin/users/" + userId + "/unban", { method: "PATCH", token, cache: "no-store" }),
};
