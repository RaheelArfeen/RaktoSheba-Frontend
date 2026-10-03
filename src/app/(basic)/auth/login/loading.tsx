import { Container } from "@/components/ui/container";
import { FormSkeleton, LoadingLabel, Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <Container className="grid gap-10 py-12 lg:grid-cols-[.9fr_1.1fr] lg:py-16">
      <LoadingLabel />
      <Skeleton className="hidden min-h-[520px] rounded-[32px] lg:block" />
      <div className="mx-auto w-full max-w-[520px] space-y-4 lg:py-6">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="mb-4 h-5 w-full" />
        <FormSkeleton fields={2} />
      </div>
    </Container>
  );
}
