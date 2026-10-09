import type { BloodGroup, PaymentPurpose, PaymentStatus, RequestBoardQuery, Role, VerificationStatus } from "@/types";

/**
 * TanStack Query key factory. Keys are hierarchical per scope, so invalidating
 * `qk.admin.all` / `qk.donor.all` / `qk.hospital.all` refetches every query in it.
 */

export type PageParams = { page: number; limit: number };

export type AdminHospitalParams = PageParams & { verificationStatus?: VerificationStatus; search?: string };

export type AdminUserParams = PageParams & { isBanned?: boolean; role?: Role; search?: string };

export type AdminPaymentParams = PageParams & { status?: PaymentStatus; purpose?: PaymentPurpose };

export type HospitalRequestParams = PageParams & {
  bloodGroup?: BloodGroup;
  /** Board status; mapped to the API's RequestStatus inside the hook. */
  status?: RequestBoardQuery["status"];
  minUrgency?: number;
  sortBy?: RequestBoardQuery["sortBy"];
  sortOrder?: RequestBoardQuery["sortOrder"];
};

export const qk = {
  admin: {
    all: ["admin"] as const,
    analytics: () => ["admin", "analytics"] as const,
    timeSeries: (days: number) => ["admin", "timeseries", days] as const,
    queue: (params: PageParams) => ["admin", "queue", params] as const,
    hospitals: (params: AdminHospitalParams) => ["admin", "hospitals", params] as const,
    users: (params: AdminUserParams) => ["admin", "users", params] as const,
    payments: (params: AdminPaymentParams) => ["admin", "payments", params] as const,
    paymentStats: () => ["admin", "payment-stats"] as const,
    audit: (params: PageParams) => ["admin", "audit", params] as const,
  },
  donor: {
    all: ["donor"] as const,
    profile: () => ["donor", "profile"] as const,
    matches: () => ["donor", "matches"] as const,
    donations: () => ["donor", "donations"] as const,
  },
  hospital: {
    all: ["hospital"] as const,
    profile: () => ["hospital", "profile"] as const,
    requestStats: () => ["hospital", "request-stats"] as const,
    requests: (params: HospitalRequestParams) => ["hospital", "requests", params] as const,
    request: (id: string) => ["hospital", "request", id] as const,
  },
};
