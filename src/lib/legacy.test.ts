import { describe, expect, it } from "vitest";
import { fallbackCategories, fallbackProducts } from "./fallback";
import { LEGACY_REDIRECTS, legacyCollectionPath, legacyProductPath } from "./legacy";

describe("URL cũ của Haravan", () => {
  it("danh mục trùng slug → bộ lọc, không có → tất cả sản phẩm", () => {
    expect(legacyCollectionPath("linen", fallbackCategories)).toBe("/collections/all?cat=linen");
    expect(legacyCollectionPath("khong-co", fallbackCategories)).toBe("/collections/all");
  });

  it("sản phẩm → danh mục của sản phẩm", () => {
    expect(legacyProductPath("dune", fallbackProducts)).toBe("/collections/all?cat=tableware");
    expect(legacyProductPath("bath-linen", fallbackProducts)).toBe("/collections/all?cat=linen");
    expect(legacyProductPath("khong-co", fallbackProducts)).toBe("/collections/all");
  });

  it("redirect cố định đều là 308 và không trỏ về chính nó", () => {
    for (const r of LEGACY_REDIRECTS) {
      expect(r.permanent).toBe(true);
      expect(r.destination).not.toBe(r.source);
    }
  });
});
