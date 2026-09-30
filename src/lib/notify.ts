import "server-only";
import { siteUrl } from "@/sanity/env";

export type QuoteNotice = {
  name: string;
  company: string;
  phone: string;
  email: string;
  interest: string;
  message: string;
  items: string[];
  submittedAt: string;
};

const config = () => {
  const apiKey = process.env.RESEND_API_KEY;
  const to = (process.env.QUOTE_NOTIFY_TO || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (!apiKey || !to.length) return null;
  return { apiKey, to, from: process.env.QUOTE_NOTIFY_FROM || "Website AnhTris <onboarding@resend.dev>" };
};

/** Đã cấu hình email báo yêu cầu báo giá (RESEND_API_KEY + QUOTE_NOTIFY_TO) chưa. */
export const isQuoteNotifyConfigured = () => config() !== null;

/**
 * Email báo có yêu cầu báo giá mới cho đội kinh doanh (Resend REST API, dạng text thuần).
 * Trả về `true` khi gửi thành công; không bao giờ ném lỗi.
 */
export async function sendQuoteEmail(q: QuoteNotice, documentId: string | null): Promise<boolean> {
  const cfg = config();
  if (!cfg) return false;

  const lines = [
    `Họ tên: ${q.name}`,
    `Đơn vị: ${q.company || "—"}`,
    `Điện thoại: ${q.phone}`,
    `Email: ${q.email || "—"}`,
    `Quan tâm: ${q.interest || "—"}`,
    `Mục đã chọn: ${q.items.length ? q.items.join(", ") : "—"}`,
    "",
    "Nhu cầu:",
    q.message || "—",
    "",
    `Gửi lúc: ${new Date(q.submittedAt).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}`,
    documentId
      ? `Xem trong Studio: ${siteUrl}/studio/intent/edit/id=${encodeURIComponent(documentId)};type=quoteRequest`
      : "Lưu ý: yêu cầu này CHƯA được lưu vào Sanity (lỗi kết nối) — email này là bản duy nhất.",
  ];

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${cfg.apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: cfg.from,
        to: cfg.to,
        subject: `Yêu cầu báo giá mới: ${q.name}${q.company ? ` — ${q.company}` : ""}`,
        text: lines.join("\n"),
        ...(q.email && { reply_to: q.email }),
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      console.error("[quoteRequest] Gửi email báo thất bại", res.status, await res.text().catch(() => ""));
      return false;
    }
    return true;
  } catch (e) {
    console.error("[quoteRequest] Gửi email báo thất bại", e);
    return false;
  }
}
