/**
 * Reads public environment variables once, so pages share one source of truth.
 *
 * Must never throw at import time: `.env.local` is gitignored, so Vercel
 * builds run without it unless the vars are set in the project dashboard.
 * A missing value falls back to production so `next build` always succeeds;
 * set NEXT_PUBLIC_API_BASE_URL in Vercel to point at your backend.
 */
const DEFAULT_API_BASE_URL = "https://raktosheba-backend.vercel.app";

function optionalUrl(name: string, value: string | undefined, fallback: string) {
  const raw = value || fallback;
  if (!value && typeof process !== "undefined" && process.env.NODE_ENV === "development") {
    console.warn(`[env] ${name} is not set; using fallback ${fallback}. Copy .env.example to .env.local and fill it in.`);
  }
  return raw.replace(/\/$/, "");
}

export const env = {
  /** Backend origin, e.g. http://localhost:8000 (no /api/v1). */
  apiBaseUrl: optionalUrl("NEXT_PUBLIC_API_BASE_URL", process.env.NEXT_PUBLIC_API_BASE_URL, DEFAULT_API_BASE_URL),
  /** Public URL of this site, used for metadata. */
  siteUrl: optionalUrl("NEXT_PUBLIC_SITE_URL", process.env.NEXT_PUBLIC_SITE_URL, "http://localhost:3000"),
};
