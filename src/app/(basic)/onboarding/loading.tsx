import { Container } from "@/components/ui/container";
import { FormSkeleton, LoadingLabel, Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <Container className="py-14 sm:py-20">
      <LoadingLabel />
      <div className="mx-auto max-w-[520px] space-y-4">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="mb-4 h-5 w-full" />
        <FormSkeleton fields={2} />
      </div>
    </Container>
  );
}
