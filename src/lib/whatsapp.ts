import { env } from "./env";
import type { Order } from "@/types/domain";
import { formatPrice } from "./format";

export function buildWhatsAppLink(message: string): string {
  return `https://wa.me/${env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function formatOrderForWhatsApp(order: Order): string {
  const lines = order.items.map(
    (it, i) => `${i + 1}. ${it.productName} (${it.size}/${it.color}) x${it.quantity} - ${formatPrice(it.subtotal)}`
  );
  return [
    `Hola ${env.NEXT_PUBLIC_STORE_NAME}, quiero confirmar mi pedido ${order.id}:`,
    ...lines,
    `Subtotal: ${formatPrice(order.subtotal)}`,
    `Envío: a coordinar (Yango/InDrive - Santa Cruz de la Sierra)`,
    `Nombre: ${order.customerName}`,
    `Tel: ${order.customerPhone}`,
    `Barrio: ${order.neighborhood}`,
    `Dirección: ${order.address}`,
    order.reference ? `Ref: ${order.reference}` : "",
    `Pago: contraentrega`,
  ]
    .filter(Boolean)
    .join("\n");
}
