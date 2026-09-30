import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { isQuoteNotifyConfigured, sendQuoteEmail } from "./notify";

const quote = {
  name: "Nguyễn Văn A",
  company: "Khách sạn B",
  phone: "0853 748 898",
  email: "a@khachsanb.vn",
  interest: "Maiahorecare",
  message: "Cần 200 bộ chén dĩa cho nhà hàng mới",
  items: ["DUNE", "Napkins"],
  submittedAt: "2026-09-30T03:00:00.000Z",
};

describe("sendQuoteEmail", () => {
  beforeEach(() => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("QUOTE_NOTIFY_TO", "sales@anhtrisholdings.com, giamdoc@anhtrisholdings.com");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("không gửi khi thiếu cấu hình", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    expect(isQuoteNotifyConfigured()).toBe(false);
    expect(await sendQuoteEmail(quote, "abc123")).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("gửi tới nhiều người nhận, trả lời thẳng cho khách, có link mở trong Studio", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    expect(await sendQuoteEmail(quote, "abc123")).toBe(true);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.resend.com/emails");
    expect(init.headers.Authorization).toBe("Bearer re_test");
    const body = JSON.parse(init.body);
    expect(body.to).toEqual(["sales@anhtrisholdings.com", "giamdoc@anhtrisholdings.com"]);
    expect(body.reply_to).toBe("a@khachsanb.vn");
    expect(body.subject).toBe("Yêu cầu báo giá mới: Nguyễn Văn A — Khách sạn B");
    expect(body.text).toContain("Mục đã chọn: DUNE, Napkins");
    expect(body.text).toContain("/studio/intent/edit/id=abc123;type=quoteRequest");
  });

  it("ghi rõ khi yêu cầu chưa được lưu vào Sanity", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    await sendQuoteEmail({ ...quote, email: "" }, null);
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.text).toContain("CHƯA được lưu vào Sanity");
    expect(body).not.toHaveProperty("reply_to");
  });

  it("trả false (không ném lỗi) khi Resend từ chối hoặc mất mạng", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("invalid from", { status: 422 })));
    expect(await sendQuoteEmail(quote, "abc123")).toBe(false);
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network down")));
    expect(await sendQuoteEmail(quote, "abc123")).toBe(false);
  });
});
