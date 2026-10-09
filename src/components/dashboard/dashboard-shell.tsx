"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HeartPulse, LogOut, Menu, X } from "lucide-react";
import { logout } from "@/app/actions/auth";
import { cn } from "@/lib/cn";
import type { AuthUser } from "@/types";
import { dashboardNav, roleLabel, siteLink, type NavItem } from "./nav-config";
import { CurrentUserProvider } from "./user-context";

function isNavActive(pathname: string, href: string) {
  if (pathname === href) return true;
  if (href === "/dashboard/hospital/requests") {
    return pathname.startsWith("/dashboard/hospital/requests/") && !pathname.startsWith("/dashboard/hospital/requests/new");
  }
  const overview = ["/dashboard/admin", "/dashboard/hospital", "/dashboard/donor"];
  if (overview.includes(href)) return false;
  return pathname.startsWith(href + "/");
}

function NavLinks({ items, onNavigate }: { items: NavItem[]; onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="space-y-1">
      {items.map(({ href, label, icon: Icon }) => {
        const active = isNavActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold transition-colors",
              active ? "bg-white/10 text-cream" : "text-[#f2d8ca]/65 hover:bg-white/[.07] hover:text-cream",
            )}
          >
            <Icon size={17} /> {label}
          </Link>
        );
      })}
    </nav>
  );
}

function Sidebar({ user, onNavigate }: { user: AuthUser; onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col bg-maroon px-5 py-7">
      <Link href="/" onClick={onNavigate} className="flex items-center gap-3">
        <span className="relative grid size-10 place-items-center rounded-[13px] bg-blood text-cream">
          <span className="absolute -top-1.5 right-0 size-3 rounded-full bg-mint-strong" />
          <HeartPulse size={22} strokeWidth={2.2} aria-hidden />
        </span>
        <span className="font-display text-lg tracking-[-.01em] text-cream">RaktoSheba</span>
      </Link>
      <p className="mt-12 px-3 text-[10px] font-extrabold tracking-[.18em] text-[#f2d8ca]/50 uppercase">{roleLabel[user.role]} workspace</p>
      <div className="mt-3">
        <NavLinks items={dashboardNav[user.role]} onNavigate={onNavigate} />
      </div>
      <div className="mt-auto space-y-4">
        <NavLinks items={[siteLink]} onNavigate={onNavigate} />
        <div className="rounded-2xl border border-white/10 bg-white/[.06] p-4">
          <div className="flex items-center gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-peach font-display text-base text-maroon">{user.email[0]?.toUpperCase()}</span>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-cream">{user.email}</p>
              <p className="mt-0.5 text-[10px] font-bold tracking-[.12em] text-[#f2d8ca]/60 uppercase">{roleLabel[user.role]}</p>
            </div>
          </div>
          <form action={logout}>
            <button type="submit" className="mt-4 flex items-center gap-2 text-xs font-bold text-[#f2d8ca]/65 transition-colors hover:text-white">
              <LogOut size={14} /> Sign out
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

/** Dashboard frame: fixed sidebar on desktop, slide-out sidebar on phones. */
export function DashboardShell({ user, children }: { user: AuthUser; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="min-h-screen bg-paper">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[264px] lg:block">
        <Sidebar user={user} />
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Dashboard menu">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="animate-fade-in absolute inset-0 bg-ink/45 backdrop-blur-sm"
          />
          <div className="animate-drawer-in absolute inset-y-0 left-0 w-[280px] overflow-y-auto overscroll-contain shadow-[24px_0_60px_rgba(62,41,36,.3)]">
            <Sidebar user={user} onNavigate={() => setOpen(false)} />
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="animate-fade-in absolute top-5 right-5 grid size-10 place-items-center rounded-full bg-cream text-ink shadow-lg"
          >
            <X size={18} />
          </button>
        </div>
      )}

      <div className="lg:pl-[264px]">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-ink/10 bg-paper/85 px-4 py-3.5 backdrop-blur-xl sm:px-5 sm:py-4 lg:hidden">
          <button type="button" onClick={() => setOpen(true)} aria-label="Open menu" className="grid size-10 place-items-center rounded-full text-ink-muted transition-colors hover:bg-linen hover:text-ink">
            <Menu size={20} />
          </button>
          <span className="relative grid size-8 shrink-0 place-items-center rounded-[10px] bg-blood text-cream">
            <HeartPulse size={16} strokeWidth={2.2} aria-hidden />
          </span>
          <p className="font-display text-lg tracking-[-.01em]">{roleLabel[user.role]} workspace</p>
        </header>
        <main className="mx-auto max-w-[1250px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10 2xl:max-w-none 2xl:px-14">
          <CurrentUserProvider value={user}>{children}</CurrentUserProvider>
        </main>
      </div>
    </div>
  );
}
