import Link from "next/link";
import { ProductService } from "@/services/shop.service";
import { ProductCard } from "@/components/ProductCard";

export default async function Home() {
  const svc = new ProductService();
  const [cats, featured] = await Promise.all([
    svc.categories(),
    svc.list({ page: 1, limit: 8 }),
  ]);
  return (
    <main className="mx-auto max-w-6xl px-4">
      <section className="mt-6 rounded-3xl bg-pink-100 p-6 sm:p-10">
        <h1 className="text-2xl font-bold sm:text-4xl">Lencería en Santa Cruz de la Sierra</h1>
        <p className="mt-2 max-w-xl text-sm sm:text-base">
          Catálogo virtual, pedido por WhatsApp y pago contraentrega. Envío con Yango/InDrive a coordinar.
        </p>
        <div className="mt-4 flex gap-2">
          <Link href="/catalogo" className="rounded-full bg-zinc-900 px-5 py-2.5 text-white text-sm">
            Ver catálogo
          </Link>
          <Link href="/api-docs" className="rounded-full border bg-white px-5 py-2.5 text-sm">
            API v1
          </Link>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-semibold">Categorías</h2>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
          {cats.map((c) => (
            <Link key={c.id} href={`/catalogo?categoria=${c.slug}`} className="rounded-2xl border bg-white p-4 text-center text-sm hover:shadow">
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Destacados</h2>
          <Link href="/catalogo" className="text-sm underline">Ver todo</Link>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {featured.data.slice(0, 4).map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      </section>
    </main>
  );
}
