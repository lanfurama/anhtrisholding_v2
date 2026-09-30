import { defineArrayMember, defineField, defineType } from "sanity";
import { imageWithAlt, linkObject } from "./fields";

export const member = defineType({
  name: "member",
  title: "Thương hiệu thành viên",
  type: "document",
  groups: [
    { name: "home", title: "Trang chủ", default: true },
    { name: "eco", title: "Trang hệ sinh thái" },
  ],
  fields: [
    defineField({ name: "name", title: "Tên", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "name" }, validation: (r) => r.required() }),
    defineField({ name: "order", title: "Thứ tự", type: "number", initialValue: 1 }),
    imageWithAlt("logo", "Logo", true),
    defineField({ name: "tag", title: "Nhãn (trang chủ)", type: "string", group: "home" }),
    defineField({ name: "summary", title: "Mô tả ngắn", type: "text", rows: 3, group: "home" }),
    defineField({ name: "highlights", title: "Nhóm sản phẩm / dịch vụ", type: "array", of: [{ type: "string" }], group: "home" }),
    { ...linkObject("homeCta", "Nút (trang chủ)"), group: "home" },
    defineField({ name: "ecoTag", title: "Nhãn (hệ sinh thái)", type: "string", group: "eco" }),
    defineField({ name: "description", title: "Mô tả", type: "text", rows: 3, group: "eco" }),
    defineField({
      name: "services",
      title: "Dịch vụ",
      type: "array",
      group: "eco",
      of: [
        defineArrayMember({
          type: "object",
          name: "service",
          fields: [
            defineField({ name: "title", title: "Tiêu đề", type: "string" }),
            defineField({ name: "text", title: "Mô tả", type: "string" }),
          ],
        }),
      ],
    }),
    { ...linkObject("ecoCta", "Nút (hệ sinh thái)"), group: "eco" },
    defineField({
      name: "theme",
      title: "Tông thẻ",
      type: "string",
      group: "eco",
      options: {
        list: [
          { title: "Tím đậm", value: "dark" },
          { title: "Trắng", value: "light" },
          { title: "Cam", value: "accent" },
        ],
        layout: "radio",
      },
      initialValue: "light",
    }),
  ],
  orderings: [{ title: "Thứ tự", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "name", subtitle: "tag", media: "logo" } },
});
