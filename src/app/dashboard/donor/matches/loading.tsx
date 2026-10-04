import { LoadingLabel, RequestCardSkeleton, Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-8">
      <LoadingLabel>Finding requests you can help…</LoadingLabel>
      <div className="space-y-3">
        <Skeleton className="h-3 w-40" />
        <Skeleton className="h-10 w-80 max-w-full" />
        <Skeleton className="h-4 w-full max-w-xl" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <RequestCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
