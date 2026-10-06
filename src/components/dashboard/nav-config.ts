import { Building2, Droplets, Globe, HandHeart, History, LayoutDashboard, Plus, UserRound, type LucideIcon } from "lucide-react";
import type { Role } from "@/types";

export type NavItem = { href: string; label: string; icon: LucideIcon };

// Sidebar links per role. Later phases add each role's pages here.
export const dashboardNav: Record<Role, NavItem[]> = {
  DONOR: [
    { href: "/dashboard/donor", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/donor/matches", label: "Requests I can help", icon: HandHeart },
    { href: "/dashboard/donor/donations", label: "My donations", icon: History },
    { href: "/dashboard/donor/profile", label: "My profile", icon: UserRound },
  ],
  HOSPITAL: [
    { href: "/dashboard/hospital", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/hospital/requests", label: "Requests", icon: Droplets },
    { href: "/dashboard/hospital/requests/new", label: "New request", icon: Plus },
    { href: "/dashboard/hospital/profile", label: "Hospital profile", icon: Building2 },
  ],
  ADMIN: [{ href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard }],
};

export const siteLink: NavItem = { href: "/", label: "Back to the site", icon: Globe };

export const roleLabel: Record<Role, string> = { DONOR: "Donor", HOSPITAL: "Hospital", ADMIN: "Admin" };
