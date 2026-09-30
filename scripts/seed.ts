/**
 * Đẩy nội dung mặc định của bản thiết kế lên Sanity (chạy lại nhiều lần được — createOrReplace theo _id cố định).
 *   npm run seed
 * Dùng SANITY_API_WRITE_TOKEN trong .env.local; nếu trống thì dùng phiên đăng nhập của `npx sanity login`.
 * Ảnh được tải từ CDN hiện tại (hstatic) rồi upload vào Sanity Media.
 */
// @next/env là CommonJS — sanity exec (vite) chỉ nhận default import
import nextEnv from "@next/env";
import { getCliClient } from "sanity/cli";
import {
  fallbackCategories,
  fallbackHome,
  fallbackMembers,
  fallbackPosts,
  fallbackProducts,
  fallbackProjects,
  fallbackSettings,
} from "../src/lib/fallback";
import type { Img } from "../src/lib/types";

nextEnv.loadEnvConfig(process.cwd());
const token = process.env.SANITY_API_WRITE_TOKEN;
const client = getCliClient({ apiVersion: "2026-09-01", ...(token && { token }) });

const assetIds = new Map<string, string>();
async function upload(url: string) {
  const hit = assetIds.get(url);
  if (hit) return hit;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Không tải được ảnh ${url}: ${res.status}`);
  const filename = decodeURIComponent(new URL(url).pathname.split("/").pop() || "image");
  const asset = await client.assets.upload("image", Buffer.from(await res.arrayBuffer()), { filename });
  assetIds.set(url, asset._id);
  console.log("  ↑", filename);
  return asset._id;
}

const image = async (img: Img) => (img ? { _type: "image", asset: { _type: "reference", _ref: await upload(img.url) }, alt: img.alt } : undefined);
const ref = (id: string) => ({ _type: "reference", _ref: id });
const slug = (current: string) => ({ _type: "slug", current });
let n = 0;
const keyed = <T extends object>(items: T[]) => items.map((x) => ({ _key: `s${(n++).toString(36)}`, ...x }));

async function main() {
  const docs: Record<string, unknown>[] = [];

  for (const [i, c] of fallbackCategories.entries()) {
    docs.push({
      _id: c._id,
      _type: "productCategory",
      title: c.title,
      slug: slug(c.slug),
      filterLabel: c.filterLabel ?? undefined,
      order: i + 1,
      tone: c.tone,
      showOnHome: c.showOnHome,
      subtitle: c.subtitle ?? undefined,
      homeDescription: c.homeDescription ?? undefined,
      homeImage: await image(c.homeImage),
    });
  }

  for (const [i, p] of fallbackProducts.entries()) {
    docs.push({
      _id: p._id,
      _type: "product",
      name: p.name,
      slug: slug(p.slug),
      category: ref("category-" + p.category!.slug),
      line: p.line ?? undefined,
      description: p.description ?? undefined,
      image: await image(p.image),
      order: i + 1,
    });
  }

  for (const [i, m] of fallbackMembers.entries()) {
    docs.push({
      _id: m._id,
      _type: "member",
      name: m.name,
      slug: slug(m.slug),
      order: i + 1,
      logo: await image(m.logo),
      tag: m.tag,
      summary: m.summary,
      highlights: m.highlights,
      homeCta: m.homeCta,
      ecoTag: m.ecoTag,
      description: m.description,
      services: keyed(m.services.map((sv) => ({ _type: "service", ...sv }))),
      ecoCta: m.ecoCta,
      theme: m.theme,
    });
  }

  for (const [i, p] of fallbackProjects.entries()) {
    docs.push({
      _id: p._id,
      _type: "project",
      title: p.title,
      slug: slug(p.slug),
      order: i + 1,
      sector: p.sector ?? undefined,
      products: p.products ?? undefined,
      member: p.member ?? undefined,
      summary: p.summary ?? undefined,
      testimonial: p.testimonial ?? undefined,
      image: await image(p.image),
    });
  }

  for (const p of fallbackPosts) {
    docs.push({
      _id: p._id,
      _type: "post",
      title: p.title,
      slug: slug(p.slug),
      category: p.category,
      publishedAt: p.publishedAt,
      excerpt: p.excerpt,
      coverImage: await image(p.coverImage),
      quickAnswer: p.quickAnswer ?? undefined,
      sections: p.sections.map((s) => ({ _key: s._key, _type: "section", heading: s.heading, body: s.body })),
      keyTakeaways: p.keyTakeaways,
      faq: keyed(p.faq.map((f) => ({ _type: "faqItem", ...f }))),
      relatedProducts: keyed(
        p.relatedProducts.map((r) => ({ _type: "productLink", label: r.label, ...(r.categorySlug && { category: ref("category-" + r.categorySlug) }) })),
      ),
      cta: p.cta ?? undefined,
      seo: p.seo ?? undefined,
    });
  }

  const h = fallbackHome;
  docs.push({
    _id: "homePage",
    _type: "homePage",
    heroLede: h.heroLede,
    heroImage: await image(h.heroImage),
    heroBadge: h.heroBadge ?? undefined,
    strategyText: h.strategyText,
    steps: keyed(h.steps.map((s) => ({ _type: "step", ...s }))),
    featuredProjects: keyed(h.featuredProjects.map((p) => ref(p._id))),
    showroomAddress: h.showroomAddress,
    showroomImage: await image(h.showroomImage),
    faqs: keyed(h.faqs.map((f) => ({ _type: "faqItem", ...f }))),
  });

  const s = fallbackSettings;
  docs.push({
    _id: "siteSettings",
    _type: "siteSettings",
    title: s.title,
    phone: s.phone,
    phoneE164: s.phoneE164,
    email: s.email,
    showroomName: s.showroomName,
    address: s.address,
    addressShort: s.addressShort,
    authorName: s.authorName,
    authorBio: s.authorBio,
    authorImage: await image(s.authorImage),
  });

  const tx = client.transaction();
  docs.forEach((d) => tx.createOrReplace(d as { _id: string; _type: string }));
  await tx.commit();
  console.log(`✓ Đã ghi ${docs.length} document vào dataset "${client.config().dataset}"`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
