"use client";
import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/format";
import { buildWhatsAppLink, formatOrderForWhatsApp } from "@/lib/whatsapp";

export default function CheckoutPage() {
  const { lines, subtotal, clear } = useCart();
  const [form, setForm] = useState({ customerName: "", customerPhone: "", neighborhood: "", address: "", reference: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/v1/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, items: lines.map((l) => ({ variantId: l.variantId, quantity: l.quantity })) }),
      });
      const order = await res.json();
      if (!res.ok) throw new Error(order.error?.message ?? order.error ?? "Error al crear pedido");
      const msg = formatOrderForWhatsApp(order);
      clear();
      window.open(buildWhatsAppLink(msg), "_blank");
      window.location.href = `/checkout/exito?id=${order.id}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  if (lines.length === 0) return <main className="mx-auto max-w-3xl px-4 py-10">Carrito vacío.</main>;

  return (
    <main className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="text-xl font-bold">Finalizar pedido — Santa Cruz</h1>
      <p className="mt-1 text-sm text-zinc-600">Subtotal {formatPrice(subtotal)} · Pago contraentrega · Envío a coordinar</p>
      <form onSubmit={submit} className="mt-4 space-y-3 rounded-2xl border bg-white p-4">
        {(["customerName", "customerPhone", "neighborhood", "address", "reference"] as const).map((k) => (
          <input
            key={k}
            required={k !== "reference"}
            value={form[k]}
            onChange={(e) => setForm({ ...form, [k]: e.target.value })}
            placeholder={{ customerName: "Nombre completo", customerPhone: "Teléfono / WhatsApp", neighborhood: "Barrio (ej. Equipetrol)", address: "Dirección exacta", reference: "Referencia (opcional)" }[k]}
            className="w-full rounded-xl border px-3 py-2.5 text-sm"
          />
        ))}
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button disabled={loading} className="w-full rounded-full bg-green-600 py-3 text-white disabled:opacity-50">
          {loading ? "Creando..." : "Confirmar y enviar a WhatsApp"}
        </button>
      </form>
    </main>
  );
}
