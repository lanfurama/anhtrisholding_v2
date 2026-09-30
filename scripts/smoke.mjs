/**
 * Smoke test bản build production: chạy `next start`, gọi các route chính, kiểm tra status, redirect URL cũ,
 * header bảo mật, dữ liệu có cấu trúc và việc nội dung mặc định không lọt vào JS phía client.
 *   npm run build && npm run smoke
 */
import { spawn } from "node:child_process";

const PORT = Number(process.env.SMOKE_PORT || 3210);
const BASE = `http://127.0.0.1:${PORT}`;
// Chuỗi chỉ có trong src/lib/fallback.ts — xuất hiện trong JS client nghĩa là module nội dung mặc định bị bundle nhầm
const FALLBACK_MARKER = "/article/";

const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-p", String(PORT)], {
  stdio: ["ignore", "pipe", "pipe"],
});
let serverLog = "";
server.stdout.on("data", (d) => (serverLog += d));
server.stderr.on("data", (d) => (serverLog += d));

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const get = (path, init = {}) => fetch(BASE + path, { redirect: "manual", signal: AbortSignal.timeout(20_000), ...init });

async function waitReady() {
  for (let i = 0; i < 80; i++) {
    if (server.exitCode !== null) break;
    try {
      await get("/robots.txt");
      return;
    } catch {
      await sleep(250);
    }
  }
  throw new Error("next start không chạy được:\n" + serverLog);
}

const failures = [];
function check(name, ok, detail = "") {
  console.log(`${ok ? "✓" : "✗"} ${name}${ok || !detail ? "" : ` — ${detail}`}`);
  if (!ok) failures.push(name);
}

async function page(path, status, patterns = []) {
  const res = await get(path);
  const html = await res.text();
  check(`${path} → ${status}`, res.status === status, `nhận ${res.status}`);
  for (const re of patterns) check(`${path} có ${re}`, re.test(html));
  return html;
}

async function redirect(path, target) {
  const res = await get(path);
  const location = res.headers.get("location");
  const got = location && new URL(location, BASE);
  const actual = got ? got.pathname + got.search : null;
  check(`${path} ⇒ ${target}`, res.status === 308 && actual === target, `nhận ${res.status} ${actual}`);
}

async function main() {
  await waitReady();

  const home = await page("/", 200, [/<h1/, /"@type":"Organization"/, /"@type":"FAQPage"/, /href="\/blogs\/news"/]);
  for (const path of ["/pages/he-sinh-thai", "/collections/all", "/pages/du-an", "/blogs/news", "/robots.txt", "/studio"]) {
    await page(path, 200);
  }
  await page("/pages/lien-he", 200, [/Gửi yêu cầu/]);

  const sitemap = await page("/sitemap.xml", 200, [/<loc>/]);
  const post = sitemap.match(/<loc>[^<]*(\/blogs\/news\/[^<]+)<\/loc>/)?.[1];
  check("sitemap có bài viết", Boolean(post));
  if (post) await page(post, 200, [/"@type":"BlogPosting"/, /"@type":"BreadcrumbList"/, /rel="canonical"/]);

  await page("/khong-ton-tai-smoke", 404, [/name="robots" content="noindex"/, /Điều hướng chính/]);
  const missingPost = await page("/blogs/news/khong-ton-tai-smoke", 404, [/name="robots" content="noindex"/, /<title>Không tìm thấy trang/]);
  check("404 bài viết không còn robots index của layout", !/content="index, follow"/.test(missingPost));

  await redirect("/collections/tableware", "/collections/all?cat=tableware");
  await redirect("/collections/khong-co", "/collections/all");
  await redirect("/products/dune", "/collections/all?cat=tableware");
  await redirect("/blogs/news/tagged/xu-huong", "/blogs/news");
  await redirect("/cart", "/pages/lien-he");

  const res = await get("/");
  check("header X-Content-Type-Options", res.headers.get("x-content-type-options") === "nosniff");
  check("không lộ X-Powered-By", !res.headers.has("x-powered-by"));

  const scripts = [...new Set(home.match(/\/_next\/static\/chunks\/[^"]+\.js/g) ?? [])];
  let leaked = [];
  for (const src of scripts) if ((await (await get(src)).text()).includes(FALLBACK_MARKER)) leaked.push(src);
  check(`nội dung mặc định không nằm trong JS client (${scripts.length} file)`, leaked.length === 0, leaked.join(", "));
}

try {
  await main();
} catch (e) {
  failures.push(String(e));
  console.error(e);
} finally {
  server.kill();
}

if (failures.length) {
  console.error(`\n${failures.length} kiểm tra thất bại.`);
  process.exit(1);
}
console.log("\nSmoke test đạt.");
