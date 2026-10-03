"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Order } from "@/types/domain";
import { formatPrice } from "@/lib/format";
import { setOrderStatusAction } from "@/app/admin/(panel)/actions";

const LABELS: Record<Order["status"], string> = {
  pending: "Pendiente",
  confirmed: "Confirmado",
  delivered: "Entregado",
  cancelled: "Cancelado",
};

export function OrdersTable({ orders }: { orders: Order[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();

  if (orders.length === 0)
    return <p className="border border-figue/15 bg-white p-6 text-center text-sm text-nuit/55">Sin pedidos todavía.</p>;

  return (
    <div className="space-y-3">
      {orders.map((o) => (
        <article key={o.id} className="border border-figue/15 bg-white p-4">
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <p className="font-medium">{o.id}</p>
            <p className="text-sm font-light text-nuit/60">{new Date(o.createdAt).toLocaleString("es-BO")}</p>
            <p className="ml-auto font-display text-lg text-figue">{formatPrice(o.subtotal)}</p>
          </div>
          <p className="mt-1 text-sm">
            {o.customerName} · {o.customerPhone} · {o.neighborhood}, {o.address}
            {o.reference ? ` (Ref: ${o.reference})` : ""}
          </p>
          <ul className="mt-2 text-sm font-light">
            {o.items.map((it) => (
              <li key={it.variantId}>
                {it.productName} ({it.size}/{it.color}) x{it.quantity} — {formatPrice(it.subtotal)}
              </li>
            ))}
          </ul>
          <div className="mt-3 flex items-center gap-2 text-sm">
            <label>
              Estado{" "}
              <select
                defaultValue={o.status}
                disabled={pending}
                onChange={(e) =>
                  start(async () => {
                    await setOrderStatusAction(o.id, e.target.value);
                    router.refresh();
                  })
                }
                className="border border-nuit/20 bg-white px-2 py-1.5"
              >
                {(Object.keys(LABELS) as Order["status"][]).map((s) => (
                  <option key={s} value={s}>
                    {LABELS[s]}
                  </option>
                ))}
              </select>
            </label>
            <a
              href={`https://wa.me/${o.customerPhone}?text=${encodeURIComponent(`Hola ${o.customerName}, sobre tu pedido ${o.id}:`)}`}
              target="_blank"
              className="ml-auto underline underline-offset-4"
            >
              WhatsApp cliente
            </a>
          </div>
        </article>
      ))}
    </div>
  );
}
