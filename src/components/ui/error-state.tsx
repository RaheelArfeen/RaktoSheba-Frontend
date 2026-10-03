"use client";

import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";

/**
 * Shared body for every route-segment `error.tsx` boundary. Next.js resets
 * the boundary by calling `reset`, which retries rendering that segment.
 */
export function ErrorState({
  title = "Something went wrong",
  message,
  reset,
  showHome = true,
}: {
  title?: string;
  message?: string;
  reset?: () => void;
  showHome?: boolean;
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-5 px-6 py-20 text-center">
      <span className="grid size-16 place-items-center rounded-2xl bg-blush text-blood shadow-sm">
        <AlertTriangle className="size-7" />
      </span>
      <div className="max-w-md space-y-2">
        <h2 className="font-display text-3xl tracking-[-.015em]">{title}</h2>
        <p className="text-sm leading-relaxed text-ink-muted">
          {message ?? "That didn't go through. It's likely temporary — try again in a moment."}
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {reset && (
          <Button onClick={reset} size="sm">
            <RotateCcw /> Try again
          </Button>
        )}
        {showHome && (
          <ButtonLink href="/" variant="outline" size="sm">
            <Home /> Back home
          </ButtonLink>
        )}
      </div>
    </div>
  );
}
