"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import styles from "./providers.module.css";

export type QuoteItem = { id: string; name: string };

type SiteCtx = {
  quote: QuoteItem[];
  inQuote: (id: string) => boolean;
  /** Thêm/bỏ một mục; truyền toạ độ click để chạy hiệu ứng bay vào nút báo giá. */
  toggleQuote: (item: QuoteItem, from?: { x: number; y: number }) => void;
  clearQuote: () => void;
  flash: (text: string) => void;
};

const Ctx = createContext<SiteCtx | null>(null);
const STORAGE_KEY = "anhtris_quote";

export const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function readSaved(): QuoteItem[] {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved.filter((q) => q && typeof q.id === "string" && typeof q.name === "string") : [];
  } catch {
    return [];
  }
}

export function SiteProviders({ children }: { children: ReactNode }) {
  const [quote, setQuoteState] = useState<QuoteItem[]>([]);
  const [toast, setToast] = useState<{ text: string; id: number } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Khôi phục giỏ báo giá sau hydrate (localStorage không có ở server).
  useEffect(() => {
    const saved = readSaved();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved.length) setQuoteState(saved);
  }, []);

  const setQuote = useCallback((q: QuoteItem[]) => {
    setQuoteState(q);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(q));
    } catch {}
  }, []);

  const flash = useCallback((text: string) => {
    clearTimeout(toastTimer.current);
    setToast({ text, id: Date.now() });
    toastTimer.current = setTimeout(() => setToast(null), 2400);
  }, []);

  const toggleQuote = useCallback(
    (item: QuoteItem, from?: { x: number; y: number }) => {
      const has = quote.some((x) => x.id === item.id);
      setQuote(has ? quote.filter((x) => x.id !== item.id) : [...quote, item]);
      if (has) return;
      if (from && !reducedMotion()) flyToBadge(from.x, from.y);
      flash("Đã thêm “" + item.name + "” vào báo giá");
    },
    [quote, setQuote, flash],
  );

  const value = useMemo<SiteCtx>(
    () => ({
      quote,
      inQuote: (id) => quote.some((q) => q.id === id),
      toggleQuote,
      clearQuote: () => setQuote([]),
      flash,
    }),
    [quote, toggleQuote, setQuote, flash],
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      {toast && (
        <div key={toast.id} className={styles.toast} role="status">
          {toast.text}
        </div>
      )}
    </Ctx.Provider>
  );
}

export function useSite() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSite must be used inside <SiteProviders>");
  return ctx;
}

/** Chấm cam bay từ điểm click tới badge của nút "Yêu cầu báo giá". */
function flyToBadge(x: number, y: number) {
  const target = document.querySelector<HTMLElement>("[data-quote-badge]") || document.querySelector<HTMLElement>("[data-quote-btn]");
  if (!target) return;
  const b = target.getBoundingClientRect();
  const tx = b.left + b.width / 2 - x;
  const ty = b.top + b.height / 2 - y;
  const dot = document.createElement("div");
  dot.className = styles.flyDot;
  dot.style.left = x + "px";
  dot.style.top = y + "px";
  document.body.appendChild(dot);
  dot.animate(
    [
      { transform: "translate(0,0) scale(1)" },
      { transform: `translate(${tx * 0.5}px,${ty * 0.5 - 140}px) scale(1.3)`, offset: 0.5 },
      { transform: `translate(${tx}px,${ty}px) scale(.5)` },
    ],
    { duration: 750, easing: "cubic-bezier(.5,0,.3,1)", fill: "forwards" },
  ).onfinish = () => {
    dot.remove();
    // Badge có thể vừa xuất hiện (mục đầu tiên) → tìm lại
    const t = document.querySelector<HTMLElement>("[data-quote-badge]") || target;
    t.animate([{ transform: "scale(1)" }, { transform: t.dataset.quoteBadge ? "scale(1.6)" : "scale(1.06)" }, { transform: "scale(1)" }], {
      duration: 480,
      easing: "cubic-bezier(.16,1,.3,1)",
    });
  };
}
