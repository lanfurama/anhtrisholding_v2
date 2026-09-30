import type { ReactNode } from "react";
import { getMembers, getSettings } from "@/lib/content";
import { LOGO_URL, SITE_NAME } from "@/lib/brand";
import { organizationGraph } from "@/lib/seo";
import { Analytics } from "./analytics";
import { CopyGuard, ScrollProgress } from "./effects";
import { JsonLd } from "./json-ld";
import { SiteProviders } from "./providers";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

/** Khung chung của website (header, footer, giỏ báo giá, JSON-LD) — dùng cho layout (site) và trang 404 toàn cục. */
export async function SiteChrome({ children }: { children: ReactNode }) {
  const [settings, members] = await Promise.all([getSettings(), getMembers()]);
  const logo = { url: settings.logo?.url || LOGO_URL, alt: settings.logo?.alt || SITE_NAME };
  return (
    <>
      <SiteProviders>
        <div className="site" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
          <ScrollProgress />
          <SiteHeader logo={logo} phone={settings.phone} phoneE164={settings.phoneE164} />
          <main style={{ flex: 1 }}>{children}</main>
          <SiteFooter settings={settings} members={members} />
        </div>
        <CopyGuard />
      </SiteProviders>
      <JsonLd data={organizationGraph(settings, members)} />
      <noscript>
        <style>{".fadeImg{opacity:1}"}</style>
      </noscript>
      <Analytics />
    </>
  );
}
