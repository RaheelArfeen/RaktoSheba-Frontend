"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ApiError, API_URL } from "@/lib/api";
import { hospitalApi, hospitalRequestApi } from "@/lib/hospitals";
import { getSession } from "@/lib/session";
import { bloodRequestWizardSchema, hospitalEditSchema, type BloodRequestWizardValues, type HospitalEditValues } from "@/lib/validations";

export type ActionResult = { error: string } | { ok: true };

const LICENCE_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
const LICENCE_MAX_BYTES = 5 * 1024 * 1024;

const messageFor = (error: unknown) =>
  error instanceof ApiError ? error.message : "We couldn't reach RaktoSheba. Check your connection and try again.";

async function hospitalToken() {
  const session = await getSession();
  if (!session || session.user.role !== "HOSPITAL") {
    redirect("/auth/login?next=/dashboard/hospital");
  }
  return session.accessToken;
}

/** Post a new blood request for the signed-in hospital. */
export async function createBloodRequest(
  values: BloodRequestWizardValues,
): Promise<{ error: string } | { ok: true; id: string }> {
  const token = await hospitalToken();
  const parsed = bloodRequestWizardSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form and try again." };
  }

  const { bloodGroup, units, urgency, lat, lng } = parsed.data;
  // `location` is UI-only — the backend derives it from the hospital's own address.

  try {
    const result = await hospitalRequestApi.createRequest(token, {
      bloodGroup,
      unitsNeeded: units,
      urgency,
      lat: lat ?? undefined,
      lng: lng ?? undefined,
    });
    revalidatePath("/dashboard/hospital/requests", "layout");
    return { ok: true, id: result.id };
  } catch (error) {
    return { error: messageFor(error) };
  }
}

/** Mark a matched blood request as fulfilled. */
export async function fulfillRequest(requestId: string): Promise<ActionResult> {
  const token = await hospitalToken();
  try {
    await hospitalRequestApi.fulfillRequest(token, requestId);
    revalidatePath("/dashboard/hospital/requests", "layout");
    revalidatePath("/dashboard/hospital/requests/" + requestId);
    return { ok: true };
  } catch (error) {
    return { error: messageFor(error) };
  }
}

/** Update the hospital's name and address. */
export async function updateHospitalProfile(values: HospitalEditValues): Promise<ActionResult> {
  const token = await hospitalToken();
  const parsed = hospitalEditSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form and try again." };
  }
  try {
    await hospitalApi.updateProfile(token, parsed.data);
    revalidatePath("/dashboard/hospital", "layout");
    return { ok: true };
  } catch (error) {
    return { error: messageFor(error) };
  }
}

/** Upload a licence document (multipart, bypasses the JSON helper). */
export async function uploadLicenceDoc(formData: FormData): Promise<ActionResult> {
  const token = await hospitalToken();
  const file = formData.get("licence");
  if (!(file instanceof File) || file.size === 0) return { error: "Choose a file first." };
  if (!LICENCE_TYPES.includes(file.type))
    return { error: "The licence must be a JPG, PNG, WEBP image or a PDF document." };
  if (file.size > LICENCE_MAX_BYTES) return { error: "The file must be smaller than 5 MB." };

  const body = new FormData();
  body.set("licence", file);
  try {
    const response = await fetch(`${API_URL}/hospitals/me/licence`, {
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
  revalidatePath("/dashboard/hospital", "layout");
  return { ok: true };
}
