"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CircleAlert, LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import { logout } from "@/app/actions/auth";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { publicNav } from "@/lib/site";
import type { AuthUser } from "@/types";
import { Logo } from "./logo";
import { UserMenu } from "./user-menu";

// Public site header: logo, pill navigation, emergency + sign-in links, and a slide-out menu on phones.
export function SiteHeader({ user }: { user?: AuthUser | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the phone menu on navigation and lock page scroll while it's open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Hospitals post their own requests, so the patient-facing emergency button isn't for them.
  const showEmergency = user?.role !== "HOSPITAL";

  const isActive = (href: string) =>
    !href.includes("#") &&
    (pathname === href || pathname.startsWith(`${href}/`));

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/80 backdrop-blur-xl">
      <Container className="flex items-center justify-between gap-6 py-4">
        <Logo />

        <nav
          aria-label="Main"
          className="hidden items-center gap-1 rounded-full border border-ink/10 bg-cream/70 p-1 text-sm font-semibold text-ink-muted shadow-[0_6px_18px_rgba(91,44,30,.05)] lg:flex"
        >
          {publicNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`rounded-full px-4 py-2 transition-colors ${
                isActive(item.href)
                  ? "bg-blood text-cream"
                  : "hover:bg-linen hover:text-blood"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {showEmergency ? (
            // Always visible, even on phones: this is the one button someone in a hurry needs.
            <ButtonLink href="/emergency" variant="soft" size="sm">
              <CircleAlert /> <span className="sm:hidden">Help</span>
              <span className="hidden sm:inline">Emergency help</span>
            </ButtonLink>
          ) : null}
          {user ? (
            <>
              <ButtonLink
                href={`/dashboard/${user.role.toLowerCase()}`}
                size="sm"
                className="hidden sm:inline-flex"
              >
                <LayoutDashboard /> Dashboard
              </ButtonLink>
              <div className="hidden sm:block">
                <UserMenu user={user} />
              </div>
            </>
          ) : (
            <>
              <ButtonLink
                href="/auth/login"
                variant="ghost"
                size="sm"
                className="hidden sm:inline-flex"
              >
                Sign in
              </ButtonLink>
              <ButtonLink
                href="/auth/register"
                size="sm"
                className="hidden md:inline-flex"
              >
                Join free
              </ButtonLink>
            </>
          )}
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            className="grid size-10 place-items-center rounded-full text-ink-muted transition-colors hover:bg-linen hover:text-blood lg:hidden"
          >
            <Menu size={20} />
          </button>
        </div>
      </Container>

      {open && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-ink/45 backdrop-blur-sm"
          />
          <div className="absolute inset-y-0 right-0 flex w-[86%] max-w-sm flex-col overflow-y-auto border-l border-ink/10 bg-paper p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <Logo onClick={() => setOpen(false)} />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="grid size-9 place-items-center rounded-full text-ink-muted hover:bg-linen"
              >
                <X size={18} />
              </button>
            </div>
            <nav
              aria-label="Main"
              className="mt-8 flex flex-col gap-1 text-lg font-bold text-ink-soft"
            >
              {publicNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`rounded-2xl px-3 py-3 transition-colors ${
                    isActive(item.href)
                      ? "bg-blush text-blood"
                      : "hover:bg-linen hover:text-blood"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-10 flex flex-col gap-3">
              {showEmergency && (
                <ButtonLink
                  href="/emergency"
                  variant="soft"
                  onClick={() => setOpen(false)}
                  className="justify-start rounded-2xl"
                >
                  <CircleAlert /> Emergency help — no login
                </ButtonLink>
              )}
              {user ? (
                <>
                  <ButtonLink
                    href={`/dashboard/${user.role.toLowerCase()}`}
                    onClick={() => setOpen(false)}
                  >
                    <LayoutDashboard /> Dashboard
                  </ButtonLink>
                  <form action={logout}>
                    <button
                      type="submit"
                      className="flex h-11 w-full items-center justify-center gap-2 rounded-full border border-ink/15 bg-cream/70 text-sm font-bold text-ink-soft"
                    >
                      <LogOut size={16} /> Sign out
                    </button>
                  </form>
                  <p className="truncate text-center text-xs text-ink-faint">
                    Signed in as {user.email}
                  </p>
                </>
              ) : (
                <>
                  <ButtonLink
                    href="/auth/register"
                    onClick={() => setOpen(false)}
                  >
                    Join free
                  </ButtonLink>
                  <ButtonLink
                    href="/auth/login"
                    variant="outline"
                    onClick={() => setOpen(false)}
                  >
                    Sign in
                  </ButtonLink>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
