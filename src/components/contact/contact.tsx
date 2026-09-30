"use client";

import Link from "next/link";
import { useState, useTransition, type ChangeEvent, type FormEvent } from "react";
import { submitQuote } from "@/app/actions";
import { validateQuote, type QuoteErrors, type QuoteFields } from "@/lib/quote";
import { ROUTES } from "@/lib/routes";
import { useSite } from "../providers";
import c from "./contact.module.css";

export function QuoteSummary() {
  const { quote, toggleQuote } = useSite();
  return (
    <div className={c.summary}>
      <div className={c.summaryHead}>
        <span>Đã chọn để báo giá</span>
        <span className={c.summaryCount}>{quote.length} mục</span>
      </div>
      {quote.length === 0 ? (
        <div className={c.summaryEmpty}>
          Chưa có mục nào — bạn vẫn có thể gửi yêu cầu tư vấn chung.
          <Link href={ROUTES.products} className="linkStrong">
            Chọn bộ sưu tập →
          </Link>
        </div>
      ) : (
        <ul className={c.summaryList}>
          {quote.map((q) => (
            <li key={q.id} className={c.summaryRow}>
              <span>{q.name}</span>
              <button type="button" className={c.remove} aria-label={`Bỏ ${q.name}`} onClick={() => toggleQuote(q)}>
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const EMPTY: QuoteFields = { name: "", company: "", phone: "", email: "", msg: "" };

export function QuoteForm({ interests }: { interests: string[] }) {
  const { quote, clearQuote } = useSite();
  const [f, setF] = useState<QuoteFields>(EMPTY);
  const [interest, setInterest] = useState(interests[0] ?? "");
  const [err, setErr] = useState<QuoteErrors>({});
  const [attempt, setAttempt] = useState(0);
  const [sent, setSent] = useState<QuoteFields | null>(null);
  const [pending, start] = useTransition();

  const set = (k: keyof QuoteFields) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setF({ ...f, [k]: e.target.value });
    if (k in err) setErr({ ...err, [k]: undefined });
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const website = String(new FormData(e.currentTarget).get("website") || "");
    const local = validateQuote(f);
    setAttempt((n) => n + 1);
    if (Object.keys(local).length) return setErr(local);
    start(async () => {
      const r = await submitQuote({ ...f, interest, items: quote.map((q) => q.name), website });
      if (r.ok) {
        setErr({});
        setSent(f);
      } else setErr(r.errors);
    });
  };

  if (sent) {
    return (
      <div className={c.sent} role="status">
        <span className={c.sentMark} aria-hidden="true">
          ✓
        </span>
        <h2 className={c.sentTitle}>Đã nhận yêu cầu.</h2>
        <p className={c.sentText}>
          Cảm ơn {sent.name}. Đội ngũ tư vấn sẽ liên hệ qua {sent.phone} trong 24 giờ làm việc.
        </p>
        <button
          type="button"
          className="btn btnOutline btnSm"
          style={{ alignSelf: "flex-start" }}
          onClick={() => {
            setSent(null);
            setF(EMPTY);
            clearQuote();
          }}
        >
          Gửi yêu cầu khác
        </button>
      </div>
    );
  }

  const field = (k: "name" | "phone" | "email") => ({
    "aria-invalid": err[k] ? true : undefined,
    "aria-describedby": err[k] ? `err-${k}` : undefined,
    "data-invalid": err[k] ? "1" : undefined,
  });
  const error = (k: "name" | "phone" | "email") =>
    err[k] && (
      <span key={attempt} id={`err-${k}`} className={`${c.error} rvShake`}>
        {err[k]}
      </span>
    );

  return (
    <form className={c.form} onSubmit={onSubmit} noValidate>
      <fieldset className={c.interests}>
        <legend className={c.legend}>Bạn quan tâm đến</legend>
        <div className={c.chips}>
          {interests.map((t) => (
            <button key={t} type="button" aria-pressed={interest === t} className={c.interest} onClick={() => setInterest(t)}>
              {t}
            </button>
          ))}
        </div>
      </fieldset>

      <div className={c.fields}>
        <label className={c.label}>
          Họ tên *
          <input className={c.input} value={f.name} onChange={set("name")} placeholder="Nguyễn Văn A" autoComplete="name" required {...field("name")} />
          {error("name")}
        </label>
        <label className={c.label}>
          Đơn vị
          <input className={c.input} value={f.company} onChange={set("company")} placeholder="Khách sạn / nhà hàng" autoComplete="organization" />
        </label>
        <label className={c.label}>
          Số điện thoại *
          <input
            className={c.input}
            value={f.phone}
            onChange={set("phone")}
            type="tel"
            inputMode="tel"
            placeholder="09xx xxx xxx"
            autoComplete="tel"
            required
            {...field("phone")}
          />
          {error("phone")}
        </label>
        <label className={c.label}>
          Email
          <input
            className={c.input}
            value={f.email}
            onChange={set("email")}
            type="email"
            inputMode="email"
            placeholder="ban@congty.vn"
            autoComplete="email"
            {...field("email")}
          />
          {error("email")}
        </label>
      </div>

      <label className={c.label}>
        Nhu cầu
        <textarea
          className={`${c.input} ${c.textarea}`}
          value={f.msg}
          onChange={set("msg")}
          rows={4}
          placeholder="Quy mô dự án, số phòng / số khách, thời gian khai trương, yêu cầu dập logo…"
        />
      </label>

      {/* Ô bẫy chống spam — người dùng thật không thấy */}
      <label className="srOnly" aria-hidden="true">
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>

      {err.form && (
        <p className={c.formError} role="alert">
          {err.form}
        </p>
      )}

      <button type="submit" className={`btn btnPrimary ${c.submit}`} disabled={pending}>
        {pending ? "Đang gửi…" : "Gửi yêu cầu →"}
      </button>
    </form>
  );
}
