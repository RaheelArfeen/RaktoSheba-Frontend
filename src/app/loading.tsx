import { Container } from "@/components/ui/container";
import { LoadingLabel, RequestCardSkeleton, Skeleton } from "@/components/ui/skeleton";

/** Home-page shaped skeleton (also the fallback for any route without its own). */
export default function Loading() {
  return (
    <>
      <LoadingLabel>Loading RaktoSheba…</LoadingLabel>
      <section className="border-b border-ink/10">
        <Container className="grid min-h-[610px] items-center gap-12 py-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,.75fr)]">
          <div className="space-y-6">
            <Skeleton className="h-9 w-56 rounded-full" />
            <div className="space-y-3">
              <Skeleton className="h-16 w-4/5 sm:h-20" />
              <Skeleton className="h-16 w-3/5 sm:h-20" />
            </div>
            <Skeleton className="h-5 w-full max-w-md" />
            <Skeleton className="h-5 w-2/3 max-w-sm" />
            <div className="flex gap-3 pt-3">
              <Skeleton className="h-13 w-48 rounded-full" />
              <Skeleton className="h-13 w-44 rounded-full" />
            </div>
          </div>
          <div className="relative hidden min-h-[440px] lg:block">
            <Skeleton className="absolute top-12 right-1 h-44 w-[270px] rotate-[5deg] rounded-[26px]" />
            <Skeleton className="absolute bottom-16 left-0 h-36 w-[268px] -rotate-[6deg] rounded-[26px]" />
          </div>
        </Container>
      </section>
      <div className="border-b border-ink/10 bg-cream">
        <Container className="grid grid-cols-2 gap-8 py-9 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-9 w-16" />
              <Skeleton className="h-3 w-32" />
            </div>
          ))}
        </Container>
      </div>
      <Container className="grid grid-cols-1 gap-14 py-24 lg:grid-cols-[.75fr_1.25fr]">
        <div className="space-y-4">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-3/4" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <RequestCardSkeleton key={i} />
          ))}
        </div>
      </Container>
    </>
  );
}
