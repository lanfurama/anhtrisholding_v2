"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { reducedMotion } from "./providers";

/** Thanh tiến trình cuộn ở mép trên màn hình. */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - innerHeight;
      if (ref.current) ref.current.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`;
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
  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        background: "linear-gradient(90deg,#6a2c91 0 50%,#f39223 50% 100%)",
        transformOrigin: "0 50%",
        transform: "scaleX(0)",
        zIndex: 60,
      }}
    />
  );
}

/** Chặn sao chép / chuột phải / kéo ảnh ngoài ô nhập liệu — hành vi có trong bản thiết kế. */
export function CopyGuard() {
  useEffect(() => {
    const isField = (t: EventTarget | null) => t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement;
    const block = (e: Event) => {
      if (!isField(e.target)) e.preventDefault();
    };
    const key = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && ["a", "c", "x"].includes(e.key.toLowerCase()) && !isField(e.target)) e.preventDefault();
    };
    const events = ["copy", "cut", "selectstart", "dragstart", "contextmenu"] as const;
    events.forEach((n) => document.addEventListener(n, block));
    document.addEventListener("keydown", key);
    return () => {
      events.forEach((n) => document.removeEventListener(n, block));
      document.removeEventListener("keydown", key);
    };
  }, []);
  return null;
}

/** next/image mờ dần khi tải xong. */
export function FadeImage({ className, onLoad, alt, ...props }: ImageProps) {
  const [loaded, setLoaded] = useState(false);
  return (
    <Image
      {...props}
      alt={alt}
      className={["fadeImg", className].filter(Boolean).join(" ")}
      data-loaded={loaded ? "1" : undefined}
      onLoad={(e) => {
        setLoaded(true);
        onLoad?.(e);
      }}
    />
  );
}

/** Parallax dọc nhẹ theo vị trí của khung cha so với giữa màn hình. */
export function Parallax({ factor = 0.1, className, children }: { factor?: number; className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (reducedMotion()) return;
    const el = ref.current;
    if (!el?.parentElement) return;
    const parent = el.parentElement;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = parent.getBoundingClientRect();
      el.style.transform = `translate3d(0,${(r.top + r.height / 2 - innerHeight / 2) * -factor}px,0)`;
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
  }, [factor]);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
