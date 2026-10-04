import { LoadingLabel, RequestCardSkeleton, Skeleton, StatCardsSkeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-8">
      <LoadingLabel>Loading your donations…</LoadingLabel>
      <div className="space-y-3">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-10 w-80 max-w-full" />
      </div>
      <StatCardsSkeleton count={3} />
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <RequestCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
