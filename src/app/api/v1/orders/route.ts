import { NextResponse } from "next/server";
import { createOrderSchema } from "@/schemas/api";
import { OrderService } from "@/services/shop.service";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = createOrderSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  try {
    const svc = new OrderService();
    const order = await svc.create(parsed.data);
    return NextResponse.json(order, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Error" }, { status: 400 });
  }
}
