"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Faq } from "@/lib/types";
import { reducedMotion } from "../providers";
import h from "./home.module.css";

/** Ô danh mục có vệt sáng đi theo con trỏ. */
export function SpotlightLink({ href, className, children }: { href: string; className?: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className={className}
      onMouseMove={(e) => {
        const el = e.currentTarget;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", e.clientX - r.left + "px");
        el.style.setProperty("--my", e.clientY - r.top + "px");
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.setProperty("--mx", "-400px");
        e.currentTarget.style.setProperty("--my", "-400px");
      }}
    >
      <span className={h.spot} aria-hidden="true" />
      {children}
    </Link>
  );
}

/** Đường tiến trình của các bước — chạy theo vị trí cuộn. */
export function ProcessLine() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    const parent = el?.parentElement;
    if (!el || !parent) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = parent.getBoundingClientRect();
      const p = reducedMotion() ? 1 : Math.min(1, Math.max(0, (innerHeight * 0.85 - r.top) / (r.height + innerHeight * 0.3)));
      el.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  return <div ref={ref} className={h.lineFill} aria-hidden="true" />;
}

export function FaqList({ items }: { items: Faq[] }) {
  const [open, setOpen] = useState(0);
  return (
    <div className={h.faqList}>
      {items.map((q, i) => {
        const on = open === i;
        return (
          <div key={q.question} className={h.faqItem}>
            <button
              type="button"
              className={h.faqQ}
              aria-expanded={on}
              aria-controls={`faq-a-${i}`}
              id={`faq-q-${i}`}
              onClick={() => setOpen(on ? -1 : i)}
            >
              {q.question}
              <span className={h.faqIcon} data-open={on ? "1" : undefined} aria-hidden="true">
                {on ? "−" : "+"}
              </span>
            </button>
            <p id={`faq-a-${i}`} role="region" aria-labelledby={`faq-q-${i}`} className={h.faqA} hidden={!on}>
              {q.answer}
            </p>
          </div>
        );
      })}
    </div>
  );
}
