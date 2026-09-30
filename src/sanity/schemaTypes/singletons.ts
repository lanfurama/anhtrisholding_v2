import { defineArrayMember, defineField, defineType } from "sanity";
import { faqArray, imageWithAlt } from "./fields";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Thông tin chung",
  type: "document",
  groups: [
    { name: "contact", title: "Liên hệ", default: true },
    { name: "brand", title: "Logo & chia sẻ" },
    { name: "legal", title: "Pháp lý" },
    { name: "author", title: "Tác giả bài viết" },
  ],
  fields: [
    defineField({ name: "title", title: "Tên thương hiệu", type: "string", group: "contact", initialValue: "AnhTris Holdings" }),
    defineField({ name: "phone", title: "Hotline (hiển thị)", type: "string", group: "contact", description: "Ví dụ 0853 748 898" }),
    defineField({
      name: "phoneE164",
      title: "Hotline (quốc tế)",
      type: "string",
      group: "contact",
      description: "Ví dụ +84853748898 — dùng cho liên kết gọi điện",
      validation: (r) => r.custom<string>((v) => !v || /^\+\d{8,15}$/.test(v) || "Viết liền, bắt đầu bằng +84, ví dụ +84853748898"),
    }),
    defineField({ name: "email", title: "Email", type: "string", group: "contact", validation: (r) => r.email().error("Email chưa hợp lệ") }),
    defineField({ name: "showroomName", title: "Tên showroom", type: "string", group: "contact" }),
    defineField({ name: "address", title: "Địa chỉ đầy đủ", type: "text", rows: 2, group: "contact" }),
    defineField({ name: "addressShort", title: "Địa chỉ rút gọn (footer)", type: "text", rows: 2, group: "contact" }),
    defineField({ name: "catalogue", title: "Catalogue PDF", type: "file", group: "contact", options: { accept: "application/pdf" } }),
    {
      ...imageWithAlt("logo", "Logo"),
      group: "brand",
      description: "Dùng ở header và cho Google (dữ liệu có cấu trúc). PNG/SVG nền trong suốt, cao tối thiểu 72px.",
    },
    {
      ...imageWithAlt("ogImage", "Ảnh chia sẻ mặc định"),
      group: "brand",
      description: "Hiện khi chia sẻ link lên Facebook, Zalo… (trang không có ảnh riêng). Kích thước 1200×630.",
    },
    defineField({
      name: "socialLinks",
      title: "Mạng xã hội",
      type: "array",
      group: "brand",
      description: "Hiện ở footer và khai báo cho Google (sameAs).",
      of: [
        defineArrayMember({
          type: "object",
          name: "socialLink",
          fields: [
            defineField({ name: "label", title: "Tên", type: "string", description: "Ví dụ: Facebook, Zalo, YouTube", validation: (r) => r.required() }),
            defineField({ name: "url", title: "Đường dẫn", type: "url", validation: (r) => r.required().uri({ scheme: ["https"] }) }),
          ],
          preview: { select: { title: "label", subtitle: "url" } },
        }),
      ],
    }),
    defineField({ name: "legalName", title: "Tên pháp nhân", type: "string", group: "legal" }),
    defineField({ name: "taxId", title: "Mã số thuế", type: "string", group: "legal" }),
    defineField({ name: "authorName", title: "Tên tác giả", type: "string", group: "author" }),
    defineField({ name: "authorBio", title: "Giới thiệu tác giả", type: "text", rows: 3, group: "author" }),
    { ...imageWithAlt("authorImage", "Ảnh / logo tác giả"), group: "author" },
  ],
  preview: { prepare: () => ({ title: "Thông tin chung" }) },
});

export const homePage = defineType({
  name: "homePage",
  title: "Trang chủ",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "sections", title: "Các khối" },
  ],
  fields: [
    defineField({ name: "heroLede", title: "Đoạn giới thiệu", type: "text", rows: 3, group: "hero" }),
    { ...imageWithAlt("heroImage", "Ảnh hero"), group: "hero" },
    defineField({
      name: "heroBadge",
      title: "Nhãn trên ảnh hero",
      type: "object",
      group: "hero",
      options: { columns: 2 },
      fields: [
        defineField({ name: "mark", title: "Ký tự trong vòng tròn", type: "string", validation: (r) => r.max(2) }),
        defineField({ name: "label", title: "Nhãn nhỏ", type: "string" }),
        defineField({ name: "title", title: "Tiêu đề", type: "string" }),
      ],
    }),
    defineField({ name: "strategyText", title: "Đoạn chiến lược", type: "text", rows: 3, group: "sections" }),
    defineField({
      name: "steps",
      title: "Quy trình dự án",
      type: "array",
      group: "sections",
      of: [
        defineArrayMember({
          type: "object",
          name: "step",
          fields: [
            defineField({ name: "title", title: "Tiêu đề", type: "string", validation: (r) => r.required() }),
            defineField({ name: "text", title: "Mô tả", type: "text", rows: 2 }),
          ],
        }),
      ],
      validation: (r) => r.max(6),
    }),
    defineField({
      name: "featuredProjects",
      title: "Dự án tiêu biểu",
      type: "array",
      group: "sections",
      of: [defineArrayMember({ type: "reference", to: [{ type: "project" }] })],
      validation: (r) => r.max(3),
    }),
    defineField({ name: "showroomAddress", title: "Địa chỉ khối showroom", type: "text", rows: 2, group: "sections" }),
    { ...imageWithAlt("showroomImage", "Ảnh khối showroom"), group: "sections" },
    { ...faqArray(), group: "sections" },
  ],
  preview: { prepare: () => ({ title: "Trang chủ" }) },
});
