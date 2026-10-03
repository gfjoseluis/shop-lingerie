import { NextResponse } from "next/server";
import { ProductService } from "@/services/shop.service";

export async function GET() {
  const svc = new ProductService();
  return NextResponse.json(await svc.categories());
}
