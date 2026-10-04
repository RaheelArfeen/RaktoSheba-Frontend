"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input, Select } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { BLOOD_GROUPS, bloodGroupLabel } from "@/lib/blood";
import { EMERGENCY_LEVELS } from "@/lib/emergency";

const statusTabs = [
  { value: "open", label: "Open" },
  { value: "matched", label: "Matched" },
  { value: "fulfilled", label: "Fulfilled" },
  { value: "all", label: "All" },
];

const urgencyChips = [
  { value: "", label: "Any urgency" },
  { value: String(EMERGENCY_LEVELS.urgent.minUrgency), label: "Urgent+" },
  { value: String(EMERGENCY_LEVELS.severe.minUrgency), label: "Severe+" },
  { value: String(EMERGENCY_LEVELS.critical.minUrgency), label: "Critical" },
];

// Request board filters. Every filter lives in the URL, so views can be bookmarked and shared.
export function Filters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");

  const update = (changes: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams);
    for (const [key, value] of Object.entries(changes)) {
      if (!value) params.delete(key);
      else params.set(key, value);
    }
    params.delete("page"); // any filter change starts from page 1
    const qs = params.toString();
    startTransition(() => router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false }));
  };

  // Debounce: push the search box to the URL 400ms after typing stops.
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search.trim() !== (searchParams.get("search") ?? "")) update({ search: search.trim() || undefined });
    }, 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only react to typing
  }, [search]);

  const status = searchParams.get("status") ?? "open";
  const minUrgency = searchParams.get("minUrgency") ?? "";
  const bloodGroup = searchParams.get("bloodGroup") ?? "";
  const canHelp = searchParams.get("canHelp") ?? "";
  const sortBy = searchParams.get("sortBy") ?? "urgency";
  const hasFilters = ["bloodGroup", "canHelp", "minUrgency", "search", "status", "sortBy"].some((k) => searchParams.has(k));

  return (
    <div className="space-y-4 rounded-[26px] border border-ink/10 bg-cream p-4 shadow-[0_12px_32px_rgba(91,44,30,.04)] sm:p-5">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="col-span-2 lg:col-span-1">
          <label htmlFor="board-search" className="mb-1.5 block text-xs font-bold text-ink-muted">
            Hospital or area
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-ink-faint" />
            <Input
              id="board-search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="e.g. Dhaka or Square Hospital"
              className="h-12 py-0 pl-11"
            />
          </div>
        </div>
        {/* Donors pick their own group; the board then shows every request that group can safely give to. */}
        <div className="col-span-2 lg:col-span-1">
          <label htmlFor="board-can-help" className="mb-1.5 block text-xs font-bold text-ink-muted">
            Your blood group
          </label>
          <Select
            id="board-can-help"
            value={canHelp}
            onChange={(e) => update({ canHelp: e.target.value || undefined, bloodGroup: undefined })}
            className="h-12 py-0"
          >
            <option value="">I&apos;m not sure</option>
            {BLOOD_GROUPS.map((g) => (
              <option key={g} value={g}>
                I&apos;m {bloodGroupLabel[g]}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <label htmlFor="board-blood-group" className="mb-1.5 block text-xs font-bold text-ink-muted">
            Patient needs
          </label>
          <Select
            id="board-blood-group"
            value={bloodGroup}
            onChange={(e) => update({ bloodGroup: e.target.value || undefined, canHelp: undefined })}
            className="h-12 py-0"
          >
            <option value="">Any group</option>
            {BLOOD_GROUPS.map((g) => (
              <option key={g} value={g}>
                {bloodGroupLabel[g]}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <label htmlFor="board-sort" className="mb-1.5 block text-xs font-bold text-ink-muted">
            Sort by
          </label>
          <Select
            id="board-sort"
            value={sortBy}
            onChange={(e) => update({ sortBy: e.target.value === "urgency" ? undefined : e.target.value })}
            className="h-12 py-0"
          >
            <option value="urgency">Most urgent</option>
            <option value="createdAt">Newest first</option>
          </Select>
        </div>
      </div>

      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div className="grid grid-cols-4 gap-1 rounded-2xl bg-linen p-1 sm:inline-grid sm:w-auto" role="group" aria-label="Request status">
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              aria-pressed={status === tab.value}
              onClick={() => update({ status: tab.value === "open" ? undefined : tab.value })}
              className={`min-h-10 rounded-xl px-4 text-sm font-extrabold transition-colors ${
                status === tab.value ? "bg-cream text-blood shadow-sm" : "text-ink-muted hover:text-ink"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Urgency">
          {urgencyChips.map((chip) => (
            <button
              key={chip.label}
              type="button"
              aria-pressed={minUrgency === chip.value}
              onClick={() => update({ minUrgency: chip.value || undefined })}
              className={`min-h-10 rounded-full border px-4 text-sm font-extrabold transition-colors ${
                minUrgency === chip.value
                  ? "border-blood/30 bg-blood text-cream"
                  : "border-ink/10 bg-paper text-ink-muted hover:border-blood/25 hover:text-blood"
              }`}
            >
              {chip.label}
            </button>
          ))}
          {pending && <Spinner className="size-4" />}
          {hasFilters && !pending && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                startTransition(() => router.replace(pathname, { scroll: false }));
              }}
              className="inline-flex min-h-10 items-center gap-1 rounded-full px-3 text-sm font-bold text-ink-muted hover:bg-linen hover:text-blood"
            >
              <X size={14} /> Clear all
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
