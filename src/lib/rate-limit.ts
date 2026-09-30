/**
 * Giới hạn tần suất kiểu "cửa sổ trượt", lưu trong bộ nhớ của từng instance server.
 * Đủ để chặn spam đơn giản vào form; không thay cho giới hạn ở tầng hạ tầng (WAF/CDN) khi chạy nhiều instance.
 */
export function createRateLimiter({ limit, windowMs, maxKeys = 5000 }: { limit: number; windowMs: number; maxKeys?: number }) {
  const hits = new Map<string, number[]>();

  return function allow(key: string, now = Date.now()): boolean {
    const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
    const ok = recent.length < limit;
    if (ok) recent.push(now);
    hits.set(key, recent);

    // Dọn các key đã hết hạn để Map không phình mãi; vẫn quá tải thì bỏ các key cũ nhất
    if (hits.size > maxKeys) {
      for (const [k, times] of hits) if (!times.some((t) => now - t < windowMs)) hits.delete(k);
      for (const k of hits.keys()) {
        if (hits.size <= maxKeys) break;
        hits.delete(k);
      }
    }
    return ok;
  };
}
