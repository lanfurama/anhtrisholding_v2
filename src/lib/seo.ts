import type { Metadata } from "next";
import { siteUrl } from "@/sanity/env";
import { LOGO_URL } from "./fallback";
import type { Member, SiteSettings } from "./types";

export const SITE_NAME = "AnhTris Holdings";
export const ORG_ID = `${siteUrl}/#org`;
export const WEBSITE_ID = `${siteUrl}/#website`;

type PageSeo = { title: string; description: string; path: string; image?: { url: string; alt: string } | null };

/** Title/description/canonical/OG/Twitter cho một trang tĩnh. */
export function pageMetadata({ title, description, path, image }: PageSeo): Metadata {
  const img = image ?? { url: LOGO_URL, alt: SITE_NAME };
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      title,
      description,
      url: path,
      siteName: SITE_NAME,
      locale: "vi_VN",
      images: [{ url: img.url, alt: img.alt }],
    },
    twitter: { card: "summary_large_image", title, description, images: [img.url] },
  };
}

export function organizationGraph(settings: SiteSettings, members: Member[]) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORG_ID,
        name: settings.title,
        url: siteUrl + "/",
        logo: { "@type": "ImageObject", url: LOGO_URL },
        telephone: settings.phoneE164,
        email: settings.email,
        address: {
          "@type": "PostalAddress",
          streetAddress: settings.address,
          addressLocality: "Ngũ Hành Sơn, Đà Nẵng",
          addressCountry: "VN",
        },
        subOrganization: members.map((m) => ({ "@type": "Organization", name: m.name })),
      },
      { "@type": "WebSite", "@id": WEBSITE_ID, url: siteUrl + "/", name: SITE_NAME, inLanguage: "vi-VN", publisher: { "@id": ORG_ID } },
    ],
  };
}
