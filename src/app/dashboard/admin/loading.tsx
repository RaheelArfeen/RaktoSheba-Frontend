import { LoadingLabel, Skeleton, StatCardsSkeleton } from "@/components/ui/skeleton";

export default function AdminLoading() {
  return (
    <div className="space-y-8">
      <LoadingLabel>Loading network overview…</LoadingLabel>
      <div className="space-y-3">
        <Skeleton className="h-3 w-36" />
        <Skeleton className="h-12 w-96 max-w-full" />
      </div>
      <StatCardsSkeleton count={4} />
      <div className="rounded-[24px] border border-ink/10 bg-cream p-6">
        <Skeleton className="h-5 w-56" />
        <div className="mt-5 grid gap-3 sm:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-2xl" />
          ))}
        </div>
      </div>
      <div className="rounded-[24px] border border-ink/10 bg-cream p-6">
        <Skeleton className="h-5 w-48" />
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-[220px] rounded-2xl" />
          <Skeleton className="h-[200px] rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
