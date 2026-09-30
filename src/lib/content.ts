import { defineQuery } from "next-sanity";
import { cache } from "react";
import { client } from "@/sanity/client";
import {
  fallbackCategories,
  fallbackHome,
  fallbackMembers,
  fallbackPosts,
  fallbackProducts,
  fallbackProjects,
  fallbackSettings,
} from "./fallback";
import type { Category, HomePage, Member, Post, PostCard, Product, Project, SiteSettings } from "./types";

const IMG = `{ "url": asset->url, "alt": coalesce(alt, ""), "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height }`;

const PROJECT = `{ _id, title, "slug": slug.current, sector, products, member, summary, testimonial, "image": image${IMG} }`;
const POST_CARD = `_id, title, "slug": slug.current, category, publishedAt, "updatedAt": _updatedAt, excerpt, "coverImage": coverImage${IMG}`;
// Bài thiếu slug hoặc ngày đăng (tạo bằng API, bỏ qua validation) không được đưa lên site
const POST_FILTER = `_type == "post" && defined(slug.current) && defined(publishedAt)`;

const SETTINGS_Q = defineQuery(`*[_type == "siteSettings" && _id == "siteSettings"][0]{
  title, phone, phoneE164, email, showroomName, address, addressShort, legalName, taxId,
  "catalogueUrl": catalogue.asset->url, authorName, authorBio, "authorImage": authorImage${IMG},
  "logo": logo${IMG}, "ogImage": ogImage${IMG}, "socialLinks": coalesce(socialLinks[defined(url)]{ "label": coalesce(label, url), url }, [])
}`);

const HOME_Q = defineQuery(`*[_type == "homePage" && _id == "homePage"][0]{
  heroLede, "heroImage": heroImage${IMG}, heroBadge, strategyText, "steps": steps[defined(title)]{title, text}, showroomAddress,
  "showroomImage": showroomImage${IMG}, "faqs": faqs[defined(question) && defined(answer)]{question, answer},
  "featuredProjects": featuredProjects[]->${PROJECT}
}`);

const MEMBERS_Q = defineQuery(`*[_type == "member" && defined(slug.current)] | order(order asc){
  _id, name, "slug": slug.current, "logo": logo${IMG}, tag, summary, "highlights": coalesce(highlights[defined(@)], []),
  homeCta, ecoTag, description, "services": coalesce(services[defined(title)]{title, text}, []), ecoCta, "theme": coalesce(theme, "light")
}`);

const CATEGORIES_Q = defineQuery(`*[_type == "productCategory" && defined(slug.current)] | order(order asc){
  _id, title, "slug": slug.current, filterLabel, "tone": coalesce(tone, "purple"), "showOnHome": coalesce(showOnHome, false),
  subtitle, homeDescription, "homeImage": homeImage${IMG}
}`);

const PRODUCTS_Q = defineQuery(`*[_type == "product" && defined(slug.current)] | order(category->order asc, order asc, name asc){
  _id, name, "slug": slug.current, line, description, "image": image${IMG},
  "category": category->{ "slug": slug.current, title, "tone": coalesce(tone, "purple") }
}`);

const PROJECTS_Q = defineQuery(`*[_type == "project" && defined(slug.current)] | order(order asc)${PROJECT}`);

const POSTS_Q = defineQuery(`*[${POST_FILTER}] | order(publishedAt desc){ ${POST_CARD} }`);

const POST_Q = defineQuery(`*[${POST_FILTER} && slug.current == $slug][0]{
  ${POST_CARD}, quickAnswer, "sections": coalesce(sections[defined(heading)]{_key, heading, body}, []),
  "keyTakeaways": coalesce(keyTakeaways[defined(@)], []), "faq": coalesce(faq[defined(question) && defined(answer)]{question, answer}, []),
  "relatedProducts": coalesce(relatedProducts[defined(label)]{label, "categorySlug": category->slug.current}, []), cta, seo
}`);

const SLUGS_Q = defineQuery(`*[${POST_FILTER}].slug.current`);

/**
 * Có webhook (SANITY_REVALIDATE_SECRET) thì nội dung làm mới ngay khi bấm Publish, làm mới theo thời gian
 * chỉ là lưới an toàn (1 giờ — tiết kiệm quota API). Chưa có webhook thì tự làm mới sau 60 giây.
 */
const REVALIDATE = process.env.SANITY_REVALIDATE_SECRET ? 3600 : 60;

/**
 * Lấy dữ liệu từ Sanity (ISR, gắn tag theo document type để webhook revalidate).
 * Chưa cấu hình Sanity → trả về nội dung mặc định của bản thiết kế.
 */
async function load<T>(query: string, params: Record<string, string>, tags: string[], fallback: () => T): Promise<T> {
  if (!client) return fallback();
  const data = await client.fetch<T | null>(query, params, { next: { revalidate: REVALIDATE, tags } });
  return data ?? fallback();
}

export const getSettings = cache(() =>
  load<SiteSettings>(SETTINGS_Q, {}, ["siteSettings"], () => fallbackSettings).then((s) => ({ ...fallbackSettings, ...stripNulls(s) })),
);

export const getHome = cache(() =>
  load<HomePage>(HOME_Q, {}, ["homePage", "project"], () => fallbackHome).then((h) => {
    const home = { ...fallbackHome, ...stripNulls(h) };
    // Reference tới dự án đã xoá/chưa publish trả về null
    return { ...home, featuredProjects: home.featuredProjects.filter(Boolean) };
  }),
);

export const getMembers = cache(() => load<Member[]>(MEMBERS_Q, {}, ["member"], () => fallbackMembers));
export const getCategories = cache(() => load<Category[]>(CATEGORIES_Q, {}, ["productCategory"], () => fallbackCategories));
export const getProducts = cache(() => load<Product[]>(PRODUCTS_Q, {}, ["product", "productCategory"], () => fallbackProducts));
export const getProjects = cache(() => load<Project[]>(PROJECTS_Q, {}, ["project"], () => fallbackProjects));
export const getPosts = cache(() => load<PostCard[]>(POSTS_Q, {}, ["post"], () => fallbackPosts));
export const getPostSlugs = () => load<string[]>(SLUGS_Q, {}, ["post"], () => fallbackPosts.map((p) => p.slug));

export const getPost = cache((slug: string) =>
  load<Post | null>(POST_Q, { slug }, ["post", "productCategory"], () => fallbackPosts.find((p) => p.slug === slug) ?? null),
);

/** Trường để trống trong CMS không ghi đè giá trị mặc định. */
function stripNulls<T extends object>(o: T): Partial<T> {
  return Object.fromEntries(Object.entries(o).filter(([, v]) => v !== null && v !== undefined && v !== "")) as Partial<T>;
}
