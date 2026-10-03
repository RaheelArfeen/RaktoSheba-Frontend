/**
 * Reads public environment variables once, so a missing value fails loudly
 * here instead of turning into a "fetch failed" somewhere in a page.
 */
function required(name: string, value: string | undefined) {
  if (!value) {
    throw new Error(`Missing environment variable ${name}. Copy .env.example to .env.local and fill it in.`);
  }
  return value.replace(/\/$/, "");
}

export const env = {
  /** Backend origin, e.g. http://localhost:8000 (no /api/v1). */
  apiBaseUrl: required("NEXT_PUBLIC_API_BASE_URL", process.env.NEXT_PUBLIC_API_BASE_URL),
  /** Public URL of this site, used for metadata. */
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
};
