"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { publicNav } from "@/lib/site";
import { cn } from "@/lib/utils";

type NavLinksProps = {
  /** "pill": compact segmented group for the desktop header. "stack": large vertical list for the mobile menu. */
  variant?: "pill" | "stack";
  className?: string;
  onNavigate?: () => void;
};

// Highlights the section you're on. Hash links ("/#how-it-works") are never marked active.
export default function NavLinks({ variant = "pill", className, onNavigate }: NavLinksProps) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main"
      className={cn(
        variant === "pill"
          ? "items-center gap-1 rounded-full border border-ink/10 bg-cream/70 p-1 text-sm font-semibold text-ink-muted shadow-[0_6px_18px_rgba(91,44,30,.05)]"
          : "flex flex-col gap-1 text-lg font-bold text-ink-soft",
        className,
      )}
    >
      {publicNav.map((item) => {
        const active = !item.href.includes("#") && (pathname === item.href || pathname.startsWith(`${item.href}/`));
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "transition-colors",
              variant === "pill"
                ? cn("rounded-full px-4 py-2", active ? "bg-blood text-cream" : "hover:bg-linen hover:text-blood")
                : cn("rounded-2xl px-3 py-3", active ? "bg-blush text-blood" : "hover:bg-linen hover:text-blood"),
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
