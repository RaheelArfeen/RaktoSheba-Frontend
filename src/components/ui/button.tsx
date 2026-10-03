import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "outline" | "ghost" | "soft" | "forest" | "light";
type Size = "sm" | "md" | "lg";

/*
  Icons are sized here rather than at each call site, so any lucide icon
  dropped into a button matches the rest.
*/
const base =
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-bold whitespace-nowrap transition-all active:scale-[.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blood disabled:pointer-events-none disabled:opacity-60 [&>svg]:size-4 [&>svg]:shrink-0";

const variants: Record<Variant, string> = {
  primary: "bg-blood text-cream shadow-[0_8px_20px_rgba(169,40,54,.18)] hover:-translate-y-0.5 hover:bg-blood-deep",
  outline: "border border-ink/15 bg-cream/70 text-ink-soft hover:border-blood/30 hover:bg-cream",
  ghost: "text-ink-muted hover:bg-linen hover:text-blood",
  soft: "border border-blood/20 bg-blush/70 text-blood hover:bg-blush",
  forest: "bg-forest text-white hover:-translate-y-0.5 hover:bg-forest-deep",
  light: "bg-cream text-blood hover:bg-white",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-xs",
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-6 text-sm",
};

type ButtonProps = ComponentProps<"button"> & { variant?: Variant; size?: Size; children: ReactNode };

export function Button({ variant = "primary", size = "md", className, children, ...props }: ButtonProps) {
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
}

type ButtonLinkProps = ComponentProps<typeof Link> & { variant?: Variant; size?: Size; children: ReactNode };

export function ButtonLink({ variant = "primary", size = "md", className, children, ...props }: ButtonLinkProps) {
  return (
    <Link className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </Link>
  );
}
