"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ApiError } from "@/lib/api";
import { hospitalRequestApi } from "@/lib/hospitals";
import { getSession } from "@/lib/session";
import { bloodRequestWizardSchema, type BloodRequestWizardValues } from "@/lib/validations";

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
