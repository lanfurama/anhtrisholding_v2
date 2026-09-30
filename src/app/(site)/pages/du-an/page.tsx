import type { Metadata } from "next";
import { PageTransition } from "@/components/page-transition";
import p from "@/components/pages.module.css";
import { ProjectMedia } from "@/components/project-media";
import { getProjects } from "@/lib/content";
import { ROUTES } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({
    title: "Dự án khách sạn, nhà hàng đã triển khai | AnhTris",
    description: "Các dự án cung ứng HORECA của AnhTris Holdings cho resort, khách sạn và nhà hàng fine dining.",
    path: ROUTES.projects,
  });
}

export default async function ProjectsPage() {
  const projects = await getProjects();
  return (
    <PageTransition>
      <section className={`container ${p.intro}`} style={{ paddingBottom: "clamp(40px, 5vw, 56px)" }}>
        <span className="eyebrow">Dự án</span>
        <h1 className="display" style={{ fontSize: "clamp(44px, 7vw, 104px)", maxWidth: 1000 }}>
          Đồng hành cùng những thương hiệu <span className="cO">tiên phong.</span>
        </h1>
      </section>

      <section className={`container ${p.caseList}`}>
        {projects.map((pr, i) => {
          const dark = i % 3 === 2;
          const hasQuote = pr.testimonial?.quote;
          return (
            <article key={pr._id} id={pr.slug} className={`${p.case} ${dark ? p.caseDark : ""}`}>
              <ProjectMedia project={pr} className={p.caseMedia} tone={dark ? "dark" : "purple"} sizes="(max-width: 800px) 100vw, 620px" />
              <div className={p.caseBody}>
                <span className={p.caseTag}>{[pr.sector, pr.member || pr.products].filter(Boolean).join(" · ")}</span>
                <h2 className={p.caseTitle}>{pr.title}</h2>
                {pr.summary && <p className={p.caseText}>{pr.summary}</p>}
                {hasQuote && (
                  <blockquote className={p.caseQuote}>
                    “{pr.testimonial!.quote}”{pr.testimonial!.author && ` — ${pr.testimonial!.author}`}
                  </blockquote>
                )}
              </div>
            </article>
          );
        })}
      </section>
    </PageTransition>
  );
}
