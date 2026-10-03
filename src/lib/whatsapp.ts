import { env } from "./env";
import type { Order } from "@/types/domain";
import { formatPrice } from "./format";

export function buildWhatsAppLink(message: string, number: string = env.NEXT_PUBLIC_WHATSAPP_NUMBER): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function formatOrderForWhatsApp(order: Order, storeName: string = env.NEXT_PUBLIC_STORE_NAME): string {
  const lines = order.items.map(
    (it, i) => `${i + 1}. _${it.productName}_ (*Talla:* ${it.size} / *Color:* ${it.color}) x${it.quantity} - ${formatPrice(it.subtotal)}`
  );
  return [
    `Hola ${storeName}, quiero confirmar mi pedido ${order.id}:`,
    ...lines,
    `*Subtotal*: ${formatPrice(order.subtotal)}`,

    `*Nombre:* _${order.customerName}_`,
    `*Tel:* _${order.customerPhone}_`,
    `*Barrio:* _${order.neighborhood}_`,
    `*Dirección:* _${order.address}_`,
    order.reference ? `*Ref:* _${order.reference}_` : "",
    `*Pago:* _Delivery_`,
  ]
    .filter(Boolean)
    .join("\n");
}
