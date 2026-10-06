import { LoadingLabel, RequestCardSkeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-3">
      <LoadingLabel>Loading requests…</LoadingLabel>
      <RequestCardSkeleton />
      <RequestCardSkeleton />
      <RequestCardSkeleton />
      <RequestCardSkeleton />
      <RequestCardSkeleton />
    </div>
  );
}
