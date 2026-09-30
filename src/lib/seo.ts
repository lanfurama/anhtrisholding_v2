import type { Metadata } from "next";
import { siteUrl } from "@/sanity/env";
import { LOGO_URL, SITE_NAME } from "./brand";
import { getSettings } from "./content";
import type { Member, SiteSettings } from "./types";

export { SITE_NAME };
export const ORG_ID = `${siteUrl}/#org`;
export const WEBSITE_ID = `${siteUrl}/#website`;

type ShareImage = { url: string; alt: string };
type PageSeo = { title: string; description: string; path: string; image?: ShareImage | null };

/** Ảnh Open Graph cho trang không có ảnh riêng: ảnh chia sẻ trong "Thông tin chung" → logo. */
export async function defaultShareImage(): Promise<ShareImage> {
  const s = await getSettings();
  const img = s.ogImage ?? s.logo;
  return { url: img?.url || LOGO_URL, alt: img?.alt || SITE_NAME };
}

/** Title/description/canonical/OG/Twitter cho một trang tĩnh. */
export async function pageMetadata({ title, description, path, image }: PageSeo): Promise<Metadata> {
  const img = image ?? (await defaultShareImage());
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
  const sameAs = settings.socialLinks.map((s) => s.url);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORG_ID,
        name: settings.title,
        url: siteUrl + "/",
        logo: { "@type": "ImageObject", url: settings.logo?.url || LOGO_URL },
        telephone: settings.phoneE164,
        email: settings.email,
        address: {
          "@type": "PostalAddress",
          streetAddress: settings.address,
          addressLocality: "Ngũ Hành Sơn, Đà Nẵng",
          addressCountry: "VN",
        },
        ...(settings.legalName && { legalName: settings.legalName }),
        ...(settings.taxId && { taxID: settings.taxId }),
        ...(sameAs.length > 0 && { sameAs }),
        subOrganization: members.map((m) => ({ "@type": "Organization", name: m.name })),
      },
      { "@type": "WebSite", "@id": WEBSITE_ID, url: siteUrl + "/", name: SITE_NAME, inLanguage: "vi-VN", publisher: { "@id": ORG_ID } },
    ],
  };
}
