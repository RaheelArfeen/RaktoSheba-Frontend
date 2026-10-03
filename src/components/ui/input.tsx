import type { ComponentProps } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

const field =
  "w-full rounded-2xl border border-ink/12 bg-paper px-4 py-3.5 text-sm text-ink outline-none transition-all placeholder:text-ink-faint focus-visible:border-blood/60 focus-visible:ring-4 focus-visible:ring-blood/10 aria-invalid:border-blood aria-invalid:ring-4 aria-invalid:ring-blood/10 disabled:cursor-not-allowed disabled:opacity-60";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(field, className)} {...props} />;
}

export function Select({ className, children, ...props }: ComponentProps<"select">) {
  return (
    <div className="relative">
      <select className={cn(field, "cursor-pointer appearance-none pr-10 font-semibold", className)} {...props}>
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-ink-faint" />
    </div>
  );
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={cn(field, "min-h-28", className)} {...props} />;
}

export function Label({ className, children, ...props }: ComponentProps<"label">) {
  return (
    <label className={cn("mb-2 block text-sm font-bold text-ink", className)} {...props}>
      {children}
    </label>
  );
}

/** Validation message shown under a field. */
export function FieldError({ message }: { message?: string }) {
  return message ? <p className="mt-1.5 text-xs font-semibold text-blood">{message}</p> : null;
}
