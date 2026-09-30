"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import type { Member } from "@/lib/types";
import { reducedMotion } from "../providers";
import o from "./ecosystem-orbit.module.css";

const ORANGE = "#f39223";

/** Sơ đồ quỹ đạo: AnhTris ở tâm, các thương hiệu thành viên xếp đều trên vòng tròn. */
export function EcosystemOrbit({ members }: { members: Member[] }) {
  const [sel, setSel] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  if (!members.length) return null;
  const m = members[Math.min(sel, members.length - 1)];

  const pick = (i: number) => {
    setSel(i);
    if (!reducedMotion()) panelRef.current?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 350, easing: "ease-out" });
  };

  const pos = members.map((_, i) => {
    const a = ((-90 + (i * 360) / members.length) * Math.PI) / 180;
    return { x: 50 + 36 * Math.cos(a), y: 50 + 36 * Math.sin(a) };
  });

  return (
    <section className={o.section}>
      <div className={`container ${o.inner}`}>
        <div className={`sectionHead ${o.head}`}>
          <h2 className={o.title}>
            Một hệ sinh thái, <span className="cO">ba thương hiệu.</span>
          </h2>
          <span className={o.hint}>Chọn một thành viên</span>
        </div>

        <div className={o.grid}>
          <div className={o.orbit}>
            <div className={o.ringDashed} />
            <div className={o.ringInner} />
            <svg viewBox="0 0 100 100" className={o.lines} aria-hidden="true">
              {pos.map((p, i) => (
                <line
                  key={i}
                  x1="50"
                  y1="50"
                  x2={p.x}
                  y2={p.y}
                  stroke={sel === i ? ORANGE : "rgba(255,255,255,.22)"}
                  strokeWidth={sel === i ? 0.7 : 0.35}
                />
              ))}
            </svg>
            <div className={o.core} aria-hidden="true">
              <span className={o.coreMark}>
                <span className="cP">ANH</span>
                <span className="cO">TRIS</span>
              </span>
              <span className={o.coreSub}>HOLDINGS</span>
            </div>
            {members.map((mb, i) => (
              <button
                key={mb._id}
                type="button"
                aria-label={mb.name}
                aria-pressed={sel === i}
                onClick={() => pick(i)}
                className={o.node}
                style={{
                  left: `${pos[i].x}%`,
                  top: `${pos[i].y}%`,
                  transform: `translate(-50%,-50%) scale(${sel === i ? 1.12 : 0.94})`,
                  borderColor: sel === i ? ORANGE : "transparent",
                }}
              >
                {mb.logo && <Image src={mb.logo.url} alt="" fill sizes="140px" className={o.nodeImg} />}
              </button>
            ))}
          </div>

          <div ref={panelRef} className={o.panel}>
            <div className={o.tabs}>
              {members.map((mb, i) => (
                <button key={mb._id} type="button" aria-pressed={sel === i} onClick={() => pick(i)} className={o.tab}>
                  {mb.name}
                </button>
              ))}
            </div>
            <span className={o.tag}>{m.tag}</span>
            <h3 className={o.name}>{m.name}</h3>
            <p className={o.desc}>{m.summary}</p>
            <div className={o.items}>
              {m.highlights.map((it) => (
                <span key={it} className={o.item}>
                  {it}
                </span>
              ))}
            </div>
            {m.homeCta?.href && (
              <Link href={m.homeCta.href} className={`btn btnAccent ${o.cta}`}>
                {m.homeCta.label} →
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
