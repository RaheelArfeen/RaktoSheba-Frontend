import { NextResponse, type NextRequest } from "next/server";
import { api, ApiError } from "@/lib/api";
import { dashboardPath, safeNext, setSessionCookies } from "@/lib/session";
import type { AuthSession } from "@/types";

/**
 * Google sends people here (via the backend) with a 2-minute pass. Swap it for a
 * session, save the cookies, then continue — new accounts go to finish their profile.
 */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  const next = safeNext(request.nextUrl.searchParams.get("next"), "");
  const fail = (message: string) => {
    const login = new URL("/auth/login", request.url);
    login.searchParams.set("error", message);
    return NextResponse.redirect(login);
  };

  if (!token) return fail("Google sign-in didn't finish. Please try again.");

  let session: AuthSession & { isNew: boolean };
  try {
    session = await api<AuthSession & { isNew: boolean }>("/auth/google/exchange", { method: "POST", body: { token }, cache: "no-store" });
  } catch (error) {
    return fail(error instanceof ApiError ? error.message : "Google sign-in failed. Please try again.");
  }
  await setSessionCookies(session);

  // Donors and hospitals need a profile before their dashboard is useful.
  const { role } = session.user;
  if (role !== "ADMIN") {
    const hasProfile = await api(role === "DONOR" ? "/donors/me" : "/hospitals/me", { token: session.accessToken, cache: "no-store" })
      .then(() => true)
      .catch(() => false);
    if (!hasProfile) {
      const onboarding = new URL("/onboarding", request.url);
      if (next) onboarding.searchParams.set("next", next);
      return NextResponse.redirect(onboarding);
    }
  }

  return NextResponse.redirect(new URL(next || dashboardPath(role), request.url));
}
