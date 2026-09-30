import { getCategories } from "@/lib/content";
import { legacyCollectionPath } from "@/lib/legacy";

/** URL danh mục cũ của Haravan (/collections/<handle>) → bộ lọc tương ứng trên trang sản phẩm. */
export async function GET(_req: Request, { params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const location = legacyCollectionPath(handle, await getCategories());
  return new Response(null, { status: 308, headers: { Location: location } });
}
