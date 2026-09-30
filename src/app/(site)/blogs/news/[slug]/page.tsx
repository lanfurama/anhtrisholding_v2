import type { Metadata } from "next";
import { PortableText, toPlainText, type PortableTextComponents } from "next-sanity";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShareButtons, Toc } from "@/components/article/article-client";
import a from "@/components/article/article.module.css";
import { FadeImage } from "@/components/effects";
import { JsonLd } from "@/components/json-ld";
import { PageTransition } from "@/components/page-transition";
import { PostCard } from "@/components/post-card";
import { getPost, getPosts, getPostSlugs, getSettings } from "@/lib/content";
import { categoryPath, formatDate, postPath, ROUTES } from "@/lib/routes";
import { defaultShareImage, ORG_ID, SITE_NAME, WEBSITE_ID } from "@/lib/seo";
import type { Post } from "@/lib/types";
import { siteUrl } from "@/sanity/env";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getPostSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  // Gọi notFound() ngay tại đây để cả HTML lẫn payload phía client dùng metadata của (site)/not-found.tsx (noindex)
  if (!post) notFound();
  const title = post.seo?.title || post.title;
  const description = post.seo?.description || post.excerpt;
  const image = post.coverImage ?? (await defaultShareImage());
  return {
    title: { absolute: title },
    description,
    keywords: post.seo?.keywords || undefined,
    alternates: { canonical: postPath(slug) },
    openGraph: {
      type: "article",
      title,
      description,
      url: postPath(slug),
      siteName: SITE_NAME,
      locale: "vi_VN",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt || post.publishedAt,
      section: post.category,
      authors: ["Maiahorecare"],
      images: [{ url: image.url, alt: image.alt }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image.url] },
  };
}

const pt: PortableTextComponents = {
  block: { normal: ({ children }) => <p className={a.p}>{children}</p> },
  list: { bullet: ({ children }) => <ul className={a.ul}>{children}</ul> },
  listItem: { bullet: ({ children }) => <li className={a.li}>{children}</li> },
};

const pad = (n: number) => String(n).padStart(2, "0");

function wordCount(post: Post) {
  const text = [
    post.title,
    post.excerpt,
    post.quickAnswer,
    ...post.sections.flatMap((s) => [s.heading, toPlainText(s.body ?? [])]),
    ...post.faq.flatMap((f) => [f.question, f.answer]),
  ].join(" ");
  return text.split(/\s+/).filter(Boolean).length;
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const [post, posts, settings] = await Promise.all([getPost(slug), getPosts(), getSettings()]);
  if (!post) notFound();

  const url = siteUrl + postPath(slug);
  const words = wordCount(post);
  const readBody = [post.quickAnswer, ...post.sections.map((s) => toPlainText(s.body ?? []))].join(" ");
  const read = Math.max(3, Math.round(readBody.split(/\s+/).filter(Boolean).length / 200));
  const idx = posts.findIndex((p) => p.slug === slug);
  const related = [1, 2, 3].map((k) => posts[(idx + k) % posts.length]).filter((p, i, arr) => p && p.slug !== slug && arr.indexOf(p) === i);
  const img = post.coverImage;

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": url,
        url,
        name: post.seo?.title || post.title,
        inLanguage: "vi-VN",
        isPartOf: { "@id": WEBSITE_ID },
        breadcrumb: { "@id": url + "#breadcrumb" },
        ...(img && { primaryImageOfPage: { "@type": "ImageObject", url: img.url } }),
      },
      {
        "@type": "BlogPosting",
        "@id": url + "#article",
        headline: post.title,
        description: post.seo?.description || post.excerpt,
        ...(img && { image: [img.url] }),
        datePublished: post.publishedAt,
        dateModified: post.updatedAt || post.publishedAt,
        inLanguage: "vi-VN",
        articleSection: post.category,
        keywords: post.seo?.keywords || undefined,
        wordCount: words,
        author: { "@type": "Organization", name: settings.authorName, parentOrganization: { "@id": ORG_ID } },
        publisher: { "@id": ORG_ID },
        mainEntityOfPage: { "@id": url },
        speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", "[data-quick]"] },
      },
      {
        "@type": "BreadcrumbList",
        "@id": url + "#breadcrumb",
        itemListElement: [
          ["Trang chủ", siteUrl + "/"],
          ["Cẩm nang HORECA", siteUrl + ROUTES.blog],
          [post.title, url],
        ].map(([name, item], i) => ({ "@type": "ListItem", position: i + 1, name, item })),
      },
      ...(post.faq.length
        ? [
            {
              "@type": "FAQPage",
              "@id": url + "#faq",
              mainEntity: post.faq.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
            },
          ]
        : []),
    ],
  };

  return (
    <PageTransition>
      <article className={`container ${a.article}`}>
        <header className={a.header}>
          <nav aria-label="Breadcrumb">
            <ol className={a.crumbs}>
              <li>
                <Link href="/">Trang chủ</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href={ROUTES.blog}>Cẩm nang HORECA</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page">{post.category}</li>
            </ol>
          </nav>
          <h1 className={a.title}>{post.title}</h1>
          <p className={a.lede}>{post.excerpt}</p>
          <div className={a.metaRow}>
            <div className={a.author}>
              {settings.authorImage && (
                <span className={a.avatar}>
                  <FadeImage src={settings.authorImage.url} alt={settings.authorImage.alt} fill sizes="48px" />
                </span>
              )}
              <span className={a.authorText}>
                <Link href={ROUTES.eco} rel="author" className={a.authorName}>
                  {settings.authorName}
                </Link>
                <span className={a.date}>
                  <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time> · {read} phút đọc
                </span>
              </span>
            </div>
            <ShareButtons url={url} />
          </div>
        </header>

        {img && (
          <figure className={`rvClip ${a.figure}`}>
            <Image src={img.url} alt={img.alt || post.title} fill preload sizes="(max-width: 1280px) 100vw, 1200px" />
          </figure>
        )}

        <div className={a.body}>
          <aside className={a.aside}>
            {post.sections.length > 0 && <Toc headings={post.sections.map((s) => s.heading)} />}
            <div className={a.asideCta}>
              Cần tư vấn cho dự án?
              <Link href={ROUTES.contact} className="btn btnPrimary">
                Nhận tư vấn miễn phí
              </Link>
            </div>
          </aside>

          <div className={a.content}>
            {post.quickAnswer && (
              <div className={a.quick}>
                <span className={a.kicker}>Trả lời nhanh</span>
                <p data-quick="1" className={a.quickText}>
                  {post.quickAnswer}
                </p>
              </div>
            )}

            {post.sections.map((sec, i) => (
              <section key={sec._key} id={`sec-${i}`} data-sec="1" className={a.section}>
                <h2 className={a.h2}>
                  <span className={a.h2Num}>{pad(i + 1)}</span>
                  <span>{sec.heading}</span>
                </h2>
                <PortableText value={sec.body ?? []} components={pt} />
              </section>
            ))}

            {post.relatedProducts.length > 0 && (
              <div className={a.prods}>
                <span className={a.kicker}>Sản phẩm nhắc đến trong bài</span>
                <div className={a.chips}>
                  {post.relatedProducts.map((pr, i) => (
                    <Link key={i} href={categoryPath(pr.categorySlug)} className="chip">
                      {pr.label} →
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {post.keyTakeaways.length > 0 && (
              <div className={a.keys}>
                <span className={a.kicker}>Ghi nhớ nhanh</span>
                {post.keyTakeaways.map((k, i) => (
                  <div key={i} className={a.key}>
                    <span className={a.keyMark} aria-hidden="true">
                      ✓
                    </span>
                    <span>{k}</span>
                  </div>
                ))}
              </div>
            )}

            {post.faq.length > 0 && (
              <section aria-labelledby="faq-title">
                <h2 id="faq-title" className={a.faqTitle}>
                  Câu hỏi thường gặp
                </h2>
                {post.faq.map((f, i) => (
                  <div key={i} className={a.faqItem}>
                    <h3 className={a.faqQ}>{f.question}</h3>
                    <p className={a.faqA}>{f.answer}</p>
                  </div>
                ))}
              </section>
            )}

            <div className={a.authorBox}>
              {settings.authorImage && (
                <span className={a.authorBoxAvatar}>
                  <FadeImage src={settings.authorImage.url} alt={settings.authorImage.alt} fill sizes="64px" />
                </span>
              )}
              <div className={a.authorBoxBody}>
                <span className={a.kicker}>Về tác giả</span>
                <span className={a.authorBoxName}>{settings.authorName}</span>
                <p className={a.authorBoxBio}>{settings.authorBio}</p>
                <Link href={ROUTES.eco} className="linkStrong" style={{ fontSize: 14.5 }}>
                  Tìm hiểu hệ sinh thái AnhTris →
                </Link>
              </div>
            </div>

            <div className={a.cta}>
              <span className={a.ctaText}>{post.cta || "Cần tư vấn giải pháp cho dự án của bạn?"}</span>
              <div className={a.ctaBtns}>
                <Link href={ROUTES.contact} className="btn btnInk btnSm">
                  Nhận tư vấn miễn phí
                </Link>
                <Link href={ROUTES.products} className={`btn btnOutline btnSm ${a.ctaGhost}`}>
                  Xem sản phẩm
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className={a.related}>
          <div className={`container ${a.relatedInner}`}>
            <div className="sectionHead" style={{ gap: 16 }}>
              <h2 className={a.relatedTitle}>Bài viết liên quan</h2>
              <Link href={ROUTES.blog} className="linkStrong">
                Xem tất cả bài viết →
              </Link>
            </div>
            <div className="grid3">
              {related.map((p) => (
                <PostCard key={p._id} post={p} showCategory />
              ))}
            </div>
          </div>
        </section>
      )}

      <JsonLd data={graph} />
    </PageTransition>
  );
}
