"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Loader2, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDebounce } from "@/hooks/useDebounce";
import { BLOOD_GROUPS, bloodGroupLabel } from "@/lib/blood";
import { EMERGENCY_LEVELS } from "@/lib/emergency";
import { cn } from "@/lib/utils";

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

// Every filter lives in the URL, so views can be bookmarked and shared.
export default function RequestFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const debouncedSearch = useDebounce(search);

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

  // Push the search box to the URL once typing pauses.
  useEffect(() => {
    if (debouncedSearch !== (searchParams.get("search") ?? "")) update({ search: debouncedSearch.trim() || undefined });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only react to the debounced value
  }, [debouncedSearch]);

  const status = searchParams.get("status") ?? "open";
  const minUrgency = searchParams.get("minUrgency") ?? "";
  const bloodGroup = searchParams.get("bloodGroup") ?? "all";
  const sortBy = searchParams.get("sortBy") ?? "urgency";
  const hasFilters = ["bloodGroup", "minUrgency", "search", "status", "sortBy"].some((k) => searchParams.has(k));

  return (
    <div className="space-y-4 rounded-[26px] border border-ink/10 bg-cream p-4 shadow-[0_12px_32px_rgba(91,44,30,.04)] sm:p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-ink-faint" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search hospital or area, e.g. Dhaka"
            aria-label="Search by hospital or area"
            className="bg-paper pl-11"
          />
        </div>
        <div className="flex gap-3">
          <Select value={bloodGroup} onValueChange={(v) => update({ bloodGroup: v === "all" ? undefined : v })}>
            <SelectTrigger aria-label="Blood group" className="h-12 min-w-36 rounded-2xl border-ink/12 bg-paper font-bold">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All blood groups</SelectItem>
              {BLOOD_GROUPS.map((g) => (
                <SelectItem key={g} value={g}>
                  {bloodGroupLabel[g]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={(v) => update({ sortBy: v === "urgency" ? undefined : v })}>
            <SelectTrigger aria-label="Sort by" className="h-12 min-w-36 rounded-2xl border-ink/12 bg-paper font-bold">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="urgency">Most urgent</SelectItem>
              <SelectItem value="createdAt">Newest first</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div className="flex flex-wrap gap-1 rounded-2xl bg-linen p-1" role="tablist" aria-label="Request status">
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={status === tab.value}
              onClick={() => update({ status: tab.value === "open" ? undefined : tab.value })}
              className={cn(
                "rounded-xl px-4 py-2 text-xs font-extrabold transition-colors",
                status === tab.value ? "bg-cream text-blood shadow-sm" : "text-ink-muted hover:text-ink",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {urgencyChips.map((chip) => (
            <button
              key={chip.label}
              type="button"
              aria-pressed={minUrgency === chip.value}
              onClick={() => update({ minUrgency: chip.value || undefined })}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-xs font-extrabold transition-colors",
                minUrgency === chip.value
                  ? "border-blood/30 bg-blood text-cream"
                  : "border-ink/10 bg-paper text-ink-muted hover:border-blood/25 hover:text-blood",
              )}
            >
              {chip.label}
            </button>
          ))}
          {pending && <Loader2 className="size-4 animate-spin text-blood" aria-label="Updating results" />}
          {hasFilters && !pending && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                startTransition(() => router.replace(pathname, { scroll: false }));
              }}
              className="inline-flex items-center gap-1 px-2 text-xs font-bold text-ink-muted hover:text-blood"
            >
              <X size={13} /> Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
