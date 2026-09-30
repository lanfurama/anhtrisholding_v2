import type { PortableTextBlock } from "next-sanity";

export type Img = {
  url: string;
  alt: string;
  width?: number | null;
  height?: number | null;
} | null;

export type Link = { label: string; href: string };
export type Faq = { question: string; answer: string };
export type SocialLink = { label: string; url: string };

export type SiteSettings = {
  title: string;
  phone: string;
  phoneE164: string;
  email: string;
  showroomName: string;
  address: string;
  addressShort: string;
  catalogueUrl: string | null;
  legalName: string | null;
  taxId: string | null;
  authorName: string;
  authorBio: string;
  authorImage: Img;
  logo: Img;
  ogImage: Img;
  socialLinks: SocialLink[];
};

export type Member = {
  _id: string;
  name: string;
  slug: string;
  logo: Img;
  tag: string;
  summary: string;
  highlights: string[];
  homeCta: Link;
  ecoTag: string;
  description: string;
  services: { title: string; text: string }[];
  ecoCta: Link;
  theme: "dark" | "light" | "accent";
};

export type Category = {
  _id: string;
  title: string;
  slug: string;
  filterLabel: string | null;
  tone: "purple" | "orange";
  showOnHome: boolean;
  subtitle: string | null;
  homeDescription: string | null;
  homeImage: Img;
};

export type Product = {
  _id: string;
  name: string;
  slug: string;
  line: string | null;
  description: string | null;
  image: Img;
  category: { slug: string; title: string; tone: "purple" | "orange" } | null;
};

export type Project = {
  _id: string;
  title: string;
  slug: string;
  sector: string | null;
  products: string | null;
  member: string | null;
  summary: string | null;
  testimonial: { quote: string | null; author: string | null } | null;
  image: Img;
};

export type HomePage = {
  heroLede: string;
  heroImage: Img;
  heroBadge: { mark: string | null; label: string; title: string } | null;
  strategyText: string;
  steps: { title: string; text: string }[];
  featuredProjects: Project[];
  showroomAddress: string;
  showroomImage: Img;
  faqs: Faq[];
};

export type PostCard = {
  _id: string;
  title: string;
  slug: string;
  category: string;
  publishedAt: string;
  /** `_updatedAt` của Sanity — ngày sửa gần nhất (dateModified, sitemap) */
  updatedAt: string | null;
  excerpt: string;
  coverImage: Img;
};

export type PostSection = { _key: string; heading: string; body: PortableTextBlock[] };

export type Post = PostCard & {
  quickAnswer: string | null;
  sections: PostSection[];
  keyTakeaways: string[];
  faq: Faq[];
  relatedProducts: { label: string; categorySlug: string | null }[];
  cta: string | null;
  seo: { title: string | null; description: string | null; keywords: string | null } | null;
};
