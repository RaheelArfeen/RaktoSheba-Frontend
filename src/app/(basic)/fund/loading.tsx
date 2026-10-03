import { Container } from "@/components/ui/container";
import { CardGridSkeleton, FormSkeleton, LoadingLabel, PageHeaderSkeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <LoadingLabel />
      <PageHeaderSkeleton />
      <Container className="grid gap-10 py-14 lg:grid-cols-[.85fr_1.15fr] lg:items-start">
        <CardGridSkeleton count={3} className="sm:grid-cols-1 lg:grid-cols-1" />
        <FormSkeleton fields={3} />
      </Container>
    </>
  );
}
