"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ApiError } from "@/lib/api";
import { adminApi } from "@/lib/admin";
import { getSession } from "@/lib/session";

export type ActionResult = { error: string } | { ok: true };

const messageFor = (error: unknown) =>
  error instanceof ApiError ? error.message : "We couldn't reach RaktoSheba. Check your connection and try again.";

async function adminToken() {
  const session = await getSession();
  if (!session || session.user.role !== "ADMIN") {
    redirect("/auth/login?next=/dashboard/admin");
  }
  return session.accessToken;
}

/** Verify a pending blood request — moves it to VERIFIED and alerts donors. */
export async function verifyRequest(requestId: string): Promise<ActionResult> {
  const token = await adminToken();
  try {
    await adminApi.verifyRequest(token, requestId);
    revalidatePath("/dashboard/admin/queue");
    revalidatePath("/dashboard/admin", "layout");
    return { ok: true };
  } catch (error) {
    return { error: messageFor(error) };
  }
}

/** Cancel a pending blood request. */
export async function cancelRequest(requestId: string): Promise<ActionResult> {
  const token = await adminToken();
  try {
    await adminApi.cancelRequest(token, requestId);
    revalidatePath("/dashboard/admin/queue");
    revalidatePath("/dashboard/admin", "layout");
    return { ok: true };
  } catch (error) {
    return { error: messageFor(error) };
  }
}

/** Verify a hospital registration. */
export async function verifyHospital(hospitalId: string): Promise<ActionResult> {
  const token = await adminToken();
  try {
    await adminApi.verifyHospital(token, hospitalId);
    revalidatePath("/dashboard/admin/hospitals");
    revalidatePath("/dashboard/admin", "layout");
    return { ok: true };
  } catch (error) {
    return { error: messageFor(error) };
  }
}
