const MINUTE = 60_000;
const DAY = 24 * 60 * MINUTE;

/** "just now", "18 min ago", "3 hr ago", "2 days ago". */
export function timeAgo(iso: string, now = Date.now()): string {
  const minutes = Math.floor((now - new Date(iso).getTime()) / MINUTE);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

export const unitsLabel = (units: number) => `${units} unit${units === 1 ? "" : "s"}`;

/** Dates are shown in Bangladesh time, e.g. "29 Sep 2026". */
export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Dhaka" });

export const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Dhaka",
  });

export const formatCurrency = (amount: number, currency = "usd") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: currency.toUpperCase() }).format(amount);

/** Whole days until a date (0 if it has passed). */
export const daysUntil = (iso: string, now = Date.now()) =>
  Math.max(0, Math.ceil((new Date(iso).getTime() - now) / DAY));

export const addDays = (iso: string, days: number) => new Date(new Date(iso).getTime() + days * DAY).toISOString();
