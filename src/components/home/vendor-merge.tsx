"use client";

import { useEffect, useRef, useState } from "react";
import { useMedia } from "@/lib/use-media";
import { reducedMotion } from "../providers";
import v from "./vendor-merge.module.css";

const P = "#6a2c91";
const O = "#f39223";
const VENDORS = ["Bát đĩa", "Dao nĩa", "Khăn bàn", "Ga gối", "Khăn tắm", "Amenities", "Nội thất", "Tranh", "Decor", "Trà cao cấp", "Bọc ghế", "Quà tặng"];
const VPOS: [number, number][] = [
  [16, 16], [50, 10], [84, 18], [90, 46], [84, 80], [58, 90],
  [24, 86], [9, 60], [12, 36], [34, 30], [70, 34], [66, 66],
];

type Opts = { duration: number; delay?: number; easing: string; fill?: FillMode };

/**
 * "Mười nhà cung ứng rời rạc → một đối tác": các pill bay vào quỹ đạo quanh lõi AnhTris.
 * Port từ animMerge() của bản thiết kế (Web Animations API).
 */
function animMerge(box: HTMLElement, on: boolean, instant: boolean) {
  const q = (sel: string) => Array.from(box.querySelectorAll<HTMLElement>(sel));
  const pills = q("[data-vendor]");
  const dots = q("[data-dot]");
  const core = box.querySelector<HTMLElement>("[data-core]");
  const txt = box.querySelector<HTMLElement>("[data-core-text]");
  const ring = box.querySelector<HTMLElement>("[data-core-ring]");
  if (!core || !pills.length) return;

  const W = box.clientWidth;
  const H = box.clientHeight;
  const cx = W / 2;
  const cy = H / 2;
  const R = W * 0.17 + 24;
  const busy = [core, ...pills].some((el) => el.getAnimations().some((a) => a.playState === "running"));
  const st = busy ? 0.25 : 1;
  const fast = instant || reducedMotion();
  const T = (n: number) => (fast ? 0 : n);

  // Tiếp nối từ trạng thái hiện tại để đảo chiều giữa chừng không bị giật
  const play = (el: HTMLElement, frames: Keyframe[], o: Opts) => {
    const cs = getComputedStyle(el);
    const f0 = { transform: cs.transform, opacity: cs.opacity };
    el.getAnimations().forEach((a) => a.cancel());
    return el.animate([f0, ...frames], { fill: "both", easing: o.easing, duration: T(o.duration), delay: T(o.delay || 0) });
  };
  const fresh = (el: HTMLElement, frames: Keyframe[], o: Opts) => {
    el.getAnimations().forEach((a) => a.cancel());
    return el.animate(frames, { fill: o.fill || "both", easing: o.easing, duration: T(o.duration), delay: T(o.delay || 0) });
  };

  const info = pills
    .map((el, i) => {
      const [x, y] = VPOS[i % VPOS.length];
      const px = (x / 100) * W;
      const py = (y / 100) * H;
      return { el, i, px, py, a: Math.atan2(py - cy, px - cx), k: 0, ox: 0, oy: 0 };
    })
    .sort((u, w) => u.a - w.a);
  const step = (Math.PI * 2) / info.length;
  const a0 = info[0].a;
  info.forEach((o, k) => {
    const a = a0 + k * step;
    o.k = k;
    o.ox = Math.cos(a) * R;
    o.oy = Math.sin(a) * R;
  });
  const dotT = (o: (typeof info)[number], sc: number) => `translate(${o.ox.toFixed(1)}px,${o.oy.toFixed(1)}px) scale(${sc})`;
  const pillT = (o: (typeof info)[number], sc: number) =>
    `translate(calc(-50% + ${(cx + o.ox - o.px).toFixed(1)}px),calc(-50% + ${(cy + o.oy - o.py).toFixed(1)}px)) scale(${sc})`;
  const C = (sc: number) => `translate(-50%,-50%) scale(${sc})`;

  if (on) {
    info.forEach((o) => {
      play(o.el, [{ opacity: 1, offset: 0.72 }, { transform: pillT(o, 0.2), opacity: 0 }], {
        duration: busy ? 560 : 760,
        delay: o.k * 45 * st,
        easing: "cubic-bezier(.65,0,.25,1)",
      });
      const d = dots[o.i];
      if (d)
        fresh(d, [{ transform: dotT(o, 0) }, { transform: dotT(o, 1.5), offset: 0.5 }, { transform: dotT(o, 1) }], {
          duration: 460,
          delay: o.k * 45 * st + (busy ? 440 : 640),
          easing: "cubic-bezier(.3,0,.2,1)",
        });
    });
    play(core, [{ transform: C(1.08), offset: 0.6 }, { transform: C(1) }], { duration: 820, delay: busy ? 100 : 260, easing: "cubic-bezier(.2,.9,.3,1)" });
    if (ring)
      fresh(ring, [{ transform: C(1), opacity: 0.55 }, { transform: C(1.75), opacity: 0 }], {
        duration: 1000,
        delay: busy ? 560 : 760,
        easing: "cubic-bezier(.2,.7,.3,1)",
        fill: "forwards",
      });
    if (txt)
      fresh(txt, [{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "none" }], {
        duration: 520,
        delay: busy ? 480 : 700,
        easing: "cubic-bezier(.16,1,.3,1)",
      });
  } else {
    if (txt) play(txt, [{ opacity: 0, transform: "translateY(-4px)" }], { duration: 160, easing: "ease-out" });
    ring?.getAnimations().forEach((a) => a.cancel());
    play(core, [{ transform: C(1.06), offset: 0.3 }, { transform: C(0) }], { duration: 440, delay: 40, easing: "cubic-bezier(.5,0,.75,0)" });
    info.forEach((o) => {
      const d = dots[o.i];
      if (d) play(d, [{ transform: dotT(o, 0) }], { duration: 200, delay: o.k * 12 * st, easing: "ease-in" });
      play(o.el, [{ opacity: 1, offset: 0.22 }, { transform: "translate(-50%,-50%) scale(1)", opacity: 1 }], {
        duration: busy ? 560 : 720,
        delay: (busy ? 0 : 70) + o.k * 28 * st,
        easing: "cubic-bezier(.34,1.4,.64,1)",
      });
    });
  }
}

export function VendorMerge() {
  const boxRef = useRef<HTMLDivElement>(null);
  const [merged, setMerged] = useState(false);
  const mergedRef = useRef(false);
  const hoverT = useRef<ReturnType<typeof setTimeout>>(undefined);
  // Theo khả năng hover chứ không theo độ rộng: iPad ngang / laptop cảm ứng dùng chạm, không có "rê chuột"
  const canHover = useMedia("(hover: hover) and (pointer: fine)");

  // Cuộn tới → tự gom về AnhTris
  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    let t: ReturnType<typeof setTimeout>;
    const io = new IntersectionObserver(
      ([en]) => {
        if (!en.isIntersecting) return;
        t = setTimeout(() => setMerged(true), reducedMotion() ? 0 : 300);
        io.disconnect();
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.01 },
    );
    io.observe(box);
    return () => {
      io.disconnect();
      clearTimeout(t);
    };
  }, []);

  useEffect(() => {
    const box = boxRef.current;
    if (!box || mergedRef.current === merged) return;
    mergedRef.current = merged;
    requestAnimationFrame(() => animMerge(box, merged, false));
  }, [merged]);

  // Kích thước đổi → đặt lại vị trí quỹ đạo tức thì
  useEffect(() => {
    const onResize = () => {
      if (mergedRef.current && boxRef.current) animMerge(boxRef.current, true, true);
    };
    addEventListener("resize", onResize);
    return () => {
      removeEventListener("resize", onResize);
      clearTimeout(hoverT.current);
    };
  }, []);

  const later = (fn: () => void, ms: number) => {
    clearTimeout(hoverT.current);
    hoverT.current = setTimeout(fn, ms);
  };

  const hint = canHover
    ? merged
      ? "Rê chuột để xem trước đây"
      : "Rời chuột để gom về AnhTris"
    : merged
      ? "Chạm để xem trước đây"
      : "Chạm để gom về AnhTris";

  return (
    <div className={v.wrap}>
      <div
        ref={boxRef}
        className={v.box}
        role="button"
        tabIndex={0}
        aria-pressed={merged}
        aria-label="Minh hoạ: các nhà cung ứng rời rạc gom về một đối tác AnhTris"
        onMouseEnter={() => canHover && later(() => setMerged(false), 70)}
        onMouseLeave={() => canHover && later(() => setMerged(true), 140)}
        onClick={() => !canHover && setMerged((m) => !m)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setMerged((m) => !m);
          }
        }}
      >
        <span data-core-ring="1" className={v.ring} />
        {VENDORS.map((label, i) => (
          <span key={"d" + label} data-dot="1" className={v.dot} style={{ background: i % 2 ? O : P }} />
        ))}
        <div data-core="1" className={v.core}>
          <span data-core-text="1" className={v.coreText}>
            ANH<span className="cO">TRIS</span>
          </span>
        </div>
        {VENDORS.map((label, i) => {
          const [x, y] = VPOS[i];
          return (
            <span
              key={label}
              data-vendor="1"
              className={v.pill}
              style={{
                left: x + "%",
                top: y + "%",
                background: i % 3 === 0 ? "#efe7f4" : i % 3 === 1 ? "#fdf0e1" : "#f3f1f5",
                color: i % 3 === 1 ? "#8a4a08" : "#4f1f6d",
              }}
            >
              {label}
            </span>
          );
        })}
      </div>
      <span className={v.hint} aria-live="polite">
        {hint}
      </span>
    </div>
  );
}
