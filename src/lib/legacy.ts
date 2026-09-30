/**
 * URL cũ của site Haravan → trang tương ứng trên site mới (redirect 308 để giữ thứ hạng tìm kiếm).
 * Các đường dẫn cố định nằm trong `next.config.ts`; ở đây là phần cần tra dữ liệu danh mục/sản phẩm.
 */
import { categoryPath, ROUTES } from "./routes";

type CategoryRef = { slug: string };
type ProductRef = { slug: string; category: { slug: string } | null };

/** `/collections/<handle>` → bộ lọc danh mục cùng slug, không có thì trang tất cả sản phẩm. */
export function legacyCollectionPath(handle: string, categories: CategoryRef[]) {
  return categories.some((c) => c.slug === handle) ? categoryPath(handle) : ROUTES.products;
}

/** `/products/<handle>` → danh mục của sản phẩm cùng slug, không có thì trang tất cả sản phẩm. */
export function legacyProductPath(handle: string, products: ProductRef[]) {
  return categoryPath(products.find((p) => p.slug === handle)?.category?.slug);
}

/** Redirect cố định (dùng trong next.config.ts). */
export const LEGACY_REDIRECTS = [
  { source: "/collections", destination: ROUTES.products },
  { source: "/collections/:handle/products/:product", destination: "/products/:product" },
  { source: "/products", destination: ROUTES.products },
  { source: "/blogs", destination: ROUTES.blog },
  { source: "/blogs/news/tagged/:tag*", destination: ROUTES.blog },
  { source: "/search", destination: ROUTES.products },
  { source: "/cart", destination: ROUTES.contact },
  { source: "/account/:path*", destination: ROUTES.home },
  { source: "/pages/about-us", destination: ROUTES.eco },
  { source: "/pages/gioi-thieu", destination: ROUTES.eco },
].map((r) => ({ ...r, permanent: true }));
