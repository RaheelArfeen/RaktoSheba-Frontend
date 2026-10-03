import { Skeleton } from "@/components/ui/skeleton";
import { RequestCardSkeleton } from "@/components/requests/RequestCard";

export default function RequestsLoading() {
  return (
    <>
      <div className="border-b border-ink/10">
        <div className="page-container space-y-4 py-14 sm:py-16">
          <Skeleton className="h-3 w-40 bg-linen" />
          <Skeleton className="h-14 w-full max-w-xl bg-linen" />
          <Skeleton className="h-5 w-full max-w-md bg-linen" />
        </div>
      </div>
      <div className="page-container space-y-6 py-10 sm:py-14">
        <Skeleton className="h-36 w-full rounded-[26px] bg-linen" />
        <div className="grid gap-3 xl:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <RequestCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </>
  );
}
