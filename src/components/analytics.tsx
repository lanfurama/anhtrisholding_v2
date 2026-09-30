import Script from "next/script";

/** Google Analytics 4 — chỉ nạp khi có NEXT_PUBLIC_GA_ID (vd. G-XXXXXXX). Page view khi chuyển trang do GA4 tự đo (lịch sử trình duyệt). */
export function Analytics() {
  const id = process.env.NEXT_PUBLIC_GA_ID;
  if (!id) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`} strategy="afterInteractive" />
      <Script id="ga4" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag("js",new Date());gtag("config",${JSON.stringify(id).replace(/</g, "\\u003c")});`}
      </Script>
    </>
  );
}
