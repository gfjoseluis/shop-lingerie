import { notFound } from "next/navigation";
import { getAdminRepository } from "@/repositories/factory";
import { ProductForm } from "@/components/admin/ProductForm";
import { VariantStockRow } from "@/components/admin/VariantStockRow";

export default async function EditarProductoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const repo = getAdminRepository();
  const [product, cats] = await Promise.all([repo.getProductById(id), repo.listCategories()]);
  if (!product) notFound();

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-display mb-5 text-3xl">Editar: {product.name}</h1>
      <ProductForm categories={cats} initial={product} />
      <div className="mt-6 border border-figue/15 bg-white p-5">
        <h2 className="font-display text-xl">Stock rápido por variante</h2>
        <p className="text-xs text-nuit/55">Úsalo cuando el producto ya tiene pedidos (las variantes no se pueden reemplazar).</p>
        <ul className="mt-3 space-y-2 text-sm">
          {product.variants.map((v) => (
            <li key={v.id} className="flex items-center gap-3">
              <span className="w-40">
                {v.size} / {v.color} <span className="text-nuit/45">({v.sku})</span>
              </span>
              <VariantStockRow variantId={v.id} stock={v.stock} />
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
