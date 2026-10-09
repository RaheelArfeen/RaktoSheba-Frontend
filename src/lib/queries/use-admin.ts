"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { clientApi, clientApiPaginated } from "@/lib/client-api";
import type {
  Analytics,
  AuditLog,
  BloodRequest,
  Hospital,
  Payment,
  PaymentStats,
  TimeSeries,
  UserProfile,
  VerificationStatus,
} from "@/types";
import { qk, type AdminHospitalParams, type AdminPaymentParams, type AdminUserParams, type PageParams } from "./keys";

export function useAdminAnalytics() {
  return useQuery({
    queryKey: qk.admin.analytics(),
    queryFn: () => clientApi<Analytics>("/admin/analytics"),
  });
}

export function useAdminTimeSeries(days: number) {
  return useQuery({
    queryKey: qk.admin.timeSeries(days),
    queryFn: () => clientApi<TimeSeries>("/admin/analytics/timeseries", { query: { days } }),
    placeholderData: keepPreviousData,
  });
}

export function useAdminQueue({ page = 1, limit = 20 }: Partial<PageParams> = {}) {
  const params = { page, limit };
  return useQuery({
    queryKey: qk.admin.queue(params),
    queryFn: () =>
      clientApiPaginated<BloodRequest[]>("/requests", {
        query: { ...params, status: "PENDING", sortBy: "urgency", sortOrder: "desc" },
      }),
    placeholderData: keepPreviousData,
  });
}

export function useAdminHospitals({ page = 1, limit = 10, verificationStatus, search }: Partial<AdminHospitalParams> = {}) {
  const params = { page, limit, verificationStatus, search };
  return useQuery({
    queryKey: qk.admin.hospitals(params),
    queryFn: () => clientApiPaginated<Hospital[]>("/hospitals", { query: params }),
    placeholderData: keepPreviousData,
  });
}

export function useAdminUsers({ page = 1, limit = 10, isBanned, role, search }: Partial<AdminUserParams> = {}) {
  const params = { page, limit, isBanned, role, search };
  return useQuery({
    queryKey: qk.admin.users(params),
    queryFn: () => clientApiPaginated<UserProfile[]>("/admin/users", { query: params }),
    placeholderData: keepPreviousData,
  });
}

export function useAdminPayments({ page = 1, limit = 10, status, purpose }: Partial<AdminPaymentParams> = {}) {
  const params = { page, limit, status, purpose };
  return useQuery({
    queryKey: qk.admin.payments(params),
    queryFn: () => clientApiPaginated<Payment[]>("/payments", { query: params }),
    placeholderData: keepPreviousData,
  });
}

export function usePaymentStats() {
  return useQuery({
    queryKey: qk.admin.paymentStats(),
    queryFn: () => clientApi<PaymentStats>("/payments/stats"),
  });
}

export function useAuditLog({ page = 1, limit = 10 }: Partial<PageParams> = {}) {
  const params = { page, limit };
  return useQuery({
    queryKey: qk.admin.audit(params),
    queryFn: () => clientApiPaginated<AuditLog[]>("/admin/audit-logs", { query: params }),
    placeholderData: keepPreviousData,
  });
}

// ---- Mutations -------------------------------------------------------------

const useAdminInvalidator = () => {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: qk.admin.all });
};

export function useVerifyRequest() {
  const invalidate = useAdminInvalidator();
  return useMutation({
    mutationFn: (id: string) => clientApi<BloodRequest>(`/requests/${id}/verify`, { method: "PATCH" }),
    onSuccess: invalidate,
  });
}

export function useCancelRequest() {
  const invalidate = useAdminInvalidator();
  return useMutation({
    mutationFn: (id: string) => clientApi<BloodRequest>(`/requests/${id}/cancel`, { method: "PATCH" }),
    onSuccess: invalidate,
  });
}

export function useSetHospitalVerification() {
  const invalidate = useAdminInvalidator();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Exclude<VerificationStatus, "PENDING"> }) =>
      clientApi<Hospital>(`/admin/hospitals/${id}/${status === "VERIFIED" ? "verify" : "reject"}`, { method: "PATCH" }),
    onSuccess: invalidate,
  });
}

export function useSetUserBanned() {
  const invalidate = useAdminInvalidator();
  return useMutation({
    mutationFn: ({ userId, banned }: { userId: string; banned: boolean }) =>
      clientApi<UserProfile>(`/admin/users/${userId}/${banned ? "ban" : "unban"}`, { method: "PATCH" }),
    onSuccess: invalidate,
  });
}
