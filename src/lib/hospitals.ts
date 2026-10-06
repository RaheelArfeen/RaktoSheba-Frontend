import type { BloodRequest, BloodRequestDetail, CreateBloodRequestInput, Hospital, RequestBoardQuery } from "@/types";
import type { HospitalEditValues } from "@/lib/validations";
import { api, apiPaginated, API_URL } from "./api";

export const hospitalApi = {
  /** The signed-in hospital's own profile, including verification status. */
  me: (token: string) => api<Hospital>("/hospitals/me", { token, cache: "no-store" }),

  /** Update the hospital's name and address. */
  updateProfile: (token: string, body: HospitalEditValues) =>
    api<Hospital>("/hospitals/me", { method: "PATCH", token, cache: "no-store", body }),

  /** Upload a licence document (multipart). Bypasses the JSON helper. */
  uploadLicence: async (token: string, formData: FormData): Promise<{ success: boolean; message?: string }> => {
    const response = await fetch(`${API_URL}/hospitals/me/licence`, {
      method: "POST",
      headers: { authorization: `Bearer ${token}` },
      body: formData,
      cache: "no-store",
    });
    const result = (await response.json().catch(() => null)) as { success?: boolean; message?: string } | null;
    if (!response.ok || !result?.success) {
      throw new Error(result?.message ?? "The upload failed. Please try again.");
    }
    return result as { success: boolean; message?: string };
  },
};

export const hospitalRequestApi = {
  /** Paginated list of the signed-in hospital's blood requests. */
  myRequests: (token: string, query: RequestBoardQuery) =>
    apiPaginated<BloodRequest[]>("/hospitals/me/requests", { token, cache: "no-store", query }),

  /** Single request detail by id. */
  requestById: (token: string, id: string) =>
    api<BloodRequestDetail>("/hospitals/me/requests/" + id, { token, cache: "no-store" }),

  /** Post a new blood request. */
  createRequest: (token: string, body: CreateBloodRequestInput) =>
    api<BloodRequest>("/hospitals/me/requests", { method: "POST", token, cache: "no-store", body }),

  /** Mark a matched request as fulfilled. */
  fulfillRequest: (token: string, requestId: string) =>
    api<BloodRequest>("/hospitals/me/requests/" + requestId + "/fulfill", { method: "PATCH", token, cache: "no-store" }),
};
