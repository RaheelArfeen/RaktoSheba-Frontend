import { Container } from "@/components/ui/container";
import { RequestCardSkeleton, Skeleton } from "@/components/ui/skeleton";

export default function RequestsLoading() {
  return (
    <>
      <div className="border-b border-ink/10">
        <Container className="space-y-4 py-14 sm:py-16">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-14 w-full max-w-xl" />
          <Skeleton className="h-5 w-full max-w-md" />
        </Container>
      </div>
      <Container className="space-y-6 py-10 sm:py-14">
        <Skeleton className="h-36 w-full rounded-[26px]" />
        <div className="grid gap-3 xl:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <RequestCardSkeleton key={i} />
          ))}
        </div>
      </Container>
    </>
  );
}
