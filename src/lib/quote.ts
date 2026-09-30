export type QuoteFields = { name: string; company: string; phone: string; email: string; msg: string };
export type QuoteErrors = Partial<Record<"name" | "phone" | "email" | "form", string>>;

/** Quy tắc kiểm tra giống bản thiết kế — dùng chung cho client và Server Action. */
export function validateQuote(f: QuoteFields): QuoteErrors {
  const err: QuoteErrors = {};
  if (!f.name.trim()) err.name = "Vui lòng nhập họ tên";
  if (!/^[0-9 +.]{9,14}$/.test(f.phone.trim())) err.phone = "Số điện thoại chưa hợp lệ";
  if (f.email && !/^\S+@\S+\.\S+$/.test(f.email.trim())) err.email = "Email chưa hợp lệ";
  return err;
}
