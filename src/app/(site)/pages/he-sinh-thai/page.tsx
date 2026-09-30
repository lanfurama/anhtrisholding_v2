import type { Metadata } from "next";
import Link from "next/link";
import { FadeImage } from "@/components/effects";
import { PageTransition } from "@/components/page-transition";
import p from "@/components/pages.module.css";
import { getMembers } from "@/lib/content";
import { ROUTES } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Hệ sinh thái Maiahorecare, Maiahome, Tris Gallery | AnhTris",
  description: "Ba thương hiệu thành viên của AnhTris Holdings: giải pháp HORECA, thiết kế không gian sống và tranh nghệ thuật độc bản.",
  path: ROUTES.eco,
});

const CTA_CLASS = { dark: "btnAccent", light: "btnPrimary", accent: "btnInk" } as const;

export default async function EcosystemPage() {
  const members = await getMembers();
  return (
    <PageTransition>
      <section className={`container ${p.intro}`}>
        <span className="eyebrow">Hệ sinh thái AnhTris Holdings</span>
        <h1 className="display" style={{ fontSize: "clamp(44px, 7.4vw, 112px)", maxWidth: 1100 }}>
          Ba thành viên. <span className="cP">Một</span> <span className="cO">chuẩn mực.</span>
        </h1>
        <p className="lede" style={{ fontSize: "clamp(16px, 1.5vw, 18px)", maxWidth: 640 }}>
          Đơn vị cung ứng uy tín tại miền Trung và trên toàn quốc, mang đến giải pháp trọn gói cho ngành dịch vụ lưu trú – ẩm thực, không gian sống và
          nghệ thuật.
        </p>
      </section>

      <section className={`container ${p.stackCards}`}>
        {members.map((m, i) => (
          <article key={m._id} id={m.slug} className={`${p.memberCard} ${p[m.theme]}`} style={{ top: 96 + i * 20 }}>
            <div className={p.memberCopy}>
              <div className={p.memberLogo}>
                {m.logo && <FadeImage src={m.logo.url} alt={m.logo.alt || `Logo ${m.name}`} fill sizes="120px" />}
              </div>
              <span className={p.memberTag}>
                {String(i + 1).padStart(2, "0")} · {m.ecoTag || m.tag}
              </span>
              <h2 className={p.memberName}>{m.name}</h2>
              <p className={p.memberDesc}>{m.description || m.summary}</p>
            </div>
            <div className={p.services}>
              {m.services.map((sv) => (
                <div key={sv.title} className={p.service}>
                  <span className={p.serviceTitle}>{sv.title}</span>
                  <span className={p.serviceText}>{sv.text}</span>
                </div>
              ))}
              {m.ecoCta?.href && (
                <Link href={m.ecoCta.href} className={`btn ${CTA_CLASS[m.theme]} ${p.serviceCta}`}>
                  {m.ecoCta.label} →
                </Link>
              )}
            </div>
          </article>
        ))}
      </section>
    </PageTransition>
  );
}
