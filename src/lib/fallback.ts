/**
 * Nội dung mặc định lấy từ bản thiết kế "AnhTris Redesign v3".
 * - Website dùng dữ liệu này khi chưa cấu hình Sanity (NEXT_PUBLIC_SANITY_PROJECT_ID trống).
 * - `scripts/seed.ts` đẩy chính dữ liệu này lên Sanity để biên tập tiếp.
 */
import type { PortableTextBlock } from "next-sanity";
import type { Category, HomePage, Member, Post, Product, Project, SiteSettings } from "./types";

const CDN = "https://cdn.hstatic.net/themes/200001050639/1001402692/14/";
const ARTICLE_IMG = "https://cdn.hstatic.net/files/200001050639/article/";

export const LOGO_URL = CDN + "logo.png";

const img = (url: string, alt: string) => ({ url, alt });

const LOGOS = {
  maiahorecare: "https://cdn.hstatic.net/200001050639/file/logo_maiahorecare_mau_chi_fa1e6000329246ac86d0159f9ddfbc8e_grande.png",
  maiahome: "https://file.hstatic.net/200001050639/file/logo_maiahome_9d020c6420c6471bbfc08c148f5d09d8_grande.png",
  trisGallery: "https://file.hstatic.net/200001050639/file/logo_tris_gallery_5045fc5509994aa0b74080784a15d428_grande.png",
};

export const fallbackSettings: SiteSettings = {
  title: "AnhTris Holdings",
  phone: "0853 748 898",
  phoneE164: "+84853748898",
  email: "sales@anhtrisholdings.com",
  showroomName: "Showroom AnhTris Holdings",
  address: "Gian hàng số 2, Khu vực sảnh Khách sạn Furama Đà Nẵng, 103–105 Võ Nguyên Giáp, P. Ngũ Hành Sơn, Tp. Đà Nẵng",
  addressShort: "Gian hàng số 2, sảnh Khách sạn Furama Đà Nẵng, 103–105 Võ Nguyên Giáp, Ngũ Hành Sơn",
  catalogueUrl: null,
  legalName: null,
  taxId: null,
  authorName: "Đội ngũ tư vấn Maiahorecare",
  authorBio:
    "Thành viên của AnhTris Holdings, cung cấp giải pháp HORECA — tableware, linen, amenities — cho khách sạn, resort và nhà hàng. Showroom tại sảnh Furama Resort Đà Nẵng.",
  authorImage: img(LOGOS.maiahorecare, "Logo Maiahorecare"),
};

export const fallbackMembers: Member[] = [
  {
    _id: "member-maiahorecare",
    name: "Maiahorecare",
    slug: "maiahorecare",
    logo: img(LOGOS.maiahorecare, "Logo Maiahorecare"),
    tag: "Giải pháp HORECA",
    summary:
      "Trọn bộ vật dụng cho khách sạn, nhà hàng — tableware, cutlery, linen, amenities đến nội thất cao cấp — cùng tư vấn giải pháp đồng bộ giúp kiểm soát chi phí và tạo dấu ấn thương hiệu.",
    highlights: ["Tableware", "Cutlery", "Linen", "Amenities", "Nội thất", "Sản phẩm xanh"],
    homeCta: { label: "Xem sản phẩm", href: "/collections/all" },
    ecoTag: "Giải pháp HORECA",
    description:
      "Giải pháp toàn diện cho khách sạn – nghỉ dưỡng, từ ý tưởng, thiết kế, triển khai đến vận hành. Sản phẩm tuyển chọn từ các thương hiệu uy tín toàn cầu.",
    services: [
      { title: "Phòng ngủ khách sạn", text: "Giường, nệm, vải vóc, đồ gỗ, tiện nghi phòng." },
      { title: "Ẩm thực & Nhà hàng", text: "Tableware, cutlery, linen bàn, giải pháp F&B." },
      { title: "Hội nghị & Tiệc", text: "Setup bàn ghế, bọc ghế, khăn tiệc theo quy mô." },
      { title: "Spa & Giải trí", text: "Amenities, bath linen, vật tư khu wellness." },
    ],
    ecoCta: { label: "Xem sản phẩm Maiahorecare", href: "/collections/all" },
    theme: "dark",
  },
  {
    _id: "member-maiahome",
    name: "Maiahome",
    slug: "maiahome",
    logo: img(LOGOS.maiahome, "Logo Maiahome"),
    tag: "Không gian sống",
    summary: "Thiết kế không gian sống cá nhân hóa, decor tinh tế, sản phẩm lifestyle và phân phối trà cao cấp TWG Tea (Singapore).",
    highlights: ["Thiết kế nội thất", "Decor", "Lifestyle", "TWG Tea"],
    homeCta: { label: "Tìm hiểu Maiahome", href: "/pages/he-sinh-thai#maiahome" },
    ecoTag: "Không gian sống",
    description: "Thiết kế nội thất cá nhân hóa, decor tinh tế và sản phẩm lifestyle — phân phối trà cao cấp TWG Tea (Singapore).",
    services: [
      { title: "Thiết kế nội thất", text: "Hiện đại, tối giản đến cổ điển, theo ngân sách." },
      { title: "Decor & lifestyle", text: "Đèn trang trí, tranh treo tường, phụ kiện." },
      { title: "TWG Tea", text: "Trà túi lọc cao cấp, TWG Saturn Tea Tin." },
    ],
    ecoCta: { label: "Tư vấn thiết kế", href: "/pages/lien-he" },
    theme: "light",
  },
  {
    _id: "member-tris-gallery",
    name: "Tris Gallery",
    slug: "tris-gallery",
    logo: img(LOGOS.trisGallery, "Logo Tris Gallery"),
    tag: "Nghệ thuật & quà tặng",
    summary:
      "Tranh nghệ thuật độc bản — từ tác phẩm hiện đại đến sáng tác đậm nét văn hóa Việt — nâng tầm thẩm mỹ không gian và là lựa chọn quà tặng doanh nghiệp sang trọng.",
    highlights: ["Tranh độc bản", "Quà tặng doanh nghiệp", "Tư vấn trưng bày"],
    homeCta: { label: "Tìm hiểu Tris Gallery", href: "/pages/he-sinh-thai#tris-gallery" },
    ecoTag: "Nghệ thuật",
    description: "Tranh nghệ thuật độc bản — từ tác phẩm hiện đại đến sáng tác đậm nét văn hóa Việt. Nghệ thuật – văn hóa – giá trị ứng dụng.",
    services: [
      { title: "Tác phẩm độc bản", text: "Trưng bày và bán tại sảnh Furama." },
      { title: "Quà tặng doanh nghiệp", text: "Lựa chọn sang trọng cho đối tác." },
      { title: "Tư vấn trưng bày", text: "Nâng tầm thẩm mỹ cho sảnh, phòng nghỉ." },
    ],
    ecoCta: { label: "Liên hệ Tris Gallery", href: "/pages/lien-he" },
    theme: "accent",
  },
];

type CatSeed = [slug: string, title: string, tone: Category["tone"], showOnHome: boolean, subtitle: string | null, desc: string | null];
const CATS: CatSeed[] = [
  ["tableware", "Tableware", "purple", true, "Chinaware · Whiteware", "DUNE, M2, Essentials Asia ELM, Grace, Moon — gốm màu và sứ trắng cho fine dining, resort, buffet."],
  ["cutlery", "Cutlery", "purple", true, null, "18/0 Series, Madel #1173 — inox cho nhà hàng, khách sạn."],
  ["linen", "Linen", "orange", true, null, "Khăn bàn Double-sided, 3D Lightning, Meteor Shower; bọc ghế, napkin, ga gối, khăn tắm."],
  ["amenities", "Amenities", "purple", true, null, "Bath amenities, Leatherite, Resin & Acrylic cho phòng khách sạn."],
  ["noi-that", "Nội thất", "purple", true, null, "Bàn ghế, đồ gỗ theo đặc thù từng dự án."],
  ["san-pham-xanh", "Sản phẩm xanh", "orange", true, null, "Vật dụng thân thiện môi trường cho resort."],
  ["lifestyle", "Lifestyle", "orange", false, null, null],
];

export const fallbackCategories: Category[] = CATS.map(([slug, title, tone, showOnHome, subtitle, homeDescription]) => ({
  _id: "category-" + slug,
  title,
  slug,
  filterLabel: slug === "san-pham-xanh" ? "Xanh" : null,
  tone,
  showOnHome,
  subtitle,
  homeDescription,
  homeImage: slug === "tableware" ? img(CDN + "slideshow_3.jpg?v=271", "Bàn ăn setup tableware cho nhà hàng") : null,
}));

const PRODUCTS: [cat: string, name: string, line: string, desc: string, image?: string][] = [
  ["tableware", "DUNE", "Chinaware · TACO4DUNE", "Bảng màu nâu cà phê và nâu trầm, cảm hứng đụn cát.", "https://cdn.hstatic.net/products/200001050639/dune_a734bce94d6f429d993ce5939687ed7d_1024x1024.jpg"],
  ["tableware", "M2", "Chinaware · 70 mã", "Men cảm hứng thiên nhiên, nhà hàng Á."],
  ["tableware", "Essentials Asia ELM", "Chinaware", "Dòng gốm cho ẩm thực châu Á."],
  ["tableware", "Grace", "Whiteware", "Sứ trắng cho buffet, tiệc."],
  ["tableware", "Moon", "Whiteware", "Sứ trắng nung hai lần."],
  ["cutlery", "18/0 Series", "Cutlery", "Inox 18/0 bền cho vận hành lớn."],
  ["cutlery", "Madel #1173", "Cutlery", "Thiết kế thanh lịch cho fine dining."],
  ["linen", "Double-sided", "Table linen", "Khăn bàn hai mặt."],
  ["linen", "3D Lightning Texture", "Table linen", "Vân nổi 3D."],
  ["linen", "Meteor Shower Texture", "Table linen", "Vân mưa sao băng."],
  ["linen", "Chair Cover", "Linen", "Bọc ghế tiệc, hội nghị."],
  ["linen", "Napkins", "Linen", "Khăn ăn nhiều chất liệu."],
  ["linen", "Bed Linen", "Linen", "Chăn ga gối khách sạn."],
  ["linen", "Bath Linen", "Linen", "Khăn tắm, thảm chân."],
  ["amenities", "Bath Amenities", "Amenities", "Bộ tiện ích phòng tắm."],
  ["amenities", "Leatherite", "Amenities", "Hộp da phòng khách sạn."],
  ["amenities", "Resin & Acrylic", "Amenities", "Khay, hộp resin & acrylic."],
  ["noi-that", "Nội thất HORECA", "Furniture", "Bàn ghế, đồ gỗ theo dự án."],
  ["san-pham-xanh", "Sản phẩm xanh", "Eco-friendly", "Khay mo cau, vật dụng thân thiện."],
  ["lifestyle", "TWG Tea túi lọc", "Maiahome · Lifestyle", "Trà túi lọc cao cấp TWG."],
  ["lifestyle", "TWG Saturn Tea Tin", "Maiahome · Lifestyle", "Hộp trà Saturn sang trọng."],
];

export const slugify = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const fallbackProducts: Product[] = PRODUCTS.map(([cat, name, line, description, image]) => {
  const c = fallbackCategories.find((x) => x.slug === cat)!;
  return {
    _id: "product-" + slugify(name),
    name,
    slug: slugify(name),
    line,
    description,
    image: image ? img(image, name) : null,
    category: { slug: c.slug, title: c.title, tone: c.tone },
  };
});

export const fallbackProjects: Project[] = [
  {
    _id: "project-v-senses-dining",
    title: "V-Senses Dining",
    slug: "v-senses-dining",
    sector: "Fine dining",
    products: "Tableware",
    member: "Maiahorecare",
    summary:
      "Ra mắt tháng 5/2025 tại TP.HCM, V-Senses Dining (Menas Group) nhanh chóng trở thành điểm nhấn của fine dining Việt Nam, và đã mở thêm chi nhánh thứ hai tại Celesta Rise. Maiahorecare đồng hành triển khai giải pháp tableware toàn diện từ các thương hiệu quốc tế uy tín.",
    testimonial: { quote: "Trích lời khách hàng", author: "tên, chức danh" },
    image: img(CDN + "share_fb_home.png?v=271", "Phòng VIP V-Senses Dining setup tableware"),
  },
  {
    _id: "project-steak-house-the-fan",
    title: "Steak House The Fan",
    slug: "steak-house-the-fan",
    sector: "Nhà hàng",
    products: "Cutlery",
    member: "Maiahorecare",
    summary: "Bối cảnh, giải pháp và sản phẩm đã sử dụng — bổ sung theo khung case study.",
    testimonial: null,
    image: null,
  },
  {
    _id: "project-furama-resort-da-nang",
    title: "Furama Resort Đà Nẵng",
    slug: "furama-resort-da-nang",
    sector: "Resort 5 sao",
    products: "Linen",
    member: null,
    summary: "Bộ chăn ga gối và khăn tắm cho khối phòng nghỉ — cũng là nơi đặt showroom AnhTris.",
    testimonial: null,
    image: null,
  },
];

export const fallbackHome: HomePage = {
  heroLede:
    "Cùng Maiahorecare, Maiahome và Tris Gallery, chúng tôi đồng hành từ thiết kế, tìm kiếm đến cung ứng — đồng bộ chất lượng, tối ưu chi phí cho khách sạn, resort và nhà hàng trên toàn quốc.",
  heroImage: img(CDN + "share_fb_home.png?v=271", "Không gian fine dining do AnhTris Holdings setup tableware và linen"),
  heroBadge: { mark: "F", label: "Showroom", title: "Sảnh Furama Resort Đà Nẵng" },
  strategyText:
    "Thay vì phải làm việc với nhiều nhà cung ứng riêng lẻ, khách hàng có một đầu mối duy nhất — tiết kiệm thời gian, chi phí và đảm bảo tính đồng bộ.",
  steps: [
    { title: "Ý tưởng", text: "Lắng nghe concept, quy mô và ngân sách của chủ đầu tư." },
    { title: "Thiết kế", text: "Đề xuất bộ sưu tập, chất liệu, dập logo thương hiệu." },
    { title: "Triển khai", text: "Cung ứng đồng bộ, đúng tiến độ khai trương." },
    { title: "Vận hành", text: "Bổ sung, thay thế và tối ưu chi phí dài hạn." },
  ],
  featuredProjects: fallbackProjects,
  showroomAddress: "Gian hàng số 2, sảnh Furama Resort · 103–105 Võ Nguyên Giáp, Ngũ Hành Sơn, Đà Nẵng.",
  showroomImage: img(CDN + "page_banner.jpg?v=271", "Showroom AnhTris Holdings"),
  faqs: [
    {
      question: "AnhTris Holdings gồm những thành viên nào?",
      answer:
        "Maiahorecare (giải pháp HORECA), Maiahome (thiết kế không gian sống, TWG Tea) và Tris Gallery (tranh nghệ thuật độc bản, quà tặng doanh nghiệp).",
    },
    {
      question: "Có nhận tùy chỉnh và dập logo không?",
      answer: "Có. Chúng tôi nhận tùy chỉnh chất liệu, kiểu dáng đến dập logo thương hiệu cho từng khách sạn, nhà hàng, khu nghỉ dưỡng.",
    },
    { question: "Showroom ở đâu?", answer: "Gian hàng số 2, sảnh Furama Resort, 103–105 Võ Nguyên Giáp, Ngũ Hành Sơn, Đà Nẵng." },
    { question: "Phạm vi cung ứng?", answer: "Miền Trung và trên toàn quốc, cho khách sạn, resort, nhà hàng, ẩm thực và bán lẻ." },
  ],
};

/* ---------- Bài viết ---------- */

let keySeq = 0;
const k = () => "k" + (keySeq++).toString(36);
const block = (text: string, listItem?: "bullet"): PortableTextBlock => ({
  _type: "block",
  _key: k(),
  style: "normal",
  markDefs: [],
  ...(listItem ? { listItem, level: 1 } : {}),
  children: [{ _type: "span", _key: k(), text, marks: [] }],
});

type SectionSeed = { h: string; p?: string[]; list?: string[]; after?: string[] };
const section = ({ h, p = [], list = [], after = [] }: SectionSeed) => ({
  _key: k(),
  heading: h,
  body: [...p.map((t) => block(t)), ...list.map((t) => block(t, "bullet")), ...after.map((t) => block(t))],
});

type PostSeed = {
  date: string;
  cat: string;
  img: string;
  slug: string;
  title: string;
  lede: string;
  quick: string;
  sections: SectionSeed[];
  keys: string[];
  cta: string;
  seoTitle: string;
  kw: string;
  desc: string;
  alt: string;
  faq: [string, string][];
  prods: [string, string][];
};

const POSTS: PostSeed[] = [
  {
    date: "2026-09-21",
    cat: "Xu hướng",
    img: "8f784d66a511118223bb90154b6c539f_d233e1263896446f85771e38a8084ff7_grande.jpg",
    slug: "arts-of-afternoon-tea-xu-huong-tiec-tra-chieu-va-nghe-thuat-bai-tri-voi-ke-banh-da-tang-co-dien",
    title: "Arts of Afternoon Tea: Xu hướng tiệc trà chiều và nghệ thuật bài trí với kệ bánh đa tầng cổ điển",
    lede: "Tiệc trà chiều đã bước ra khỏi khách sạn 5 sao để trở thành một lối sống.",
    quick:
      "Một bàn trà chiều chuẩn mực xoay quanh kệ bánh ba tầng: tầng dưới là bánh mặn, tầng giữa là scone, tầng trên là bánh ngọt — dùng từ dưới lên, đi cùng bộ ấm tách sứ đồng bộ.",
    sections: [
      {
        h: "Trà chiều đã trở thành một trải nghiệm",
        p: [
          "Từng là nghi thức riêng của giới quý tộc Anh, afternoon tea nay xuất hiện ở sảnh khách sạn, café cao cấp và cả những buổi tiệc riêng. Với nhà hàng và khách sạn, đây là cách khai thác khung giờ thấp điểm buổi chiều, đồng thời tạo ra khoảnh khắc đáng chụp ảnh cho khách.",
        ],
      },
      {
        h: "Kệ bánh ba tầng: thứ tự và ý nghĩa",
        p: ["Kệ bánh là trung tâm thị giác của bàn trà. Thứ tự sắp xếp gần như cố định:"],
        list: ["Tầng dưới: sandwich và bánh mặn cỡ một miếng cắn", "Tầng giữa: scone kèm kem và mứt", "Tầng trên: bánh ngọt, macaron, tart trái cây"],
        after: ["Khách dùng từ dưới lên, từ mặn đến ngọt. Kệ nên có tay cầm chắc chắn, khoảng cách giữa các tầng đủ cao để gắp bánh dễ dàng."],
      },
      {
        h: "Bộ ấm tách và phụ kiện",
        p: [
          "Ấm trà, tách có đĩa lót, bình sữa, hũ đường và kẹp đường nên cùng một dòng men để bàn trà trông liền mạch. Sứ trắng viền mảnh mang lại vẻ cổ điển; gốm màu phù hợp concept hiện đại hoặc trà chiều phong cách Á.",
        ],
      },
      {
        h: "Gợi ý bài trí",
        list: [
          "Khăn trải bàn sáng màu, napkin gấp đơn giản",
          "Hoa tươi cắm thấp để khách nhìn thấy nhau",
          "Mỗi khách một bộ tách đĩa, dao phết và nĩa bánh",
          "Kệ bánh đặt giữa bàn, ấm trà bên tay phải người rót",
        ],
      },
    ],
    keys: ["Kệ ba tầng dùng từ dưới lên: mặn → scone → ngọt", "Đồng bộ ấm, tách, bình sữa trong một dòng men", "Trà chiều giúp khai thác khung giờ thấp điểm"],
    cta: "Setup góc trà chiều cho khách sạn của bạn?",
    seoTitle: "Tiệc trà chiều & cách bài trí kệ bánh 3 tầng | AnhTris",
    kw: "tiệc trà chiều, afternoon tea, kệ bánh 3 tầng",
    desc: "Kệ bánh 3 tầng dùng từ dưới lên: bánh mặn, scone, bánh ngọt. Cách chọn ấm tách và bài trí bàn trà chiều cho khách sạn, café.",
    alt: "Bàn tiệc trà chiều với kệ bánh nhiều tầng và bộ ấm tách sứ",
    faq: [
      ["Kệ bánh trà chiều dùng theo thứ tự nào?", "Từ dưới lên: bánh mặn ở tầng dưới, scone ở tầng giữa, bánh ngọt ở tầng trên cùng."],
      ["Tiệc trà chiều cần những dụng cụ gì?", "Kệ bánh ba tầng, ấm trà, tách có đĩa lót, bình sữa, hũ đường, kẹp đường, dao phết và nĩa bánh cho mỗi khách."],
      ["Nên chọn sứ trắng hay gốm màu cho trà chiều?", "Sứ trắng viền mảnh hợp phong cách cổ điển; gốm màu hợp concept hiện đại hoặc trà chiều phong cách Á."],
    ],
    prods: [["tableware", "Ấm tách & chén dĩa sứ"], ["linen", "Khăn trải bàn & napkin"], ["lifestyle", "Trà TWG"]],
  },
  {
    date: "2026-09-07",
    cat: "Nhà hàng",
    img: "789060364_1804177697674725_7316801011082352604_n_281e489194214184884126dab392244e_grande.jpg",
    slug: "cach-phoi-mau-ban-an-sang-trong-bi-quyet-tao-nen-mot-ban-an-dep-cho-nha-hang-khach-san",
    title: "Cách phối màu bàn ăn sang trọng cho nhà hàng, khách sạn",
    lede: "Một bàn ăn đẹp đôi khi là thứ khách nhìn thấy trước cả món ăn.",
    quick:
      "Bàn ăn sang trọng thường dùng tối đa ba màu theo tỷ lệ 60–30–10: màu nền từ khăn trải bàn, màu phụ từ chén dĩa, màu nhấn từ napkin, hoa hoặc ly.",
    sections: [
      {
        h: "Vì sao màu sắc bàn ăn quan trọng",
        p: [
          "Khách nhìn thấy bàn ăn trước khi món đầu tiên được phục vụ. Màu sắc tạo cảm nhận về đẳng cấp và phong cách của nhà hàng, đồng thời làm nổi bật màu món ăn — yếu tố ảnh hưởng trực tiếp tới cảm giác ngon miệng.",
        ],
      },
      {
        h: "Quy tắc 60–30–10",
        list: ["60% màu nền: khăn trải bàn, runner", "30% màu phụ: chén dĩa, lót dĩa", "10% màu nhấn: napkin, hoa, nến, viền ly"],
        after: ["Giữ màu nền trung tính (trắng, kem, xám, be) giúp dễ thay màu nhấn theo mùa hoặc theo sự kiện."],
      },
      {
        h: "Các bảng màu dễ ứng dụng",
        list: [
          "Trắng – vàng đồng: cổ điển, hợp tiệc cưới và khách sạn 5 sao",
          "Be – nâu đất: ấm áp, hợp nhà hàng Á và concept thiên nhiên",
          "Xám – xanh rêu: hiện đại, tinh gọn cho fine dining",
          "Đen – trắng: tương phản mạnh, hợp steak house",
        ],
      },
      {
        h: "Đừng quên món ăn",
        p: [
          "Chén dĩa là khung tranh của món ăn. Món nhiều màu nên đặt trên dĩa trắng hoặc trung tính; món đơn sắc có thể dùng dĩa men màu để tăng chiều sâu. Nên thử bày món thật trên mẫu dĩa trước khi đặt số lượng lớn.",
        ],
      },
    ],
    keys: ["Tối đa ba màu, theo tỷ lệ 60–30–10", "Màu nền trung tính để dễ đổi theo mùa", "Thử bày món thật trên mẫu dĩa trước khi đặt hàng"],
    cta: "Cần tư vấn bảng màu cho bàn ăn nhà hàng?",
    seoTitle: "Cách phối màu bàn ăn sang trọng cho nhà hàng | AnhTris",
    kw: "phối màu bàn ăn, quy tắc 60-30-10, bàn ăn nhà hàng",
    desc: "Áp dụng quy tắc 60–30–10 để phối màu khăn bàn, chén dĩa và điểm nhấn. Bốn bảng màu dễ dùng cho nhà hàng, khách sạn.",
    alt: "Bàn ăn nhà hàng phối màu khăn trải bàn và chén dĩa",
    faq: [
      ["Quy tắc 60–30–10 khi phối màu bàn ăn là gì?", "60% màu nền từ khăn trải bàn, 30% màu phụ từ chén dĩa, 10% màu nhấn từ napkin, hoa, nến hoặc ly."],
      ["Màu chén dĩa nào làm món ăn nổi bật?", "Dĩa trắng hoặc trung tính hợp món nhiều màu; món đơn sắc có thể dùng dĩa men màu để tăng chiều sâu."],
      ["Một bàn ăn nên dùng bao nhiêu màu?", "Tối đa ba màu để bàn ăn sang trọng mà không rối mắt."],
    ],
    prods: [["tableware", "Chén dĩa sứ & gốm màu"], ["linen", "Khăn trải bàn, runner"], ["cutlery", "Dao muỗng nĩa"]],
  },
  {
    date: "2026-08-17",
    cat: "Nhà hàng",
    img: "758501452_122276236622115616_50396867396921637_n_99aa2946a4cc4913b5c3da4d846e1c5e_grande.jpg",
    slug: "tieu-chuan-ban-an-nha-hang-fine-dining",
    title: "Tiêu chuẩn bàn ăn nhà hàng fine dining",
    lede: "Bàn ăn phải đẹp mắt, sắp xếp khoa học và đúng công năng.",
    quick:
      "Bàn fine dining chuẩn đặt dĩa trình bày ở giữa, nĩa bên trái, dao bên phải, ly phía trên bên phải; dụng cụ xếp theo thứ tự dùng từ ngoài vào trong.",
    sections: [
      {
        h: "Nguyên tắc từ ngoài vào trong",
        p: [
          "Dụng cụ cho món đầu tiên đặt xa dĩa nhất; khách lần lượt dùng từ ngoài vào trong theo từng món. Lưỡi dao quay vào trong, cán dao và nĩa thẳng hàng, cách mép bàn khoảng 2–3 cm.",
        ],
      },
      {
        h: "Bố cục một chỗ ngồi",
        list: [
          "Dĩa trình bày ở giữa, cách mép bàn khoảng 2 cm",
          "Nĩa bên trái; dao và muỗng súp bên phải",
          "Dụng cụ tráng miệng nằm ngang phía trên dĩa",
          "Dĩa bánh mì và dao phết bơ phía trên bên trái",
          "Ly nước, ly vang đỏ, ly vang trắng phía trên bên phải",
        ],
      },
      {
        h: "Khoảng cách và sự đồng bộ",
        p: [
          "Mỗi chỗ ngồi nên rộng khoảng 60–75 cm để khách thoải mái. Mọi chỗ ngồi phải giống hệt nhau — cùng khoảng cách, cùng kiểu gấp napkin, cùng vị trí ly. Chính sự đồng đều tạo nên cảm giác chỉn chu của fine dining.",
        ],
      },
      {
        h: "Chọn dụng cụ phù hợp",
        p: [
          "Chén dĩa sứ cao cấp, dao nĩa inox có độ bóng và trọng lượng cầm tay tốt, ly pha lê mỏng là bộ ba cơ bản. Nên chọn dòng sản phẩm có sẵn số lượng lớn và dễ bổ sung khi hao hụt.",
        ],
      },
    ],
    keys: ["Dùng dụng cụ từ ngoài vào trong theo thứ tự món", "Mỗi chỗ ngồi rộng 60–75 cm, đồng đều tuyệt đối", "Chọn dòng sản phẩm dễ bổ sung khi hao hụt"],
    cta: "Chuẩn bị khai trương nhà hàng fine dining?",
    seoTitle: "Tiêu chuẩn bàn ăn fine dining: bố cục chuẩn | AnhTris",
    kw: "bàn ăn fine dining, setup bàn ăn, vị trí dao nĩa",
    desc: "Bố cục một chỗ ngồi fine dining chuẩn: vị trí dĩa, dao nĩa, ly và khoảng cách 60–75 cm. Nguyên tắc dùng dụng cụ từ ngoài vào trong.",
    alt: "Bàn ăn fine dining được setup dao nĩa, ly và napkin",
    faq: [
      ["Dao nĩa fine dining đặt thế nào?", "Nĩa bên trái, dao và muỗng súp bên phải, dụng cụ tráng miệng nằm ngang phía trên dĩa; khách dùng từ ngoài vào trong."],
      ["Mỗi chỗ ngồi fine dining rộng bao nhiêu?", "Khoảng 60–75 cm để khách thoải mái và đủ chỗ cho dụng cụ nhiều món."],
      ["Ly đặt ở đâu trên bàn fine dining?", "Phía trên bên phải chỗ ngồi, gồm ly nước, ly vang đỏ và ly vang trắng."],
    ],
    prods: [["tableware", "Chén dĩa sứ cao cấp"], ["cutlery", "Dao nĩa inox"], ["linen", "Napkin & khăn bàn"]],
  },
  {
    date: "2026-08-11",
    cat: "Xu hướng",
    img: "anhtrisholdings_782ce9bc14ca404484e13861c8a4ea1b_grande.jpeg",
    slug: "xu-huong-mix-match-ban-tiec-2026-nghe-thuat-nang-tam-thi-giac-tu-chen-dia-doc-la-va-dang-cap",
    title: "Xu hướng mix-match bàn tiệc 2026: chén dĩa độc lạ và đẳng cấp",
    lede: "Sự đồng bộ tuyệt đối của gốm sứ trắng đã nhường chỗ cho phối hợp tinh tế.",
    quick:
      "Mix-match là phối nhiều mẫu chén dĩa trên cùng một bàn nhưng vẫn giữ một điểm chung — màu men, chất liệu hoặc hình khối — để bàn tiệc có chiều sâu mà không rối.",
    sections: [
      {
        h: "Từ đồng bộ sang cá tính",
        p: [
          "Nhiều năm liền, bộ sứ trắng đồng bộ là lựa chọn an toàn cho nhà hàng và khách sạn. Năm 2026, xu hướng chuyển sang những bàn tiệc có câu chuyện riêng: gốm thủ công đặt cạnh sứ trắng, dĩa men màu phối cùng lót dĩa kim loại, mỗi món một kiểu dĩa.",
        ],
      },
      {
        h: "Công thức mix-match không rối",
        list: [
          "Giữ một yếu tố chung: cùng tông màu, chất liệu hoặc đường viền",
          "Phối tối đa 2–3 dòng sản phẩm trên một bàn",
          "Xen kẽ men bóng và men mờ để tạo chiều sâu",
          "Dùng khăn trải bàn trơn để chén dĩa là điểm nhấn",
        ],
      },
      {
        h: "Gợi ý phối theo mô hình",
        list: [
          "Nhà hàng Á: gốm men màu kết hợp chén sứ trắng nhỏ",
          "Fine dining: dĩa trình bày men mờ, dĩa món chính sứ trắng",
          "Tiệc cưới, sự kiện: lót dĩa vàng đồng với sứ viền mảnh",
        ],
      },
      {
        h: "Lưu ý khi đặt hàng",
        p: [
          "Mix-match cần tính kỹ số lượng từng mẫu và khả năng bổ sung về sau. Hãy chọn các dòng có sẵn hàng lâu dài, hoặc đặt dư 10–15% để thay thế khi vỡ.",
        ],
      },
    ],
    keys: ["Luôn giữ một điểm chung giữa các mẫu", "Tối đa 2–3 dòng sản phẩm trên một bàn", "Đặt dư 10–15% để thay thế khi vỡ"],
    cta: "Muốn phối bộ chén dĩa riêng cho nhà hàng?",
    seoTitle: "Xu hướng mix-match chén dĩa bàn tiệc 2026 | AnhTris",
    kw: "mix-match chén dĩa, xu hướng bàn tiệc 2026, gốm men màu",
    desc: "Mix-match chén dĩa không rối: giữ một điểm chung, tối đa 2–3 dòng sản phẩm. Gợi ý phối cho nhà hàng Á, fine dining, tiệc cưới.",
    alt: "Bàn tiệc phối nhiều mẫu chén dĩa gốm và sứ",
    faq: [
      ["Mix-match chén dĩa là gì?", "Là phối nhiều mẫu chén dĩa trên cùng một bàn nhưng giữ một điểm chung về màu men, chất liệu hoặc hình khối."],
      ["Nên phối bao nhiêu dòng sản phẩm trên một bàn?", "Tối đa 2–3 dòng để bàn tiệc có chiều sâu mà không rối."],
      ["Cần đặt dư bao nhiêu khi mix-match?", "Nên đặt dư 10–15% mỗi mẫu để thay thế khi vỡ."],
    ],
    prods: [["tableware", "Chinaware & gốm màu"], ["linen", "Khăn trải bàn trơn"], ["cutlery", "Cutlery"]],
  },
  {
    date: "2026-08-04",
    cat: "Khách sạn",
    img: "aira-suite-balcony_e6cc6ee44a5641aa88aa0131f537e265_grande.jpg",
    slug: "setup-phong-khach-san-chuan-4-sao-can-nhung-gi-checklist-day-du-giup-nang-tam-trai-nghiem-khach-luu-tru",
    title: "Setup phòng khách sạn chuẩn 4 sao cần những gì?",
    lede: "Checklist đầy đủ giúp nâng tầm trải nghiệm khách lưu trú.",
    quick:
      "Phòng khách sạn 4 sao cần đủ bốn nhóm: chăn ga gối và khăn chất lượng cao, amenities phòng tắm, tiện nghi như ấm siêu tốc, minibar, két sắt, và phụ kiện nội thất đồng bộ phong cách.",
    sections: [
      {
        h: "Bed linen và bath linen",
        p: [
          "Giường là trung tâm của trải nghiệm lưu trú. Ga, vỏ gối và vỏ chăn nên dùng cotton mật độ sợi cao, màu trắng để dễ kiểm soát vệ sinh. Mỗi phòng cần ít nhất ba bộ linen để luân chuyển: một bộ đang dùng, một bộ đang giặt và một bộ dự phòng.",
        ],
        list: ["Khăn tắm, khăn mặt, khăn tay và thảm chân cho mỗi khách", "Áo choàng tắm và dép đi trong phòng", "Gối dự phòng và chăn mỏng trong tủ"],
      },
      {
        h: "Amenities phòng tắm",
        list: [
          "Dầu gội, sữa tắm, dầu xả, dưỡng thể",
          "Bàn chải, kem đánh răng, lược, bông tắm",
          "Mũ tắm và bộ vệ sinh cá nhân",
          "Khay đựng amenities bằng da hoặc resin đồng bộ",
        ],
      },
      {
        h: "Tiện nghi trong phòng",
        list: ["Ấm siêu tốc, bộ tách trà và cà phê, khay đựng", "Minibar, két sắt, móc treo đồ", "Hộp khăn giấy, thùng rác, sổ thông tin khách sạn bọc da"],
      },
      {
        h: "Đồng bộ phong cách",
        p: [
          'Khay, hộp khăn giấy, sổ thông tin và thùng rác nên cùng chất liệu và tông màu với nội thất. Những chi tiết nhỏ này quyết định khách cảm nhận căn phòng là "4 sao" hay chỉ là "sạch sẽ".',
        ],
      },
    ],
    keys: ["Ít nhất ba bộ linen cho mỗi phòng để luân chuyển", "Amenities và phụ kiện cùng chất liệu, tông màu", "Chi tiết nhỏ quyết định cảm nhận hạng sao"],
    cta: "Cần checklist và báo giá setup phòng?",
    seoTitle: "Setup phòng khách sạn 4 sao: checklist đầy đủ | AnhTris",
    kw: "setup phòng khách sạn 4 sao, checklist phòng khách sạn, amenities",
    desc: "Checklist setup phòng khách sạn 4 sao: bed linen, bath linen, amenities phòng tắm, tiện nghi và phụ kiện đồng bộ phong cách.",
    alt: "Phòng khách sạn có ban công và bộ chăn ga trắng",
    faq: [
      ["Mỗi phòng khách sạn cần bao nhiêu bộ linen?", "Ít nhất ba bộ: một bộ đang dùng, một bộ đang giặt và một bộ dự phòng."],
      [
        "Amenities phòng tắm 4 sao gồm những gì?",
        "Dầu gội, sữa tắm, dầu xả, dưỡng thể, bàn chải, kem đánh răng, lược, bông tắm, mũ tắm và bộ vệ sinh cá nhân.",
      ],
      ["Vì sao phụ kiện phòng cần đồng bộ?", "Khay, hộp khăn giấy, sổ thông tin cùng chất liệu và tông màu giúp khách cảm nhận đúng hạng sao của phòng."],
    ],
    prods: [["linen", "Bed linen & bath linen"], ["amenities", "Amenities phòng tắm"], ["noi-that", "Nội thất phòng nghỉ"]],
  },
  {
    date: "2026-07-29",
    cat: "Sản phẩm xanh",
    img: "hinhanhmocau-5_eb878d08f2e44d4d936aca738c96ac81_grande.jpg",
    slug: "xu-huong-dung-khay-dia-mo-cau-cam-nang-lua-chon-giai-phap-xanh-cho-am-thuc-hien-dai",
    title: "Xu hướng dùng khay dĩa mo cau – giải pháp xanh cho ẩm thực hiện đại",
    lede: 'Không chỉ vì "xanh" mà còn vì trải nghiệm.',
    quick:
      "Khay dĩa mo cau được ép từ bẹ cau rụng tự nhiên, không hóa chất, chịu được đồ nóng và dầu mỡ, tự phân hủy sau vài tháng — lựa chọn thay nhựa dùng một lần cho buffet, sự kiện và đồ mang đi.",
    sections: [
      {
        h: "Mo cau là gì?",
        p: [
          "Mo cau là phần bẹ bao quanh thân cây cau, rụng tự nhiên khi cây trưởng thành. Bẹ được thu gom, làm sạch bằng nước rồi ép nhiệt thành khay, dĩa, chén nhiều kích thước. Mỗi sản phẩm có vân riêng, không cái nào giống cái nào.",
        ],
      },
      {
        h: "Ưu điểm cho ngành F&B",
        list: [
          "Không dùng keo hay hóa chất, an toàn thực phẩm",
          "Chịu nhiệt, chịu dầu, không thấm trong thời gian dùng",
          "Cứng cáp hơn giấy, không mềm khi đựng món có nước",
          "Tự phân hủy sinh học sau khoảng 2–3 tháng",
        ],
      },
      {
        h: "Ứng dụng phù hợp",
        p: [
          "Mo cau phát huy tốt nhất ở nơi cần dùng một lần nhưng vẫn muốn giữ trải nghiệm cao cấp: buffet ngoài trời, sự kiện, teabreak hội nghị, đồ mang đi của nhà hàng và các resort theo đuổi tiêu chí xanh.",
        ],
      },
      {
        h: "Lưu ý khi sử dụng",
        list: [
          "Không hâm trong lò vi sóng quá lâu hoặc ngâm nước lâu",
          "Bảo quản nơi khô ráo, thoáng khí",
          "Chọn nhà cung cấp có quy trình làm sạch và kiểm soát nấm mốc",
        ],
      },
    ],
    keys: ["Làm từ bẹ cau rụng tự nhiên, không hóa chất", "Chịu nhiệt, chịu dầu, phân hủy sau 2–3 tháng", "Phù hợp buffet, sự kiện, đồ mang đi"],
    cta: "Chuyển sang dụng cụ xanh cho sự kiện?",
    seoTitle: "Khay dĩa mo cau: giải pháp xanh cho F&B | AnhTris",
    kw: "khay dĩa mo cau, dĩa mo cau, sản phẩm xanh F&B",
    desc: "Khay dĩa mo cau làm từ bẹ cau tự nhiên, chịu nhiệt, chịu dầu, phân hủy sau 2–3 tháng. Ứng dụng cho buffet, sự kiện, đồ mang đi.",
    alt: "Khay dĩa mo cau đựng món ăn",
    faq: [
      ["Khay dĩa mo cau có an toàn thực phẩm không?", "Có. Sản phẩm được ép nhiệt từ bẹ cau tự nhiên, không dùng keo hay hóa chất."],
      ["Khay dĩa mo cau phân hủy trong bao lâu?", "Khoảng 2–3 tháng trong điều kiện tự nhiên."],
      ["Mo cau có dùng được với đồ nóng không?", "Có. Mo cau chịu được đồ nóng, lạnh và dầu mỡ; không nên hâm lò vi sóng quá lâu hoặc ngâm nước lâu."],
    ],
    prods: [["san-pham-xanh", "Khay dĩa mo cau"], ["tableware", "Chén dĩa sứ"], ["amenities", "Amenities"]],
  },
];

export const fallbackPosts: Post[] = POSTS.map((p) => ({
  _id: "post-" + p.slug.slice(0, 60),
  title: p.title,
  slug: p.slug,
  category: p.cat,
  publishedAt: p.date,
  excerpt: p.lede,
  coverImage: img(ARTICLE_IMG + p.img, p.alt),
  quickAnswer: p.quick,
  sections: p.sections.map(section),
  keyTakeaways: p.keys,
  faq: p.faq.map(([question, answer]) => ({ question, answer })),
  relatedProducts: p.prods.map(([categorySlug, label]) => ({ label, categorySlug })),
  cta: p.cta,
  seo: { title: p.seoTitle, description: p.desc, keywords: p.kw },
}));
