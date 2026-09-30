import { defineField, defineType } from "sanity";

export const quoteRequest = defineType({
  name: "quoteRequest",
  title: "Yêu cầu báo giá",
  type: "document",
  fields: [
    defineField({
      name: "status",
      title: "Trạng thái",
      type: "string",
      options: {
        list: [
          { title: "Mới", value: "new" },
          { title: "Đã liên hệ", value: "contacted" },
          { title: "Hoàn tất", value: "done" },
        ],
        layout: "radio",
      },
      initialValue: "new",
    }),
    defineField({ name: "name", title: "Họ tên", type: "string", readOnly: true }),
    defineField({ name: "company", title: "Đơn vị", type: "string", readOnly: true }),
    defineField({ name: "phone", title: "Số điện thoại", type: "string", readOnly: true }),
    defineField({ name: "email", title: "Email", type: "string", readOnly: true }),
    defineField({ name: "interest", title: "Quan tâm", type: "string", readOnly: true }),
    defineField({ name: "message", title: "Nhu cầu", type: "text", readOnly: true }),
    defineField({ name: "items", title: "Mục đã chọn", type: "array", of: [{ type: "string" }], readOnly: true }),
    defineField({ name: "submittedAt", title: "Thời gian gửi", type: "datetime", readOnly: true }),
  ],
  orderings: [{ title: "Mới nhất", name: "submittedAtDesc", by: [{ field: "submittedAt", direction: "desc" }] }],
  preview: {
    select: { title: "name", phone: "phone", interest: "interest", status: "status" },
    prepare: ({ title, phone, interest, status }) => ({
      title: `${status === "new" ? "● " : ""}${title ?? "—"}`,
      subtitle: [phone, interest].filter(Boolean).join(" · "),
    }),
  },
});
