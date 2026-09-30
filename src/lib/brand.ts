/**
 * Hằng số thương hiệu dùng được ở cả server lẫn client.
 * Đừng import `fallback.ts` vào Client Component — nó kéo theo toàn bộ nội dung mặc định vào bundle JS.
 */
export const SITE_NAME = "AnhTris Holdings";
/** Hotline mặc định (khi CMS chưa nhập, và cho trang lỗi toàn cục không đọc được CMS). */
export const DEFAULT_PHONE = "0853 748 898";
export const DEFAULT_PHONE_E164 = "+84853748898";

/** Mã cửa hàng trên CDN của site Haravan cũ (next.config.ts chỉ cho tối ưu ảnh trong phạm vi này). */
export const HARAVAN_STORE_ID = "200001050639";
export const HSTATIC_THEME = `https://cdn.hstatic.net/themes/${HARAVAN_STORE_ID}/1001402692/14/`;

/** Logo mặc định khi "Thông tin chung" trên Sanity chưa có logo. */
export const LOGO_URL = HSTATIC_THEME + "logo.png";
