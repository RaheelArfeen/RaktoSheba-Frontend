"use client";

import { useState } from "react";
import Link from "next/link";
import { CircleAlert, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import Mark from "./Mark";
import NavLinks from "./NavLinks";

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[86%] max-w-sm gap-0 border-ink/10 bg-paper p-6">
        <SheetTitle className="sr-only">Menu</SheetTitle>
        <SheetDescription className="sr-only">Site navigation</SheetDescription>
        <Link href="/" onClick={close} aria-label="RaktoSheba home">
          <Mark />
        </Link>
        <NavLinks onNavigate={close} className="mt-10 flex flex-col gap-5 text-lg font-bold text-ink-soft" />
        <div className="mt-10 flex flex-col gap-3">
          <Button asChild variant="soft" className="justify-start rounded-2xl">
            <Link href="/emergency" onClick={close}>
              <CircleAlert /> Emergency help — no login
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/login" onClick={close}>
              Sign in
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard" onClick={close}>
              Open workspace
            </Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
