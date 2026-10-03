import { Container } from "@/components/ui/container";
import { CardGridSkeleton, LoadingLabel, PageHeaderSkeleton, Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <LoadingLabel />
      <PageHeaderSkeleton />
      <Container className="space-y-10 py-14">
        <div className="space-y-3">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-12 w-full max-w-lg" />
        </div>
        <CardGridSkeleton count={4} className="lg:grid-cols-2" />
      </Container>
    </>
  );
}
