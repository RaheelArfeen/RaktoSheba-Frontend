"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * Read + write the current URL's query string through the native history API.
 * No server round-trip — filters and pages stay bookmarkable while the list
 * data keeps coming from the TanStack Query cache.
 */
export function useUrlState() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const get = useCallback((key: string) => searchParams.get(key) ?? undefined, [searchParams]);

  const update = useCallback(
    (patch: Record<string, string | number | undefined>) => {
      const next = new URLSearchParams(window.location.search);
      for (const [key, value] of Object.entries(patch)) {
        if (value === undefined || value === "") next.delete(key);
        else next.set(key, String(value));
      }
      const qs = next.toString();
      window.history.replaceState(null, "", qs ? `${pathname}?${qs}` : pathname);
    },
    [pathname],
  );

  return { get, update };
}

/** Debounce a value — for search-as-you-type fields. */
export function useDebouncedValue<T>(value: T, delay = 350) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}
