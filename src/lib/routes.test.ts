import { describe, expect, it } from "vitest";
import { categoryPath, formatDate, navKeyFor, postPath } from "./routes";

describe("navKeyFor", () => {
  it.each([
    ["/", "home"],
    ["/pages/he-sinh-thai", "eco"],
    ["/collections/all", "product"],
    ["/pages/du-an", "projects"],
    ["/pages/lien-he", "contact"],
    ["/blogs/news/abc", null],
  ])("%s → %s", (path, key) => expect(navKeyFor(path)).toBe(key));
});

describe("đường dẫn", () => {
  it("categoryPath mã hoá slug, thiếu slug thì về trang tất cả", () => {
    expect(categoryPath("noi-that")).toBe("/collections/all?cat=noi-that");
    expect(categoryPath("a b")).toBe("/collections/all?cat=a%20b");
    expect(categoryPath(null)).toBe("/collections/all");
  });

  it("postPath giữ cấu trúc /blogs/news/<slug> của Haravan", () => {
    expect(postPath("tieu-chuan")).toBe("/blogs/news/tieu-chuan");
  });
});

describe("formatDate", () => {
  it("định dạng dd.mm.yyyy, nhận cả datetime", () => {
    expect(formatDate("2026-09-21")).toBe("21.09.2026");
    expect(formatDate("2026-09-21T10:00:00Z")).toBe("21.09.2026");
  });

  it("thiếu ngày thì trả chuỗi rỗng thay vì lỗi", () => {
    expect(formatDate(null)).toBe("");
    expect(formatDate(undefined)).toBe("");
  });
});
