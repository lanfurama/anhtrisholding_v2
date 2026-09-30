import type { Metadata } from "next";
import { NotFoundView } from "@/components/not-found-view";

// Ghi đè title/robots "index" của layout cho mọi trang gọi notFound()
export const metadata: Metadata = {
  title: { absolute: "Không tìm thấy trang | AnhTris Holdings" },
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return <NotFoundView />;
}
