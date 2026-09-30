import type { Metadata } from "next";
import { PageTransition } from "@/components/page-transition";
import p from "@/components/pages.module.css";
import { PostCard } from "@/components/post-card";
import { getPosts } from "@/lib/content";
import { ROUTES } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({
    title: "Cẩm nang HORECA — kinh nghiệm setup khách sạn, nhà hàng | AnhTris",
    description: "Kinh nghiệm chọn tableware, linen, amenities và bài trí bàn tiệc từ đội ngũ tư vấn Maiahorecare — AnhTris Holdings.",
    path: ROUTES.blog,
  });
}

export default async function BlogPage() {
  const posts = await getPosts();
  return (
    <PageTransition>
      <section className={`container ${p.intro}`}>
        <span className="eyebrow">Cẩm nang HORECA</span>
        <h1 className="display" style={{ fontSize: "clamp(44px, 7vw, 104px)", maxWidth: 1000 }}>
          Kinh nghiệm từ <span className="cO">đội ngũ AnhTris.</span>
        </h1>
      </section>
      <section className="container" style={{ paddingBottom: "clamp(72px, 10vw, 120px)" }}>
        <div className="grid3">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} showCategory />
          ))}
        </div>
      </section>
    </PageTransition>
  );
}
