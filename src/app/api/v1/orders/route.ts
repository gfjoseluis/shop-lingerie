import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { createOrderSchema } from "@/schemas/api";
import { OrderService } from "@/services/shop.service";
import { verifyTurnstile } from "@/lib/turnstile";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const { turnstileToken, ...orderBody } = (body ?? {}) as Record<string, unknown>;
  // Anti-bots: se verifica ANTES de crear el pedido y descontar stock
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const human = await verifyTurnstile(typeof turnstileToken === "string" ? turnstileToken : undefined, ip);
  if (!human) return NextResponse.json({ error: "Verificación anti-bots fallida, intenta de nuevo" }, { status: 400 });
  const parsed = createOrderSchema.safeParse(orderBody);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  try {
    const svc = new OrderService();
    const order = await svc.create(parsed.data);
    return NextResponse.json(order, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Error" }, { status: 400 });
  }
}
