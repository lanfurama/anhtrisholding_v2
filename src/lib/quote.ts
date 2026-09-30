export type QuoteFields = { name: string; company: string; phone: string; email: string; msg: string };
export type QuoteErrors = Partial<Record<"name" | "phone" | "email" | "form", string>>;

/**
 * Chấp nhận cách viết thường gặp: "0853 748 898", "0853.748.898", "+84 853-748-898", "(0236) 3812 345".
 * Bỏ khoảng trắng, chấm, gạch, ngoặc rồi yêu cầu 9–15 chữ số (có thể có dấu + ở đầu).
 */
export function isValidPhone(raw: string) {
  const compact = raw.trim().replace(/[\s().-]/g, "");
  return /^\+?\d{9,15}$/.test(compact);
}

/** Quy tắc kiểm tra giống bản thiết kế — dùng chung cho client và Server Action. */
export function validateQuote(f: QuoteFields): QuoteErrors {
  const err: QuoteErrors = {};
  if (!f.name.trim()) err.name = "Vui lòng nhập họ tên";
  if (!isValidPhone(f.phone)) err.phone = "Số điện thoại chưa hợp lệ";
  if (f.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) err.email = "Email chưa hợp lệ";
  return err;
}
