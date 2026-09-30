"use server";

import { validateQuote, type QuoteErrors, type QuoteFields } from "@/lib/quote";
import { getWriteClient } from "@/sanity/client";

export type QuoteInput = QuoteFields & { interest: string; items: string[]; website?: string };
export type QuoteResult = { ok: true } | { ok: false; errors: QuoteErrors };

const cut = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function submitQuote(input: QuoteInput): Promise<QuoteResult> {
  const f: QuoteFields = {
    name: cut(input.name, 120),
    company: cut(input.company, 160),
    phone: cut(input.phone, 20),
    email: cut(input.email, 160),
    msg: cut(input.msg, 3000),
  };
  const errors = validateQuote(f);
  if (Object.keys(errors).length) return { ok: false, errors };

  // Honeypot: bot điền vào ô ẩn → giả vờ thành công, không lưu
  if (input.website) return { ok: true };

  const doc = {
    _type: "quoteRequest",
    status: "new",
    name: f.name,
    company: f.company,
    phone: f.phone,
    email: f.email,
    message: f.msg,
    interest: cut(input.interest, 60),
    items: (Array.isArray(input.items) ? input.items : []).slice(0, 50).map((x) => cut(x, 120)).filter(Boolean),
    submittedAt: new Date().toISOString(),
  };

  const client = getWriteClient();
  if (!client) {
    if (process.env.NODE_ENV === "production") {
      console.error("[quoteRequest] Thiếu NEXT_PUBLIC_SANITY_PROJECT_ID hoặc SANITY_API_WRITE_TOKEN — yêu cầu không được lưu.");
      return { ok: false, errors: { form: "Chưa gửi được yêu cầu. Vui lòng gọi hotline để được hỗ trợ ngay." } };
    }
    console.info("[quoteRequest] (dev — chưa cấu hình Sanity, không lưu)", doc);
    return { ok: true };
  }

  try {
    await client.create(doc);
    return { ok: true };
  } catch (e) {
    console.error("[quoteRequest] Lưu vào Sanity thất bại", e);
    return { ok: false, errors: { form: "Chưa gửi được yêu cầu — vui lòng thử lại hoặc gọi hotline." } };
  }
}
