import { redirect } from "next/navigation";
import { dashboardPath, getSession } from "@/lib/session";

/** /dashboard sends each person to their own role's dashboard. */
export default async function DashboardIndex() {
  const session = await getSession();
  redirect(session ? dashboardPath(session.user.role) : "/auth/login?next=/dashboard");
}
