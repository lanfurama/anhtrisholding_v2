"use client";

import { useEffect, useState } from "react";
import { useSite } from "../providers";
import a from "./article.module.css";

/** Mục lục: làm nổi mục đang đọc, bấm để cuộn mượt tới mục. */
export function Toc({ headings }: { headings: string[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      let k = 0;
      document.querySelectorAll("[data-sec]").forEach((el, i) => {
        if (el.getBoundingClientRect().top < 180) k = i;
      });
      setActive(k);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    return () => {
      removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const go = (i: number) => {
    const el = document.getElementById(`sec-${i}`);
    if (!el) return;
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    scrollTo({ top: el.getBoundingClientRect().top + scrollY - 104, behavior: smooth ? "smooth" : "auto" });
    history.replaceState(null, "", `#sec-${i}`);
  };

  return (
    <nav aria-label="Mục lục" className={a.toc}>
      <span className={a.asideLabel}>Mục lục</span>
      {headings.map((h, i) => (
        <button key={h} type="button" className={a.tocItem} aria-current={active === i ? "location" : undefined} onClick={() => go(i)}>
          <span className={a.tocNum}>{String(i + 1).padStart(2, "0")}</span>
          <span>{h}</span>
        </button>
      ))}
    </nav>
  );
}

export function ShareButtons({ url }: { url: string }) {
  const { flash } = useSite();
  return (
    <div className={a.share}>
      <span className={a.shareLabel}>Chia sẻ</span>
      <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" className={a.shareBtn}>
        Facebook
      </a>
      <button
        type="button"
        className={a.shareBtn}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(url);
          } catch {}
          flash("Đã sao chép liên kết bài viết");
        }}
      >
        Sao chép liên kết
      </button>
    </div>
  );
}
