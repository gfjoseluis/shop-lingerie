"use client";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/format";

export default function CarritoPage() {
  const { lines, subtotal, setQty, remove } = useCart();
  if (lines.length === 0)
    return (
      <main className="mx-auto max-w-3xl px-4 py-10 text-center">
        <h1 className="text-xl font-bold">Carrito vacío</h1>
        <Link href="/catalogo" className="mt-4 inline-block rounded-full bg-zinc-900 px-5 py-2.5 text-white text-sm">Ver catálogo</Link>
      </main>
    );
  return (
    <main className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="text-xl font-bold">Carrito</h1>
      <div className="mt-4 space-y-3">
        {lines.map((l) => (
          <div key={l.variantId} className="flex gap-3 rounded-2xl border bg-white p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={l.imageUrl} alt={l.productName} className="h-20 w-16 rounded-lg object-cover" />
            <div className="flex-1 text-sm">
              <p className="font-medium">{l.productName}</p>
              <p className="text-zinc-500">{l.size} / {l.color} · {formatPrice(l.unitPrice)}</p>
              <div className="mt-2 flex items-center gap-2">
                <button onClick={() => setQty(l.variantId, l.quantity - 1)} className="rounded-full border px-3">-</button>
                <span>{l.quantity}</span>
                <button onClick={() => setQty(l.variantId, l.quantity + 1)} className="rounded-full border px-3">+</button>
                <button onClick={() => remove(l.variantId)} className="ml-auto text-red-600">Quitar</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-2xl border bg-white p-4">
        <p className="flex justify-between font-bold"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></p>
        <p className="mt-1 text-xs text-zinc-500">Envío Yango/InDrive a coordinar. Pago contraentrega.</p>
        <Link href="/checkout" className="mt-3 block bg-nuit py-3 text-center text-ivoire">Finalizar por WhatsApp</Link>
      </div>
    </main>
  );
}
