"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Skeleton } from "@/components/ui/skeleton";
import {
  EmptyState,
  FetchingHint,
  FilterChips,
  PaginationBar,
  QueryError,
  SearchInput,
} from "@/components/dashboard/list-controls";
import { cn } from "@/lib/cn";
import { useAdminHospitals } from "@/lib/queries/use-admin";
import { useDebouncedValue, useUrlState } from "@/lib/url-state";
import type { VerificationStatus } from "@/types";
import { HospitalRow } from "./hospital-row";

type Filter = "all" | "pending" | "verified" | "rejected";

const FILTERS: { label: string; value: Filter }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Verified", value: "verified" },
  { label: "Rejected", value: "rejected" },
];

const TO_API: Record<Exclude<Filter, "all">, VerificationStatus> = {
  pending: "PENDING",
  verified: "VERIFIED",
  rejected: "REJECTED",
};

const parseFilter = (value?: string): Filter =>
  value === "pending" || value === "verified" || value === "rejected" ? value : "all";

function HospitalSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 rounded-[24px] border border-ink/10 bg-cream p-5">
          <Skeleton className="size-11 shrink-0 rounded-[14px]" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="hidden h-9 w-20 rounded-full sm:block" />
        </div>
      ))}
    </div>
  );
}

export function HospitalsList() {
  const { get, update } = useUrlState();

  const filter = parseFilter(get("filter"));  const page = Math.max(1, parseInt(get("page") ?? "1", 10) || 1);

  const [query, setQuery] = useState(get("q") ?? "");
  const debouncedQuery = useDebouncedValue(query);

  useEffect(() => {
    if (debouncedQuery !== (get("q") ?? "")) update({ q: debouncedQuery || undefined, page: undefined });
  }, [debouncedQuery, get, update]);

  const { data, isPending, isFetching, isError, error, refetch } = useAdminHospitals({
    page,
    limit: 10,
    verificationStatus: filter === "all" ? undefined : TO_API[filter],
    search: debouncedQuery || undefined,
  });

  const hospitals = data?.data ?? [];
  const total = data?.meta.total ?? 0;
  const totalPages = data?.meta.totalPage ?? (Math.ceil(total / (data?.meta.limit || 10)) || 1);
  const filtered = filter !== "all" || Boolean(debouncedQuery);

  return (
    <div className="space-y-6">
      <header>
        <Eyebrow>Hospital management</Eyebrow>
        <div className="mt-2 flex items-center gap-3">
          <h1 className="font-display text-3xl tracking-[-.015em] sm:text-4xl">Hospitals</h1>
          <FetchingHint active={isFetching && !isPending} />
        </div>
        <p className="mt-2 text-sm text-ink-muted">
          {isPending
            ? "Loading hospitals…"
            : `${total} hospital${total === 1 ? "" : "s"}${filtered ? " match this view" : " in the network"}`}
        </p>
      </header>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <SearchInput
          className="w-full lg:max-w-xs"
          value={query}
          onChange={setQuery}
          placeholder="Search by hospital name…"
        />
        <FilterChips
          label="Filter"
          options={FILTERS}
          value={filter}
          onChange={(next) => update({ filter: next === "all" ? undefined : next, page: undefined })}
        />
      </div>

      {isPending && <HospitalSkeleton />}

      {isError && <QueryError error={error} onRetry={refetch} />}

      {data && hospitals.length === 0 && total > 0 && (
        <EmptyState
          title="Nothing on this page"
          hint="This page sits past the end of the list."
          action={
            <Button variant="soft" size="sm" onClick={() => update({ page: undefined })}>
              Back to page 1
            </Button>
          }
        />
      )}

      {data && hospitals.length === 0 && total === 0 && (
        <EmptyState
          title="No hospitals found"
          hint={filtered ? "Nothing matches this search or filter yet." : "No hospitals have registered yet."}
          action={
            filtered ? (
              <Button
                variant="soft"
                size="sm"
                onClick={() => {
                  setQuery("");
                  update({ filter: undefined, q: undefined, page: undefined });
                }}
              >
                Clear filters
              </Button>
            ) : undefined
          }
        />
      )}

      {hospitals.length > 0 && (
        <>
          <div className={cn("space-y-3 transition-opacity", isFetching && "opacity-60")}>
            {hospitals.map((hospital) => (
              <HospitalRow key={hospital.id} hospital={hospital} />
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
