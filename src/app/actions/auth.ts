"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { ACCESS_COOKIE, REFRESH_COOKIE, dashboardPath, getSession, safeNext, setSessionCookies } from "@/lib/session";
import {
  donorProfileSchema,
  hospitalProfileSchema,
  loginSchema,
  registerSchema,
  type DonorProfileValues,
  type HospitalProfileValues,
  type LoginValues,
  type RegisterValues,
} from "@/lib/validations";
import type { AuthSession } from "@/types";

type ActionResult = { error: string } | void;

const startSession = setSessionCookies;

const messageFor = (error: unknown) =>
  error instanceof ApiError ? error.message : "We couldn't reach RaktoSheba. Check your connection and try again.";

export async function login(values: LoginValues, next?: string): Promise<ActionResult> {
  const parsed = loginSchema.safeParse(values);
  if (!parsed.success) return { error: "Enter a valid email and password." };

  let session: AuthSession;
  try {
    session = await api<AuthSession>("/auth/login", { method: "POST", body: parsed.data, cache: "no-store" });
  } catch (error) {
    return { error: messageFor(error) };
  }
  await startSession(session);
  redirect(safeNext(next, dashboardPath(session.user.role)));
}

export async function register(values: RegisterValues): Promise<ActionResult> {
  const parsed = registerSchema.safeParse(values);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Please check the form and try again." };
  const data = parsed.data;

  let session: AuthSession;
  try {
    session = await api<AuthSession>("/auth/register", {
      method: "POST",
      body: { email: data.email, password: data.password, role: data.role },
      cache: "no-store",
    });
  } catch (error) {
    return { error: messageFor(error) };
  }
  await startSession(session);

  // Create the role's profile straight away so the dashboard is ready on first visit.
  try {
    if (data.role === "DONOR") {
      await api("/donors", { method: "POST", token: session.accessToken, body: { bloodGroup: data.bloodGroup }, cache: "no-store" });
    } else {
      await api("/hospitals", {
        method: "POST",
        token: session.accessToken,
        body: { name: data.hospitalName, address: data.hospitalAddress },
        cache: "no-store",
      });
    }
  } catch {
    // The account exists and the user is signed in; they can finish their profile from the dashboard.
    redirect(`${dashboardPath(session.user.role)}?profile=incomplete`);
  }
  redirect(`${dashboardPath(session.user.role)}?welcome=1`);
}

/** Finish a donor or hospital profile (used after signing up with Google). */
export async function completeProfile(values: DonorProfileValues | HospitalProfileValues, next?: string): Promise<ActionResult> {
  const session = await getSession();
  if (!session) redirect("/auth/login");
  const { role } = session.user;

  try {
    if (role === "DONOR") {
      const parsed = donorProfileSchema.safeParse(values);
      if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Choose your blood group." };
      await api("/donors", { method: "POST", token: session.accessToken, body: { bloodGroup: parsed.data.bloodGroup }, cache: "no-store" });
    } else if (role === "HOSPITAL") {
      const parsed = hospitalProfileSchema.safeParse(values);
      if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the hospital details." };
      await api("/hospitals", {
        method: "POST",
        token: session.accessToken,
        body: { name: parsed.data.hospitalName, address: parsed.data.hospitalAddress },
        cache: "no-store",
      });
    }
  } catch (error) {
    // A profile that already exists is fine — just carry on to the dashboard.
    if (!(error instanceof ApiError && error.status === 409)) return { error: messageFor(error) };
  }
  redirect(safeNext(next, `${dashboardPath(role)}?welcome=1`));
}

export async function logout(): Promise<void> {
  const session = await getSession();
  if (session) {
    // Best effort: tell the backend, but always clear the cookies.
    await api("/auth/logout", { method: "POST", token: session.accessToken, cache: "no-store" }).catch(() => undefined);
  }
  const store = await cookies();
  store.delete(ACCESS_COOKIE);
  store.delete(REFRESH_COOKIE);
  redirect("/");
}
