"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { api, API_URL, ApiError } from "@/lib/api";
import { getSession } from "@/lib/session";
import { donorEditSchema, type DonorEditValues } from "@/lib/validations";

type ActionResult = { error: string } | { ok: true };

// Matches the backend upload rules, kept under Vercel's 4.5 MB request limit.
const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];
const PHOTO_MAX_BYTES = 4 * 1024 * 1024;

const messageFor = (error: unknown) =>
  error instanceof ApiError ? error.message : "We couldn't reach RaktoSheba. Check your connection and try again.";

async function donorToken() {
  const session = await getSession();
  if (!session || session.user.role !== "DONOR") redirect("/auth/login?next=/dashboard/donor");
  return session.accessToken;
}

// Every donor page reads the same profile, so refresh the whole donor area after a change.
const refresh = () => revalidatePath("/dashboard/donor", "layout");

/** Turns match alerts on or off. */
export async function setAvailability(isAvailable: boolean): Promise<ActionResult> {
  const token = await donorToken();
  try {
    await api("/donors/me/availability", { method: "PATCH", token, body: { isAvailable }, cache: "no-store" });
  } catch (error) {
    return { error: messageFor(error) };
  }
  refresh();
  return { ok: true };
}

/** Says "I can help" to a request. The backend re-checks blood group, availability and the 90-day gap. */
export async function acceptRequest(requestId: string): Promise<ActionResult> {
  const token = await donorToken();
  try {
    await api(`/requests/${requestId}/accept`, { method: "POST", token, cache: "no-store" });
  } catch (error) {
    return { error: messageFor(error) };
  }
  refresh();
  revalidatePath(`/requests/${requestId}`);
  return { ok: true };
}

/** Backs out of an upcoming donation; the request reopens for other donors. */
export async function withdrawDonation(donationId: string): Promise<ActionResult> {
  const token = await donorToken();
  try {
    await api(`/donors/me/donations/${donationId}/withdraw`, { method: "PATCH", token, cache: "no-store" });
  } catch (error) {
    return { error: messageFor(error) };
  }
  refresh();
  return { ok: true };
}

/** Saves blood group, last donation date and location. */
export async function updateDonorProfile(values: DonorEditValues): Promise<ActionResult> {
  const token = await donorToken();
  const parsed = donorEditSchema.safeParse(values);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Please check the form and try again." };
  const { bloodGroup, lastDonationAt, lat, lng } = parsed.data;

  try {
    await api("/donors/me", {
      method: "PATCH",
      token,
      cache: "no-store",
      body: {
        bloodGroup,
        // The date input gives "YYYY-MM-DD"; the backend wants a full ISO date-time.
        lastDonationAt: lastDonationAt ? new Date(`${lastDonationAt}T00:00:00+06:00`).toISOString() : undefined,
        lat: lat ?? undefined,
        lng: lng ?? undefined,
      },
    });
  } catch (error) {
    return { error: messageFor(error) };
  }
  refresh();
  return { ok: true };
}

/** Uploads a profile photo (multipart, so it bypasses the JSON helper). */
export async function uploadDonorPhoto(formData: FormData): Promise<ActionResult> {
  const token = await donorToken();
  const photo = formData.get("photo");
  if (!(photo instanceof File) || photo.size === 0) return { error: "Choose a photo first." };
  if (!PHOTO_TYPES.includes(photo.type)) return { error: "The photo must be a JPG, PNG or WEBP image." };
  if (photo.size > PHOTO_MAX_BYTES) return { error: "The photo must be smaller than 4 MB." };

  const body = new FormData();
  body.set("photo", photo);
  try {
    const response = await fetch(`${API_URL}/donors/me/photo`, {
      method: "POST",
      headers: { authorization: `Bearer ${token}` },
      body,
      cache: "no-store",
    });
    const result = (await response.json().catch(() => null)) as { success?: boolean; message?: string } | null;
    if (!response.ok || !result?.success) return { error: result?.message ?? "The upload failed. Please try again." };
  } catch {
    return { error: "We couldn't reach RaktoSheba. Check your connection and try again." };
  }
  refresh();
  return { ok: true };
}
