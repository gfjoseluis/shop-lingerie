import { getAdminRepository } from "@/repositories/factory";
import { OrdersTable } from "@/components/admin/OrdersTable";

export default async function PedidosPage() {
  const orders = await getAdminRepository().listOrders();
  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="font-display mb-5 text-3xl">Pedidos ({orders.length})</h1>
      <p className="mb-4 text-sm font-light text-nuit/60">
        Al cancelar un pedido se devuelve el stock automáticamente. Pago contraentrega.
      </p>
      <OrdersTable orders={orders} />
    </main>
  );
}
