import { isBloodGroup } from "@/lib/blood";
import type { PlatformStats, PublicRequest, PublicRequestDetail, RequestBoardQuery } from "@/types";
import { api, apiPaginated } from "./api";

// Public endpoints (no auth). Fresh on every request: request boards change by the minute.
const fresh = { cache: "no-store" } as const;

export const publicApi = {
  stats: () => api<PlatformStats>("/public/stats", fresh),

  urgentRequests: (limit = 6) => api<PublicRequest[]>("/public/urgent-requests", { ...fresh, query: { limit } }),

  requestBoard: (query: RequestBoardQuery = {}) =>
    apiPaginated<PublicRequest[]>("/public/requests", { ...fresh, query }),

  requestById: (id: string) => api<PublicRequestDetail>(`/public/requests/${id}`, fresh),
};

// ---- Request board URL params ----------------------------------------------


export const BOARD_PAGE_SIZE = 10;
export const BOARD_STATUSES = ["pending", "open", "matched", "fulfilled", "all"] as const;
export const BOARD_SORTS = ["urgency", "createdAt"] as const;

type SearchParams = Record<string, string | string[] | undefined>;

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

/** Turns URL search params into a safe board query; unknown or invalid values are dropped. */
export function parseBoardParams(params: SearchParams): Required<Pick<RequestBoardQuery, "page" | "limit">> & RequestBoardQuery {
  const bloodGroup = first(params.bloodGroup);
  const canHelp = first(params.canHelp);
  const minUrgency = Number(first(params.minUrgency));
  const status = first(params.status);
  const sortBy = first(params.sortBy);
  const page = Number(first(params.page));
  const search = first(params.search)?.trim().slice(0, 100);

  return {
    bloodGroup: isBloodGroup(bloodGroup) ? bloodGroup : undefined,
    canHelp: isBloodGroup(canHelp) ? canHelp : undefined,
    minUrgency: Number.isInteger(minUrgency) && minUrgency >= 1 && minUrgency <= 5 ? minUrgency : undefined,
    status: BOARD_STATUSES.includes(status as (typeof BOARD_STATUSES)[number])
      ? (status as RequestBoardQuery["status"])
      : undefined,
    sortBy: BOARD_SORTS.includes(sortBy as (typeof BOARD_SORTS)[number]) ? (sortBy as RequestBoardQuery["sortBy"]) : undefined,
    search: search || undefined,
    page: Number.isInteger(page) && page > 0 ? page : 1,
    limit: BOARD_PAGE_SIZE,
  };
}

/** Builds a /requests URL from the current params with some keys changed (undefined removes a key). */
export function boardHref(current: URLSearchParams | Record<string, string>, changes: Record<string, string | undefined>) {
  const params = new URLSearchParams(current);
  for (const [key, value] of Object.entries(changes)) {
    if (value === undefined || value === "") params.delete(key);
    else params.set(key, value);
  }
  const qs = params.toString();
  return qs ? `/requests?${qs}` : "/requests";
}
