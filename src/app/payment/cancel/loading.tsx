import { Container } from "@/components/ui/container";
import { LoadingLabel, Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <Container className="py-20">
      <LoadingLabel>Checking your payment…</LoadingLabel>
      <div className="mx-auto flex max-w-lg flex-col items-center rounded-[30px] border border-ink/10 bg-cream p-8 sm:p-10">
        <Skeleton className="size-16 rounded-full" />
        <Skeleton className="mt-6 h-12 w-2/3" />
        <Skeleton className="mt-4 h-4 w-full" />
        <Skeleton className="mt-2 h-4 w-4/5" />
        <div className="mt-8 flex gap-3">
          <Skeleton className="h-11 w-44 rounded-full" />
          <Skeleton className="h-11 w-32 rounded-full" />
        </div>
      </div>
    </Container>
  );
}
