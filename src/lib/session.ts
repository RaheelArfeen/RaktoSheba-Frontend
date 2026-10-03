import { cookies } from "next/headers";
import type { AuthSession, AuthUser, Role } from "@/types";

// Cookie names for the session. Both are httpOnly, so browser JavaScript can never read the tokens.
export const ACCESS_COOKIE = "rs_access";
export const REFRESH_COOKIE = "rs_refresh";

export type TokenPayload = { userId: string; email: string; role: Role; exp: number };

/** Reads a JWT's payload without verifying it. The backend verifies every request; this is only for routing and display. */
export function decodeToken(token: string | undefined): TokenPayload | null {
  if (!token) return null;
  try {
    const part = token.split(".")[1];
    const json = atob(part.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(part.length / 4) * 4, "="));
    const payload = JSON.parse(json) as TokenPayload;
    return payload.userId && payload.role && payload.exp ? payload : null;
  } catch {
    return null;
  }
}

/** True if the token is missing, unreadable, or expires within `skewSeconds`. */
export function isExpired(token: string | undefined, skewSeconds = 30) {
  const payload = decodeToken(token);
  return !payload || payload.exp * 1000 <= Date.now() + skewSeconds * 1000;
}

export const dashboardPath = (role: Role) => `/dashboard/${role.toLowerCase()}`;

/** The signed-in user for Server Components and Server Actions, or null. */
export async function getSession(): Promise<{ user: AuthUser; accessToken: string } | null> {
  const store = await cookies();
  const accessToken = store.get(ACCESS_COOKIE)?.value;
  if (!accessToken || isExpired(accessToken, 0)) return null;
  const payload = decodeToken(accessToken)!;
  return { user: { id: payload.userId, email: payload.email, role: payload.role }, accessToken };
}

/** Cookie settings shared by the login action and the proxy's silent refresh. */
export function sessionCookieOptions(token: string, fallbackMaxAge: number) {
  const exp = decodeToken(token)?.exp;
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: exp ? Math.max(0, exp - Math.floor(Date.now() / 1000)) : fallbackMaxAge,
  };
}

/** Saves a new session's tokens as httpOnly cookies (Server Actions and Route Handlers only). */
export async function setSessionCookies(session: Pick<AuthSession, "accessToken" | "refreshToken">) {
  const store = await cookies();
  store.set(ACCESS_COOKIE, session.accessToken, sessionCookieOptions(session.accessToken, 30 * 60));
  store.set(REFRESH_COOKIE, session.refreshToken, sessionCookieOptions(session.refreshToken, 30 * 24 * 60 * 60));
}

/** Only allow redirects back into this site (never to another domain). */
export function safeNext(next: unknown, fallback: string) {
  return typeof next === "string" && next.startsWith("/") && !next.startsWith("//") ? next : fallback;
}
