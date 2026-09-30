import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { CopyGuard, ScrollProgress } from "@/components/effects";
import { JsonLd } from "@/components/json-ld";
import { SiteProviders } from "@/components/providers";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getMembers, getSettings } from "@/lib/content";
import { LOGO_URL } from "@/lib/fallback";
import { fontVars } from "@/lib/fonts";
import { organizationGraph, SITE_NAME } from "@/lib/seo";
import { siteUrl } from "@/sanity/env";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "AnhTris Holdings — Cung ứng HORECA trọn gói tại Đà Nẵng", template: "%s | AnhTris" },
  description:
    "Maiahorecare, Maiahome và Tris Gallery: tableware, linen, amenities và nội thất cho khách sạn, resort, nhà hàng. Showroom tại sảnh Furama Đà Nẵng.",
  applicationName: SITE_NAME,
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  openGraph: { siteName: SITE_NAME, locale: "vi_VN", type: "website", images: [LOGO_URL] },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#f3f1f5" };

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const [settings, members] = await Promise.all([getSettings(), getMembers()]);
  return (
    <html lang="vi" className={fontVars}>
      <body>
        <SiteProviders>
          <div className="site" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <ScrollProgress />
            <SiteHeader phone={settings.phone} phoneE164={settings.phoneE164} />
            <main style={{ flex: 1 }}>{children}</main>
            <SiteFooter settings={settings} members={members} />
          </div>
          <CopyGuard />
        </SiteProviders>
        <JsonLd data={organizationGraph(settings, members)} />
        <noscript>
          <style>{".fadeImg{opacity:1}"}</style>
        </noscript>
      </body>
    </html>
  );
}
