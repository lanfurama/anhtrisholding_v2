import type { Metadata } from "next";
import { Suspense } from "react";
import c from "@/components/catalog/catalog.module.css";
import { CatalogueButton, ProductCatalog, ProductCatalogFromUrl } from "@/components/catalog/product-catalog";
import { PageTransition } from "@/components/page-transition";
import { getCategories, getProducts, getSettings } from "@/lib/content";
import { ROUTES } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({
    title: "Sản phẩm HORECA: tableware, linen, amenities | AnhTris",
    description: "Chén dĩa sứ, dao nĩa, linen, amenities, nội thất và sản phẩm xanh cho khách sạn, nhà hàng. Nhận dập logo, báo giá trong 24 giờ.",
    path: ROUTES.products,
  });
}

export default async function ProductsPage() {
  const [categories, products, settings] = await Promise.all([getCategories(), getProducts(), getSettings()]);
  return (
    <PageTransition>
      <section className={`container ${c.page}`}>
        <div className={c.head}>
          <span className="eyebrow">Maiahorecare · Maiahome</span>
          <h1 className="display" style={{ fontSize: "clamp(42px, 6.4vw, 96px)" }}>
            Bộ sưu tập <span className="cO">&amp; catalogue.</span>
          </h1>
          <p className="lede" style={{ maxWidth: 620 }}>
            Nhận tùy chỉnh chất liệu, kiểu dáng và dập logo thương hiệu. Chọn bộ sưu tập để nhận báo giá trong 24 giờ làm việc.
          </p>
        </div>

        {/* HTML tĩnh hiển thị "Tất cả"; client đọc ?cat= rồi lọc lại */}
        <Suspense fallback={<ProductCatalog categories={categories} products={products} cat="all" />}>
          <ProductCatalogFromUrl categories={categories} products={products} />
        </Suspense>

        <div className={c.catalogue}>
          <div className={c.catalogueCopy}>
            <span className={c.catalogueTitle}>Catalogue đầy đủ: Cutlery · Chinaware · Whiteware · Linen · Amenities</span>
            <span className={c.catalogueText}>Bảng quy cách tra cứu trên website và bản PDF tải về.</span>
          </div>
          <CatalogueButton url={settings.catalogueUrl} phone={settings.phone} />
        </div>
      </section>
    </PageTransition>
  );
}
