import { LoadingLabel, Skeleton, StatCardsSkeleton } from "@/components/ui/skeleton";

export default function AdminLoading() {
  return (
    <div className="space-y-6">
      <LoadingLabel>Loading network overview…</LoadingLabel>
      <div className="space-y-3">
        <Skeleton className="h-3 w-36" />
        <Skeleton className="h-12 w-96 max-w-full" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>
      <Skeleton className="h-[172px] rounded-[26px]" />
      <StatCardsSkeleton count={4} />
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-[24px] border border-ink/10 bg-cream p-6 lg:col-span-2">
          <Skeleton className="h-5 w-56" />
          <Skeleton className="mt-4 h-[260px] rounded-2xl" />
        </div>
        <div className="space-y-4">
          <div className="rounded-[24px] border border-ink/10 bg-cream p-6">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="mt-4 h-[140px] rounded-2xl" />
          </div>
          <div className="rounded-[24px] border border-ink/10 bg-cream p-6">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="mt-4 h-[120px] rounded-2xl" />
          </div>
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-3 rounded-[24px] border border-ink/10 bg-cream p-6 lg:col-span-2">
          <Skeleton className="h-5 w-44" />
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-[84px] rounded-[24px]" />
          ))}
        </div>
        <div className="rounded-[24px] border border-ink/10 bg-cream p-6">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="mt-4 h-[200px] rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
