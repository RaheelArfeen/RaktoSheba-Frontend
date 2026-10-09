"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { clientApi, clientApiPaginated, clientUpload } from "@/lib/client-api";
import { boardStatusToApi, toHospitalPayload } from "@/lib/hospitals";
import type { BloodRequest, BloodRequestDetail, Hospital, RequestStatus } from "@/types";
import type { BloodRequestWizardValues, HospitalEditValues } from "@/lib/validations";
import { qk, type HospitalRequestParams } from "./keys";

export function useHospitalProfile() {
  return useQuery({
    queryKey: qk.hospital.profile(),
    queryFn: () => clientApi<Hospital>("/hospitals/me"),
  });
}

export type HospitalRequestStats = {
  total: number;
  byStatus: Record<RequestStatus, number>;
  openUnits: number;
  donationsCompleted: number;
};

export function useHospitalRequestStats() {
  return useQuery({
    queryKey: qk.hospital.requestStats(),
    queryFn: () => clientApi<HospitalRequestStats>("/requests/mine/stats"),
  });
}

export function useHospitalRequests(params: HospitalRequestParams) {
  return useQuery({
    queryKey: qk.hospital.requests(params),
    queryFn: () =>
      clientApiPaginated<BloodRequest[]>("/requests", {
        query: {
          page: params.page,
          limit: params.limit,
          bloodGroup: params.bloodGroup,
          minUrgency: params.minUrgency,
          sortBy: params.sortBy,
          sortOrder: params.sortOrder,
          status: boardStatusToApi(params.status),
        },
      }),
    placeholderData: keepPreviousData,
  });
}

export function useHospitalRequest(id: string) {
  return useQuery({
    queryKey: qk.hospital.request(id),
    queryFn: () => clientApi<BloodRequestDetail>(`/requests/${id}`),
    enabled: Boolean(id),
  });
}

// ---- Mutations -------------------------------------------------------------

export function useCreateRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    // `location` is wizard UI-only; the backend takes lat/lng.
    mutationFn: (values: BloodRequestWizardValues) =>
      clientApi<BloodRequest>("/requests", {
        method: "POST",
        body: {
          bloodGroup: values.bloodGroup,
          unitsNeeded: values.units,
          urgency: values.urgency,
          lat: values.lat ?? undefined,
          lng: values.lng ?? undefined,
        },
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: qk.hospital.all }),
  });
}

export function useFulfillRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (requestId: string) =>
      clientApi<BloodRequest>(`/requests/${requestId}/fulfill`, { method: "PATCH" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: qk.hospital.all }),
  });
}

export function useUpdateHospitalProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: HospitalEditValues) =>
      clientApi<Hospital>("/hospitals/me", { method: "PATCH", body: toHospitalPayload(values) }),
    onSuccess: (hospital) => queryClient.setQueryData(qk.hospital.profile(), hospital),
  });
}

export function useUploadLicence() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.set("document", file);
      return clientUpload<Hospital>("/hospitals/me/document", formData);
    },
    onSuccess: (hospital) => queryClient.setQueryData(qk.hospital.profile(), hospital),
  });
}

export function useUploadLogo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.set("logo", file);
      return clientUpload<Hospital>("/hospitals/me/logo", formData);
    },
    onSuccess: (hospital) => queryClient.setQueryData(qk.hospital.profile(), hospital),
  });
}
