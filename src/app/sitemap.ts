import type { MetadataRoute } from "next";
import { getPosts } from "@/lib/content";
import { postPath, ROUTES } from "@/lib/routes";
import { siteUrl } from "@/sanity/env";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts();
  const pages = [ROUTES.home, ROUTES.eco, ROUTES.products, ROUTES.projects, ROUTES.contact, ROUTES.blog].map((path) => ({
    url: siteUrl + path,
    changeFrequency: "weekly" as const,
    priority: path === "/" ? 1 : 0.7,
  }));
  return [
    ...pages,
    ...posts.map((p) => ({ url: siteUrl + postPath(p.slug), lastModified: p.publishedAt, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
