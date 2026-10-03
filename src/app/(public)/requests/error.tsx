"use client";

import { RotateCcw, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { contact } from "@/lib/site";

export default function RequestsError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="page-container py-24">
      <div className="mx-auto flex max-w-md flex-col items-center text-center">
        <span className="grid size-14 place-items-center rounded-2xl bg-blush text-blood">
          <WifiOff className="size-6" />
        </span>
        <h1 className="mt-5 font-display text-4xl tracking-[-.05em]">The request board is unavailable</h1>
        <p className="mt-3 leading-7 text-ink-muted">
          We couldn&apos;t load live requests right now. If this is an emergency, call {contact.emergencyLine}.
        </p>
        <Button onClick={reset} className="mt-7">
          <RotateCcw /> Try again
        </Button>
      </div>
    </div>
  );
}
