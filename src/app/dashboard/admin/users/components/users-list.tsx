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
import { useAdminUsers } from "@/lib/queries/use-admin";
import { useDebouncedValue, useUrlState } from "@/lib/url-state";
import type { Role } from "@/types";
import { UserRow } from "./user-row";

type RoleFilter = "all" | Role;
type StatusFilter = "all" | "active" | "banned";

const ROLE_FILTERS: { label: string; value: RoleFilter }[] = [
  { label: "All roles", value: "all" },
  { label: "Donors", value: "DONOR" },
  { label: "Hospitals", value: "HOSPITAL" },
  { label: "Admins", value: "ADMIN" },
];

const STATUS_FILTERS: { label: string; value: StatusFilter }[] = [
  { label: "Everyone", value: "all" },
  { label: "Active", value: "active" },
  { label: "Banned", value: "banned" },
];

function UsersSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 rounded-[24px] border border-ink/10 bg-cream p-5">
          <Skeleton className="size-11 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-3 w-1/4" />
          </div>
          <Skeleton className="hidden h-9 w-16 rounded-full sm:block" />
        </div>
      ))}
    </div>
  );
}

export function UsersList() {
  const { get, update } = useUrlState();

  const roleParam = get("role");
  const role: RoleFilter = roleParam === "DONOR" || roleParam === "HOSPITAL" || roleParam === "ADMIN" ? roleParam : "all";
  const statusParam = get("status");
  const status: StatusFilter = statusParam === "active" || statusParam === "banned" ? statusParam : "all";
  const page = Math.max(1, parseInt(get("page") ?? "1", 10) || 1);

  const [query, setQuery] = useState(get("q") ?? "");
  const debouncedQuery = useDebouncedValue(query);

  useEffect(() => {
    if (debouncedQuery !== (get("q") ?? "")) update({ q: debouncedQuery || undefined, page: undefined });
  }, [debouncedQuery, get, update]);

  const { data, isPending, isFetching, isError, error, refetch } = useAdminUsers({
    page,
    limit: 10,
    role: role === "all" ? undefined : role,
    isBanned: status === "all" ? undefined : status === "banned",
    search: debouncedQuery || undefined,
  });

  const users = data?.data ?? [];
  const total = data?.meta.total ?? 0;
  const totalPages = data?.meta.totalPage ?? (Math.ceil(total / (data?.meta.limit || 10)) || 1);
  const filtered = role !== "all" || status !== "all" || Boolean(debouncedQuery);

  return (
    <div className="space-y-6">
      <header>
        <Eyebrow>User management</Eyebrow>
        <div className="mt-2 flex items-center gap-3">
          <h1 className="font-display text-3xl tracking-[-.015em] sm:text-4xl">Users</h1>
          <FetchingHint active={isFetching && !isPending} />
        </div>
        <p className="mt-2 text-sm text-ink-muted">
          {isPending ? "Loading users…" : `${total} account${total === 1 ? "" : "s"}${filtered ? " match this view" : " in the network"}`}
        </p>
      </header>

      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <SearchInput
          className="w-full xl:max-w-xs"
          value={query}
          onChange={setQuery}
          placeholder="Search by email…"
        />
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2.5">
          <FilterChips
            className="sm:flex-1 lg:flex-none"
            label="Role"
            options={ROLE_FILTERS}
            value={role}
            onChange={(next) => update({ role: next === "all" ? undefined : next, page: undefined })}
          />
          <FilterChips
            className="sm:flex-1 lg:flex-none"
            label="Account status"
            options={STATUS_FILTERS}
            value={status}
            onChange={(next) => update({ status: next === "all" ? undefined : next, page: undefined })}
          />
        </div>
      </div>

      {isPending && <UsersSkeleton />}

      {isError && <QueryError error={error} onRetry={refetch} />}

      {data && users.length === 0 && total > 0 && (
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

      {data && users.length === 0 && total === 0 && (
        <EmptyState
          title="No users found"
          hint={filtered ? "Nothing matches this search or filter yet." : "No accounts have registered yet."}
          action={
            filtered ? (
              <Button
                variant="soft"
                size="sm"
                onClick={() => {
                  setQuery("");
                  update({ role: undefined, status: undefined, q: undefined, page: undefined });
                }}
              >
                Clear filters
              </Button>
            ) : undefined
          }
        />
      )}

      {users.length > 0 && (
        <>
          <div className={cn("space-y-3 transition-opacity", isFetching && "opacity-60")}>
            {users.map((user) => (
              <UserRow key={user.id} user={user} />
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
