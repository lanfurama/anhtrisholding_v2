import type { Metadata } from "next";
import { NotFoundView } from "@/components/not-found-view";
import { fontVars } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Không tìm thấy trang | AnhTris Holdings",
  robots: { index: false },
};

export default function GlobalNotFound() {
  return (
    <html lang="vi" className={fontVars}>
      <body>
        <main>
          <NotFoundView />
        </main>
      </body>
    </html>
  );
}
