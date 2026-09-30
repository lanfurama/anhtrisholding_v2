import { NextStudio } from "next-sanity/studio";
import config from "../../../../../sanity.config";
import { isSanityConfigured } from "@/sanity/env";

export const dynamic = "force-static";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  if (!isSanityConfigured) {
    return (
      <main style={{ fontFamily: "system-ui, sans-serif", maxWidth: 560, margin: "15vh auto", padding: 24, lineHeight: 1.6 }}>
        <h1 style={{ fontSize: 22 }}>Chưa cấu hình Sanity</h1>
        <p>
          Thêm <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> và <code>NEXT_PUBLIC_SANITY_DATASET</code> vào <code>.env.local</code> rồi khởi động
          lại server. Xem hướng dẫn trong README.
        </p>
      </main>
    );
  }
  return <NextStudio config={config} />;
}
