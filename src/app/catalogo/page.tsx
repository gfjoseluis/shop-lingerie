import Link from "next/link";
import { ProductService } from "@/services/shop.service";
import { ProductCard } from "@/components/ProductCard";
import { CUP_TYPES, CUT_TYPES, MATERIALS } from "@/data/guides";

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
      cupType: sp.copa,
      cutType: sp.corte,
      material: sp.tela,
    }),
  ]);

  const qs = (patch: Record<string, string>) => {
    const u = new URLSearchParams({ ...sp, ...patch } as Record<string, string>);
    return `/catalogo?${u.toString()}`;
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-display text-[2.2rem]">La colección {sp.q ? <span className="italic text-figue">“{sp.q}”</span> : null}</h1>
      <p className="mt-1 text-sm font-light text-nuit/60">{res.total} piezas · página {res.page} de {res.totalPages}</p>
      <form action="/catalogo" className="mt-5 flex flex-wrap items-end gap-3 border-y border-figue/15 py-4 text-sm">
        <label className="flex flex-col gap-1">Buscar<input name="q" defaultValue={sp.q ?? ""} placeholder="Encaje, seda…" className="border-b border-nuit/25 bg-transparent py-1.5 outline-none focus:border-figue" /></label>
        <label className="flex flex-col gap-1">Colección
          <select name="categoria" defaultValue={sp.categoria ?? ""} className="border border-figue/25 bg-transparent px-3 py-2">
            <option value="">Todas</option>
            {cats.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1">Talla
          <select name="talla" defaultValue={sp.talla ?? ""} className="border border-figue/25 bg-transparent px-3 py-2">
            <option value="">Todas</option>
            <option>S</option><option>M</option><option>L</option><option>XL</option><option>XXL</option>
            <option>34B</option><option>36B</option><option>36C</option><option>38C</option>
            <option>Único</option>
          </select>
        </label>
        <label className="flex flex-col gap-1">Copa
          <select name="copa" defaultValue={sp.copa ?? ""} className="border border-figue/25 bg-transparent px-3 py-2">
            <option value="">Todas</option>
            {CUP_TYPES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1">Corte
          <select name="corte" defaultValue={sp.corte ?? ""} className="border border-figue/25 bg-transparent px-3 py-2">
            <option value="">Todos</option>
            {CUT_TYPES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1">Tela
          <select name="tela" defaultValue={sp.tela ?? ""} className="border border-figue/25 bg-transparent px-3 py-2">
            <option value="">Todas</option>
            {MATERIALS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1">Orden
          <select name="orden" defaultValue={sp.orden ?? "newest"} className="border border-figue/25 bg-transparent px-3 py-2">
            <option value="newest">Novedades</option><option value="price_asc">Menor precio</option><option value="price_desc">Mayor precio</option>
          </select>
        </label>
        <button className="bg-nuit px-5 py-2.5 text-ivoire">Filtrar</button>
      </form>

      <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-3">
        {res.data.map((p) => <ProductCard key={p.id} p={p} />)}
      </div>

      <div className="mt-10 flex justify-between text-sm">
        {res.page > 1 ? <Link href={qs({ page: String(res.page - 1) })} className="border border-nuit/25 px-5 py-2.5">Anterior</Link> : <span />}
        {res.page < res.totalPages ? <Link href={qs({ page: String(res.page + 1) })} className="border border-nuit/25 px-5 py-2.5">Siguiente</Link> : <span />}
      </div>
    </main>
  );
}
