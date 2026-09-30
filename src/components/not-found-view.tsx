import Link from "next/link";

export function NotFoundView() {
  return (
    <section
      className="container"
      style={{ minHeight: "70vh", paddingTop: "clamp(120px, 14vw, 160px)", paddingBottom: 80, display: "flex", flexDirection: "column", gap: 22 }}
    >
      <span className="eyebrow">Lỗi 404</span>
      <h1 className="display" style={{ fontSize: "clamp(44px, 7vw, 104px)" }}>
        Không tìm thấy <span className="cO">trang này.</span>
      </h1>
      <p className="lede" style={{ maxWidth: 560 }}>
        Đường dẫn có thể đã thay đổi. Hãy quay về trang chủ hoặc xem các bộ sưu tập của chúng tôi.
      </p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Link href="/" className="btn btnPrimary">
          Về trang chủ
        </Link>
        <Link href="/collections/all" className="btn btnOutline">
          Xem sản phẩm
        </Link>
      </div>
    </section>
  );
}
