import { cn } from "@/lib/cn";

/** Page gutter used by every section. */
export function Container({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-[1440px] px-5 sm:px-8 xl:px-12", className)}>{children}</div>;
}
