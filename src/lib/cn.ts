import { twMerge } from "tailwind-merge";

/**
 * Joins class names, dropping falsy values. Conflicting Tailwind classes are
 * resolved so the last one wins — e.g. a component's built-in `inline-flex`
 * gives way to a `hidden` passed in by the caller.
 */
export function cn(...values: Array<string | false | null | undefined>) {
  return twMerge(values.filter(Boolean).join(" "));
}
