"use client";

import { ButtonLink, Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, FetchingHint, PaginationBar, QueryError } from "@/components/dashboard/list-controls";
import { cn } from "@/lib/cn";
import { useAdminQueue } from "@/lib/queries/use-admin";
import { useUrlState } from "@/lib/url-state";
import { QueueRow } from "./queue-row";

function QueueSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="relative flex items-center gap-4 overflow-hidden rounded-[24px] border border-ink/10 bg-cream p-5 pl-6">
          <Skeleton className="absolute inset-y-0 left-0 w-1.5 rounded-none" />
          <Skeleton className="size-12 shrink-0 rounded-[16px]" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/3" />
          </div>
          <div className="hidden shrink-0 gap-2 sm:flex">
            <Skeleton className="h-9 w-20 rounded-full" />
            <Skeleton className="h-9 w-20 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function QueueList() {
  const { get, update } = useUrlState();
  const page = Math.max(1, parseInt(get("page") ?? "1", 10) || 1);

  const { data, isPending, isFetching, isError, error, refetch } = useAdminQueue({ page, limit: 20 });

  const requests = data?.data ?? [];
  const total = data?.meta.total ?? 0;
  const totalPages = data?.meta.totalPage ?? (Math.ceil(total / (data?.meta.limit || 20)) || 1);

  return (
    <div className="space-y-6">
      <header>
        <Eyebrow>Verification queue</Eyebrow>
        <div className="mt-2 flex items-center gap-3">
          <h1 className="font-display text-3xl tracking-[-.015em] sm:text-4xl">Pending requests</h1>
          <FetchingHint active={isFetching && !isPending} />
        </div>
        <p className="mt-2 text-sm text-ink-muted">
          {isPending
            ? "Checking the queue…"
            : `${total} request${total === 1 ? "" : "s"} awaiting verification, most urgent first`}
        </p>
      </header>

      {isPending && <QueueSkeleton />}

      {isError && <QueryError error={error} onRetry={refetch} />}

      {data && requests.length === 0 && total > 0 && (
        <EmptyState
          title="Nothing on this page"
          hint="This page sits past the end of the queue — the list shrank while you were working."
          action={
            <Button variant="soft" size="sm" onClick={() => update({ page: undefined })}>
              Back to page 1
            </Button>
          }
        />
      )}

      {data && requests.length === 0 && total === 0 && (
        <EmptyState
          title="Queue is clear"
          hint="No requests are waiting for verification. Verified requests reach donors right away."
          action={
            <ButtonLink href="/dashboard/admin" variant="soft" size="sm">
              Back to overview
            </ButtonLink>
          }
        />
      )}

      {requests.length > 0 && (
        <>
          <div className={cn("space-y-3 transition-opacity", isFetching && "opacity-60")}>
            {requests.map((request) => (
              <QueueRow key={request.id} request={request} />
            ))}
          </div>
          <PaginationBar
            page={page}
            totalPages={totalPages}
            onPage={(next) => update({ page: next > 1 ? next : undefined })}
          />
        </>
      )}
    </div>
  );
}
