import { NextResponse, type NextRequest } from "next/server";
import { API_URL } from "@/lib/api";

// Sends the browser on to the backend's Google sign-in. Done on the server because the
// backend address (API_BASE_URL) is a server-only setting the browser can't read.
export function GET(request: NextRequest) {
  const url = new URL(`${API_URL}/auth/google`);
  const role = request.nextUrl.searchParams.get("role");
  const next = request.nextUrl.searchParams.get("next");
  if (role === "DONOR" || role === "HOSPITAL") url.searchParams.set("role", role);
  if (next) url.searchParams.set("next", next);
  return NextResponse.redirect(url);
}
