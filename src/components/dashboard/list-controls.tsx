"use client";

import { ChevronDown, Search, SearchX, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { errorMessage } from "@/lib/client-api";
import { cn } from "@/lib/cn";

/** Rounded search field used by every admin list toolbar. */
export function SearchInput({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <Search size={16} aria-hidden className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-ink-faint" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-full border border-ink/15 bg-cream pr-4 pl-10 text-sm font-semibold text-ink placeholder:font-medium placeholder:text-ink-faint focus:border-blood/40 focus:ring-2 focus:ring-blood/15 focus:outline-none"
      />
    </div>
  );
}

/** Pill group for one filter axis (status, role, verification…). A dropdown below lg, pills from lg up. */
export function FilterChips<T extends string>({
  options,
  value,
  onChange,
  label,
  className,
}: {
  options: { label: string; value: T }[];
  value: T;
  onChange: (value: T) => void;
  /** Accessible name for the phone dropdown. */
  label?: string;
  className?: string;
}) {
  return (
    <div role="group" className={cn("min-w-0", className)}>
      <div className="relative lg:hidden">
        <select
          aria-label={label}
          value={value}
          onChange={(e) => {
            const next = options.find((option) => option.value === e.target.value);
            if (next) onChange(next.value);
          }}
          className="h-11 w-full appearance-none rounded-full border border-ink/15 bg-cream pr-10 pl-4 text-sm font-semibold text-ink focus:border-blood/40 focus:ring-2 focus:ring-blood/15 focus:outline-none"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown size={16} aria-hidden className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-ink-faint" />
      </div>

      <div className="hidden items-center gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:flex">
        {options.map((option) => {
          const active = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              aria-pressed={active}
              className={cn(
                "shrink-0 rounded-full border px-4 py-2 text-xs font-bold whitespace-nowrap transition-all duration-150 active:scale-[.97]",
                active
                  ? "border-blood bg-blood text-cream shadow-[0_4px_12px_-4px_rgba(169,40,54,.5)]"
                  : "border-ink/10 bg-cream text-ink-muted hover:border-ink/25 hover:text-ink",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Prev / next pager shown under a list. Hidden when there's a single page. */
export function PaginationBar({
  page,
  totalPages,
  onPage,
}: {
  page: number;
  totalPages: number;
  onPage: (page: number) => void;
}) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between gap-3 pt-1 sm:justify-center sm:gap-5">
      <Button variant="outline" size="sm" onClick={() => onPage(page - 1)} disabled={page <= 1}>
        ← Prev
      </Button>
      <span className="text-sm font-semibold text-ink-muted">
        Page {page} of {totalPages}
      </span>
      <Button variant="outline" size="sm" onClick={() => onPage(page + 1)} disabled={page >= totalPages}>
        Next →
      </Button>
    </div>
  );
}

/** Inline "keep previous data" cue: a small spinner that fades in while refetching. */
export function FetchingHint({ active }: { active: boolean }) {
  return (
    <span
      aria-hidden
      className={cn("inline-flex transition-opacity duration-200", active ? "opacity-100" : "opacity-0")}
    >
      <Spinner className="size-4 text-blood" />
    </span>
  );
}

/** Shared empty state for filtered lists. */
export function EmptyState({
  title,
  hint,
  action,
}: {
  title: string;
  hint: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-[24px] border border-dashed border-ink/15 bg-cream p-8 text-center sm:p-10">
      <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-linen text-ink-muted">
        <SearchX size={20} />
      </span>
      <p className="mt-4 font-display text-xl">{title}</p>
      <p className="mt-2 text-sm text-ink-muted">{hint}</p>
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}

/** Card shown when a query fails, with a retry button. */
export function QueryError({ error, onRetry }: { error: unknown; onRetry: () => void }) {
  return (
    <div className="rounded-[24px] border border-blood/20 bg-blush/40 p-8 text-center">
      <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-blush text-blood">
        <TriangleAlert size={20} />
      </span>
      <p className="mt-4 font-display text-xl text-ink">Something went wrong</p>
      <p className="mt-2 text-sm text-ink-muted">{errorMessage(error)}</p>
      <Button variant="soft" size="sm" className="mt-5" onClick={onRetry}>
        Try again
      </Button>
    </div>
  );
}
