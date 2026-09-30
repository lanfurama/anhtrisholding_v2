import type { Metadata } from "next";
import { QuoteForm, QuoteSummary } from "@/components/contact/contact";
import c from "@/components/contact/contact.module.css";
import { PageTransition } from "@/components/page-transition";
import { getMembers, getSettings } from "@/lib/content";
import { ROUTES } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { phone } = await getSettings();
  return pageMetadata({
    title: "Liên hệ & yêu cầu báo giá | AnhTris Holdings",
    description: `Gửi yêu cầu báo giá tableware, linen, amenities. Showroom tại sảnh Furama Đà Nẵng, hotline ${phone}.`,
    path: ROUTES.contact,
  });
}

export default async function ContactPage() {
  const [settings, members] = await Promise.all([getSettings(), getMembers()]);
  const interests = [...members.map((m) => m.name), "Trọn gói"];
  return (
    <PageTransition>
      <section className={`container ${c.page}`}>
        <div className={c.left}>
          <span className="eyebrow">Liên hệ &amp; báo giá</span>
          <h1 className="display" style={{ fontSize: "clamp(40px, 5.6vw, 76px)", lineHeight: 0.98 }}>
            Hãy cùng xây dựng không gian <span className="cO">của bạn.</span>
          </h1>
          <QuoteSummary />
          <address className={c.showroom} style={{ fontStyle: "normal" }}>
            <span className={c.showroomName}>{settings.showroomName}</span>
            <span className={c.showroomAddr}>{settings.address}</span>
            <span>
              <a href={`tel:${settings.phoneE164}`} className="linkStrong">
                {settings.phone}
              </a>
              {" · "}
              <a href={`mailto:${settings.email}`}>{settings.email}</a>
            </span>
          </address>
        </div>
        <div className={c.card}>
          <QuoteForm interests={interests} />
        </div>
      </section>
    </PageTransition>
  );
}
