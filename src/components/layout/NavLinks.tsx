"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { publicNav } from "@/lib/site";
import { cn } from "@/lib/utils";

// Highlights the section you're on. Hash links ("/#how-it-works") are never marked active.
export default function NavLinks({ className, onNavigate }: { className?: string; onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Main" className={className}>
      {publicNav.map((item) => {
        const active = !item.href.includes("#") && (pathname === item.href || pathname.startsWith(`${item.href}/`));
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn("transition-colors hover:text-blood", active && "text-blood")}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
