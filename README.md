# AnhTris Holdings — website v2

Next.js 16 (App Router) + Sanity, dựng theo thiết kế **AnhTris Redesign v3**.

- Website: `/`, `/pages/he-sinh-thai`, `/collections/all`, `/pages/du-an`, `/pages/lien-he`, `/blogs/news`, `/blogs/news/<slug>`.
  Giữ nguyên cấu trúc URL của site Haravan hiện tại nên canonical/SEO cũ không bị mất.
- Sanity Studio nhúng tại `/studio`.

## Chạy local

```bash
npm install
npm run dev          # http://localhost:3000
```

Chưa cấu hình Sanity thì website vẫn chạy bằng nội dung mặc định lấy từ bản thiết kế (`src/lib/fallback.ts`).

## Kết nối Sanity

1. Tạo project: `npx sanity login` rồi `npx sanity init --env` (hoặc tạo ở [sanity.io/manage](https://www.sanity.io/manage)).
2. Tạo `.env.local` theo mẫu `.env.example`:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`
   - `SANITY_API_WRITE_TOKEN`: token quyền **Editor** (API → Tokens), để lưu yêu cầu báo giá từ form liên hệ.
   - `SANITY_REVALIDATE_SECRET`: chuỗi bí mật bất kỳ cho webhook.
3. Cho phép Studio chạy trên domain của site:
   `npx sanity cors add http://localhost:3000 --credentials` (thêm cả domain production).
4. Đẩy nội dung mặc định lên Sanity (ảnh được tải từ CDN hiện tại rồi upload vào Sanity):
   `npm run seed` — dùng `SANITY_API_WRITE_TOKEN` trong `.env.local`, không cần `sanity login`.
   Chạy lại sẽ ghi đè các document mặc định (theo `_id` cố định) — đừng chạy lại sau khi đã sửa nội dung trong Studio.
5. Webhook để nội dung cập nhật ngay khi bấm Publish (nếu không, trang tự làm mới sau 60 giây):
   sanity.io/manage → API → Webhooks → URL `https://<domain>/api/revalidate`, Trigger on: Create/Update/Delete,
   Projection `{_type}`, Secret = `SANITY_REVALIDATE_SECRET`.

## Mô hình nội dung

| Loại | Dùng ở |
| --- | --- |
| Trang chủ (singleton) | Hero, đoạn chiến lược, quy trình, dự án tiêu biểu, showroom, FAQ |
| Thông tin chung (singleton) | Hotline, email, địa chỉ, pháp nhân/MST, catalogue PDF, tác giả bài viết |
| Thương hiệu thành viên | Sơ đồ hệ sinh thái trang chủ, trang Hệ sinh thái, footer |
| Danh mục sản phẩm | Bộ lọc sản phẩm, ô bento trang chủ (`showOnHome`) |
| Sản phẩm / bộ sưu tập | Trang sản phẩm, giỏ báo giá |
| Dự án | Trang Dự án |
| Bài viết | Cẩm nang HORECA: các mục (Portable Text), Trả lời nhanh, Ghi nhớ nhanh, FAQ, SEO |
| Yêu cầu báo giá | Dữ liệu gửi từ form liên hệ (chỉ đọc, có trạng thái xử lý) |

Tiêu đề lớn có tô màu (hero, tiêu đề các khối) nằm trong code vì là một phần của bố cục.

## Cấu trúc

```
src/app/(site)/        website (root layout riêng: header, footer, font, JSON-LD Organization)
src/app/(studio)/      Sanity Studio (root layout riêng, không dính CSS của site)
src/app/actions.ts     Server Action gửi yêu cầu báo giá → Sanity
src/components/        UI; hiệu ứng client nằm trong các file "use client"
src/lib/content.ts     GROQ + lấy dữ liệu (ISR 60s, tag theo document type)
src/sanity/            client, schema, cấu trúc Studio
scripts/seed.ts        đẩy nội dung mặc định lên Sanity
```

## Ghi chú

- Hiệu ứng lấy từ bản thiết kế: chữ ANH/TRIS lộ dần, ảnh hero mở từ giữa + parallax, pill điều hướng dạng lò xo,
  sơ đồ "gom nhà cung ứng", thanh tiến trình cuộn, chấm cam bay vào giỏ báo giá, chuyển trang mờ dần (View Transitions).
  Tất cả tắt khi người dùng bật *giảm chuyển động* trong hệ điều hành.
- Site chặn bôi đen/sao chép/chuột phải như bản thiết kế (`CopyGuard` + class `.site`). Muốn bỏ, xoá `<CopyGuard />` trong `src/app/(site)/layout.tsx`.
- Khối "Xem trước SEO & GEO" trong bản thiết kế chỉ để duyệt nên không đưa lên site. Phần SEO thật (meta, Open Graph,
  canonical, JSON-LD BlogPosting/FAQPage/BreadcrumbList, sitemap, robots) đã được dựng.
- Nội dung còn là chỗ trống trong thiết kế, cần thay trong Studio: trích lời khách hàng của V-Senses, case study Steak House The Fan,
  ảnh Steak House The Fan và Furama, tên pháp nhân + MST (footer chỉ hiện khi đã nhập), file catalogue PDF.
- Khi chưa có `SANITY_API_WRITE_TOKEN`: ở môi trường dev form báo giá chỉ ghi log; ở production form báo lỗi và mời gọi hotline
  (không âm thầm bỏ mất yêu cầu).
