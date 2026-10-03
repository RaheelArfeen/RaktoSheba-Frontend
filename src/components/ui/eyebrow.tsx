import { cn } from "@/lib/cn";

/** Small caps label that sits above every section headline. */
export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("text-xs font-extrabold tracking-[.18em] text-blood uppercase", className)}>{children}</p>;
}
