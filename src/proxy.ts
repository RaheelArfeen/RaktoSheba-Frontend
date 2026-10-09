import { NextResponse, type NextRequest } from "next/server";
import { API_URL } from "@/lib/api";
import { ACCESS_COOKIE, REFRESH_COOKIE, dashboardPath, decodeToken, isExpired, sessionCookieOptions } from "@/lib/session";

const ROLE_AREAS = ["admin", "hospital", "donor"];

/** Pages outside /dashboard that also need a signed-in user. The /requests board itself stays public. */
const isSignedInOnly = (pathname: string) =>
  pathname.startsWith("/payment/") || pathname.startsWith("/onboarding") || /^\/requests\/[^/]+\/?$/.test(pathname);

/** Swap an expired access token for a fresh one using the refresh token. */
async function refreshAccessToken(refreshToken: string): Promise<string | null> {
  try {
    const res = await fetch(`${API_URL}/auth/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    const body = (await res.json()) as { success?: boolean; data?: { accessToken?: string } };
    return res.ok && body.success && body.data?.accessToken ? body.data.accessToken : null;
  } catch {
    return null;
  }
}

/**
 * Runs before every page: keeps the session fresh, protects /dashboard by role,
 * requires sign-in for payment results and request details,
 * and keeps signed-in users out of the sign-in pages. The backend still checks
 * every API call — this is for routing, not security on its own.
 */
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  let access = request.cookies.get(ACCESS_COOKIE)?.value;
  const refresh = request.cookies.get(REFRESH_COOKIE)?.value;

  let refreshed: string | null = null;
  if (isExpired(access) && refresh && !isExpired(refresh, 0)) {
    refreshed = await refreshAccessToken(refresh);
    if (refreshed) access = refreshed;
  }
  const user = access && !isExpired(access, 0) ? decodeToken(access) : null;

  let response: NextResponse;
  if (isSignedInOnly(pathname) && !user) {
    const login = new URL("/auth/login", request.url);
    login.searchParams.set("next", pathname + search);
    response = NextResponse.redirect(login);
  } else if (pathname.startsWith("/dashboard")) {
    if (!user) {
      const login = new URL("/auth/login", request.url);
      login.searchParams.set("next", pathname + search);
      response = NextResponse.redirect(login);
    } else {
      const area = pathname.split("/")[2];
      const home = dashboardPath(user.role);
      // /dashboard itself, or another role's area, goes to your own dashboard.
      response = !area || (ROLE_AREAS.includes(area) && `/dashboard/${area}` !== home) ? NextResponse.redirect(new URL(home, request.url)) : nextWithToken(request, refreshed);
    }
  } else if (pathname.startsWith("/auth") && user) {
    response = NextResponse.redirect(new URL(dashboardPath(user.role), request.url));
  } else {
    response = nextWithToken(request, refreshed);
  }

  if (refreshed) {
    response.cookies.set(ACCESS_COOKIE, refreshed, sessionCookieOptions(refreshed, 30 * 60));
  } else if (!user && (access || refresh)) {
    // Both tokens are dead: clear them so the site stops treating this browser as signed in.
    response.cookies.delete(ACCESS_COOKIE);
    response.cookies.delete(REFRESH_COOKIE);
  }
  return response;
}

/** Continue the request; if the token was just refreshed, let this render already see the new one. */
function nextWithToken(request: NextRequest, refreshed: string | null) {
  if (!refreshed) return NextResponse.next();
  const headers = new Headers(request.headers);
  request.cookies.set(ACCESS_COOKIE, refreshed);
  headers.set("cookie", request.cookies.toString());
  return NextResponse.next({ request: { headers } });
}

export const config = {
  // Everything except static files and images.
  matcher: ["/((?!_next/static|_next/image|icon.svg|robots.txt|sitemap.xml|.*\\.(?:webp|png|jpg|jpeg|svg|ico)$).*)"],
};
