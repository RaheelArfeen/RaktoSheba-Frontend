import { LoadingLabel, Skeleton } from "@/components/ui/skeleton";

export default function UsersLoading() {
  return (
    <div className="space-y-6">
      <LoadingLabel>Loading users…</LoadingLabel>
      <div className="space-y-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 rounded-[24px] border border-ink/10 bg-cream p-5">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-9 w-20 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
