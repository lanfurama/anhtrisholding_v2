import { describe, expect, it } from "vitest";
import { createRateLimiter } from "./rate-limit";

describe("createRateLimiter", () => {
  it("cho phép tối đa `limit` lần trong cửa sổ, sau đó chặn", () => {
    const allow = createRateLimiter({ limit: 3, windowMs: 1000 });
    expect([allow("ip", 0), allow("ip", 10), allow("ip", 20), allow("ip", 30)]).toEqual([true, true, true, false]);
  });

  it("mở lại khi các lần cũ trôi khỏi cửa sổ", () => {
    const allow = createRateLimiter({ limit: 2, windowMs: 1000 });
    allow("ip", 0);
    allow("ip", 500);
    expect(allow("ip", 900)).toBe(false);
    expect(allow("ip", 1001)).toBe(true);
  });

  it("đếm riêng từng key", () => {
    const allow = createRateLimiter({ limit: 1, windowMs: 1000 });
    expect(allow("a", 0)).toBe(true);
    expect(allow("b", 0)).toBe(true);
    expect(allow("a", 1)).toBe(false);
  });

  it("không giữ quá maxKeys key", () => {
    const allow = createRateLimiter({ limit: 1, windowMs: 1000, maxKeys: 10 });
    for (let i = 0; i < 50; i++) allow(`ip-${i}`, 0);
    // key cũ nhất đã bị bỏ nên được phép lại; key mới nhất vẫn bị chặn
    expect(allow("ip-0", 1)).toBe(true);
    expect(allow("ip-49", 1)).toBe(false);
  });
});
