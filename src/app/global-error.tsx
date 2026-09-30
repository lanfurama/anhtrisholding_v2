"use client";

import { useEffect } from "react";
import { MessageView } from "@/components/message-view";
import { DEFAULT_PHONE } from "@/lib/brand";
import "./globals.css";

/** Lỗi ở chính layout gốc (header/footer không render được) — trang độc lập, tải lại toàn bộ khi thử lại. */
export default function GlobalError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="vi">
      <body>
        <title>Có lỗi xảy ra | AnhTris Holdings</title>
        <main>
          <MessageView
            eyebrow="Lỗi hệ thống"
            title="Có lỗi xảy ra"
            accent="khi tải trang."
            text={`Vui lòng thử lại sau ít phút. Cần hỗ trợ ngay, gọi hotline ${DEFAULT_PHONE}.`}
          >
            <button type="button" className="btn btnPrimary" onClick={() => retry()}>
              Thử lại
            </button>
            {/* Thẻ <a> thường để tải lại toàn bộ ứng dụng — layout gốc đã lỗi nên không dựa vào router phía client */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/" className="btn btnOutline">
              Về trang chủ
            </a>
          </MessageView>
        </main>
      </body>
    </html>
  );
}
