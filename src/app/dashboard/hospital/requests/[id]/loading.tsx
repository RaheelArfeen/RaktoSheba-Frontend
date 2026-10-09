import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      {/* Header area */}
      <Skeleton className="h-12 w-64" />

      {/* Two-column layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.35fr_.65fr]">
        <Skeleton className="h-48 rounded-[26px]" />
        <Skeleton className="h-48 rounded-[26px]" />
      </div>
    </div>
  );
}
