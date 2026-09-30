import Link from "next/link";
import { ROUTES } from "@/lib/routes";
import { MessageView } from "./message-view";

export function NotFoundView() {
  return (
    <MessageView
      eyebrow="Lỗi 404"
      title="Không tìm thấy"
      accent="trang này."
      text="Đường dẫn có thể đã thay đổi. Hãy quay về trang chủ hoặc xem các bộ sưu tập của chúng tôi."
    >
      <Link href={ROUTES.home} className="btn btnPrimary">
        Về trang chủ
      </Link>
      <Link href={ROUTES.products} className="btn btnOutline">
        Xem sản phẩm
      </Link>
    </MessageView>
  );
}
