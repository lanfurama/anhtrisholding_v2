import { defineArrayMember, defineField } from "sanity";

/** Ảnh kèm alt bắt buộc — alt dùng cho SEO và trình đọc màn hình. */
export const imageWithAlt = (name: string, title: string, required = false) =>
  defineField({
    name,
    title,
    type: "image",
    options: { hotspot: true },
    fields: [
      defineField({
        name: "alt",
        title: "Mô tả ảnh (alt)",
        type: "string",
        validation: (r) => r.required().warning("Nên có mô tả ảnh cho SEO"),
      }),
    ],
    validation: required ? (r) => r.required() : undefined,
  });

export const faqArray = (name = "faqs", title = "Câu hỏi thường gặp") =>
  defineField({
    name,
    title,
    type: "array",
    of: [
      defineArrayMember({
        type: "object",
        name: "faqItem",
        fields: [
          defineField({ name: "question", title: "Câu hỏi", type: "string", validation: (r) => r.required() }),
          defineField({ name: "answer", title: "Trả lời", type: "text", rows: 3, validation: (r) => r.required() }),
        ],
        preview: { select: { title: "question", subtitle: "answer" } },
      }),
    ],
  });

export const linkObject = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "object",
    options: { columns: 2 },
    fields: [
      defineField({ name: "label", title: "Nhãn", type: "string" }),
      defineField({
        name: "href",
        title: "Đường dẫn",
        type: "string",
        description: "Đường dẫn nội bộ, ví dụ /collections/all hoặc /pages/lien-he",
      }),
    ],
  });
