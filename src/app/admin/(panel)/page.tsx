import Link from "next/link";
import { getAdminRepository } from "@/repositories/factory";
import { formatPrice } from "@/lib/format";

export default async function AdminDashboard() {
  const repo = getAdminRepository();
  const [cats, orders] = await Promise.all([repo.listCategories(), repo.listOrders()]);
  const { ProductService } = await import("@/services/shop.service");
  const all = await new ProductService().list({ page: 1, limit: 200 });
  const lowStock = all.data.flatMap((p) =>
    p.variants.filter((v) => v.stock > 0 && v.stock <= 3).map((v) => ({ product: p.name, ...v }))
  );
  const pending = orders.filter((o) => o.status === "pending");

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-display text-3xl">Panel</h1>
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Productos", value: all.total, href: "/admin/productos" },
          { label: "Pedidos pendientes", value: pending.length, href: "/admin/pedidos" },
          { label: "Stock bajo (≤3)", value: lowStock.length, href: "/admin/productos" },
          { label: "Categorías", value: cats.length, href: "/admin/productos/nuevo" },
        ].map((c) => (
          <Link key={c.label} href={c.href} className="border border-figue/15 bg-white p-4">
            <p className="font-display text-3xl text-figue">{c.value}</p>
            <p className="text-sm font-light text-nuit/60">{c.label}</p>
          </Link>
        ))}
      </div>

      <h2 className="mt-8 font-display text-xl">Últimos pedidos</h2>
      <div className="mt-3 overflow-x-auto border border-figue/15 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-seda-soft text-left">
              <th className="p-2">Pedido</th>
              <th className="p-2">Cliente</th>
              <th className="p-2">Total</th>
              <th className="p-2">Estado</th>
            </tr>
          </thead>
          <tbody>
            {orders.slice(0, 5).map((o) => (
              <tr key={o.id} className="border-b">
                <td className="p-2">{o.id}</td>
                <td className="p-2">{o.customerName}</td>
                <td className="p-2">{formatPrice(o.subtotal)}</td>
                <td className="p-2">{o.status}</td>
              </tr>
            ))}
            {orders.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-nuit/50">
                  Sin pedidos todavía. Comparte tu catálogo por WhatsApp.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </main>
  );
}
