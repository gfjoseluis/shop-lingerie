import { notFound } from "next/navigation";
import { ProductService } from "@/services/shop.service";
import { ProductDetailClient } from "@/components/ProductDetailClient";

export default async function ProductoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const svc = new ProductService();
  const product = await svc.getBySlug(slug);
  if (!product) notFound();
  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <ProductDetailClient product={product} />
    </main>
  );
}
