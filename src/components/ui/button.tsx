import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-bold transition-all outline-none active:scale-[.98] disabled:pointer-events-none disabled:opacity-60 focus-visible:ring-4 focus-visible:ring-ring [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-blood text-cream shadow-[0_8px_20px_rgba(169,40,54,.18)] hover:-translate-y-0.5 hover:bg-blood-deep",
        destructive: "bg-blood text-cream hover:bg-blood-deep",
        outline: "border border-ink/15 bg-cream/70 text-ink-soft hover:border-blood/30 hover:bg-cream",
        secondary: "bg-forest text-white hover:-translate-y-0.5 hover:bg-forest-deep",
        soft: "border border-blood/20 bg-blush/70 text-blood hover:bg-blush",
        ghost: "text-ink-muted hover:bg-linen hover:text-blood",
        link: "rounded-none px-0 text-blood hover:text-blood-deep hover:underline underline-offset-4",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-4 text-xs",
        lg: "h-13 px-6",
        icon: "size-10",
        "icon-sm": "size-9",
        "icon-lg": "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
