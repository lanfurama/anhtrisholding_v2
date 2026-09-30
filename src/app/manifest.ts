import type { MetadataRoute } from "next";
import { SITE_NAME } from "@/lib/brand";

/** Web manifest: tên, màu và icon khi khách thêm website ra màn hình chính (Android/Chrome). */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — Cung ứng HORECA trọn gói`,
    short_name: "AnhTris",
    description: "Maiahorecare, Maiahome và Tris Gallery: giải pháp HORECA trọn gói cho khách sạn, resort, nhà hàng.",
    lang: "vi",
    start_url: "/",
    display: "browser",
    background_color: "#f3f1f5",
    theme_color: "#6a2c91",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
