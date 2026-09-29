import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "w-full min-w-0 rounded-2xl border border-ink/12 bg-cream px-4 py-3.5 text-sm text-ink transition-all outline-none placeholder:text-ink-faint",
        "focus-visible:border-blood/60 focus-visible:ring-4 focus-visible:ring-blood/10",
        "aria-invalid:border-blood aria-invalid:ring-4 aria-invalid:ring-blood/10",
        "disabled:cursor-not-allowed disabled:opacity-60",
        "file:mr-3 file:border-0 file:bg-transparent file:text-sm file:font-bold file:text-blood",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
