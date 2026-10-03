import { Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

/** Small spinning glyph for buttons and inline actions. Page loading uses skeletons instead. */
export function Spinner({ className }: { className?: string }) {
  return <Loader2 className={cn("animate-spin text-blood", className)} aria-hidden="true" />;
}
