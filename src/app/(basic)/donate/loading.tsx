import { Container } from "@/components/ui/container";
import { CardGridSkeleton, FormSkeleton, LoadingLabel, PageHeaderSkeleton, Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <LoadingLabel />
      <PageHeaderSkeleton />
      <Container className="grid gap-10 py-14 lg:grid-cols-[1.1fr_.9fr] lg:items-start">
        <FormSkeleton fields={5} />
        <div className="space-y-4">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-10 w-3/4" />
          <CardGridSkeleton count={4} className="sm:grid-cols-1 lg:grid-cols-1" />
        </div>
      </Container>
    </>
  );
}
