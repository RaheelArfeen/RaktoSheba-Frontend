"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { toHospitalPayload } from "@/lib/hospitals";
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
import type { AuthSession, Hospital } from "@/types";

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
  const target = safeNext(next, dashboardPath(session.user.role));

  if (session.user.role === "HOSPITAL") {
    // Hospitals with an unfinished profile complete the extended details form first.
    const profile = await api<Pick<Hospital, "phone" | "district">>("/hospitals/me", { token: session.accessToken, cache: "no-store" }).catch(() => null);
    if (!profile || !profile.phone?.trim() || !profile.district?.trim()) {
      redirect(`/onboarding?next=${encodeURIComponent(target)}`);
    }
  }
  redirect(target);
}

// Public demo accounts created by the backend seed, so reviewers can try each role in one click.
// They live on the server only; set DEMO_PASSWORD if the seed password ever changes.
const DEMO_ACCOUNTS = {
  DONOR: "donor@raktosheba.com",
  HOSPITAL: "hospital@raktosheba.com",
  ADMIN: "admin@raktosheba.com",
} as const;

export type DemoRole = keyof typeof DEMO_ACCOUNTS;

/** Signs in as the demo account for a role. */
export async function demoLogin(role: DemoRole, next?: string): Promise<ActionResult> {
  if (!(role in DEMO_ACCOUNTS)) return { error: "Unknown demo account." };
  // Ignore a `next` pointing at another role's dashboard, so each demo opens its own.
  const target = next?.startsWith("/dashboard") && !next.startsWith(dashboardPath(role)) ? undefined : next;
  return login({ email: DEMO_ACCOUNTS[role], password: process.env.DEMO_PASSWORD ?? "Demo@1234" }, target);
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

  // Hospitals finish their profile in the extended onboarding form; donors are done.
  const onboardingNext = `/onboarding?next=${encodeURIComponent(dashboardPath(session.user.role))}`;
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
    // The account exists and the user is signed in; donors can finish from the dashboard.
    if (data.role === "HOSPITAL") redirect(onboardingNext);
    redirect(`${dashboardPath(session.user.role)}?profile=incomplete`);
  }
  if (data.role === "HOSPITAL") redirect(onboardingNext);
  redirect(`${dashboardPath(session.user.role)}?welcome=1`);
}

/** Finish a donor or hospital profile (used after signing up with Google or registering as a hospital). */
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
      const body = toHospitalPayload(parsed.data);
      try {
        await api("/hospitals", { method: "POST", token: session.accessToken, body, cache: "no-store" });
      } catch (error) {
        // The profile was already created during sign-up? Fill in the extended details instead.
        if (!(error instanceof ApiError && error.status === 409)) return { error: messageFor(error) };
        await api("/hospitals/me", { method: "PATCH", token: session.accessToken, body, cache: "no-store" });
      }
    }
  } catch (error) {
    // A donor profile that already exists is fine — just carry on to the dashboard.
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
