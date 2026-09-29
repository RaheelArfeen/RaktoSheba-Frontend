import * as React from "react";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-28 w-full rounded-2xl border border-ink/12 bg-cream px-4 py-3.5 text-sm text-ink transition-all outline-none placeholder:text-ink-faint",
        "focus-visible:border-blood/60 focus-visible:ring-4 focus-visible:ring-blood/10",
        "aria-invalid:border-blood aria-invalid:ring-4 aria-invalid:ring-blood/10",
        "disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
