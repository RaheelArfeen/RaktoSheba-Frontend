import type { Hospital, HospitalType, RequestBoardQuery, RequestStatus, VerificationStatus } from "@/types";
import { HOSPITAL_TYPES, type HospitalProfileValues } from "@/lib/validations";

export const boardStatusToApi = (status?: RequestBoardQuery["status"]): RequestStatus | undefined => {
  if (!status || status === "all") return undefined;
  if (status === "open") return "VERIFIED";
  if (status === "pending") return "PENDING";
  if (status === "matched") return "MATCHED";
  if (status === "fulfilled") return "FULFILLED";
  if (status === "cancelled") return "CANCELLED";
  return undefined;
};

/** Pill styling for the three hospital verification states. */
export const VERIFICATION_META: Record<VerificationStatus, { label: string; pill: string; dot: string }> = {
  VERIFIED: { label: "Verified", pill: "bg-mint text-forest", dot: "bg-mint-strong" },
  PENDING: { label: "Pending", pill: "bg-sand text-sand-deep", dot: "bg-gold" },
  REJECTED: { label: "Rejected", pill: "bg-blush text-blood", dot: "bg-blood" },
};

/** Human label for a stored hospital type, or null when the hospital hasn't picked one. */
export const hospitalTypeLabel = (type: HospitalType | null | undefined) =>
  HOSPITAL_TYPES.find((t) => t.value === type)?.label ?? null;

/** Body for POST /hospitals and PATCH /hospitals/me. Blank inputs are omitted, not sent as "". */
export const toHospitalPayload = (values: HospitalProfileValues) => {
  const text = (v?: string) => (v?.trim() ? v.trim() : undefined);
  return {
    name: values.hospitalName.trim(),
    address: values.hospitalAddress.trim(),
    type: (values.hospitalType || undefined) as HospitalType | undefined,
    email: text(values.email),
    district: values.district.trim(),
    upazila: text(values.upazila),
    phone: values.phone.trim(),
    emergencyPhone: text(values.emergencyPhone),
    website: text(values.website),
    openHours: text(values.openHours),
    hasEmergencyService: values.hasEmergencyService,
    licenseNumber: text(values.licenseNumber),
    description: text(values.description),
  };
};

/** Form defaults for the shared hospital fields, from a stored profile if there is one. */
export const toHospitalFormValues = (hospital?: Hospital | null): HospitalProfileValues => ({
  hospitalName: hospital?.name ?? "",
  hospitalAddress: hospital?.address ?? "",
  hospitalType: hospital?.type ?? "",
  email: hospital?.email ?? "",
  phone: hospital?.phone ?? "",
  emergencyPhone: hospital?.emergencyPhone ?? "",
  district: hospital?.district ?? "",
  upazila: hospital?.upazila ?? "",
  website: hospital?.website ?? "",
  openHours: hospital?.openHours ?? "",
  hasEmergencyService: hospital?.hasEmergencyService ?? false,
  licenseNumber: hospital?.licenseNumber ?? "",
  description: hospital?.description ?? "",
});

