"use client";

import { useSearchParams } from "next/navigation";
import type { Category, Product } from "@/lib/types";
import { FadeImage } from "../effects";
import { useSite } from "../providers";
import c from "./catalog.module.css";

type Props = { categories: Category[]; products: Product[] };

/** Đọc bộ lọc từ ?cat=… (cần <Suspense> ở trang cha). */
export function ProductCatalogFromUrl(props: Props) {
  const cat = useSearchParams().get("cat") ?? "all";
  return <ProductCatalog {...props} cat={cat} />;
}

export function ProductCatalog({ categories, products, cat }: Props & { cat: string }) {
  const { inQuote, toggleQuote } = useSite();
  const active = cat === "all" || categories.some((x) => x.slug === cat) ? cat : "all";
  const shown = active === "all" ? products : products.filter((p) => p.category?.slug === active);

  const setCat = (slug: string) => {
    const url = new URL(window.location.href);
    if (slug === "all") url.searchParams.delete("cat");
    else url.searchParams.set("cat", slug);
    // Next.js đồng bộ history.replaceState với useSearchParams — không cần tải lại trang
    window.history.replaceState(null, "", url.pathname + url.search);
  };

  const filters = [{ slug: "all", label: "Tất cả" }, ...categories.map((x) => ({ slug: x.slug, label: x.filterLabel || x.title }))];

  return (
    <>
      <div className={c.filters} role="group" aria-label="Lọc theo danh mục">
        {filters.map((f) => (
          <button key={f.slug} type="button" aria-pressed={active === f.slug} className={c.filter} onClick={() => setCat(f.slug)}>
            {f.label}
          </button>
        ))}
      </div>

      <div className={c.grid}>
        {shown.map((p) => {
          const id = "p-" + p.slug;
          const on = inQuote(id);
          const warm = p.category?.tone === "orange";
          return (
            <div key={p._id} className={c.card} data-on={on ? "1" : undefined}>
              <div className={`${c.media} ${p.image ? "" : `placeholder ${warm ? "phOrange" : "phPurple"}`}`}>
                {p.image ? <FadeImage src={p.image.url} alt={p.image.alt || p.name} fill sizes="(max-width: 600px) 100vw, 320px" /> : <span>{p.name}</span>}
              </div>
              <div className={c.info}>
                <div className={c.text}>
                  <span className={c.line}>{p.line || p.category?.title}</span>
                  <h2 className={c.name}>{p.name}</h2>
                  <span className={c.desc}>{p.description || "Liên hệ để nhận catalogue và báo giá."}</span>
                </div>
                <button
                  type="button"
                  className={c.add}
                  aria-pressed={on}
                  aria-label={on ? `Bỏ ${p.name} khỏi báo giá` : `Thêm ${p.name} vào báo giá`}
                  onClick={(e) => toggleQuote({ id, name: p.name }, e.detail ? { x: e.clientX, y: e.clientY } : undefined)}
                >
                  {on ? "✓" : "+"}
                </button>
              </div>
            </div>
          );
        })}
        {shown.length === 0 && <p className={c.empty}>Danh mục đang cập nhật — liên hệ để nhận catalogue mới nhất.</p>}
      </div>
    </>
  );
}

export function CatalogueButton({ url, phone }: { url: string | null; phone: string }) {
  const { flash } = useSite();
  if (url) {
    return (
      <a href={`${url}?dl=`} className="btn btnAccent" download>
        Tải catalogue PDF ↓
      </a>
    );
  }
  return (
    <button type="button" className="btn btnAccent" onClick={() => flash(`Catalogue PDF đang cập nhật — gọi ${phone} để nhận bản mới nhất`)}>
      Tải catalogue PDF ↓
    </button>
  );
}
