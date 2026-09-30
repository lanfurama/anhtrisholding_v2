export const ROUTES = {
  home: "/",
  eco: "/pages/he-sinh-thai",
  products: "/collections/all",
  projects: "/pages/du-an",
  contact: "/pages/lien-he",
  blog: "/blogs/news",
} as const;

export const NAV = [
  { key: "home", label: "Trang chủ", href: ROUTES.home },
  { key: "eco", label: "Hệ sinh thái", href: ROUTES.eco },
  { key: "product", label: "Sản phẩm", href: ROUTES.products },
  { key: "projects", label: "Dự án", href: ROUTES.projects },
  { key: "contact", label: "Liên hệ", href: ROUTES.contact },
] as const;

export function navKeyFor(pathname: string): string | null {
  if (pathname === "/") return "home";
  const hit = NAV.find((n) => n.href !== "/" && pathname.startsWith(n.href.replace("/all", "")));
  return hit?.key ?? null;
}

export const postPath = (slug: string) => `${ROUTES.blog}/${slug}`;
export const categoryPath = (slug?: string | null) => (slug ? `${ROUTES.products}?cat=${encodeURIComponent(slug)}` : ROUTES.products);

/** "2026-09-21" → "21.09.2026" (định dạng ngày trong bản thiết kế) */
export const formatDate = (iso: string) => {
  const [y, m, d] = iso.slice(0, 10).split("-");
  return `${d}.${m}.${y}`;
};
