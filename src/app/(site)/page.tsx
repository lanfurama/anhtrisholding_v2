import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FadeImage, Parallax } from "@/components/effects";
import { EcosystemOrbit } from "@/components/home/ecosystem-orbit";
import h from "@/components/home/home.module.css";
import { FaqList, ProcessLine, SpotlightLink } from "@/components/home/interactive";
import { JsonLd } from "@/components/json-ld";
import { VendorMerge } from "@/components/home/vendor-merge";
import { PageTransition } from "@/components/page-transition";
import { PostCard } from "@/components/post-card";
import { ProjectMedia } from "@/components/project-media";
import { getCategories, getHome, getMembers, getPosts, getSettings } from "@/lib/content";
import { categoryPath, ROUTES } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "AnhTris Holdings — Cung ứng HORECA trọn gói tại Đà Nẵng",
  description:
    "Maiahorecare, Maiahome và Tris Gallery: tableware, linen, amenities và nội thất cho khách sạn, resort, nhà hàng. Showroom tại sảnh Furama Đà Nẵng.",
  path: "/",
});

const pad = (n: number) => String(n).padStart(2, "0");

export default async function HomePage() {
  const [home, members, categories, posts, settings] = await Promise.all([getHome(), getMembers(), getCategories(), getPosts(), getSettings()]);
  const onHome = categories.filter((c) => c.showOnHome);
  const [big, ...small] = onHome;

  return (
    <PageTransition>
      {/* ---------- Hero ---------- */}
      <section className={h.hero}>
        <div className={`container ${h.heroInner}`}>
          <div className={h.heroMeta}>
            <span className={h.metaDot}>Đầu tư &amp; phát triển</span>
            <span aria-hidden="true">·</span>
            <span>Khách sạn – Nghỉ dưỡng – Nhà hàng – Bán lẻ</span>
          </div>
          <div className={h.wordmarkWrap} role="img" aria-label="AnhTris Holdings">
            <div className={h.wordmark}>
              <span className="rvFromL cP">ANH</span>
              <span className="rvFromR cO">TRIS</span>
            </div>
            <div className={`rvTrack ${h.holdings}`}>HOLDINGS</div>
          </div>
          <div className={h.heroGrid}>
            <h1 className={h.heroTitle}>
              Một đối tác. Trọn giải pháp cho <span className="cP">lưu trú, ẩm thực</span> và <span className="cOD">không gian sống.</span>
            </h1>
            <div className={h.heroSide}>
              <p className={h.heroLede}>{home.heroLede}</p>
              <div className={h.btnRow}>
                <Link href={ROUTES.eco} className="btn btnPrimary">
                  Khám phá hệ sinh thái →
                </Link>
                <Link href={ROUTES.contact} className="btn btnOutline">
                  Đặt lịch xem showroom
                </Link>
              </div>
            </div>
          </div>
          {home.heroImage && (
            <div className={`rvClip ${h.heroMedia}`}>
              <Parallax className={h.parallax}>
                <Image src={home.heroImage.url} alt={home.heroImage.alt} fill preload sizes="(max-width: 1280px) 100vw, 1200px" />
              </Parallax>
              <div className={h.heroShade} />
              {home.heroBadge && (
                <div className={h.badge}>
                  <span className={h.badgeMark} aria-hidden="true">
                    {home.heroBadge.mark || home.heroBadge.title.charAt(0)}
                  </span>
                  <span className={h.badgeText}>
                    <span className={h.badgeLabel}>{home.heroBadge.label}</span>
                    <span className={h.badgeTitle}>{home.heroBadge.title}</span>
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ---------- Chiến lược ---------- */}
      <section className={h.strategy}>
        <div className={`container ${h.strategyInner}`}>
          <div className={h.strategyAside}>
            <span className="eyebrow">Chiến lược</span>
            <p className={h.strategyText}>{home.strategyText}</p>
          </div>
          <ol className={h.lines}>
            {["Kết nối nguồn lực.", "Tối ưu giá trị.", "Nâng tầm trải nghiệm."].map((t, i) => (
              <li key={t} className={h.lineRow}>
                <span className={h.lineNum}>{pad(i + 1)}</span>
                <span className={`${h.lineText} ${i === 2 ? "cO" : ""}`}>{t}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <EcosystemOrbit members={members} />

      {/* ---------- Một đầu mối ---------- */}
      <section className={`container ${h.merge}`}>
        <div className={h.mergeGrid}>
          <div className={h.mergeCopy}>
            <span className="eyebrow">Một đầu mối</span>
            <h2 className="h2">
              Từ mười nhà cung ứng rời rạc <span className="cP">về một đối tác.</span>
            </h2>
            <p className="lede">
              Bát đĩa, dao nĩa, linen, amenities, nội thất, tranh nghệ thuật, quà tặng doanh nghiệp — cùng một tiêu chuẩn, một tiến độ, một người phụ
              trách.
            </p>
          </div>
          <VendorMerge />
        </div>
      </section>

      {/* ---------- Danh mục ---------- */}
      {big && (
        <section className={h.bentoSection}>
          <div className={`container sectionHead ${h.bentoHead}`}>
            <div className={h.headCopy}>
              <span className="eyebrow">Maiahorecare · Danh mục</span>
              <h2 className="h2">
                Đạt chuẩn quốc tế, <span className="cOD">tùy chỉnh theo bạn.</span>
              </h2>
            </div>
            <Link href={ROUTES.products} className="linkStrong">
              Xem toàn bộ sản phẩm →
            </Link>
          </div>
          <div className={`container ${h.bento}`}>
            <Link href={categoryPath(big.slug)} className={h.bigTile}>
              {big.homeImage && <FadeImage src={big.homeImage.url} alt={big.homeImage.alt} fill sizes="(max-width: 640px) 100vw, 50vw" />}
              <div className={h.bigShade} />
              <div className={h.bigBody}>
                <span className={h.bigTag}>
                  01{big.subtitle && ` · ${big.subtitle}`}
                </span>
                <span className={h.bigTitle}>{big.title}</span>
                {big.homeDescription && <span className={h.bigDesc}>{big.homeDescription}</span>}
              </div>
            </Link>
            {small.map((c, i) => (
              <SpotlightLink key={c._id} href={categoryPath(c.slug)} className={h.tile}>
                <div className={h.tileTop}>
                  <span className={h.tileNum}>{pad(i + 2)}</span>
                  <span className={h.tileArrow} style={{ background: i % 2 ? "var(--orange)" : "var(--purple)" }} aria-hidden="true">
                    →
                  </span>
                </div>
                <div className={h.tileBody}>
                  <span className={h.tileName}>{c.title}</span>
                  {c.homeDescription && <span className={h.tileDesc}>{c.homeDescription}</span>}
                </div>
              </SpotlightLink>
            ))}
          </div>
        </section>
      )}

      {/* ---------- Quy trình ---------- */}
      <section className={h.process}>
        <div className={`container ${h.processInner}`}>
          <div className="sectionHead">
            <h2 className="h2" style={{ maxWidth: 760 }}>
              Đồng hành trọn vòng đời dự án.
            </h2>
            <span className={h.muted}>Ý tưởng → Vận hành</span>
          </div>
          <div className={h.steps}>
            <div className={h.lineTrack} />
            <ProcessLine />
            <ol className={h.stepGrid}>
              {home.steps.map((st, i) => (
                <li key={st.title} className={h.step}>
                  <span className={h.stepNum}>{pad(i + 1)}</span>
                  <span className={h.stepTitle}>{st.title}</span>
                  <span className={h.stepText}>{st.text}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ---------- Dự án tiêu biểu ---------- */}
      {home.featuredProjects.length > 0 && (
        <section className={`container ${h.block}`}>
          <div className="sectionHead">
            <h2 className="h2">Dự án tiêu biểu</h2>
            <Link href={ROUTES.projects} className={`btn btnOutline ${h.pillLink}`}>
              Tất cả dự án →
            </Link>
          </div>
          <div className={h.projectGrid}>
            {home.featuredProjects.map((p, i) => (
              <Link key={p._id} href={`${ROUTES.projects}#${p.slug}`} className={h.projectCard}>
                <ProjectMedia project={p} className={h.projectMedia} tone={i % 3 === 2 ? "orange" : "purple"} sizes="(max-width: 700px) 100vw, 420px" />
                <div className={h.projectMeta}>
                  <span className={h.projectTag}>{[p.sector, p.products].filter(Boolean).join(" · ")}</span>
                  <span className={h.projectTitle}>{p.title}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ---------- Showroom ---------- */}
      <section className="container" style={{ paddingBottom: "clamp(72px, 10vw, 130px)" }}>
        <div className={h.showroom}>
          <div className={h.showroomCopy}>
            <span className="eyebrow">Trải nghiệm thực tế</span>
            <h2 className={h.showroomTitle}>Chạm, cầm và so sánh tại showroom Furama.</h2>
            <p className={h.showroomText}>{home.showroomAddress}</p>
            <div className={h.btnRow}>
              <Link href={ROUTES.contact} className="btn btnInk">
                Đặt lịch ghé thăm
              </Link>
              <a href={`tel:${settings.phoneE164}`} className="btn btnOutline">
                {settings.phone}
              </a>
            </div>
          </div>
          <div className={h.showroomMedia}>
            {home.showroomImage && <FadeImage src={home.showroomImage.url} alt={home.showroomImage.alt} fill sizes="(max-width: 760px) 100vw, 640px" />}
          </div>
        </div>
      </section>

      {/* ---------- Cẩm nang ---------- */}
      {posts.length > 0 && (
        <section className={`container ${h.blockTight}`}>
          <div className="sectionHead">
            <div className={h.headCopy}>
              <span className="eyebrow">Cẩm nang HORECA</span>
              <h2 className="h2">Kinh nghiệm từ đội ngũ AnhTris</h2>
            </div>
            <Link href={ROUTES.blog} className="linkStrong">
              Xem tất cả bài viết →
            </Link>
          </div>
          <div className="grid3">
            {posts.slice(0, 6).map((p) => (
              <PostCard key={p._id} post={p} />
            ))}
          </div>
        </section>
      )}

      {/* ---------- FAQ ---------- */}
      {home.faqs.length > 0 && (
        <section className={`container ${h.faq}`}>
          <h2 className="h2">Câu hỏi thường gặp</h2>
          <FaqList items={home.faqs} />
          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: home.faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
            }}
          />
        </section>
      )}
    </PageTransition>
  );
}
