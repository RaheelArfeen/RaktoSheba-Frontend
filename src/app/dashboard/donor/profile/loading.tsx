import { FormSkeleton, LoadingLabel, Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="max-w-3xl space-y-6">
      <LoadingLabel>Loading your profile…</LoadingLabel>
      <div className="mb-8 space-y-3">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-10 w-72 max-w-full" />
      </div>
      <Skeleton className="h-36 rounded-[26px]" />
      <FormSkeleton fields={3} />
    </div>
  );
}
