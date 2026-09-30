import { defineArrayMember, defineField, defineType } from "sanity";
import { faqArray, imageWithAlt } from "./fields";

export const POST_CATEGORIES = ["Xu hướng", "Nhà hàng", "Khách sạn", "Sản phẩm xanh"];

export const post = defineType({
  name: "post",
  title: "Bài viết (Cẩm nang HORECA)",
  type: "document",
  groups: [
    { name: "content", title: "Nội dung", default: true },
    { name: "geo", title: "Trả lời nhanh & FAQ" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({ name: "title", title: "Tiêu đề", type: "string", group: "content", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "content",
      options: { source: "title", maxLength: 120 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "category",
      title: "Chuyên mục",
      type: "string",
      group: "content",
      options: { list: POST_CATEGORIES },
      validation: (r) => r.required(),
    }),
    defineField({ name: "publishedAt", title: "Ngày đăng", type: "date", group: "content", validation: (r) => r.required() }),
    defineField({ name: "excerpt", title: "Sapo", type: "text", rows: 2, group: "content", validation: (r) => r.required() }),
    { ...imageWithAlt("coverImage", "Ảnh bìa", true), group: "content" },
    defineField({
      name: "sections",
      title: "Các mục",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({
          type: "object",
          name: "section",
          fields: [
            defineField({ name: "heading", title: "Tiêu đề mục (H2)", type: "string", validation: (r) => r.required() }),
            defineField({
              name: "body",
              title: "Nội dung",
              type: "array",
              of: [
                defineArrayMember({
                  type: "block",
                  styles: [{ title: "Đoạn văn", value: "normal" }],
                  lists: [{ title: "Gạch đầu dòng", value: "bullet" }],
                  marks: { decorators: [{ title: "Đậm", value: "strong" }, { title: "Nghiêng", value: "em" }] },
                }),
              ],
            }),
          ],
          preview: { select: { title: "heading" } },
        }),
      ],
    }),
    defineField({
      name: "relatedProducts",
      title: "Sản phẩm nhắc đến trong bài",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({
          type: "object",
          name: "productLink",
          fields: [
            defineField({ name: "label", title: "Nhãn", type: "string", validation: (r) => r.required() }),
            defineField({ name: "category", title: "Danh mục", type: "reference", to: [{ type: "productCategory" }] }),
          ],
          preview: { select: { title: "label", subtitle: "category.title" } },
        }),
      ],
    }),
    defineField({ name: "cta", title: "Câu kêu gọi cuối bài", type: "string", group: "content" }),
    defineField({
      name: "quickAnswer",
      title: "Trả lời nhanh",
      type: "text",
      rows: 3,
      group: "geo",
      description: "Câu trả lời trực tiếp ở đầu bài — giúp AI và Google trích dẫn.",
    }),
    defineField({ name: "keyTakeaways", title: "Ghi nhớ nhanh", type: "array", of: [{ type: "string" }], group: "geo" }),
    { ...faqArray("faq"), group: "geo" },
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      group: "seo",
      fields: [
        defineField({ name: "title", title: "Title tag", type: "string", validation: (r) => r.max(60).warning("Nên dưới 60 ký tự") }),
        defineField({
          name: "description",
          title: "Meta description",
          type: "text",
          rows: 3,
          validation: (r) => r.min(70).max(160).warning("Nên từ 70–160 ký tự"),
        }),
        defineField({ name: "keywords", title: "Từ khóa", type: "string" }),
      ],
    }),
  ],
  orderings: [{ title: "Mới nhất", name: "publishedAtDesc", by: [{ field: "publishedAt", direction: "desc" }] }],
  preview: { select: { title: "title", subtitle: "category", media: "coverImage" } },
});
