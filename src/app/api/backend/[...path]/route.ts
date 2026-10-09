import { cookies } from "next/headers";
import { API_URL } from "@/lib/api";
import { ACCESS_COOKIE, REFRESH_COOKIE, sessionCookieOptions } from "@/lib/session";

/**
 * Same-origin pass-through to the backend for Client Components (TanStack Query,
 * uploads). It attaches the httpOnly access token, which browser code can't read,
 * and silently refreshes it when it has expired.
 */

// Parallel 401s (several queries at once) share a single refresh call.
let refreshInFlight: Promise<string | null> | null = null;

function refreshAccessToken(refreshToken: string): Promise<string | null> {
  refreshInFlight ??= (async () => {
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
  })().finally(() => {
    refreshInFlight = null;
  });
  return refreshInFlight;
}

async function forward(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const store = await cookies();
  const url = new URL(request.url);

  const body = ["GET", "HEAD"].includes(request.method) ? undefined : await request.arrayBuffer();
  const type = request.headers.get("content-type");

  const send = (token?: string) => {
    const headers = new Headers();
    if (type) headers.set("content-type", type);
    headers.set("accept", "application/json");
    if (token) headers.set("authorization", `Bearer ${token}`);
    return fetch(`${API_URL}/${path.map(encodeURIComponent).join("/")}${url.search}`, {
      method: request.method,
      headers,
      body,
      cache: "no-store",
    });
  };

  let upstream = await send(store.get(ACCESS_COOKIE)?.value);

  // Access tokens live 30 minutes and client-side fetches bypass the middleware,
  // so a stale token is exchanged here and the request retried once.
  if (upstream.status === 401) {
    const refresh = store.get(REFRESH_COOKIE)?.value;
    const fresh = refresh ? await refreshAccessToken(refresh) : null;
    if (fresh) {
      store.set(ACCESS_COOKIE, fresh, sessionCookieOptions(fresh, 30 * 60));
      upstream = await send(fresh);
    }
  }

  return new Response(upstream.body, {
    status: upstream.status,
    headers: { "content-type": upstream.headers.get("content-type") ?? "application/json" },
  });
}

export { forward as GET, forward as POST, forward as PATCH, forward as PUT, forward as DELETE };
