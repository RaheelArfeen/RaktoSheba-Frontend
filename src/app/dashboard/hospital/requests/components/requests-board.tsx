"use client";

import { Plus, X } from "lucide-react";
import {
  EmptyState,
  FetchingHint,
  FilterChips,
  PaginationBar,
  QueryError,
} from "@/components/dashboard/list-controls";
import { RequestCard } from "@/components/request/request-card";
import { Button, ButtonLink } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Skeleton } from "@/components/ui/skeleton";
import { BLOOD_GROUPS, bloodGroupLabel, isBloodGroup } from "@/lib/blood";
import { cn } from "@/lib/cn";
import { useHospitalRequests } from "@/lib/queries/use-hospital";
import { useUrlState } from "@/lib/url-state";
import type { BloodGroup, RequestBoardQuery } from "@/types";
import { toPublicRequest } from "../../components/public-request";

type BoardStatus = NonNullable<RequestBoardQuery["status"]>;

const STATUS_OPTIONS: { label: string; value: BoardStatus }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Open", value: "open" },
  { label: "Matched", value: "matched" },
  { label: "Fulfilled", value: "fulfilled" },
  { label: "Cancelled", value: "cancelled" },
];

const GROUP_OPTIONS: { label: string; value: "all" | BloodGroup }[] = [
  { label: "Any group", value: "all" },
  ...BLOOD_GROUPS.map((g) => ({ label: bloodGroupLabel[g], value: g })),
];

const URGENCY_OPTIONS: { label: string; value: string }[] = [
  { label: "Any urgency", value: "any" },
  { label: "Urgent+", value: "3" },
  { label: "Severe+", value: "4" },
  { label: "Critical", value: "5" },
];

const PAGE_SIZE = 20;

export function RequestsBoard() {
  const { get, update } = useUrlState();

  const pageParam = Number(get("page"));
  const page = Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;

  const statusParam = get("status");
  const status = STATUS_OPTIONS.some((o) => o.value === statusParam)
    ? (statusParam as BoardStatus)
    : "all";

  const groupParam = get("group");
  const group: "all" | BloodGroup = isBloodGroup(groupParam)
    ? groupParam
    : "all";

  const urgencyParam = get("urgency");
  const urgency =
    URGENCY_OPTIONS.find((o) => o.value === urgencyParam)?.value ?? "any";

  const filtersActive =
    status !== "all" || group !== "all" || urgency !== "any";

  const { data, isPending, isError, error, refetch, isFetching } =
    useHospitalRequests({
      page,
      limit: PAGE_SIZE,
      status: status === "all" ? undefined : status,
      bloodGroup: group === "all" ? undefined : group,
      minUrgency: urgency === "any" ? undefined : Number(urgency),
      sortBy: "createdAt",
      sortOrder: "desc",
    });

  const rows = data?.data ?? [];
  const total = data?.meta.total ?? 0;
  const totalPages =
    data?.meta.totalPage ??
    (Math.ceil(total / (data?.meta.limit || PAGE_SIZE)) || 1);
  const pastEnd = rows.length === 0 && total > 0;

  const clearFilters = () =>
    update({
      status: undefined,
      group: undefined,
      urgency: undefined,
      page: undefined,
    });
  const setParam = (key: string, value: string | undefined) =>
    update({ [key]: value, page: undefined });

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Eyebrow>My requests</Eyebrow>
          <h1 className="mt-2 font-display text-3xl tracking-[-.01em] sm:text-4xl">
            Blood requests
          </h1>
          <p className="mt-1.5 flex items-center gap-2 text-sm text-ink-muted">
            Everything your hospital has posted, newest first.
            <FetchingHint active={isFetching && !isPending} />
          </p>
        </div>
        <ButtonLink href="/dashboard/hospital/requests/new">
          <Plus size={16} /> New request
        </ButtonLink>
      </header>

      <div className="rounded-[26px] border border-ink/10 bg-cream p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <FilterChips
            className="min-w-0 flex-1"
            label="Status"
            options={STATUS_OPTIONS}
            value={status}
            onChange={(value) =>
              setParam("status", value === "all" ? undefined : value)
            }
          />
          {filtersActive && (
            <Button variant="ghost" size="sm" className="shrink-0" onClick={clearFilters}>
              <X size={14} /> Clear filters
            </Button>
          )}
        </div>
        <div className="mt-4 flex items-center gap-2.5 sm:gap-3">
          <span className="w-14 shrink-0 text-xs font-extrabold tracking-[.12em] text-ink-faint uppercase sm:w-20">
            Group
          </span>
          <FilterChips
            className="min-w-0 flex-1"
            label="Blood group"
            options={GROUP_OPTIONS}
            value={group}
            onChange={(value) =>
              setParam("group", value === "all" ? undefined : value)
            }
          />
        </div>
        <div className="mt-3 flex items-center gap-2.5 sm:gap-3">
          <span className="w-14 shrink-0 text-xs font-extrabold tracking-[.12em] text-ink-faint uppercase sm:w-20">
            Urgency
          </span>
          <FilterChips
            className="min-w-0 flex-1"
            label="Urgency"
            options={URGENCY_OPTIONS}
            value={urgency}
            onChange={(value) =>
              setParam("urgency", value === "any" ? undefined : value)
            }
          />
        </div>
      </div>

      {isPending ? (
        <BoardSkeleton />
      ) : isError ? (
        <QueryError error={error} onRetry={refetch} />
      ) : pastEnd ? (
        <EmptyState
          title="That page is empty"
          hint="You've gone past the last page of results."
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => update({ page: undefined })}
            >
              Back to page 1
            </Button>
          }
        />
      ) : total === 0 && filtersActive ? (
        <EmptyState
          title="No requests match these filters"
          hint="Try a different status, blood group or urgency."
          action={
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Clear filters
            </Button>
          }
        />
      ) : total === 0 ? (
        <EmptyState
          title="No requests yet"
          hint="Post your first blood request and matching donors will be alerted once it's verified."
          action={
            <ButtonLink
              href="/dashboard/hospital/requests/new"
              variant="soft"
              size="sm"
            >
              Post a blood request
            </ButtonLink>
          }
        />
      ) : (
        <>
          <div
            className={cn(
              "space-y-3 transition-opacity",
              isFetching && "opacity-60"
            )}
          >
            {rows.map((request) => (
              <RequestCard
                key={request.id}
                request={toPublicRequest(request)}
                href={`/dashboard/hospital/requests/${request.id}`}
              />
            ))}
          </div>
          <PaginationBar
            page={page}
            totalPages={totalPages}
            onPage={(next) =>
              update({ page: next > 1 ? String(next) : undefined })
            }
          />
        </>
      )}
    </div>
  );
}

function BoardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-[112px] rounded-[24px]" />
      <Skeleton className="h-[112px] rounded-[24px]" />
      <Skeleton className="h-[112px] rounded-[24px]" />
      <Skeleton className="h-[112px] rounded-[24px]" />
      <Skeleton className="h-[112px] rounded-[24px]" />
      <Skeleton className="h-[112px] rounded-[24px]" />
    </div>
  );
}
