import type { Metadata } from "next";
import { AdminOverview } from "./components/admin-overview";

export const metadata: Metadata = { title: "Admin dashboard" };

export default function AdminDashboard() {
  return <AdminOverview />;
}
