import type { StructureBuilder, StructureResolver } from "sanity/structure";
import { QUOTE_STATUSES } from "./schemaTypes/quoteRequest";

const singleton = (S: StructureBuilder, id: string, title: string) =>
  S.listItem().title(title).id(id).child(S.document().schemaType(id).documentId(id).title(title));

/** Hộp thư yêu cầu báo giá: tách theo trạng thái, mới nhất lên đầu. */
const quoteRequests = (S: StructureBuilder) =>
  S.listItem()
    .title("Yêu cầu báo giá")
    .id("quoteRequests")
    .schemaType("quoteRequest")
    .child(
      S.list()
        .title("Yêu cầu báo giá")
        .items([
          ...QUOTE_STATUSES.map(({ title, value }) =>
            S.listItem()
              .title(title)
              .id(`quote-${value}`)
              .schemaType("quoteRequest")
              .child(
                S.documentList()
                  .title(`Yêu cầu: ${title.toLowerCase()}`)
                  .schemaType("quoteRequest")
                  .filter('_type == "quoteRequest" && status == $status')
                  .params({ status: value })
                  .defaultOrdering([{ field: "submittedAt", direction: "desc" }]),
              ),
          ),
          S.divider(),
          S.documentTypeListItem("quoteRequest").title("Tất cả"),
        ]),
    );

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
      quoteRequests(S),
    ]);
