import Link from "next/link";
import { ProductService } from "@/services/shop.service";
import { ProductCard } from "@/components/ProductCard";

export default async function Home() {
  const svc = new ProductService();
  const [cats, featured] = await Promise.all([svc.categories(), svc.list({ page: 1, limit: 7 })]);
  const [hero, ...rest] = featured.data;
  return (
    <main className="mx-auto max-w-6xl px-4">
      <section className="grid gap-10 pt-10 sm:pt-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <div>
          <p className="text-sm font-light text-nuit/55">Catálogo · Pedidos por WhatsApp · Contraentrega</p>
          <h1 className="font-display mt-4 max-w-[14ch] text-[2.8rem] leading-[0.98] sm:text-[4.4rem]">
            Íntima, suave y a tu medida.
          </h1>
          <p className="mt-5 max-w-[46ch] text-[1rem] font-light leading-7 text-nuit/75">
            Eliges en calma, preguntas tu talla por WhatsApp y recibes en Santa Cruz con Yango o InDrive. Sin pagos en línea, sin apuros.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link href="/catalogo" className="bg-nuit px-7 py-3 text-[0.95rem] text-ivoire">
              Explorar la colección
            </Link>
            <span className="text-sm font-light text-nuit/60">Guía de tallas incluida en cada pieza</span>
          </div>
          <div className="mt-8 flex gap-8 border-t border-figue/15 pt-5 text-sm">
            <div><p className="font-display text-2xl">{featured.total}+</p><p className="font-light text-nuit/60">piezas en catálogo</p></div>
            <div><p className="font-display text-2xl">Bs</p><p className="font-light text-nuit/60">pago al recibir</p></div>
            <div><p className="font-display text-2xl">SCZ</p><p className="font-light text-nuit/60">entrega el mismo día</p></div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="arch overflow-hidden border border-figue/15">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={hero?.images[0]?.url ?? ""} alt={hero?.name ?? "Pieza destacada"} className="aspect-3/4 w-full object-cover" />
          </div>
          <div className="flex flex-col gap-4 pt-10">
            <div className="overflow-hidden border border-figue/15">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={rest[0]?.images[1]?.url ?? rest[0]?.images[0]?.url ?? ""} alt="" className="aspect-square w-full object-cover" />
            </div>
            <p className="bg-seda-soft p-4 font-display text-[1.05rem] italic leading-snug">
              “Escríbeme tu medida y te digo qué talla te queda.”
            </p>
          </div>
        </div>
      </section>

      <section className="mt-14 border-y border-figue/15 py-8">
        <div className="grid grid-cols-2 gap-px bg-nuit/10 sm:grid-cols-4">
          {cats.map((c) => (
            <Link key={c.id} href={`/catalogo?categoria=${c.slug}`} className="group bg-ivoire p-5 transition hover:bg-seda-soft">
              <span className="font-display block text-xl group-hover:text-figue">{c.name}</span>
              <span className="mt-1 block text-xs font-light text-nuit/50">{c.description}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-[1.9rem]">Piezas que se agotan</h2>
          <Link href="/catalogo" className="text-sm underline decoration-figue/50 underline-offset-4">Ver todo el catálogo</Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-3">
          {rest.slice(0, 6).map((p, i) => (
            <ProductCard key={p.id} p={p} large={i === 0} />
          ))}
        </div>
      </section>
    </main>
  );
}
