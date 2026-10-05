import { notFound } from "next/navigation";
import { ProductService } from "@/services/shop.service";
import { ProductDetailClient } from "@/components/ProductDetailClient";
import { ProductCard } from "@/components/ProductCard";

export default async function ProductoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const svc = new ProductService();
  const product = await svc.getBySlug(slug);
  if (!product) notFound();

  // Combina con: misma categoría, con stock, sin el actual
  let related: Awaited<ReturnType<typeof svc.list>>["data"] = [];
  if (product.category) {
    const res = await svc.list({ categorySlugs: [product.category.slug], limit: 5 });
    related = res.data.filter((p) => p.id !== product.id && p.variants.some((v) => v.stock > 0)).slice(0, 4);
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <ProductDetailClient product={product} />
      {related.length > 0 ? (
        <section className="mt-14">
          <h2 className="font-display text-[1.7rem]">Combina con</h2>
          <div className="mt-4 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
