import type { NextConfig } from "next";
import { HARAVAN_STORE_ID } from "./src/lib/brand";
import { LEGACY_REDIRECTS } from "./src/lib/legacy";

type RemotePattern = Exclude<NonNullable<NonNullable<NextConfig["images"]>["remotePatterns"]>[number], URL>;

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

// Chỉ tối ưu ảnh của đúng project Sanity và cửa hàng Haravan cũ — tránh bị dùng làm proxy ảnh cho nội dung khác.
const remotePatterns: RemotePattern[] = [
  { protocol: "https", hostname: "cdn.sanity.io", pathname: projectId ? `/images/${projectId}/${dataset}/**` : "/images/**" },
  ...["/themes", "/files", "/products", ""].map(
    (prefix): RemotePattern => ({ protocol: "https", hostname: "cdn.hstatic.net", pathname: `${prefix}/${HARAVAN_STORE_ID}/**` }),
  ),
  { protocol: "https", hostname: "file.hstatic.net", pathname: `/${HARAVAN_STORE_ID}/**` },
];

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  { key: "Strict-Transport-Security", value: "max-age=31536000" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: { remotePatterns },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    return LEGACY_REDIRECTS;
  },
  experimental: {
    globalNotFound: true,
  },
};

export default nextConfig;
