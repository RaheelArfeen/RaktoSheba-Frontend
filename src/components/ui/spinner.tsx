import { Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

/** The single spinning glyph every loading state in the app should reuse. */
export function Spinner({ className }: { className?: string }) {
  return <Loader2 className={cn("animate-spin text-blood", className)} aria-hidden="true" />;
}

/** Full-height loading screen for a route segment. Used directly by `loading.tsx` files. */
export function PageLoader({ label = "Loading…" }: { label?: string }) {
  return (
    <div role="status" aria-live="polite" className="flex min-h-[50vh] flex-col items-center justify-center gap-4 py-20">
      <span className="grid size-14 place-items-center rounded-2xl bg-blush shadow-sm">
        <Spinner className="size-6" />
      </span>
      <p className="text-sm font-semibold text-ink-muted">{label}</p>
    </div>
  );
}
