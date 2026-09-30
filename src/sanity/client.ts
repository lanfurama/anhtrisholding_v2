import "server-only";
import { createClient, type SanityClient } from "next-sanity";
import { apiVersion, dataset, isSanityConfigured, projectId } from "./env";

// useCdn: false — Next đã cache kết quả (ISR + tag). Đọc qua API CDN của Sanity thì lần làm mới ngay sau webhook
// có thể nhận lại bản cũ và cache tiếp; next-sanity khuyến nghị tắt CDN khi dùng ISR/revalidate theo tag.
export const client: SanityClient | null = isSanityConfigured
  ? createClient({ projectId, dataset, apiVersion, useCdn: false, perspective: "published" })
  : null;

/** Client có quyền ghi — chỉ dùng trong Server Actions / Route Handlers. */
export function getWriteClient(): SanityClient | null {
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!isSanityConfigured || !token) return null;
  return createClient({ projectId, dataset, apiVersion, useCdn: false, token });
}
