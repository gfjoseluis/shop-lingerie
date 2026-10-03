import Link from "next/link";
import { ProductService } from "@/services/shop.service";
import { ProductCard } from "@/components/ProductCard";

interface Props {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function CatalogoPage({ searchParams }: Props) {
  const sp = await searchParams;
  const page = Number(sp.page ?? 1);
  const svc = new ProductService();
  const [cats, res] = await Promise.all([
    svc.categories(),
    svc.list({
      q: sp.q,
      categorySlug: sp.categoria,
      size: sp.talla,
      color: sp.color,
      page: Number.isNaN(page) ? 1 : page,
      limit: 12,
      sort: (sp.orden as "newest" | "price_asc" | "price_desc") ?? "newest",
    }),
  ]);

  const qs = (patch: Record<string, string>) => {
    const u = new URLSearchParams({ ...sp, ...patch } as Record<string, string>);
    return `/catalogo?${u.toString()}`;
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="text-xl font-bold">Catálogo {sp.q ? `“${sp.q}”` : ""}</h1>
      <form action="/catalogo" className="mt-3 flex flex-wrap gap-2 text-sm">
        <input name="q" defaultValue={sp.q ?? ""} placeholder="Buscar..." className="rounded-full border px-3 py-2" />
        <select name="categoria" defaultValue={sp.categoria ?? ""} className="rounded-full border px-3 py-2">
          <option value="">Todas</option>
          {cats.map((c) => (
            <option key={c.id} value={c.slug}>{c.name}</option>
          ))}
        </select>
        <select name="talla" defaultValue={sp.talla ?? ""} className="rounded-full border px-3 py-2">
          <option value="">Talla</option><option>S</option><option>M</option><option>L</option><option>XL</option>
        </select>
        <select name="orden" defaultValue={sp.orden ?? "newest"} className="rounded-full border px-3 py-2">
          <option value="newest">Novedades</option><option value="price_asc">Menor precio</option><option value="price_desc">Mayor precio</option>
        </select>
        <button className="rounded-full bg-zinc-900 px-4 py-2 text-white">Filtrar</button>
      </form>

      <p className="mt-3 text-sm text-zinc-600">{res.total} productos · página {res.page}/{res.totalPages}</p>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {res.data.map((p) => <ProductCard key={p.id} p={p} />)}
      </div>

      <div className="mt-6 flex justify-between text-sm">
        {res.page > 1 ? <Link href={qs({ page: String(res.page - 1) })} className="rounded-full border px-4 py-2">← Anterior</Link> : <span />}
        {res.page < res.totalPages ? <Link href={qs({ page: String(res.page + 1) })} className="rounded-full border px-4 py-2">Siguiente →</Link> : <span />}
      </div>
    </main>
  );
}
