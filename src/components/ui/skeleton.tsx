import { cn } from "@/lib/cn";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-lg bg-linen", className)} />;
}

/** Placeholder shaped like a request card, used while boards load. */
export function RequestCardSkeleton() {
  return <Skeleton className="h-24 rounded-[24px]" />;
}
