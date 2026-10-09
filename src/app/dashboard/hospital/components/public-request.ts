import type { BloodRequest, PublicRequest } from "@/types";

/** Convert a hospital's own BloodRequest to the shape RequestCard expects. */
export function toPublicRequest(r: BloodRequest): PublicRequest {
  return {
    id: r.id,
    bloodGroup: r.bloodGroup,
    unitsNeeded: r.unitsNeeded,
    urgency: r.urgency,
    status: r.status,
    createdAt: r.createdAt,
    hospital: r.requester.hospital
      ? { name: r.requester.hospital.name, address: r.requester.hospital.address }
      : null,
  };
}
