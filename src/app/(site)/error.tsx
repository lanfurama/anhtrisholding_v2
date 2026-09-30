"use client";

import Link from "next/link";
import { useEffect } from "react";
import { MessageView } from "@/components/message-view";
import { ROUTES } from "@/lib/routes";

/** Lỗi khi render một trang (vd. mất kết nối tới Sanity) — header, footer và hotline vẫn còn. */
export default function SiteError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <MessageView
      eyebrow="Lỗi tải trang"
      title="Chưa tải được"
      accent="nội dung này."
      text="Kết nối có thể đang gián đoạn trong giây lát. Hãy thử lại, hoặc gọi hotline ở cuối trang để được hỗ trợ ngay."
    >
      <button type="button" className="btn btnPrimary" onClick={() => retry()}>
        Thử lại
      </button>
      <Link href={ROUTES.home} className="btn btnOutline">
        Về trang chủ
      </Link>
    </MessageView>
  );
}
