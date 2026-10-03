import { hasSupabase } from "@/lib/env";
import { MockOrderRepository, MockProductRepository } from "./mock.repository";
import type { IOrderRepository, IProductRepository } from "./interfaces";

// Factory: hoy devuelve Mock (placeholders). Cuando haya Supabase, devuelve Supabase* sin tocar el resto.
export function getProductRepository(): IProductRepository {
  void hasSupabase;
  // TODO: return new SupabaseProductRepository() cuando existan credenciales
  return new MockProductRepository();
}

export function getOrderRepository(): IOrderRepository {
  return new MockOrderRepository();
}
