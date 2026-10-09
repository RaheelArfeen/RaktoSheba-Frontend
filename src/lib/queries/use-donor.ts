"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { clientApi, clientUpload } from "@/lib/client-api";
import type { Donation, DonorMatchRequest, DonorProfile, MyDonation } from "@/types";
import type { DonorEditValues } from "@/lib/validations";
import { qk } from "./keys";

export function useDonorProfile() {
  return useQuery({
    queryKey: qk.donor.profile(),
    queryFn: () => clientApi<DonorProfile>("/donors/me"),
  });
}

export function useDonorMatches() {
  return useQuery({
    queryKey: qk.donor.matches(),
    queryFn: () => clientApi<DonorMatchRequest[]>("/donors/me/matches"),
  });
}

export function useDonorDonations() {
  return useQuery({
    queryKey: qk.donor.donations(),
    queryFn: () => clientApi<MyDonation[]>("/donors/me/donations"),
  });
}

// ---- Mutations -------------------------------------------------------------

export function useSetAvailability() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (isAvailable: boolean) =>
      clientApi<DonorProfile>("/donors/me/availability", { method: "PATCH", body: { isAvailable } }),
    // Flip the toggle instantly; roll back if the server rejects it.
    onMutate: async (isAvailable) => {
      await queryClient.cancelQueries({ queryKey: qk.donor.profile() });
      const previous = queryClient.getQueryData<DonorProfile>(qk.donor.profile());
      if (previous) queryClient.setQueryData<DonorProfile>(qk.donor.profile(), { ...previous, isAvailable });
      return { previous };
    },
    onError: (_error, _isAvailable, context) => {
      if (context?.previous) queryClient.setQueryData(qk.donor.profile(), context.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: qk.donor.all }),
  });
}

export function useAcceptRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (requestId: string) => clientApi<Donation>(`/requests/${requestId}/accept`, { method: "POST" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: qk.donor.all }),
  });
}

export function useWithdrawDonation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (donationId: string) =>
      clientApi<Donation>(`/donors/me/donations/${donationId}/withdraw`, { method: "PATCH" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: qk.donor.all }),
  });
}

export function useUpdateDonorProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: DonorEditValues) =>
      clientApi<DonorProfile>("/donors/me", {
        method: "PATCH",
        body: {
          bloodGroup: values.bloodGroup,
          // The date input gives "YYYY-MM-DD"; the backend wants a full ISO date-time.
          lastDonationAt: values.lastDonationAt
            ? new Date(`${values.lastDonationAt}T00:00:00+06:00`).toISOString()
            : undefined,
          lat: values.lat ?? undefined,
          lng: values.lng ?? undefined,
        },
      }),
    onSuccess: (profile) => {
      queryClient.setQueryData(qk.donor.profile(), profile);
      // Matches are blood-group dependant, so they need a refetch.
      queryClient.invalidateQueries({ queryKey: qk.donor.matches() });
    },
  });
}

export function useUploadDonorPhoto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.set("photo", file);
      return clientUpload<DonorProfile>("/donors/me/photo", formData);
    },
    onSuccess: (profile) => queryClient.setQueryData(qk.donor.profile(), profile),
  });
}
