import type { Metadata, Viewport } from "next";
import { NotFoundView } from "@/components/not-found-view";
import { SiteChrome } from "@/components/site-chrome";
import { fontVars } from "@/lib/fonts";
import { siteUrl } from "@/sanity/env";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Không tìm thấy trang | AnhTris Holdings",
  robots: { index: false },
};

export const viewport: Viewport = { themeColor: "#f3f1f5" };

/** URL không khớp route nào (vd. link cũ) — vẫn có header, footer để khách tìm đường tiếp. */
export default function GlobalNotFound() {
  return (
    <html lang="vi" className={fontVars}>
      <body>
        <SiteChrome>
          <NotFoundView />
        </SiteChrome>
      </body>
    </html>
  );
}
