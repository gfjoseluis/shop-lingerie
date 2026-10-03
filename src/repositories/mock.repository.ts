import { MOCK_CATEGORIES, MOCK_PRODUCTS } from "@/data/mock";
import type { Paginated, Product, ProductFilters } from "@/types/domain";
import { effectivePrice } from "@/lib/format";
import type { IOrderRepository, IProductRepository } from "./interfaces";
import type { Order } from "@/types/domain";

// Implementación en memoria (placeholders). Se reemplaza por Supabase sin cambiar services/UI.
export class MockProductRepository implements IProductRepository {
  async listCategories() {
    return MOCK_CATEGORIES;
  }

  async listProducts(f: ProductFilters): Promise<Paginated<Product>> {
    const page = f.page ?? 1;
    const limit = f.limit ?? 12;
    let items = [...MOCK_PRODUCTS];

    if (f.categorySlugs && f.categorySlugs.length > 0) {
      const ids = new Set(
        MOCK_CATEGORIES.filter((c) => f.categorySlugs!.includes(c.slug)).map((c) => c.id)
      );
      items = items.filter((p) => ids.has(p.categoryId));
    }
    if (f.q) {
      const q = f.q.toLowerCase();
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.variants.some((v) => v.color.toLowerCase().includes(q))
      );
    }
    if (f.sizes && f.sizes.length > 0)
      items = items.filter((p) => p.variants.some((v) => f.sizes!.includes(v.size) && v.stock > 0));
    if (f.colors && f.colors.length > 0) {
      const wanted = f.colors.map((c) => c.toLowerCase());
      items = items.filter((p) => p.variants.some((v) => wanted.some((c) => v.color.toLowerCase().includes(c))));
    }
    if (f.minPrice !== undefined) items = items.filter((p) => effectivePrice(p.basePrice, p.salePrice) >= f.minPrice!);
    if (f.maxPrice !== undefined) items = items.filter((p) => effectivePrice(p.basePrice, p.salePrice) <= f.maxPrice!);
    if (f.onlyAvailable) items = items.filter((p) => p.variants.some((v) => v.stock > 0));
    if (f.cupTypes && f.cupTypes.length > 0) items = items.filter((p) => p.cupType && f.cupTypes!.includes(p.cupType));
    if (f.cutTypes && f.cutTypes.length > 0) items = items.filter((p) => p.cutType && f.cutTypes!.includes(p.cutType));
    if (f.materials && f.materials.length > 0)
      items = items.filter((p) => p.material && f.materials!.includes(p.material));

    if (f.sort === "price_asc") items.sort((a, b) => effectivePrice(a.basePrice, a.salePrice) - effectivePrice(b.basePrice, b.salePrice));
    else if (f.sort === "price_desc") items.sort((a, b) => effectivePrice(b.basePrice, b.salePrice) - effectivePrice(a.basePrice, a.salePrice));
    else items.sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));

    const total = items.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const data = items.slice((page - 1) * limit, page * limit);
    return { data, page, limit, total, totalPages };
  }

  async getProductBySlug(slug: string): Promise<Product | null> {
    return MOCK_PRODUCTS.find((p) => p.slug === slug) ?? null;
  }

  async getVariant(variantId: string) {
    for (const p of MOCK_PRODUCTS) {
      const v = p.variants.find((x) => x.id === variantId);
      if (v) return { variantId, stock: v.stock, product: p };
    }
    return null;
  }
}

const orders: Order[] = [];

export class MockOrderRepository implements IOrderRepository {
  async create(order: Order): Promise<Order> {
    orders.unshift(order);
    return order;
  }
  async list(): Promise<Order[]> {
    return orders;
  }
}
