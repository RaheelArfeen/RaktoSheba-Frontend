import { Container } from "@/components/ui/container";
import { FormSkeleton, LoadingLabel, RequestCardSkeleton, Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <LoadingLabel>Loading emergency help…</LoadingLabel>
      <div className="bg-maroon">
        <Container className="grid gap-10 py-16 lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:py-20">
          <div className="space-y-5">
            <div className="h-3 w-56 animate-pulse rounded-lg bg-white/15" />
            <div className="h-16 w-4/5 animate-pulse rounded-lg bg-white/15" />
            <div className="h-5 w-full max-w-md animate-pulse rounded-lg bg-white/15" />
          </div>
          <div className="h-36 animate-pulse rounded-[28px] bg-white/15" />
        </Container>
      </div>
      <Container className="grid gap-10 py-14 lg:grid-cols-2">
        <FormSkeleton fields={2} />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-[22px]" />
          ))}
        </div>
      </Container>
      <Container className="grid grid-cols-1 gap-3 pb-14 xl:grid-cols-2">
        <RequestCardSkeleton />
        <RequestCardSkeleton />
      </Container>
    </>
  );
}
