import { cookies } from "next/headers";
import { API_URL } from "@/lib/api";
import { ACCESS_COOKIE } from "@/lib/session";

/**
 * Same-origin pass-through to the backend for Client Components (TanStack Query,
 * uploads). It attaches the httpOnly access token, which browser code can't read.
 */
async function forward(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const token = (await cookies()).get(ACCESS_COOKIE)?.value;
  const url = new URL(request.url);

  const headers = new Headers();
  const type = request.headers.get("content-type");
  if (type) headers.set("content-type", type);
  headers.set("accept", "application/json");
  if (token) headers.set("authorization", `Bearer ${token}`);

  const hasBody = !["GET", "HEAD"].includes(request.method);
  const upstream = await fetch(`${API_URL}/${path.map(encodeURIComponent).join("/")}${url.search}`, {
    method: request.method,
    headers,
    body: hasBody ? await request.arrayBuffer() : undefined,
    cache: "no-store",
  });

  return new Response(upstream.body, {
    status: upstream.status,
    headers: { "content-type": upstream.headers.get("content-type") ?? "application/json" },
  });
}

export { forward as GET, forward as POST, forward as PATCH, forward as PUT, forward as DELETE };
