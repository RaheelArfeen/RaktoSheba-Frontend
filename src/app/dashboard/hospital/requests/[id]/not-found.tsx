import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center px-4 text-center">
      <div className="rounded-[28px] border border-ink/10 bg-cream p-10 sm:p-12">
        <h1 className="font-display text-2xl tracking-[-.01em] sm:text-3xl">Request not found</h1>
        <p className="mt-3 max-w-sm text-sm leading-6 text-ink-muted">
          This request doesn&apos;t exist, or you don&apos;t have access to it.
        </p>
        <ButtonLink href="/dashboard/hospital/requests" variant="outline" className="mt-8">
          ← Back to requests
        </ButtonLink>
      </div>
    </div>
  );
}
