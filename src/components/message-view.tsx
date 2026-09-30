import type { ReactNode } from "react";

/** Trang thông báo toàn màn hình (404, lỗi tải trang) theo kiểu chữ của site. */
export function MessageView({
  eyebrow,
  title,
  accent,
  text,
  children,
}: {
  eyebrow: string;
  title: string;
  accent: string;
  text: string;
  children: ReactNode;
}) {
  return (
    <section
      className="container"
      style={{ minHeight: "70vh", paddingTop: "clamp(120px, 14vw, 160px)", paddingBottom: 80, display: "flex", flexDirection: "column", gap: 22 }}
    >
      <span className="eyebrow">{eyebrow}</span>
      <h1 className="display" style={{ fontSize: "clamp(44px, 7vw, 104px)" }}>
        {title} <span className="cO">{accent}</span>
      </h1>
      <p className="lede" style={{ maxWidth: 560 }}>
        {text}
      </p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>{children}</div>
    </section>
  );
}
