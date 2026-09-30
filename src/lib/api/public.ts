import type { PlatformStats, PublicRequest, PublicRequestDetail, RequestBoardQuery } from "@/types/api";
import { api, apiPaginated } from "./client";

// Public endpoints (no auth). Fresh on every request: request boards change by the minute.
const fresh = { cache: "no-store" } as const;

export const publicApi = {
  stats: () => api<PlatformStats>("/public/stats", fresh),

  urgentRequests: (limit = 6) => api<PublicRequest[]>("/public/urgent-requests", { ...fresh, query: { limit } }),

  requestBoard: (query: RequestBoardQuery = {}) =>
    apiPaginated<PublicRequest[]>("/public/requests", { ...fresh, query }),

  requestById: (id: string) => api<PublicRequestDetail>(`/public/requests/${id}`, fresh),
};
