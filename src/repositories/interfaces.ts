import type { Category, Order, Paginated, Product, ProductFilters } from "@/types/domain";
import type { OrderStatusInput, ProductInput } from "@/schemas/api";

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

// Operaciones de administración (requieren Supabase + service key).
export interface IAdminCatalogRepository {
  listCategories(): Promise<Category[]>;
  createCategory(input: { name: string; slug: string; description?: string }): Promise<Category>;
  updateCategory(id: string, input: { name: string; description?: string }): Promise<Category>;
  deleteCategory(id: string): Promise<void>;
  listOrders(): Promise<Order[]>;
  getProductById(id: string): Promise<Product | null>;
  createProduct(input: ProductInput): Promise<Product>;
  updateProduct(id: string, input: ProductInput): Promise<Product>;
  setProductActive(id: string, active: boolean): Promise<void>;
  updateVariantStock(variantId: string, stock: number): Promise<void>;
  setOrderStatus(id: string, status: OrderStatusInput): Promise<void>;
}
