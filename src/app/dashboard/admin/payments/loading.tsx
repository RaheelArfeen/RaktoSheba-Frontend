import { LoadingLabel, Skeleton } from "@/components/ui/skeleton";

export default function PaymentsLoading() {
  return (
    <div className="space-y-6">
      <LoadingLabel>Loading payments…</LoadingLabel>
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-[24px] border border-ink/10 bg-cream p-5">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-28" />
              </div>
              <Skeleton className="h-7 w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
