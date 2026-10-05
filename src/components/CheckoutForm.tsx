"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Turnstile } from "react-turnstile";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/format";
import { buildWhatsAppLink, formatOrderForWhatsApp } from "@/lib/whatsapp";
import type { SiteSettings } from "@/lib/settings";

const PHONE_PREFIX = "591";
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  const local = digits.startsWith(PHONE_PREFIX) ? digits.slice(PHONE_PREFIX.length) : digits;
  // Celulares Bolivia: 8 dígitos, empiezan con 6 o 7
  if (/^[67]\d{7}$/.test(local)) return PHONE_PREFIX + local;
  return null;
}

export function CheckoutForm({ settings }: { settings: SiteSettings }) {
  const router = useRouter();
  const { lines, subtotal, clear } = useCart();
  const [form, setForm] = useState({ customerName: "", customerPhone: "", neighborhood: "", address: "", reference: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const phone = normalizePhone(form.customerPhone);
    if (!phone) {
      setError("Revisa tu número: escribe los 8 dígitos de tu celular (ej. 70012345).");
      return;
    }
    if (TURNSTILE_SITE_KEY && !turnstileToken) {
      setError("Espera un momento a que termine la verificación anti-bots e intenta de nuevo.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/v1/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, customerPhone: phone, turnstileToken, items: lines.map((l) => ({ variantId: l.variantId, quantity: l.quantity })) }),
      });
      const order = await res.json();
      if (!res.ok) throw new Error(order.error?.message ?? order.error ?? "Error al crear pedido");
      const msg = formatOrderForWhatsApp(order, settings.storeName);
      clear();
      window.open(buildWhatsAppLink(msg, settings.whatsappNumber), "_blank");
      router.push(`/checkout/exito?id=${order.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  if (lines.length === 0) return <main className="mx-auto max-w-3xl px-4 py-10">Carrito vacío.</main>;

  const input = "w-full border border-nuit/20 px-3 py-2.5 text-sm outline-none focus:border-figue";

  return (
    <main className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="font-display text-[1.9rem]">Finalizar pedido</h1>
      <p className="mt-1 text-sm font-light text-nuit/60">Subtotal {formatPrice(subtotal)} · Pago contraentrega · Envío a coordinar</p>
      <form onSubmit={submit} className="mt-4 space-y-3 border border-figue/15 bg-white p-4">
        <div>
          <label htmlFor="co-nombre" className="text-sm text-nuit/70">Nombre completo</label>
          <input
            id="co-nombre"
            required
            value={form.customerName}
            onChange={(e) => setForm({ ...form, customerName: e.target.value })}
            placeholder="Ej. María Pérez"
            autoComplete="name"
            className={`${input} mt-1`}
          />
        </div>
        <div>
          <label htmlFor="co-tel" className="text-sm text-nuit/70">Celular / WhatsApp</label>
          <div className="mt-1 flex">
            <span className="border border-r-0 border-nuit/20 bg-seda-soft px-3 py-2.5 text-sm font-medium">+{PHONE_PREFIX}</span>
            <input
              id="co-tel"
              required
              inputMode="numeric"
              maxLength={11}
              value={form.customerPhone}
              onChange={(e) => setForm({ ...form, customerPhone: e.target.value.replace(/[^\d]/g, "").slice(0, 11) })}
              placeholder="70012345"
              autoComplete="tel"
              className="w-full border border-nuit/20 px-3 py-2.5 text-sm outline-none focus:border-figue"
            />
          </div>
          <p className="mt-1 text-xs font-light text-nuit/55">Solo tus 8 dígitos, sin el 591. Si lo pegas con 591 igual lo aceptamos.</p>
        </div>
        <div>
          <label htmlFor="co-barrio" className="text-sm text-nuit/70">Barrio</label>
          <input
            id="co-barrio"
            required
            value={form.neighborhood}
            onChange={(e) => setForm({ ...form, neighborhood: e.target.value })}
            placeholder="Ej. Equipetrol"
            autoComplete="address-level3"
            className={`${input} mt-1`}
          />
        </div>
        <div>
          <label htmlFor="co-dir" className="text-sm text-nuit/70">Dirección exacta</label>
          <input
            id="co-dir"
            required
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            placeholder="Ej. Calle 5 #123"
            autoComplete="street-address"
            className={`${input} mt-1`}
          />
        </div>
        <div>
          <label htmlFor="co-ref" className="text-sm text-nuit/70">Referencia <span className="text-nuit/50">(opcional)</span></label>
          <input
            id="co-ref"
            value={form.reference}
            onChange={(e) => setForm({ ...form, reference: e.target.value })}
            placeholder="Ej. frente a la farmacia"
            className={`${input} mt-1`}
          />
        </div>
        {error ? <p className="text-sm text-figue">{error}</p> : null}
        {TURNSTILE_SITE_KEY ? (
          <Turnstile
            sitekey={TURNSTILE_SITE_KEY}
            onVerify={(token) => setTurnstileToken(token)}
            onExpire={() => setTurnstileToken("")}
            onError={() => setTurnstileToken("")}
          />
        ) : null}
        <button disabled={loading} className="w-full rounded-full bg-figue py-3 font-semibold text-nuit disabled:opacity-50">
          {loading ? "Creando..." : "Confirmar y enviar a WhatsApp"}
        </button>
      </form>
    </main>
  );
}
