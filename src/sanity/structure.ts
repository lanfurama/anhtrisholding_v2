import type { StructureResolver } from "sanity/structure";

const singleton = (S: Parameters<StructureResolver>[0], id: string, title: string) =>
  S.listItem().title(title).id(id).child(S.document().schemaType(id).documentId(id).title(title));

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Nội dung")
    .items([
      singleton(S, "homePage", "Trang chủ"),
      singleton(S, "siteSettings", "Thông tin chung"),
      S.divider(),
      S.documentTypeListItem("member").title("Thương hiệu thành viên"),
      S.documentTypeListItem("productCategory").title("Danh mục sản phẩm"),
      S.documentTypeListItem("product").title("Sản phẩm / bộ sưu tập"),
      S.documentTypeListItem("project").title("Dự án"),
      S.documentTypeListItem("post").title("Bài viết"),
      S.divider(),
      S.documentTypeListItem("quoteRequest").title("Yêu cầu báo giá"),
    ]);
