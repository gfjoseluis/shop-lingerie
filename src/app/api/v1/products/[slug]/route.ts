import { NextResponse } from "next/server";
import { ProductService } from "@/services/shop.service";

export async function GET(_req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const svc = new ProductService();
  const product = await svc.getBySlug(slug);
  if (!product) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json(product);
}
