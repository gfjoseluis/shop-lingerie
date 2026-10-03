import { NextResponse } from "next/server";
import { productQuerySchema } from "@/schemas/api";
import { ProductService } from "@/services/shop.service";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const parsed = productQuerySchema.safeParse(Object.fromEntries(url.searchParams));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const q = parsed.data;
  const svc = new ProductService();
  const result = await svc.list({
    q: q.q,
    categorySlug: q.categoria,
    size: q.talla,
    color: q.color,
    minPrice: q.minPrice,
    maxPrice: q.maxPrice,
    page: q.page,
    limit: q.limit,
    sort: q.orden,
    cupType: q.copa,
    cutType: q.corte,
    material: q.tela,
  });
  return NextResponse.json(result);
}
