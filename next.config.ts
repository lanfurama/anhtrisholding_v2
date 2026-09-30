import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "cdn.hstatic.net" },
      { protocol: "https", hostname: "file.hstatic.net" },
    ],
  },
  experimental: {
    globalNotFound: true,
  },
};

export default nextConfig;
