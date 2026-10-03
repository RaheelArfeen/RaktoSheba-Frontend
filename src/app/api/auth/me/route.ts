import { getSession } from "@/lib/session";

/** Who is signed in, for Client Components. Never returns the token itself. */
export async function GET() {
  const session = await getSession();
  if (!session) return Response.json({ success: false, message: "Not signed in" }, { status: 401 });
  return Response.json({ success: true, message: "Signed in", data: session.user });
}
