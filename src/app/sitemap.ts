import type { MetadataRoute } from "next";
import { env } from "@/config/env";

const pages = ["", "/requests", "/donate", "/emergency", "/fund", "/about", "/faq", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map((path) => ({
    url: `${env.siteUrl}${path}`,
    changeFrequency: path === "/requests" || path === "" ? "hourly" : "monthly",
    priority: path === "" ? 1 : path === "/requests" || path === "/emergency" ? 0.9 : 0.6,
  }));
}
