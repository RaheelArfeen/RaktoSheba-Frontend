import { LoadingLabel, Skeleton, StatCardsSkeleton } from "@/components/ui/skeleton";

/** Shown inside the dashboard frame while a workspace page loads. */
export default function Loading() {
  return (
    <div className="space-y-8">
      <LoadingLabel>Loading your workspace…</LoadingLabel>
      <div className="space-y-3">
        <Skeleton className="h-3 w-36" />
        <Skeleton className="h-12 w-72" />
        <Skeleton className="h-4 w-48" />
      </div>
      <StatCardsSkeleton count={3} />
      <Skeleton className="h-40 rounded-[24px]" />
    </div>
  );
}
