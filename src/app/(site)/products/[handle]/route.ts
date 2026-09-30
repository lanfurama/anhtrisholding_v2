import { getProducts } from "@/lib/content";
import { legacyProductPath } from "@/lib/legacy";

/** URL sản phẩm cũ của Haravan (/products/<handle>) → danh mục của sản phẩm đó trên trang sản phẩm. */
export async function GET(_req: Request, { params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const location = legacyProductPath(handle, await getProducts());
  return new Response(null, { status: 308, headers: { Location: location } });
}
