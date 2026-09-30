"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { NAV, navKeyFor, ROUTES } from "@/lib/routes";
import { reducedMotion, useSite } from "./providers";
import s from "./site-header.module.css";

type Ind = { l: number; r: number; W: number; pos?: (t: number) => { l: number; r: number }; t0?: number; dur?: number };

const HIDDEN = "inset(0px 100% 0px 0px round 999px)";

/** Lò xo tắt dần — hai mép pill chạy với tốc độ khác nhau tạo cảm giác "kéo giãn". */
const spring = (w: number, z: number) => {
  const wd = w * Math.sqrt(1 - z * z);
  return (t: number) => 1 - Math.exp(-z * w * t) * (Math.cos(wd * t) + ((z * w) / wd) * Math.sin(wd * t));
};

type Props = { logo: { url: string; alt: string }; phone: string; phoneE164: string };

export function SiteHeader({ logo, phone, phoneE164 }: Props) {
  const pathname = usePathname();
  const active = navKeyFor(pathname);
  const { quote } = useSite();
  const [menuFor, setMenuFor] = useState<string | null>(null);
  // Menu tự đóng khi chuyển trang: chỉ "mở" nếu được mở trên đúng pathname hiện tại
  const menuOpen = menuFor === pathname;

  const navRef = useRef<HTMLElement>(null);
  const indRef = useRef<HTMLSpanElement>(null);
  const shapeRef = useRef<HTMLSpanElement>(null);
  const ind = useRef<Ind | null>(null);

  const placeNav = useCallback((key: string | null, animate: boolean) => {
    const nav = navRef.current;
    const ov = indRef.current;
    if (!nav || !ov || nav.offsetParent === null) return;
    const W = nav.clientWidth;
    const clip = (L: number, R: number) =>
      `inset(0px ${Math.max(0, W - R).toFixed(2)}px 0px ${Math.max(0, L).toFixed(2)}px round 999px)`;
    const els = [ov, shapeRef.current].filter((el): el is HTMLSpanElement => !!el);
    const put = (v: string) =>
      els.forEach((el) => {
        el.getAnimations().forEach((a) => a.cancel());
        el.style.clipPath = v;
      });
    const run = (frames: Keyframe[], o: KeyframeAnimationOptions) => els.forEach((el) => el.animate(frames, o));
    const still = !animate || reducedMotion();
    const cur = ind.current;
    const now = performance.now();
    const at = (c: Ind) => (c.pos && c.t0 !== undefined && c.dur && now - c.t0 < c.dur ? c.pos((now - c.t0) / 1000) : { l: c.l, r: c.r });

    const a = key ? nav.querySelector<HTMLElement>(`[data-nav-key="${key}"]`) : null;
    if (!a) {
      if (!still && cur) {
        const f = at(cur);
        const c = (f.l + f.r) / 2;
        put(clip(c, c));
        run([{ clipPath: clip(f.l, f.r) }, { clipPath: clip(c, c) }], { duration: 280, easing: "cubic-bezier(.4,0,.2,1)" });
      } else put(HIDDEN);
      ind.current = null;
      return;
    }
    const to = { l: a.offsetLeft, r: a.offsetLeft + a.offsetWidth };
    if (still) {
      if (cur && cur.l === to.l && cur.r === to.r && cur.W === W) return;
      put(clip(to.l, to.r));
      ind.current = { ...to, W };
      return;
    }
    let from = cur ? at(cur) : null;
    let grow = false;
    if (!from) {
      const c = (to.l + to.r) / 2;
      from = { l: c, r: c };
      grow = true;
    }
    const fast = spring(23, 0.8);
    const slow = spring(17, 0.82);
    const right = to.l + to.r > from.l + from.r;
    const fL = grow ? fast : right ? slow : fast;
    const fR = grow ? fast : right ? fast : slow;
    const f0 = from;
    const pos = (t: number) => ({ l: f0.l + (to.l - f0.l) * fL(t), r: f0.r + (to.r - f0.r) * fR(t) });
    const dur = 460;
    const N = 36;
    const frames: Keyframe[] = [];
    for (let i = 0; i <= N; i++) {
      const q = pos(((i / N) * dur) / 1000);
      frames.push({ clipPath: clip(q.l, Math.max(q.l, q.r)) });
    }
    frames[N] = { clipPath: clip(to.l, to.r) };
    put(clip(to.l, to.r));
    run(frames, { duration: dur, easing: "linear" });
    ind.current = { ...to, W, pos, t0: now, dur };
  }, []);

  // Đổi trang → pill trượt tới mục mới
  const first = useRef(true);
  useEffect(() => {
    placeNav(active, !first.current);
    first.current = false;
  }, [active, placeNav]);

  // Resize / font tải xong → đặt lại vị trí, không animate
  useEffect(() => {
    const re = () => {
      placeNav(active, false);
      if (window.innerWidth >= 960) setMenuFor(null);
    };
    window.addEventListener("resize", re);
    document.fonts?.ready.then(re);
    return () => window.removeEventListener("resize", re);
  }, [active, placeNav]);

  useEffect(() => {
    if (!menuOpen) return;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuFor(null);
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const count = quote.length;

  return (
    <>
      <header className={s.header}>
        <div className={s.bar}>
          <Link href="/" className={s.logo} aria-label={`${logo.alt} — Trang chủ`} onClick={() => setMenuFor(null)}>
            <Image src={logo.url} alt={logo.alt} width={145} height={36} loading="eager" className={s.logoImg} />
          </Link>

          <nav ref={navRef} className={s.nav} aria-label="Điều hướng chính">
            <span className={s.navShadow} aria-hidden="true">
              <span ref={shapeRef} className={s.navShape} />
            </span>
            {NAV.map((n) => (
              <Link
                key={n.key}
                href={n.href}
                data-nav-key={n.key}
                className={s.navLink}
                aria-current={active === n.key ? "page" : undefined}
                onClick={() => placeNav(n.key, true)}
              >
                {n.label}
              </Link>
            ))}
            <span ref={indRef} className={s.navInd} aria-hidden="true">
              {NAV.map((n) => (
                <span key={n.key} className={s.navIndLabel}>
                  {n.label}
                </span>
              ))}
            </span>
          </nav>

          <span className={s.spacer} />

          <Link href={ROUTES.contact} data-quote-btn="1" className={s.quoteBtn} onClick={() => setMenuFor(null)}>
            <span className={s.quoteLong}>Yêu cầu báo giá</span>
            <span className={s.quoteShort}>Báo giá</span>
            {count > 0 && (
              <span data-quote-badge="1" className={s.badge} aria-label={`${count} mục đã chọn`}>
                {count}
              </span>
            )}
          </Link>

          <button
            type="button"
            className={s.menuBtn}
            aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuFor(menuOpen ? null : pathname)}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </header>

      {menuOpen && (
        <div id="mobile-menu" className={s.menu}>
          {NAV.map((n) => (
            <Link key={n.key} href={n.href} className={s.menuLink} onClick={() => setMenuFor(null)} aria-current={active === n.key ? "page" : undefined}>
              {n.label}
              <span aria-hidden="true">→</span>
            </Link>
          ))}
          <a href={`tel:${phoneE164}`} className={s.menuCall}>
            Gọi {phone}
          </a>
        </div>
      )}
    </>
  );
}
