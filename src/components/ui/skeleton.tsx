import { cn } from "@/lib/cn";
import { Container } from "./container";

/** Base block: a soft pulsing shape standing in for content that's loading. */
export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn("animate-pulse rounded-lg bg-ink/[.07]", className)} />;
}

/** Placeholder shaped like a request card, used while boards load. */
export function RequestCardSkeleton() {
  return (
    <div aria-hidden className="flex items-center gap-4 rounded-[24px] border border-ink/10 bg-cream p-5">
      <Skeleton className="size-14 shrink-0 rounded-[18px]" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="hidden h-8 w-16 sm:block" />
    </div>
  );
}

/** The title block at the top of inner pages: eyebrow, headline, intro line. */
export function PageHeaderSkeleton() {
  return (
    <div className="border-b border-ink/10">
      <Container className="space-y-4 py-14 sm:py-16">
        <Skeleton className="h-3 w-36" />
        <Skeleton className="h-12 w-full max-w-xl sm:h-14" />
        <Skeleton className="h-5 w-full max-w-md" />
      </Container>
    </div>
  );
}

/** A grid of plain cards (icon, title, two lines of text). */
export function CardGridSkeleton({ count = 3, className }: { count?: number; className?: string }) {
  return (
    <div aria-hidden className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-[24px] border border-ink/10 bg-cream p-6">
          <Skeleton className="size-10 rounded-xl" />
          <Skeleton className="mt-5 h-5 w-1/2" />
          <Skeleton className="mt-3 h-3 w-full" />
          <Skeleton className="mt-2 h-3 w-4/5" />
        </div>
      ))}
    </div>
  );
}

/** A form card: label + field pairs and a submit button. */
export function FormSkeleton({ fields = 4 }: { fields?: number }) {
  return (
    <div aria-hidden className="space-y-5 rounded-[28px] border border-ink/10 bg-cream p-6 sm:p-8">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-12 w-full rounded-2xl" />
        </div>
      ))}
      <Skeleton className="h-13 w-full rounded-full" />
    </div>
  );
}

/** Dashboard stat cards row. */
export function StatCardsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div aria-hidden className={cn("grid gap-4 sm:grid-cols-2", count >= 4 ? "xl:grid-cols-4" : "md:grid-cols-3")}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-[24px] border border-ink/10 bg-cream p-6">
          <Skeleton className="size-10 rounded-xl" />
          <Skeleton className="mt-4 h-3 w-24" />
          <Skeleton className="mt-3 h-9 w-20" />
          <Skeleton className="mt-2 h-3 w-28" />
        </div>
      ))}
    </div>
  );
}

/** Screen-reader text for a loading region (the shapes themselves are hidden from assistive tech). */
export function LoadingLabel({ children = "Loading…" }: { children?: string }) {
  return (
    <span role="status" className="sr-only">
      {children}
    </span>
  );
}
