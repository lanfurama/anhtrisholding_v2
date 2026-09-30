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
const POST_CARD = `_id, title, "slug": slug.current, category, publishedAt, excerpt, "coverImage": coverImage${IMG}`;

const SETTINGS_Q = defineQuery(`*[_type == "siteSettings" && _id == "siteSettings"][0]{
  title, phone, phoneE164, email, showroomName, address, addressShort, legalName, taxId,
  "catalogueUrl": catalogue.asset->url, authorName, authorBio, "authorImage": authorImage${IMG}
}`);

const HOME_Q = defineQuery(`*[_type == "homePage" && _id == "homePage"][0]{
  heroLede, "heroImage": heroImage${IMG}, heroBadge, strategyText, steps, showroomAddress,
  "showroomImage": showroomImage${IMG}, "faqs": faqs[]{question, answer},
  "featuredProjects": featuredProjects[]->${PROJECT}
}`);

const MEMBERS_Q = defineQuery(`*[_type == "member"] | order(order asc){
  _id, name, "slug": slug.current, "logo": logo${IMG}, tag, summary, "highlights": coalesce(highlights, []),
  homeCta, ecoTag, description, "services": coalesce(services[]{title, text}, []), ecoCta, "theme": coalesce(theme, "light")
}`);

const CATEGORIES_Q = defineQuery(`*[_type == "productCategory"] | order(order asc){
  _id, title, "slug": slug.current, filterLabel, "tone": coalesce(tone, "purple"), "showOnHome": coalesce(showOnHome, false),
  subtitle, homeDescription, "homeImage": homeImage${IMG}
}`);

const PRODUCTS_Q = defineQuery(`*[_type == "product"] | order(category->order asc, order asc, name asc){
  _id, name, "slug": slug.current, line, description, "image": image${IMG},
  "category": category->{ "slug": slug.current, title, "tone": coalesce(tone, "purple") }
}`);

const PROJECTS_Q = defineQuery(`*[_type == "project"] | order(order asc)${PROJECT}`);

const POSTS_Q = defineQuery(`*[_type == "post" && defined(slug.current)] | order(publishedAt desc){ ${POST_CARD} }`);

const POST_Q = defineQuery(`*[_type == "post" && slug.current == $slug][0]{
  ${POST_CARD}, quickAnswer, "sections": coalesce(sections[]{_key, heading, body}, []),
  "keyTakeaways": coalesce(keyTakeaways, []), "faq": coalesce(faq[]{question, answer}, []),
  "relatedProducts": coalesce(relatedProducts[]{label, "categorySlug": category->slug.current}, []), cta, seo
}`);

const SLUGS_Q = defineQuery(`*[_type == "post" && defined(slug.current)].slug.current`);

/**
 * Lấy dữ liệu từ Sanity (ISR 60 giây, gắn tag theo document type để webhook revalidate).
 * Chưa cấu hình Sanity → trả về nội dung mặc định của bản thiết kế.
 */
async function load<T>(query: string, params: Record<string, string>, tags: string[], fallback: () => T): Promise<T> {
  if (!client) return fallback();
  const data = await client.fetch<T | null>(query, params, { next: { revalidate: 60, tags } });
  return data ?? fallback();
}

export const getSettings = cache(() =>
  load<SiteSettings>(SETTINGS_Q, {}, ["siteSettings"], () => fallbackSettings).then((s) => ({ ...fallbackSettings, ...stripNulls(s) })),
);

export const getHome = cache(() =>
  load<HomePage>(HOME_Q, {}, ["homePage", "project"], () => fallbackHome).then((h) => ({ ...fallbackHome, ...stripNulls(h) })),
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
