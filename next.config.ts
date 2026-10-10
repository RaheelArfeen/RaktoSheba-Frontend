import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Profile photos and hospital logos are uploaded to Cloudinary.
    remotePatterns: [new URL("https://res.cloudinary.com/**")],
  },
  experimental: {
    // Profile photos go through a Server Action. Photos are capped at 4 MB in the app
    // (Vercel rejects request bodies over 4.5 MB), so allow a little room for the form data.
    serverActions: { bodySizeLimit: "5mb" },
  },
};

export default nextConfig;
