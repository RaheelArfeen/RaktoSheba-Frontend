import type { MetadataRoute } from "next";
import { env } from "@/config/env";

// Public pages are open to search engines; dashboards, payments and auth flows are not.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/dashboard", "/payment", "/onboarding", "/auth", "/api"] },
    sitemap: `${env.siteUrl}/sitemap.xml`,
  };
}
