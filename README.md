# AnhTris Holdings — website v2

Next.js 16 (App Router) + Sanity, dựng theo thiết kế **AnhTris Redesign v3**.

- Website: `/`, `/pages/he-sinh-thai`, `/collections/all`, `/pages/du-an`, `/pages/lien-he`, `/blogs/news`, `/blogs/news/<slug>`.
  Giữ nguyên cấu trúc URL của site Haravan hiện tại nên canonical/SEO cũ không bị mất; các URL cũ khác được redirect (xem [URL cũ](#url-cũ-của-haravan)).
- Sanity Studio nhúng tại `/studio`.
- Kết quả audit và danh sách việc đã làm / còn lại: [`docs/AUDIT.md`](docs/AUDIT.md).

## Chạy local

```bash
npm install
npm run dev          # http://localhost:3000
```

Chưa cấu hình Sanity thì website vẫn chạy bằng nội dung mặc định lấy từ bản thiết kế (`src/lib/fallback.ts`).

Kiểm tra trước khi đẩy code (CI trên GitHub chạy đúng các lệnh này):

```bash
npm run lint && npm run typecheck && npm test
npm run build && npm run smoke   # chạy bản production, gọi thử các route, redirect, header
```

## Kết nối Sanity

1. Tạo project: `npx sanity login` rồi `npx sanity init --env` (hoặc tạo ở [sanity.io/manage](https://www.sanity.io/manage)).
2. Tạo `.env.local` theo mẫu `.env.example`:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`
   - `SANITY_API_WRITE_TOKEN`: token quyền **Editor** (API → Tokens), để lưu yêu cầu báo giá từ form liên hệ.
   - `SANITY_REVALIDATE_SECRET`: chuỗi bí mật bất kỳ cho webhook.
3. Cho phép Studio chạy trên domain của site:
   `npx sanity cors add http://localhost:3000 --credentials` (thêm cả domain production).
4. Đẩy nội dung mặc định lên Sanity (ảnh — kể cả logo và ảnh chia sẻ — được tải từ CDN Haravan rồi upload vào Sanity):
   `npm run seed` — dùng `SANITY_API_WRITE_TOKEN` trong `.env.local`, không cần `sanity login`.
   Chạy lại sẽ ghi đè các document mặc định (theo `_id` cố định) — đừng chạy lại sau khi đã sửa nội dung trong Studio.
   Nên seed **trước khi đóng cửa hàng Haravan**, vì nội dung mặc định còn trỏ ảnh về CDN của Haravan.
5. Webhook để nội dung cập nhật ngay khi bấm Publish:
   sanity.io/manage → API → Webhooks → URL `https://<domain>/api/revalidate`, Trigger on: Create/Update/Delete,
   Filter `_type != "quoteRequest"`, Projection `{_type}`, Secret = `SANITY_REVALIDATE_SECRET`.
   Khi đã đặt `SANITY_REVALIDATE_SECRET`, trang chỉ tự làm mới theo thời gian mỗi 1 giờ (lưới an toàn, tiết kiệm quota API);
   chưa đặt thì trang tự làm mới sau 60 giây.

## Mô hình nội dung

| Loại | Dùng ở |
| --- | --- |
| Trang chủ (singleton) | Hero, đoạn chiến lược, quy trình, dự án tiêu biểu, showroom, FAQ |
| Thông tin chung (singleton) | Hotline, email, địa chỉ, pháp nhân/MST, catalogue PDF, tác giả bài viết, **logo, ảnh chia sẻ (OG) mặc định, mạng xã hội** |
| Thương hiệu thành viên | Sơ đồ hệ sinh thái trang chủ, trang Hệ sinh thái, footer |
| Danh mục sản phẩm | Bộ lọc sản phẩm, ô bento trang chủ (`showOnHome`) |
| Sản phẩm / bộ sưu tập | Trang sản phẩm, giỏ báo giá |
| Dự án | Trang Dự án |
| Bài viết | Cẩm nang HORECA: các mục (Portable Text), Trả lời nhanh, Ghi nhớ nhanh, FAQ, SEO |
| Yêu cầu báo giá | Dữ liệu gửi từ form liên hệ (xem bên dưới) |

Tiêu đề lớn có tô màu (hero, tiêu đề các khối) nằm trong code vì là một phần của bố cục.

## Yêu cầu báo giá

- Lưu vào Sanity: Studio → **Yêu cầu báo giá** → Mới / Đã liên hệ / Hoàn tất / Tất cả. Đổi trạng thái hoặc thêm *Ghi chú nội bộ*
  là lưu ngay (không cần Publish). Không tạo tay được trong Studio — chỉ đến từ form.
- Email báo cho đội kinh doanh (tuỳ chọn): tạo tài khoản [Resend](https://resend.com), xác minh domain gửi, rồi đặt
  `RESEND_API_KEY`, `QUOTE_NOTIFY_TO` (nhiều email cách nhau bằng dấu phẩy), `QUOTE_NOTIFY_FROM`.
  Email gửi sau khi khách nhận kết quả (không làm chậm form), có nút trả lời thẳng cho khách và link mở yêu cầu trong Studio.
  Nếu lưu Sanity lỗi, email là kênh dự phòng — form chỉ báo thành công khi ít nhất một nơi nhận được yêu cầu.
- Chống spam: ô bẫy ẩn + tối đa 5 yêu cầu / 10 phút / IP.
- Chưa cấu hình nơi lưu (token Sanity hoặc email): ở dev form chỉ ghi log; ở production form báo lỗi và mời gọi hotline
  (không âm thầm bỏ mất yêu cầu).

## URL cũ của Haravan

Redirect 308 để giữ thứ hạng và backlink:

| URL cũ | Chuyển tới |
| --- | --- |
| `/collections/<handle>` | `/collections/all?cat=<handle>` nếu có danh mục cùng slug, không thì `/collections/all` |
| `/products/<handle>` | bộ lọc danh mục của sản phẩm cùng slug, không thì `/collections/all` |
| `/collections/<c>/products/<p>` | như `/products/<p>` |
| `/collections`, `/products`, `/search` | `/collections/all` |
| `/blogs`, `/blogs/news/tagged/<tag>` | `/blogs/news` |
| `/cart` | `/pages/lien-he` (giỏ báo giá) |
| `/account/*` | `/` |
| `/pages/about-us`, `/pages/gioi-thieu` | `/pages/he-sinh-thai` |

Thêm redirect cố định trong `src/lib/legacy.ts` (`LEGACY_REDIRECTS`). Nên đối chiếu với báo cáo *Trang* trong Google Search Console
của site cũ để bổ sung các URL có traffic.

## Theo dõi (tuỳ chọn)

- Google Analytics 4: `NEXT_PUBLIC_GA_ID=G-XXXXXXX`.
- Xác minh Google Search Console bằng thẻ meta: `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=<mã>`.

## Cấu trúc

```
src/app/(site)/        website (root layout riêng: header, footer, font, JSON-LD Organization), error.tsx, not-found.tsx
src/app/(studio)/      Sanity Studio (root layout riêng, không dính CSS của site)
src/app/actions.ts     Server Action gửi yêu cầu báo giá → Sanity (+ email)
src/app/global-*.tsx   404 cho URL không khớp route (có header/footer) và trang lỗi toàn cục
src/components/        UI; hiệu ứng client nằm trong các file "use client"; site-chrome.tsx là khung chung
src/lib/content.ts     GROQ + lấy dữ liệu (ISR, tag theo document type)
src/lib/brand.ts       hằng số dùng được ở client — KHÔNG import fallback.ts vào Client Component
src/lib/legacy.ts      redirect URL Haravan cũ
src/sanity/            client, schema, cấu trúc Studio
scripts/seed.ts        đẩy nội dung mặc định lên Sanity
scripts/smoke.mjs      smoke test bản production
```

## Ghi chú

- Hiệu ứng lấy từ bản thiết kế: chữ ANH/TRIS lộ dần, ảnh hero mở từ giữa + parallax, pill điều hướng dạng lò xo,
  sơ đồ "gom nhà cung ứng", thanh tiến trình cuộn, chấm cam bay vào giỏ báo giá, chuyển trang mờ dần (View Transitions).
  Tất cả tắt khi người dùng bật *giảm chuyển động* trong hệ điều hành.
- Site chặn bôi đen/sao chép/chuột phải như bản thiết kế (`CopyGuard` + class `.site`). Muốn bỏ, xoá `<CopyGuard />` trong `src/components/site-chrome.tsx`.
- Khối "Xem trước SEO & GEO" trong bản thiết kế chỉ để duyệt nên không đưa lên site. Phần SEO thật (meta, Open Graph,
  canonical, JSON-LD BlogPosting/FAQPage/BreadcrumbList, sitemap, robots) đã được dựng.
- Nội dung còn là chỗ trống trong thiết kế, cần thay trong Studio: trích lời khách hàng của V-Senses, case study Steak House The Fan,
  ảnh Steak House The Fan và Furama, tên pháp nhân + MST (footer chỉ hiện khi đã nhập), file catalogue PDF, link mạng xã hội.
- Security header (nosniff, Referrer-Policy, X-Frame-Options, Permissions-Policy, HSTS) và giới hạn nguồn ảnh cho image optimizer
  cấu hình trong `next.config.ts`.
- Favicon và icon: `src/app/icon.svg` (vector), `src/app/favicon.ico` (16/32/48), `src/app/apple-icon.png` (iOS),
  `public/icons/*` + `src/app/manifest.ts` (Android). Đổi icon thì thay các file này, giữ nguyên tên.
- Đã kiểm tra hiển thị từ 320px đến 2560px, cả điện thoại xoay ngang và iPad (xem `docs/AUDIT.md`, mục Vòng 2).
