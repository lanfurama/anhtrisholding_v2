import { defineField, defineType } from "sanity";
import { imageWithAlt } from "./fields";

export const productCategory = defineType({
  name: "productCategory",
  title: "Danh mục sản phẩm",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Tên", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      description: "Dùng cho bộ lọc: /collections/all?cat=<slug>",
      validation: (r) => r.required(),
    }),
    defineField({ name: "filterLabel", title: "Nhãn bộ lọc (ngắn)", type: "string", description: "Để trống sẽ dùng tên danh mục" }),
    defineField({ name: "order", title: "Thứ tự", type: "number", initialValue: 1 }),
    defineField({
      name: "tone",
      title: "Tông màu nhấn",
      type: "string",
      options: { list: [{ title: "Tím", value: "purple" }, { title: "Cam", value: "orange" }], layout: "radio" },
      initialValue: "purple",
    }),
    defineField({ name: "showOnHome", title: "Hiển thị ở trang chủ", type: "boolean", initialValue: true }),
    defineField({ name: "subtitle", title: "Phụ đề", type: "string", description: "Ví dụ: Chinaware · Whiteware" }),
    defineField({ name: "homeDescription", title: "Mô tả ở trang chủ", type: "text", rows: 2 }),
    imageWithAlt("homeImage", "Ảnh (ô lớn trang chủ)"),
  ],
  orderings: [{ title: "Thứ tự", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "subtitle", media: "homeImage" } },
});

export const product = defineType({
  name: "product",
  title: "Sản phẩm / bộ sưu tập",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Tên", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "name" }, validation: (r) => r.required() }),
    defineField({
      name: "category",
      title: "Danh mục",
      type: "reference",
      to: [{ type: "productCategory" }],
      validation: (r) => r.required(),
    }),
    defineField({ name: "line", title: "Dòng sản phẩm", type: "string", description: "Ví dụ: Chinaware · TACO4DUNE" }),
    defineField({ name: "description", title: "Mô tả ngắn", type: "text", rows: 2, validation: (r) => r.max(140) }),
    imageWithAlt("image", "Ảnh"),
    defineField({ name: "order", title: "Thứ tự", type: "number", initialValue: 100 }),
  ],
  orderings: [{ title: "Thứ tự", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "name", subtitle: "category.title", media: "image" } },
});

export const project = defineType({
  name: "project",
  title: "Dự án",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Tên dự án", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "order", title: "Thứ tự", type: "number", initialValue: 1 }),
    defineField({ name: "sector", title: "Loại hình", type: "string", description: "Ví dụ: Fine dining, Resort 5 sao" }),
    defineField({ name: "products", title: "Hạng mục cung ứng", type: "string", description: "Ví dụ: Tableware, Linen" }),
    defineField({ name: "member", title: "Thành viên thực hiện", type: "string", description: "Ví dụ: Maiahorecare" }),
    defineField({ name: "summary", title: "Tóm tắt", type: "text", rows: 4 }),
    defineField({
      name: "testimonial",
      title: "Trích lời khách hàng",
      type: "object",
      fields: [
        defineField({ name: "quote", title: "Trích dẫn", type: "text", rows: 2 }),
        defineField({ name: "author", title: "Tên, chức danh", type: "string" }),
      ],
    }),
    imageWithAlt("image", "Ảnh"),
  ],
  orderings: [{ title: "Thứ tự", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "sector", media: "image" } },
});
