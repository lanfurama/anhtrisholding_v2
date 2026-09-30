"use server";

import { headers } from "next/headers";
import { after } from "next/server";
import { isQuoteNotifyConfigured, sendQuoteEmail } from "@/lib/notify";
import { validateQuote, type QuoteErrors, type QuoteFields } from "@/lib/quote";
import { createRateLimiter } from "@/lib/rate-limit";
import { getWriteClient } from "@/sanity/client";

export type QuoteInput = QuoteFields & { interest: string; items: string[]; website?: string };
export type QuoteResult = { ok: true } | { ok: false; errors: QuoteErrors };

const cut = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const fail = (form: string): QuoteResult => ({ ok: false, errors: { form } });

// 5 yêu cầu / 10 phút cho mỗi IP — đủ rộng cho người thật, chặn được spam gửi dồn dập.
const allowQuote = createRateLimiter({ limit: 5, windowMs: 10 * 60_000 });

async function clientIp() {
  const h = await headers();
  return h.get("x-real-ip") || h.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

export async function submitQuote(raw: QuoteInput): Promise<QuoteResult> {
  const input: Partial<QuoteInput> = raw && typeof raw === "object" ? raw : {};
  const f: QuoteFields = {
    name: cut(input.name, 120),
    company: cut(input.company, 160),
    phone: cut(input.phone, 24),
    email: cut(input.email, 160),
    msg: cut(input.msg, 3000),
  };
  const errors = validateQuote(f);
  if (Object.keys(errors).length) return { ok: false, errors };

  // Honeypot: bot điền vào ô ẩn → giả vờ thành công, không lưu
  if (input.website) return { ok: true };

  if (!allowQuote(await clientIp())) {
    return fail("Bạn đã gửi nhiều yêu cầu liên tiếp. Vui lòng thử lại sau ít phút hoặc gọi hotline.");
  }

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
  const notify = isQuoteNotifyConfigured();

  if (!client && !notify) {
    if (process.env.NODE_ENV === "production") {
      console.error("[quoteRequest] Thiếu SANITY_API_WRITE_TOKEN (hoặc email báo) — yêu cầu không được lưu.");
      return fail("Chưa gửi được yêu cầu. Vui lòng gọi hotline để được hỗ trợ ngay.");
    }
    console.info("[quoteRequest] (dev — chưa cấu hình Sanity, không lưu)", doc);
    return { ok: true };
  }

  let id: string | null = null;
  if (client) {
    try {
      id = (await client.create(doc))._id;
    } catch (e) {
      console.error("[quoteRequest] Lưu vào Sanity thất bại", e);
    }
  }

  if (id) {
    // Email gửi sau khi đã trả kết quả cho khách — không làm chậm form
    const documentId = id;
    if (notify) after(() => sendQuoteEmail(doc, documentId));
    return { ok: true };
  }

  // Không lưu được vào Sanity: email là bản ghi duy nhất nên phải gửi xong mới báo thành công
  if (notify && (await sendQuoteEmail(doc, null))) return { ok: true };
  return fail("Chưa gửi được yêu cầu — vui lòng thử lại hoặc gọi hotline.");
}
