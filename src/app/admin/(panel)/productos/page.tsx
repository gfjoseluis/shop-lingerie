import Link from "next/link";
import { getAdminRepository } from "@/repositories/factory";
import { effectivePrice, formatPrice } from "@/lib/format";
import { ToggleActive } from "@/components/admin/ToggleActive";

export default async function ProductosPage() {
  const repo = getAdminRepository();
  const { ProductService } = await import("@/services/shop.service");
  const [res, cats] = await Promise.all([
    new ProductService().list({ page: 1, limit: 200 }),
    repo.listCategories(),
  ]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl">Productos ({res.total})</h1>
        <Link href="/admin/productos/nuevo" className="bg-figue px-5 py-2.5 text-sm text-white">
          Nuevo producto
        </Link>
      </div>
      <div className="mt-4 overflow-x-auto border border-figue/15 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-seda-soft text-left">
              <th className="p-2">Producto</th>
              <th className="p-2">Precio</th>
              <th className="p-2">Variantes / stock</th>
              <th className="p-2">Estado</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {res.data.map((p) => (
              <tr key={p.id} className="border-b align-top">
                <td className="p-2">
                  <p className="font-medium">{p.name}</p>
                  <p className="text-xs text-nuit/50">{p.slug}</p>
                </td>
                <td className="p-2 whitespace-nowrap">
                  {formatPrice(effectivePrice(p.basePrice, p.salePrice))}
                  {p.salePrice ? <span className="block text-xs text-nuit/45 line-through">{formatPrice(p.basePrice)}</span> : null}
                </td>
                <td className="p-2 text-xs">{p.variants.map((v) => `${v.size}/${v.color}:${v.stock}`).join(" · ")}</td>
                <td className="p-2 text-xs">{p.isActive ? "Visible" : "Oculto"}</td>
                <td className="p-2 whitespace-nowrap">
                  <Link href={`/admin/productos/${p.id}`} className="mr-2 border border-nuit/25 px-3 py-1.5 text-xs">
                    Editar
                  </Link>
                  <ToggleActive id={p.id} active={p.isActive} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-nuit/50">Categorías: {cats.map((c) => c.name).join(", ")}</p>
    </main>
  );
}
