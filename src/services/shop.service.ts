import { effectivePrice } from "@/lib/format";
import { getOrderRepository, getProductRepository } from "@/repositories/factory";
import type { CreateOrderInput } from "@/schemas/api";
import type { Order, OrderItem } from "@/types/domain";

// SRP: solo reglas de negocio. El acceso a datos vive en repositories.
export class ProductService {
  constructor(private repo = getProductRepository()) {}
  list = (filters: Parameters<typeof this.repo.listProducts>[0]) => this.repo.listProducts(filters);
  getBySlug = (slug: string) => this.repo.getProductBySlug(slug);
  categories = () => this.repo.listCategories();
}

export class OrderService {
  constructor(
    private orders = getOrderRepository(),
    private products = getProductRepository()
  ) {}

  async create(input: CreateOrderInput): Promise<Order> {
    const items: OrderItem[] = [];
    let subtotal = 0;
    for (const it of input.items) {
      const found = await this.products.getVariant(it.variantId);
      if (!found) throw new Error(`Variante no encontrada: ${it.variantId}`);
      if (found.stock < it.quantity) throw new Error(`Stock insuficiente para ${found.product.name}`);
      const unit = effectivePrice(found.product.basePrice, found.product.salePrice);
      const v = found.product.variants.find((x) => x.id === it.variantId)!;
      subtotal += unit * it.quantity;
      items.push({
        variantId: it.variantId,
        quantity: it.quantity,
        productName: found.product.name,
        size: v.size,
        color: v.color,
        unitPrice: unit,
        subtotal: unit * it.quantity,
      });
    }
    const order: Order = {
      id: `PED-${Date.now().toString(36).toUpperCase()}`,
      customerName: input.customerName,
      customerPhone: input.customerPhone,
      neighborhood: input.neighborhood,
      address: input.address,
      reference: input.reference ?? null,
      notes: input.notes ?? null,
      items,
      subtotal,
      shippingNote: "Envío Yango/InDrive a coordinar - Santa Cruz de la Sierra",
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    return this.orders.create(order);
  }
}
