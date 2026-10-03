import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getSession } from "@/lib/session";

// The proxy already redirects signed-out visitors; this is the server-side backstop.
export default async function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  const session = await getSession();
  if (!session) redirect("/auth/login?next=/dashboard");
  return <DashboardShell user={session.user}>{children}</DashboardShell>;
}
