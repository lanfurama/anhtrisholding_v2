# Audit & kế hoạch hoàn thiện — website AnhTris v2

Ngày audit: 30.09.2026 · Phạm vi: toàn bộ repo (Next.js 16.3 App Router + Sanity 6, Studio nhúng tại `/studio`).

## Cách audit

- Đọc toàn bộ mã nguồn (`src/`, `scripts/`, cấu hình) và đối chiếu với tài liệu Next.js 16 trong `node_modules/next/dist/docs/`.
- Chạy `lint`, `typecheck`, `build`, `next start` rồi gọi thử mọi route (status, header, metadata).
- Chụp màn hình mọi trang ở 1440px và 390px bằng Chromium, kiểm tra tràn ngang, `alt`, lỗi console.
- Kiểm tra bundle JS phía client và `npm audit`.

**Hiện trạng ban đầu:** lint, typecheck, build đều sạch; giao diện render đúng ở desktop và mobile, không tràn ngang, ảnh đều có `alt`.
Vấn đề nằm ở độ bền dữ liệu, chống spam form, cache Sanity, SEO khi chuyển từ Haravan, dung lượng JS, và chưa có test/CI.

Mức độ: **Cao** = ảnh hưởng người dùng/SEO/chi phí ngay · **TB** = nên sửa trước khi chạy thật · **Thấp** = cải thiện.

## Phát hiện & hành động

Trạng thái: ✅ đã làm · ➖ không làm (có lý do)

### Backend (Sanity, Server Action)

| # | Mức | Phát hiện | Hành động | TT |
| --- | --- | --- | --- | --- |
| B1 | Cao | Client đọc dùng `useCdn: true` cùng revalidate theo tag: sau webhook, lần tải lại có thể lấy bản cũ từ API CDN của Sanity và cache tiếp. | `useCdn: false` (khuyến nghị của next-sanity khi dùng ISR/tag). Revalidate dự phòng 60 giây, hoặc 1 giờ khi đã cấu hình webhook để tiết kiệm quota API. | ✅ |
| B2 | Cao | Form báo giá không giới hạn tần suất; chỉ có honeypot. Bot có thể tạo hàng loạt document trong Sanity. | Giới hạn 5 yêu cầu / 10 phút / IP; kiểm tra kiểu dữ liệu đầu vào. | ✅ |
| B3 | TB | Kiểm tra số điện thoại từ chối số hợp lệ: `+84 853 748 898` (quá 14 ký tự), `0853-748-898`, `(0236) 3812 345`. | Chấp nhận khoảng trắng, chấm, gạch, ngoặc; đếm 9–15 chữ số. | ✅ |
| B4 | TB | Có yêu cầu báo giá mới nhưng không ai được báo, phải tự mở Studio kiểm tra. | Email báo qua Resend (tuỳ chọn, bật bằng env), gửi sau khi trả kết quả (`after()`). Nếu lưu Sanity lỗi thì email là kênh dự phòng. | ✅ |
| B5 | TB | Dữ liệu CMS thiếu có thể làm lỗi trang: reference hỏng trong "Dự án tiêu biểu" (`null` → crash), nhãn hero không có tiêu đề (`.charAt` trên `null`), bài viết thiếu ngày đăng. | Lọc phần tử rỗng ngay trong GROQ và trong code, thêm điều kiện hiển thị. | ✅ |
| B6 | Thấp | Module chứa write token không được đánh dấu chỉ-server. | `import "server-only"` trong `src/sanity/client.ts`. | ✅ |
| B7 | Thấp | Studio: yêu cầu báo giá không có mục "Mới", không có ghi chú nội bộ, đổi trạng thái phải bấm Publish, có thể tạo tay; link nút (CTA) và email/hotline không được kiểm tra định dạng. | `liveEdit`, danh sách theo trạng thái, trường ghi chú, ẩn khỏi menu Tạo mới, validation cho link/email/hotline. | ✅ |
| B8 | Thấp | Webhook revalidate chạy cả khi có yêu cầu báo giá mới (không có trang nào cần làm mới). | Bỏ qua `quoteRequest`; README hướng dẫn lọc ngay trong webhook. | ✅ |

### SEO

| # | Mức | Phát hiện | Hành động | TT |
| --- | --- | --- | --- | --- |
| S1 | Cao | Logo header, ảnh chia sẻ (OG) và logo JSON-LD trỏ thẳng CDN Haravan (`cdn.hstatic.net`) — sẽ vỡ khi đóng cửa hàng Haravan. Ảnh OG mặc định là logo nhỏ, hiển thị xấu khi chia sẻ. | Thêm Logo, Ảnh chia sẻ mặc định, Mạng xã hội vào "Thông tin chung"; `npm run seed` tải ảnh lên Sanity; OG mặc định dùng ảnh chia sẻ 1200×630; JSON-LD có `sameAs`. | ✅ |
| S2 | TB | URL cũ của Haravan (`/collections/<handle>`, `/products/<handle>`, `/blogs/news/tagged/…`, `/cart`, `/search`…) sẽ 404 → mất thứ hạng và backlink. | Redirect 308: danh mục → bộ lọc tương ứng, sản phẩm → danh mục của sản phẩm, còn lại → trang gần nhất. | ✅ |
| S3 | TB | Trang 404 của bài viết có hai thẻ robots mâu thuẫn (`noindex` và `index, follow`) và dùng title trang chủ. | Metadata riêng: `noindex` + title "Không tìm thấy bài viết". | ✅ |
| S4 | Thấp | `dateModified` (JSON-LD, Open Graph) và `lastModified` (sitemap) đều lấy ngày đăng. | Dùng `_updatedAt` của Sanity. | ✅ |
| S5 | Thấp | "Cẩm nang HORECA" không có link ở header/footer — chỉ vào được từ trang chủ. | Thêm link ở footer (cột Khám phá). | ✅ |
| S6 | Thấp | Chưa có chỗ gắn Google Analytics / xác minh Google Search Console. | Tuỳ chọn qua `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`. | ✅ |

### Frontend

| # | Mức | Phát hiện | Hành động | TT |
| --- | --- | --- | --- | --- |
| F1 | Cao | Header (tải ở mọi trang) import `LOGO_URL` từ `fallback.ts` nên toàn bộ nội dung mặc định (~25 KB bài viết, sản phẩm) bị đóng vào JS phía client. | Tách hằng số ra `src/lib/brand.ts`, logo truyền qua props từ server. | ✅ |
| F2 | TB | Không có `error.tsx` / `global-error.tsx`: lỗi khi render (ví dụ Sanity gián đoạn) hiện trang lỗi mặc định của Next, không header/footer. | Trang lỗi theo nhận diện, nút "Thử lại". | ✅ |
| F3 | TB | 404 toàn cục (URL không khớp route) không có header/footer — người vào từ link cũ không có đường điều hướng. | Dùng chung khung site (header, footer, giỏ báo giá). | ✅ |
| F4 | Thấp | Giỏ báo giá không đồng bộ giữa các tab. | Lắng nghe sự kiện `storage`. | ✅ |
| F5 | Thấp | Gửi form lỗi nhưng focus không chuyển tới ô lỗi (khó dùng với bàn phím/trình đọc màn hình). | Focus ô lỗi đầu tiên. | ✅ |
| F6 | Thấp | Key React dựa trên nội dung (tiêu đề mục, dịch vụ) — trùng tiêu đề sẽ lỗi render danh sách. | Key theo vị trí. | ✅ |

### Hạ tầng & chất lượng

| # | Mức | Phát hiện | Hành động | TT |
| --- | --- | --- | --- | --- |
| H1 | TB | Không có security header; lộ `X-Powered-By: Next.js`. | `nosniff`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`, HSTS; tắt `poweredByHeader`. | ✅ |
| H2 | TB | Image optimizer cho phép mọi ảnh trên `cdn.sanity.io` và `hstatic.net` (kể cả của project khác) → có thể bị dùng làm proxy ảnh miễn phí. | Giới hạn theo project/dataset Sanity và mã cửa hàng Haravan. | ✅ |
| H3 | TB | Chưa có test và CI. | Vitest cho logic thuần, smoke test chạy `next start` kiểm tra route/status/header, GitHub Actions. | ✅ |
| H4 | Thấp | `npm audit`: 16 lỗ hổng (4 high) đều nằm trong tooling CLI của Sanity (`adm-zip`, `undici`, `js-yaml`…), không nằm trên đường chạy của website. `npm audit fix --force` sẽ hạ Sanity xuống v5. | ➖ Không ép bản vá; theo dõi bản cập nhật của Sanity. Next 16.3.7, Sanity 6.17, next-sanity 13.3.4 đều là bản mới nhất. | ➖ |
| H5 | Thấp | 404 của slug bài viết lạ: HTML từ server rỗng, nội dung 404 do client render (hành vi của Next với trang ISR). Status 404 vẫn đúng. | ➖ Giữ nguyên, đã kiểm tra hiển thị đúng khi có JS. | ➖ |

## Kết quả kiểm chứng (30.09.2026)

- `npm run lint`, `npm run typecheck`: sạch.
- `npm test` (Vitest): 52 test — kiểm tra form/số điện thoại, giới hạn tần suất, Server Action (lưu Sanity, email dự phòng,
  honeypot, chặn spam), email Resend, redirect URL cũ, tính toàn vẹn nội dung mặc định (slug, tham chiếu, giới hạn SEO, alt ảnh).
- `npm run build` + `npm run smoke`: 41 kiểm tra trên bản production — status các trang, 404 có `noindex` và header/footer,
  redirect 308, security header, JSON-LD, nội dung mặc định không còn trong JS client.
- Trình duyệt (Chromium, 1440px/390px): form đưa focus tới ô lỗi, nhận `+84 853 748 898`; giỏ báo giá đồng bộ giữa hai tab;
  không lỗi JS.
- CI: `.github/workflows/ci.yml` chạy lint → typecheck → test → build → smoke cho mỗi push lên `main` và mỗi PR.

## Vòng 2 — favicon, UX/UI, responsive (30.09.2026)

Cách kiểm tra: đo tự động 8 trang × 13 kích thước màn hình (320×568, 360×740, 390×844, 430×932, 844×390 xoay ngang,
768×1024, 820×1180, 960×600, 1024×768, 1280×800, 1440×900, 1920×1080, 2560×1440) — tràn ngang, phần tử lọt khỏi màn hình,
vùng chạm, cỡ chữ ô nhập (iOS tự zoom khi < 16px), lỗi JS; thêm kiểm tra cuộn từng bước cho thẻ sticky và thao tác chạm thật.

| # | Mức | Phát hiện | Hành động | TT |
| --- | --- | --- | --- | --- |
| U1 | Cao | Favicon vẫn là icon mặc định của Next.js/Vercel; không có icon cho iOS/Android, không có web manifest. | Icon "AT" dựng từ font Geist của site (A trắng, T cam, nền tím): `icon.svg`, `favicon.ico` 16/32/48, `apple-icon.png` 180, icon 192/512 + maskable, `manifest.webmanifest`. | ✅ |
| U2 | Cao | Trang Hệ sinh thái trên điện thoại (360–390px, và khi xoay ngang): thẻ thành viên dính (sticky) cao hơn màn hình nên thẻ sau che mất danh sách dịch vụ và nút CTA của thẻ trước — không bao giờ bấm được. | Chỉ xếp chồng khi màn hình đủ cao (≥1024×700 hoặc ≥768×900); vị trí xếp chồng chuyển sang biến CSS. Đã kiểm tra: mọi nút CTA bấm được ở mọi kích thước. | ✅ |
| U3 | Cao | Chữ "ANHTRIS" ở hero bị cắt mất chữ S trên màn hình 320–380px (gồm 360px — độ rộng Android phổ biến nhất): cỡ chữ tối thiểu 84px rộng hơn màn hình. | Giới hạn cỡ chữ theo bề ngang khả dụng (đơn vị container `cqi`, có dòng dự phòng); từ 390px trở lên giữ nguyên như thiết kế. | ✅ |
| U4 | TB | Menu mobile khi xoay ngang: nút "Gọi hotline" bị flexbox ép còn 21px, chữ menu 44px chỉ thấy được 3 mục. | Không cho mục menu co lại; màn hình thấp dùng chữ 28px — thấy đủ 5 mục. | ✅ |
| U5 | TB | Khối "gom nhà cung ứng" chọn kiểu tương tác theo độ rộng (≥960px = rê chuột): iPad ngang / laptop cảm ứng chạm không phản hồi. | Chọn theo khả năng hover của thiết bị (`hover: hover` + `pointer: fine`). | ✅ |
| U6 | TB | 836–1100px (iPad ngang): cột phải có 2 nút xuống dòng nên tiêu đề hero (canh đáy) bị đẩy xuống, lệch với đoạn giới thiệu. | Canh trên ở khoảng này; màn lớn giữ canh đáy như thiết kế. | ✅ |
| U7 | TB | Vùng chạm nhỏ: link footer cao 18px, breadcrumb 16px, link "Xem tất cả →" 21px, email ở trang Liên hệ 19px. | Nới vùng chạm lên 28–33px bằng padding + margin âm (bố cục không đổi). | ✅ |
| U8 | Thấp | Nhảy tới `#anchor` (vd. mục trong bài viết) bị header cố định che tiêu đề. | `scroll-margin-top` cho mọi phần tử có `id`. | ✅ |
| U9 | Thấp | Hiệu ứng phóng ảnh khi hover bị "kẹt" trên màn hình cảm ứng sau khi chạm. | Chỉ áp dụng khi thiết bị có hover. | ✅ |
| U10 | Thấp | Trình duyệt ở chế độ tối có thể tự "làm tối" trang; chạm vào link hiện ô xám mặc định. | `color-scheme: only light`; màu nhấn khi chạm theo tông tím. | ✅ |
| U11 | Thấp | Gửi form thành công: form biến mất, focus bị mất; bộ lọc sản phẩm khai báo `toolbar` nhưng không điều hướng bằng phím mũi tên. | Focus chuyển tới thông báo đã gửi; bộ lọc dùng `role="group"`. | ✅ |

Kết quả: 104 tổ hợp trang × màn hình không tràn ngang, không có phần tử lọt khỏi màn hình, không lỗi JS; ô nhập đều ≥16px;
vùng chạm đều ≥24px (còn lại duy nhất ô bẫy spam ẩn). Smoke test kiểm tra thêm favicon, icon và manifest.

## Đề xuất tiếp theo

- Content-Security-Policy (cần whitelist cho Studio, GA4, JSON-LD inline) — nên làm khi đã chốt các dịch vụ bên thứ ba.
- Dùng loader ảnh của Sanity (resize trên CDN Sanity) thay cho image optimizer của Next để giảm chi phí khi lưu lượng lớn.
- Sanity TypeGen để kiểm tra kiểu kết quả GROQ thay cho type viết tay trong `src/lib/types.ts`.
- Test E2E (Playwright) cho luồng chọn sản phẩm → gửi báo giá, chạy trên môi trường preview có Sanity thật.

## Cần khách hàng bổ sung (không sửa bằng code)

Đang là chữ/ảnh mẫu từ bản thiết kế — thay trong Studio trước khi chạy thật:

- Trích lời khách hàng V-Senses (đang hiện "Trích lời khách hàng — tên, chức danh").
- Tóm tắt case study Steak House The Fan (đang là câu hướng dẫn), ảnh Steak House The Fan và Furama.
- Tên pháp nhân + MST (footer chỉ hiện khi đã nhập), file catalogue PDF.
- Mới: link mạng xã hội, ảnh chia sẻ 1200×630 (nếu muốn khác ảnh mặc định).
- Danh sách URL cũ có traffic (Google Search Console → Trang) để bổ sung redirect nếu handle khác slug mới.

## Việc cấu hình khi triển khai

Xem README: biến môi trường Sanity, webhook revalidate, token ghi, email Resend (tuỳ chọn), GA4/Search Console (tuỳ chọn), rồi chạy `npm run seed` một lần.
