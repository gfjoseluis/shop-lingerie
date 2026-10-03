import { hasSupabase } from "@/lib/env";
import { MockOrderRepository, MockProductRepository } from "./mock.repository";
import type { IAdminCatalogRepository, IOrderRepository, IProductRepository } from "./interfaces";
import { SupabaseAdminCatalogRepository, SupabaseOrderRepository, SupabaseProductRepository } from "./supabase.repository";

// Factory (DIP): el resto del código depende de interfaces.
// Con credenciales Supabase usa la DB real; sin ellas usa placeholders en memoria.
export function getProductRepository(): IProductRepository {
  if (hasSupabase()) return new SupabaseProductRepository();
  return new MockProductRepository();
}

export function getOrderRepository(): IOrderRepository {
  if (hasSupabase()) return new SupabaseOrderRepository();
  return new MockOrderRepository();
}

export function getAdminRepository(): IAdminCatalogRepository {
  if (!hasSupabase()) throw new Error("El panel admin requiere configurar Supabase en .env.local");
  return new SupabaseAdminCatalogRepository();
}
