import { Globe, LayoutDashboard, type LucideIcon } from "lucide-react";
import type { Role } from "@/types";

export type NavItem = { href: string; label: string; icon: LucideIcon };

// Sidebar links per role. Later phases add each role's pages here.
export const dashboardNav: Record<Role, NavItem[]> = {
  DONOR: [{ href: "/dashboard/donor", label: "Overview", icon: LayoutDashboard }],
  HOSPITAL: [{ href: "/dashboard/hospital", label: "Overview", icon: LayoutDashboard }],
  ADMIN: [{ href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard }],
};

export const siteLink: NavItem = { href: "/", label: "Back to the site", icon: Globe };

export const roleLabel: Record<Role, string> = { DONOR: "Donor", HOSPITAL: "Hospital", ADMIN: "Admin" };
