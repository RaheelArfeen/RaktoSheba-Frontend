"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CircleAlert, Menu, X } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { publicNav } from "@/lib/site";
import { Logo } from "./logo";

// Public site header: logo, pill navigation, emergency + sign-in links, and a slide-out menu on phones.
export function SiteHeader() {
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

  const isActive = (href: string) => !href.includes("#") && (pathname === href || pathname.startsWith(`${href}/`));

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
                isActive(item.href) ? "bg-blood text-cream" : "hover:bg-linen hover:text-blood"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ButtonLink href="/emergency" variant="soft" size="sm" className="hidden sm:inline-flex">
            <CircleAlert /> Emergency help
          </ButtonLink>
          <ButtonLink href="/auth/login" variant="ghost" className="hidden sm:inline-flex">
            Sign in
          </ButtonLink>
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
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <button type="button" aria-label="Close menu" onClick={() => setOpen(false)} className="absolute inset-0 bg-ink/45 backdrop-blur-sm" />
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
            <nav aria-label="Main" className="mt-8 flex flex-col gap-1 text-lg font-bold text-ink-soft">
              {publicNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`rounded-2xl px-3 py-3 transition-colors ${
                    isActive(item.href) ? "bg-blush text-blood" : "hover:bg-linen hover:text-blood"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-10 flex flex-col gap-3">
              <ButtonLink href="/emergency" variant="soft" onClick={() => setOpen(false)} className="justify-start rounded-2xl">
                <CircleAlert /> Emergency help — no login
              </ButtonLink>
              <ButtonLink href="/auth/login" variant="outline" onClick={() => setOpen(false)}>
                Sign in
              </ButtonLink>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
