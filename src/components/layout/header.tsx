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
import { NotificationBell, NotificationProvider } from "@/components/notifications/notification-bell";

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

  // A soft shadow once the page scrolls, so the header stays clearly separate from the content under it.
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    !href.includes("#") &&
    (pathname === href || pathname.startsWith(`${href}/`));

  const content = (
    <header
      className={`sticky top-0 z-40 border-b bg-paper transition-shadow ${
        scrolled
          ? "border-ink/10 shadow-[0_6px_24px_rgba(62,41,36,.08)]"
          : "border-ink/[.07]"
      }`}
    >
      <Container className="flex h-[72px] items-center justify-between gap-6">
        <Logo />

        <nav aria-label="Main" className="hidden h-full items-center gap-6 lg:flex xl:gap-8">
          {publicNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`relative flex h-full items-center text-[15px] font-semibold whitespace-nowrap transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-[3px] after:rounded-t-full after:transition-colors ${
                isActive(item.href)
                  ? "text-blood after:bg-blood"
                  : "text-ink-soft after:bg-transparent hover:text-blood"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {showEmergency ? (
            // Always visible, even on phones: this is the one button someone in a hurry needs.
            <Link
              href="/emergency"
              className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full border border-blood/30 whitespace-nowrap bg-blush/60 px-3.5 text-sm font-bold text-blood transition-colors hover:border-blood/50 hover:bg-blush sm:px-4"
            >
              <CircleAlert size={17} aria-hidden />
              {/* Short label on phones and on laptop widths where the full nav needs the room. */}
              <span className="sm:hidden lg:inline xl:hidden">Help</span>
              <span className="hidden sm:inline lg:hidden xl:inline">Emergency help</span>
            </Link>
          ) : null}
          {user ? (
            <div className="hidden items-center gap-3 sm:flex">
              <span className="h-6 w-px bg-ink/10" aria-hidden />
              <Link
                href={`/dashboard/${user.role.toLowerCase()}`}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-blood px-4 whitespace-nowrap text-sm font-bold text-cream transition-colors hover:bg-blood-deep"
              >
                <LayoutDashboard size={16} aria-hidden /> Dashboard
              </Link>
              <NotificationBell />
              <UserMenu user={user} />
            </div>
          ) : (
            <div className="hidden items-center gap-3 sm:flex">
              <span className="h-6 w-px bg-ink/10" aria-hidden />
              <Link
                href="/auth/login"
                className="inline-flex h-10 items-center px-2 text-sm font-bold text-ink transition-colors hover:text-blood"
              >
                Sign in
              </Link>
              <Link
                href="/auth/register"
                className="hidden h-10 items-center rounded-full bg-blood px-5 text-sm font-bold text-cream transition-colors hover:bg-blood-deep md:inline-flex"
              >
                Join free
              </Link>
            </div>
          )}
          {user && (
            <div className="sm:hidden">
              <NotificationBell />
            </div>
          )}
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            className="grid size-10 place-items-center rounded-full border border-ink/12 text-ink transition-colors hover:border-blood/30 hover:text-blood lg:hidden"
          >
            <Menu size={19} />
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

  // Signed-in visitors get the notification bell, which needs its provider around the header.
  return user ? <NotificationProvider role={user.role}>{content}</NotificationProvider> : content;
}
