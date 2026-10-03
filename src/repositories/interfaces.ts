import type { Category, Order, Paginated, Product, ProductFilters } from "@/types/domain";

// DIP: la UI y los services dependen de interfaces, no de Supabase.
export interface IProductRepository {
  listCategories(): Promise<Category[]>;
  listProducts(filters: ProductFilters): Promise<Paginated<Product>>;
  getProductBySlug(slug: string): Promise<Product | null>;
  getVariant(variantId: string): Promise<{ variantId: string; stock: number; product: Product } | null>;
}

export interface IOrderRepository {
  create(order: Order): Promise<Order>;
  list(): Promise<Order[]>;
}
