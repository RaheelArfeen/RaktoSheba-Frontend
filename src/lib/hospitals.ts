import type { BloodRequest, BloodRequestDetail, CreateBloodRequestInput, Hospital, RequestBoardQuery } from "@/types";
import { api, apiPaginated } from "./api";

export const hospitalApi = {
  /** The signed-in hospital's own profile, including verification status. */
  me: (token: string) => api<Hospital>("/hospitals/me", { token, cache: "no-store" }),
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
