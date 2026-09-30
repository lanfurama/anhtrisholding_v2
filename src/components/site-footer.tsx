import Link from "next/link";
import type { Member, SiteSettings } from "@/lib/types";
import { ROUTES } from "@/lib/routes";
import s from "./site-footer.module.css";

export function SiteFooter({ settings, members }: { settings: SiteSettings; members: Member[] }) {
  const legal = [settings.legalName, settings.taxId && `MST ${settings.taxId}`].filter(Boolean).join(" · ");
  return (
    <footer className={s.footer}>
      <div className={`container ${s.inner}`}>
        <div className={s.top}>
          <h2 className={s.headline}>
            Chuẩn mực và tiên phong cho <span className="cO">du lịch nghỉ dưỡng Việt Nam.</span>
          </h2>
          <Link href={ROUTES.contact} className={s.cta}>
            Liên hệ →
          </Link>
        </div>

        <div className={s.cols}>
          <div className={`${s.col} ${s.colAddr}`}>
            <span className={s.colTitle}>Showroom</span>
            <span>{settings.addressShort}</span>
          </div>
          <div className={s.col}>
            <span className={s.colTitle}>Liên hệ</span>
            <a href={`tel:${settings.phoneE164}`} className={s.phone}>
              {settings.phone}
            </a>
            <a href={`mailto:${settings.email}`}>{settings.email}</a>
          </div>
          <div className={s.col}>
            <span className={s.colTitle}>Thành viên</span>
            {members.map((m) => (
              <Link key={m._id} href={`${ROUTES.eco}#${m.slug}`}>
                {m.name}
              </Link>
            ))}
          </div>
          <div className={s.col}>
            <span className={s.colTitle}>Khám phá</span>
            <Link href={ROUTES.products}>Sản phẩm &amp; catalogue</Link>
            <Link href={ROUTES.projects}>Dự án</Link>
            <Link href={ROUTES.contact}>Báo giá</Link>
          </div>
        </div>

        <div className={s.wordmark} aria-hidden="true">
          <span>ANH</span>
          <span>TRIS</span>
        </div>
      </div>
      <div className={`container ${s.bottom}`}>
        <span>
          © {new Date().getFullYear()} {settings.title}
          {legal && ` · ${legal}`}
        </span>
        <span>anhtrisholdings.com</span>
      </div>
    </footer>
  );
}
