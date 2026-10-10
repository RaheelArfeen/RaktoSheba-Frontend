"use client";

import { useTransition } from "react";
import Link from "next/link";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDown, LayoutDashboard, LogOut } from "lucide-react";
import { logout } from "@/app/actions/auth";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/cn";
import type { AuthUser } from "@/types";

const roleTone = { ADMIN: "bg-sand text-sand-deep", HOSPITAL: "bg-blush text-blood", DONOR: "bg-mint text-forest" };

const item =
  "flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-ink-soft outline-none data-[highlighted]:bg-linen data-[highlighted]:text-blood";

/** Account button in the header (Radix DropdownMenu: keyboard and screen-reader friendly). */
export function UserMenu({ user }: { user: AuthUser }) {
  const [signingOut, startSignOut] = useTransition();

  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger
        aria-label="Account menu"
        className="group flex items-center gap-2 rounded-full border border-ink/10 bg-cream/70 py-1 pr-3 pl-1 transition-colors hover:border-blood/25 data-[state=open]:border-blood/25"
      >
        <span className="grid size-8 place-items-center rounded-full bg-peach font-display text-sm text-maroon">{user.email[0]?.toUpperCase()}</span>
        <ChevronDown size={15} className="text-ink-muted transition-transform group-data-[state=open]:rotate-180" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="animate-fade-in z-50 w-64 rounded-2xl border border-ink/10 bg-cream p-2 shadow-[0_24px_60px_rgba(62,41,36,.18)]"
        >
          <div className="px-3 py-2.5">
            <p className="truncate text-sm font-bold">{user.email}</p>
            <span className={cn("mt-1.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-extrabold tracking-[.12em] uppercase", roleTone[user.role])}>
              {user.role.toLowerCase()}
            </span>
          </div>
          <DropdownMenu.Separator className="my-1 h-px bg-ink/10" />
          <DropdownMenu.Item asChild className={item}>
            <Link href={`/dashboard/${user.role.toLowerCase()}`}>
              <LayoutDashboard size={16} /> Dashboard
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className={item}
            disabled={signingOut}
            onSelect={(e) => {
              e.preventDefault();
              startSignOut(() => logout());
            }}
          >
            {signingOut ? <Spinner className="size-4" /> : <LogOut size={16} />} Sign out
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
