"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, LayoutDashboard, LogOut } from "lucide-react";
import { logout } from "@/app/actions/auth";
import { cn } from "@/lib/cn";
import type { AuthUser } from "@/types";

const roleTone = { ADMIN: "bg-sand text-sand-deep", HOSPITAL: "bg-blush text-blood", DONOR: "bg-mint text-forest" };

/** Account button in the header: initial + role, with a dropdown to the dashboard and sign out. */
export function UserMenu({ user }: { user: AuthUser }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close when clicking outside or pressing Escape.
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-2 rounded-full border border-ink/10 bg-cream/70 py-1 pr-3 pl-1 transition-colors hover:border-blood/25"
      >
        <span className="grid size-8 place-items-center rounded-full bg-peach font-display text-sm text-maroon">{user.email[0]?.toUpperCase()}</span>
        <ChevronDown size={15} className={cn("text-ink-muted transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div role="menu" className="absolute top-12 right-0 z-50 w-64 rounded-2xl border border-ink/10 bg-cream p-2 shadow-[0_24px_60px_rgba(62,41,36,.18)]">
          <div className="px-3 py-2.5">
            <p className="truncate text-sm font-bold">{user.email}</p>
            <span className={cn("mt-1.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-extrabold tracking-[.12em] uppercase", roleTone[user.role])}>
              {user.role.toLowerCase()}
            </span>
          </div>
          <div className="my-1 h-px bg-ink/10" />
          <Link
            href={`/dashboard/${user.role.toLowerCase()}`}
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-ink-soft hover:bg-linen hover:text-blood"
          >
            <LayoutDashboard size={16} /> Dashboard
          </Link>
          <form action={logout}>
            <button type="submit" role="menuitem" className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-ink-soft hover:bg-linen hover:text-blood">
              <LogOut size={16} /> Sign out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
