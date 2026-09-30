import { describe, expect, it } from "vitest";
import { HARAVAN_STORE_ID } from "./brand";
import {
  fallbackCategories,
  fallbackHome,
  fallbackMembers,
  fallbackPosts,
  fallbackProducts,
  fallbackProjects,
  fallbackSettings,
  slugify,
} from "./fallback";
import type { Img } from "./types";

// Nội dung mặc định cũng là dữ liệu `npm run seed` đẩy lên Sanity — phải qua được validation của Studio.
const unique = (xs: string[]) => new Set(xs).size === xs.length;

describe("slugify", () => {
  it("bỏ dấu tiếng Việt, đ → d", () => {
    expect(slugify("Nội thất HORECA")).toBe("noi-that-horeca");
    expect(slugify("Đà Nẵng — Resort 5 sao")).toBe("da-nang-resort-5-sao");
    expect(slugify("18/0 Series")).toBe("18-0-series");
  });
});

describe("nội dung mặc định", () => {
  it("_id và slug không trùng", () => {
    for (const list of [fallbackCategories, fallbackProducts, fallbackMembers, fallbackProjects, fallbackPosts]) {
      expect(unique(list.map((x) => x._id))).toBe(true);
      expect(unique(list.map((x) => x.slug))).toBe(true);
    }
  });

  it("mọi tham chiếu danh mục đều tồn tại", () => {
    const cats = new Set(fallbackCategories.map((c) => c.slug));
    for (const p of fallbackProducts) expect(cats.has(p.category!.slug)).toBe(true);
    for (const post of fallbackPosts) for (const r of post.relatedProducts) expect(cats.has(r.categorySlug!)).toBe(true);
  });

  it("bài viết đạt các giới hạn SEO của Studio", () => {
    for (const p of fallbackPosts) {
      expect(p.seo!.title!.length).toBeLessThanOrEqual(60);
      expect(p.seo!.description!.length).toBeGreaterThanOrEqual(70);
      expect(p.seo!.description!.length).toBeLessThanOrEqual(160);
      expect(p.publishedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("bài viết sắp xếp mới nhất trước", () => {
    const dates = fallbackPosts.map((p) => p.publishedAt);
    expect([...dates].sort().reverse()).toEqual(dates);
  });

  it("mọi ảnh có alt và nằm trong phạm vi next/image cho phép", () => {
    const images: Img[] = [
      fallbackSettings.logo,
      fallbackSettings.ogImage,
      fallbackSettings.authorImage,
      fallbackHome.heroImage,
      fallbackHome.showroomImage,
      ...fallbackCategories.map((c) => c.homeImage),
      ...fallbackProducts.map((p) => p.image),
      ...fallbackMembers.map((m) => m.logo),
      ...fallbackProjects.map((p) => p.image),
      ...fallbackPosts.map((p) => p.coverImage),
    ];
    for (const img of images.filter((x): x is NonNullable<Img> => x !== null)) {
      expect(img.alt.trim()).not.toBe("");
      const url = new URL(img.url);
      expect(["cdn.hstatic.net", "file.hstatic.net"]).toContain(url.hostname);
      expect(url.pathname).toContain(`/${HARAVAN_STORE_ID}/`);
    }
  });

  it("nút CTA của thành viên là đường dẫn nội bộ hợp lệ", () => {
    for (const m of fallbackMembers) for (const cta of [m.homeCta, m.ecoCta]) expect(cta.href).toMatch(/^\//);
  });
});
