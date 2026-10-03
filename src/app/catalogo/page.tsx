import Link from "next/link";
import { ProductService } from "@/services/shop.service";
import { ProductCard } from "@/components/ProductCard";
import { CatalogFilters } from "@/components/CatalogFilters";

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const arr = (v: string | string[] | undefined): string[] => (!v ? [] : Array.isArray(v) ? v : [v]);

export default async function CatalogoPage({ searchParams }: Props) {
  const sp = await searchParams;
  const page = Number(Array.isArray(sp.page) ? sp.page[0] : (sp.page ?? 1));
  const q = Array.isArray(sp.q) ? sp.q[0] : sp.q;
  const selected = {
    categoria: arr(sp.categoria),
    talla: arr(sp.talla),
    copa: arr(sp.copa),
    corte: arr(sp.corte),
    tela: arr(sp.tela),
  };
  const orden = (Array.isArray(sp.orden) ? sp.orden[0] : sp.orden) as "newest" | "price_asc" | "price_desc" | undefined;
  const svc = new ProductService();
  const [cats, res] = await Promise.all([
    svc.categories(),
    svc.list({
      q,
      categorySlugs: selected.categoria,
      sizes: selected.talla,
      page: Number.isNaN(page) ? 1 : page,
      limit: 12,
      sort: orden ?? "newest",
      cupTypes: selected.copa,
      cutTypes: selected.corte,
      materials: selected.tela,
    }),
  ]);

  const activeCount =
    selected.categoria.length + selected.talla.length + selected.copa.length + selected.corte.length + selected.tela.length;

  const qs = (patch: Record<string, string>) => {
    const u = new URLSearchParams();
    for (const [k, v] of Object.entries(sp)) {
      if (v === undefined) continue;
      (Array.isArray(v) ? v : [v]).forEach((x) => u.append(k, x));
    }
    for (const [k, v] of Object.entries(patch)) u.set(k, v);
    return `/catalogo?${u.toString()}`;
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-display text-[2.2rem]">La colección {q ? <span className="italic text-figue">“{q}”</span> : null}</h1>
      <p className="mt-1 text-sm font-light text-nuit/60">{res.total} piezas · página {res.page} de {res.totalPages}</p>

      <div className="mt-6 flex gap-8">
        <CatalogFilters cats={cats} selected={selected} sort={orden ?? "newest"} q={q} activeCount={activeCount} />
        <div className="min-w-0 flex-1">
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3">
            {res.data.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
          {res.data.length === 0 ? (
            <p className="mt-6 border border-nuit/15 bg-white p-6 text-center text-sm text-nuit/60">
              Nada coincide con esos filtros. <a href="/catalogo" className="underline">Limpiar</a>
            </p>
          ) : null}
          <div className="mt-10 flex justify-between text-sm">
            {res.page > 1 ? <Link href={qs({ page: String(res.page - 1) })} className="border border-nuit/25 px-5 py-2.5">Anterior</Link> : <span />}
            {res.page < res.totalPages ? <Link href={qs({ page: String(res.page + 1) })} className="border border-nuit/25 px-5 py-2.5">Siguiente</Link> : <span />}
          </div>
        </div>
      </div>
    </main>
  );
}
