import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { SiteChrome } from "@/components/site-chrome";
import { fontVars } from "@/lib/fonts";
import { defaultShareImage, SITE_NAME } from "@/lib/seo";
import { siteUrl } from "@/sanity/env";
import "../globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const image = await defaultShareImage();
  const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
  return {
    metadataBase: new URL(siteUrl),
    title: { default: "AnhTris Holdings — Cung ứng HORECA trọn gói tại Đà Nẵng", template: "%s | AnhTris" },
    description:
      "Maiahorecare, Maiahome và Tris Gallery: tableware, linen, amenities và nội thất cho khách sạn, resort, nhà hàng. Showroom tại sảnh Furama Đà Nẵng.",
    applicationName: SITE_NAME,
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
    openGraph: { siteName: SITE_NAME, locale: "vi_VN", type: "website", images: [{ url: image.url, alt: image.alt }] },
    twitter: { card: "summary_large_image" },
    ...(googleVerification && { verification: { google: googleVerification } }),
  };
}

export const viewport: Viewport = { themeColor: "#f3f1f5" };

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi" className={fontVars}>
      <body>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
