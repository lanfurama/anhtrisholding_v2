import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({
  ip: "",
  client: null as null | { create: ReturnType<typeof vi.fn> },
  notify: false,
  scheduled: [] as (() => unknown)[],
}));
const sendQuoteEmail = vi.hoisted(() => vi.fn());

vi.mock("next/headers", () => ({ headers: async () => new Headers({ "x-real-ip": state.ip }) }));
vi.mock("next/server", () => ({ after: (fn: () => unknown) => void state.scheduled.push(fn) }));
vi.mock("@/sanity/client", () => ({ getWriteClient: () => state.client }));
vi.mock("@/lib/notify", () => ({ isQuoteNotifyConfigured: () => state.notify, sendQuoteEmail }));

import { submitQuote, type QuoteInput } from "./actions";

const valid = (): QuoteInput => ({
  name: "  Nguyễn Văn A ",
  company: "Khách sạn B",
  phone: "0853 748 898",
  email: "",
  msg: "Cần 200 bộ chén dĩa",
  interest: "Maiahorecare",
  items: ["DUNE", "Napkins"],
});

let n = 0;
beforeEach(() => {
  state.ip = `10.0.0.${++n}`; // mỗi test một IP để giới hạn tần suất không ảnh hưởng nhau
  state.client = { create: vi.fn().mockResolvedValue({ _id: "q1" }) };
  state.notify = false;
  state.scheduled = [];
  sendQuoteEmail.mockReset();
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.spyOn(console, "info").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("submitQuote", () => {
  it("dữ liệu không hợp lệ → trả lỗi từng trường, không lưu", async () => {
    const r = await submitQuote({ ...valid(), phone: "12" });
    expect(r).toEqual({ ok: false, errors: { phone: "Số điện thoại chưa hợp lệ" } });
    expect(state.client!.create).not.toHaveBeenCalled();
  });

  it("đầu vào rác không làm sập action", async () => {
    const r = await submitQuote(null as unknown as QuoteInput);
    expect(r.ok).toBe(false);
  });

  it("bot điền ô bẫy → giả vờ thành công, không lưu", async () => {
    expect(await submitQuote({ ...valid(), website: "http://spam" })).toEqual({ ok: true });
    expect(state.client!.create).not.toHaveBeenCalled();
  });

  it("lưu vào Sanity, email được hẹn gửi sau khi trả kết quả", async () => {
    state.notify = true;
    expect(await submitQuote(valid())).toEqual({ ok: true });

    const doc = state.client!.create.mock.calls[0][0];
    expect(doc).toMatchObject({ _type: "quoteRequest", status: "new", name: "Nguyễn Văn A", items: ["DUNE", "Napkins"], message: "Cần 200 bộ chén dĩa" });
    expect(sendQuoteEmail).not.toHaveBeenCalled();
    expect(state.scheduled).toHaveLength(1);
    await state.scheduled[0]();
    expect(sendQuoteEmail).toHaveBeenCalledWith(doc, "q1");
  });

  it("Sanity lỗi → email là kênh dự phòng, gửi được mới báo thành công", async () => {
    state.client!.create.mockRejectedValue(new Error("Sanity down"));
    state.notify = true;
    sendQuoteEmail.mockResolvedValueOnce(true);
    expect(await submitQuote(valid())).toEqual({ ok: true });
    expect(sendQuoteEmail).toHaveBeenCalledWith(expect.objectContaining({ phone: "0853 748 898" }), null);

    sendQuoteEmail.mockResolvedValueOnce(false);
    expect((await submitQuote(valid())).ok).toBe(false);
  });

  it("Sanity lỗi và không có email → báo lỗi để khách gọi hotline", async () => {
    state.client!.create.mockRejectedValue(new Error("Sanity down"));
    const r = await submitQuote(valid());
    expect(r).toEqual({ ok: false, errors: { form: expect.stringContaining("hotline") } });
  });

  it("chưa cấu hình nơi lưu: production báo lỗi, dev chỉ ghi log", async () => {
    state.client = null;
    vi.stubEnv("NODE_ENV", "production");
    expect((await submitQuote(valid())).ok).toBe(false);
    vi.stubEnv("NODE_ENV", "development");
    expect((await submitQuote(valid())).ok).toBe(true);
  });

  it("chặn quá 5 yêu cầu / 10 phút từ cùng một IP", async () => {
    for (let i = 0; i < 5; i++) expect((await submitQuote(valid())).ok).toBe(true);
    const r = await submitQuote(valid());
    expect(r).toEqual({ ok: false, errors: { form: expect.stringContaining("nhiều yêu cầu") } });
    expect(state.client!.create).toHaveBeenCalledTimes(5);
  });
});
