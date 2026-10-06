import type { Analytics, TimeSeries } from "@/types";
import { api } from "./api";

export const adminApi = {
  analytics: (token: string) => api<Analytics>("/admin/analytics", { token, cache: "no-store" }),
  timeSeries: (token: string, days = 30) =>
    api<TimeSeries>("/admin/analytics/time-series", { token, cache: "no-store", query: { days } }),
};
