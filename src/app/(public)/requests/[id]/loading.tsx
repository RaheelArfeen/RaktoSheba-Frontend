import { Skeleton } from "@/components/ui/skeleton";

export default function RequestDetailLoading() {
  return (
    <div className="page-container space-y-6 py-10 sm:py-14">
      <Skeleton className="h-4 w-28 bg-linen" />
      <div className="grid gap-6 lg:grid-cols-[1.35fr_.65fr]">
        <div className="space-y-6">
          <Skeleton className="h-64 rounded-[30px] bg-linen" />
          <div className="grid gap-3 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-[22px] bg-linen" />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <Skeleton className="h-56 rounded-[26px] bg-linen" />
          <Skeleton className="h-72 rounded-[26px] bg-linen" />
        </div>
      </div>
    </div>
  );
}
