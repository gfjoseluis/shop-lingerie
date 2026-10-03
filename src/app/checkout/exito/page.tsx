import Link from "next/link";

export default async function ExitoPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await searchParams;
  return (
    <main className="mx-auto max-w-2xl px-4 py-10 text-center">
      <h1 className="text-2xl font-bold">¡Pedido {id ?? ""} creado!</h1>
      <p className="mt-2 text-sm text-zinc-600">Se abrió WhatsApp con tu pedido. Coordinamos entrega y pago contraentrega.</p>
      <Link href="/catalogo" className="mt-4 inline-block rounded-full bg-zinc-900 px-5 py-2.5 text-white text-sm">Seguir comprando</Link>
    </main>
  );
}
