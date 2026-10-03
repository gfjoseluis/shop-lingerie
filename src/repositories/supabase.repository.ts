import { effectivePrice } from "@/lib/format";
import { getServiceClient } from "@/lib/supabase/admin";
import type { CreateOrderInput, OrderStatusInput, ProductInput } from "@/schemas/api";
import type {
  Category,
  Order,
  OrderItem,
  Paginated,
  Product,
  ProductFilters,
  ProductImage,
  ProductVariant,
} from "@/types/domain";
import type { IAdminCatalogRepository, IOrderRepository, IProductRepository } from "./interfaces";

// ---- Mapeo snake_case -> dominio ----
function mapCategory(row: {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  image_url: string | null;
}): Category {
  return { id: row.id, slug: row.slug, name: row.name, description: row.description, imageUrl: row.image_url };
}

type ProductRow = Parameters<typeof mapProduct>[0];
function mapProduct(row: {
  id: string;
  slug: string;
  name: string;
  description: string;
  base_price: number | string;
  sale_price: number | string | null;
  category_id: string | null;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  category: unknown;
  images: unknown;
  variants: unknown;
  cup_type?: string | null;
  bra_style?: string | null;
  hooks?: number | null;
  cut_type?: string | null;
  material?: string | null;
  adhesive_kind?: string | null;
  presentation?: string | null;
}): Product {
  const cat = (row.category ?? null) as {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    image_url: string | null;
  } | null;
  const images = ((row.images ?? []) as {
    id: string;
    product_id: string;
    url: string;
    alt: string | null;
    position: number;
  }[])
    .map(
      (im): ProductImage => ({ id: im.id, productId: im.product_id, url: im.url, alt: im.alt, position: im.position })
    )
    .sort((a, b) => a.position - b.position);
  const variants = ((row.variants ?? []) as {
    id: string;
    product_id: string;
    size: string;
    color: string;
    sku: string;
    stock: number;
    price_override: number | string | null;
  }[]).map(
    (v): ProductVariant => ({
      id: v.id,
      productId: v.product_id,
      size: v.size,
      color: v.color,
      sku: v.sku,
      stock: v.stock,
      priceOverride: v.price_override === null ? null : Number(v.price_override),
    })
  );
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    basePrice: Number(row.base_price),
    salePrice: row.sale_price === null ? null : Number(row.sale_price),
    categoryId: row.category_id ?? "",
    category: cat ? mapCategory(cat) : null,
    images,
    variants,
    isActive: row.is_active,
    isFeatured: row.is_featured,
    createdAt: row.created_at,
    cupType: row.cup_type ?? null,
    braStyle: row.bra_style ?? null,
    hooks: row.hooks ?? null,
    cutType: row.cut_type ?? null,
    material: row.material ?? null,
    adhesiveKind: row.adhesive_kind ?? null,
    presentation: row.presentation ?? null,
  };
}

const PRODUCT_SELECT = `
  id, slug, name, description, base_price, sale_price, category_id,
  is_active, is_featured, created_at,
  cup_type, bra_style, hooks, cut_type, material, adhesive_kind, presentation,
  category:categories ( id, slug, name, description, image_url ),
  images:product_images ( id, product_id, url, alt, position ),
  variants:product_variants ( id, product_id, size, color, sku, stock, price_override )
`;

// Tolerancia a ventana de migración: si aún no corrieron migrate-02.sql,
// lee sin las columnas nuevas (atributos llegan como null). Tras correrla,
// reinicia el servidor para limpiar la caché.
const LEGACY_SELECT = `
  id, slug, name, description, base_price, sale_price, category_id,
  is_active, is_featured, created_at,
  category:categories ( id, slug, name, description, image_url ),
  images:product_images ( id, product_id, url, alt, position ),
  variants:product_variants ( id, product_id, size, color, sku, stock, price_override )
`;

let supportsAttrs: boolean | null = null;
async function productSelect(db: ReturnType<typeof getServiceClient>): Promise<string> {
  if (supportsAttrs === null) {
    const { error } = await db.from("products").select("cup_type").limit(1);
    supportsAttrs = !error;
  }
  return supportsAttrs ? PRODUCT_SELECT : LEGACY_SELECT;
}

export class SupabaseProductRepository implements IProductRepository {
  async listCategories(): Promise<Category[]> {
    const db = getServiceClient();
    const { data, error } = await db.from("categories").select("*").order("name");
    if (error) throw new Error(`Supabase categories: ${error.message}`);
    return (data ?? []).map(mapCategory);
  }

  async listProducts(f: ProductFilters): Promise<Paginated<Product>> {
    const db = getServiceClient();
    const page = f.page ?? 1;
    const limit = f.limit ?? 12;

    let categoryId: string | null = null;
    if (f.categorySlug) {
      const { data: cat, error: catErr } = await db
        .from("categories")
        .select("id")
        .eq("slug", f.categorySlug)
        .maybeSingle();
      if (catErr) throw new Error(`Supabase categories: ${catErr.message}`);
      if (!cat) return { data: [], page, limit, total: 0, totalPages: 1 };
      categoryId = cat.id as string;
    }

    let query = db.from("products").select(await productSelect(db)).eq("is_active", true);
    if (categoryId) query = query.eq("category_id", categoryId);
    if (f.q) {
      const q = f.q.replace(/[%_]/g, "");
      query = query.or(`name.ilike.%${q}%,description.ilike.%${q}%`);
    }
    query = query.order("created_at", { ascending: false });

    const { data, error } = await query;
    if (error) throw new Error(`Supabase products: ${error.message}`);

    let items = ((data ?? []) as unknown as ProductRow[]).map(mapProduct);

    if (f.minPrice !== undefined) items = items.filter((p) => effectivePrice(p.basePrice, p.salePrice) >= f.minPrice!);
    if (f.maxPrice !== undefined) items = items.filter((p) => effectivePrice(p.basePrice, p.salePrice) <= f.maxPrice!);
    if (f.size) items = items.filter((p) => p.variants.some((v) => v.size === f.size && v.stock > 0));
    if (f.color) {
      const c = f.color.toLowerCase();
      items = items.filter((p) => p.variants.some((v) => v.color.toLowerCase().includes(c)));
    }
    if (f.onlyAvailable) items = items.filter((p) => p.variants.some((v) => v.stock > 0));
    if (f.cupType) items = items.filter((p) => p.cupType === f.cupType);
    if (f.cutType) items = items.filter((p) => p.cutType === f.cutType);
    if (f.material) items = items.filter((p) => p.material === f.material);

    if (f.sort === "price_asc")
      items.sort((a, b) => effectivePrice(a.basePrice, a.salePrice) - effectivePrice(b.basePrice, b.salePrice));
    else if (f.sort === "price_desc")
      items.sort((a, b) => effectivePrice(b.basePrice, b.salePrice) - effectivePrice(a.basePrice, a.salePrice));

    const total = items.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    return { data: items.slice((page - 1) * limit, page * limit), page, limit, total, totalPages };
  }

  async getProductBySlug(slug: string): Promise<Product | null> {
    const db = getServiceClient();
    const { data, error } = await db.from("products").select(await productSelect(db)).eq("slug", slug).maybeSingle();
    if (error) throw new Error(`Supabase product: ${error.message}`);
    if (!data) return null;
    return mapProduct(data as unknown as ProductRow);
  }

  async getVariant(variantId: string): Promise<{ variantId: string; stock: number; product: Product } | null> {
    const db = getServiceClient();
    const { data: v, error: vErr } = await db
      .from("product_variants")
      .select("id, stock, product_id")
      .eq("id", variantId)
      .maybeSingle();
    if (vErr) throw new Error(`Supabase variant: ${vErr.message}`);
    if (!v) return null;
    const { data: p, error: pErr } = await db
      .from("products")
      .select(await productSelect(db))
      .eq("id", (v as { product_id: string }).product_id)
      .maybeSingle();
    if (pErr) throw new Error(`Supabase product: ${pErr.message}`);
    if (!p) return null;
    return {
      variantId: (v as { id: string }).id,
      stock: (v as { stock: number }).stock,
      product: mapProduct(p as unknown as ProductRow),
    };
  }
}

export class SupabaseOrderRepository implements IOrderRepository {
  async create(order: Order): Promise<Order> {
    const db = getServiceClient();
    // Descuenta stock con bloqueo optimista por variante
    for (const it of order.items) {
      const { data: v, error: vErr } = await db
        .from("product_variants")
        .select("stock")
        .eq("id", it.variantId)
        .single();
      if (vErr || !v) throw new Error(`Variante no encontrada: ${it.variantId}`);
      const stock = (v as { stock: number }).stock;
      if (stock < it.quantity) throw new Error(`Stock insuficiente para ${it.productName}`);
      const { count, error: uErr } = await db
        .from("product_variants")
        .update({ stock: stock - it.quantity }, { count: "exact" })
        .eq("id", it.variantId)
        .eq("stock", stock);
      if (uErr) throw new Error(`No se pudo reservar stock: ${uErr.message}`);
      if (!count) throw new Error(`El stock cambió mientras comprabas, intenta de nuevo`);
    }
    const { error: oErr } = await db.from("orders").insert({
      id: order.id,
      customer_name: order.customerName,
      customer_phone: order.customerPhone,
      neighborhood: order.neighborhood,
      address: order.address,
      reference: order.reference,
      notes: order.notes,
      subtotal: order.subtotal,
      status: order.status,
    });
    if (oErr) throw new Error(`No se pudo guardar el pedido: ${oErr.message}`);
    const { error: iErr } = await db.from("order_items").insert(
      order.items.map((it) => ({
        order_id: order.id,
        variant_id: it.variantId,
        product_name: it.productName,
        size: it.size,
        color: it.color,
        unit_price: it.unitPrice,
        quantity: it.quantity,
        subtotal: it.subtotal,
      }))
    );
    if (iErr) throw new Error(`No se pudo guardar el detalle: ${iErr.message}`);
    return order;
  }

  async list(): Promise<Order[]> {
    const db = getServiceClient();
    const { data, error } = await db
      .from("orders")
      .select("*, items:order_items(*)")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(`Supabase orders: ${error.message}`);
    return ((data ?? []) as {
      id: string;
      customer_name: string;
      customer_phone: string;
      neighborhood: string;
      address: string;
      reference: string | null;
      notes: string | null;
      subtotal: number | string;
      status: Order["status"];
      created_at: string;
      items: {
        variant_id: string;
        quantity: number;
        product_name: string;
        size: string;
        color: string;
        unit_price: number | string;
        subtotal: number | string;
      }[];
    }[]).map(
      (o): Order => ({
        id: o.id,
        customerName: o.customer_name,
        customerPhone: o.customer_phone,
        neighborhood: o.neighborhood,
        address: o.address,
        reference: o.reference,
        notes: o.notes,
        subtotal: Number(o.subtotal),
        status: o.status,
        createdAt: o.created_at,
        shippingNote: "Envío Yango/InDrive a coordinar - Santa Cruz de la Sierra",
        items: (o.items ?? []).map(
          (it): OrderItem => ({
            variantId: it.variant_id,
            quantity: it.quantity,
            productName: it.product_name,
            size: it.size,
            color: it.color,
            unitPrice: Number(it.unit_price),
            subtotal: Number(it.subtotal),
          })
        ),
      })
    );
  }
}

export class SupabaseAdminCatalogRepository implements IAdminCatalogRepository {
  private products = new SupabaseProductRepository();
  private orders = new SupabaseOrderRepository();

  listCategories = () => this.products.listCategories();
  listOrders = () => this.orders.list();

  async createCategory(input: { name: string; slug: string; description?: string }): Promise<Category> {
    const db = getServiceClient();
    const slug = input.slug.trim().toLowerCase();
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error("Slug inválido");
    const { data, error } = await db
      .from("categories")
      .insert({ slug, name: input.name.trim(), description: input.description?.trim() || null })
      .select("*")
      .single();
    if (error || !data) throw new Error(`No se pudo crear: ${error?.message ?? "slug en uso"}`);
    return mapCategory(data as Parameters<typeof mapCategory>[0]);
  }

  async updateCategory(id: string, input: { name: string; description?: string }): Promise<Category> {
    const db = getServiceClient();
    const { data, error } = await db
      .from("categories")
      .update({ name: input.name.trim(), description: input.description?.trim() || null })
      .eq("id", id)
      .select("*")
      .single();
    if (error || !data) throw new Error(`No se pudo actualizar: ${error?.message ?? "desconocido"}`);
    return mapCategory(data as Parameters<typeof mapCategory>[0]);
  }

  async deleteCategory(id: string): Promise<void> {
    const db = getServiceClient();
    const { count } = await db.from("products").select("id", { count: "exact", head: true }).eq("category_id", id);
    if (count && count > 0) throw new Error(`Tiene ${count} productos, reasígnalos antes de borrar`);
    const { error } = await db.from("categories").delete().eq("id", id);
    if (error) throw new Error(`No se pudo borrar: ${error.message}`);
  }

  async createProduct(input: ProductInput): Promise<Product> {
    const db = getServiceClient();
    const { data: exists } = await db.from("products").select("id").eq("slug", input.slug).maybeSingle();
    if (exists) throw new Error(`El slug "${input.slug}" ya está en uso`);
    const { data: cat } = await db.from("categories").select("id").eq("id", input.categoryId).maybeSingle();
    if (!cat) throw new Error("La categoría no existe");

    const hasAttrs = (await productSelect(db)) === PRODUCT_SELECT;
    const attrs = hasAttrs
      ? {
          cup_type: input.cupType ?? null,
          bra_style: input.braStyle ?? null,
          hooks: input.hooks ?? null,
          cut_type: input.cutType ?? null,
          material: input.material ?? null,
          adhesive_kind: input.adhesiveKind ?? null,
          presentation: input.presentation ?? null,
        }
      : {};

    const { data: p, error: pErr } = await db
      .from("products")
      .insert({
        slug: input.slug,
        name: input.name,
        description: input.description,
        base_price: input.basePrice,
        sale_price: input.salePrice ?? null,
        category_id: input.categoryId,
        is_active: input.isActive,
        is_featured: input.isFeatured,
        ...attrs,
      })
      .select("id")
      .single();
    if (pErr || !p) throw new Error(`No se pudo crear el producto: ${pErr?.message ?? "desconocido"}`);
    const productId = (p as { id: string }).id;

    if (input.images.length > 0) {
      const { error: iErr } = await db.from("product_images").insert(
        input.images.map((im, i) => ({ product_id: productId, url: im.url, alt: im.alt || null, position: i }))
      );
      if (iErr) throw new Error(`Producto creado pero fallaron las imágenes: ${iErr.message}`);
    }
    const { error: vErr } = await db.from("product_variants").insert(
      input.variants.map((v) => ({
        product_id: productId,
        size: v.size,
        color: v.color,
        sku: v.sku,
        stock: v.stock,
        price_override: v.priceOverride ?? null,
      }))
    );
    if (vErr) {
      await db.from("products").delete().eq("id", productId);
      throw new Error(`No se pudieron crear las variantes (¿SKU duplicado?): ${vErr.message}`);
    }
    const created = await this.getProductById(productId);
    if (!created) throw new Error("Producto creado pero no se pudo leer");
    return created;
  }

  async getProductById(id: string): Promise<Product | null> {
    const db = getServiceClient();
    const { data, error } = await db.from("products").select(await productSelect(db)).eq("id", id).maybeSingle();
    if (error) throw new Error(`Supabase product: ${error.message}`);
    if (!data) return null;
    return mapProduct(data as unknown as ProductRow);
  }

  async updateProduct(id: string, input: ProductInput): Promise<Product> {
    const db = getServiceClient();
    const { data: clash } = await db.from("products").select("id").eq("slug", input.slug).neq("id", id).maybeSingle();
    if (clash) throw new Error(`El slug "${input.slug}" ya está en uso por otro producto`);
    const hasAttrs = (await productSelect(db)) === PRODUCT_SELECT;
    const attrs = hasAttrs
      ? {
          cup_type: input.cupType ?? null,
          bra_style: input.braStyle ?? null,
          hooks: input.hooks ?? null,
          cut_type: input.cutType ?? null,
          material: input.material ?? null,
          adhesive_kind: input.adhesiveKind ?? null,
          presentation: input.presentation ?? null,
        }
      : {};
    const { error: pErr } = await db
      .from("products")
      .update({
        slug: input.slug,
        name: input.name,
        description: input.description,
        base_price: input.basePrice,
        sale_price: input.salePrice ?? null,
        category_id: input.categoryId,
        is_active: input.isActive,
        is_featured: input.isFeatured,
        ...attrs,
      })
      .eq("id", id);
    if (pErr) throw new Error(`No se pudo actualizar: ${pErr.message}`);
    await this.replaceImages(id, input.images);
    await this.replaceVariants(id, input.variants);
    const updated = await this.getProductById(id);
    if (!updated) throw new Error("Producto actualizado pero no se pudo leer");
    return updated;
  }

  async replaceImages(productId: string, images: ProductInput["images"]): Promise<void> {
    const db = getServiceClient();
    const { error: dErr } = await db.from("product_images").delete().eq("product_id", productId);
    if (dErr) throw new Error(`No se pudieron reemplazar imágenes: ${dErr.message}`);
    if (images.length === 0) return;
    const { error: iErr } = await db.from("product_images").insert(
      images.map((im, i) => ({ product_id: productId, url: im.url, alt: im.alt || null, position: i }))
    );
    if (iErr) throw new Error(`No se pudieron guardar imágenes: ${iErr.message}`);
  }

  async replaceVariants(productId: string, variants: ProductInput["variants"]): Promise<void> {
    const db = getServiceClient();
    const { data: used } = await db
      .from("order_items")
      .select("variant_id, product_variants!inner(product_id)")
      .eq("product_variants.product_id", productId)
      .limit(1);
    if (used && used.length > 0)
      throw new Error("Este producto ya tiene pedidos; edita el stock por variante en vez de reemplazarlas");
    const { error: dErr } = await db.from("product_variants").delete().eq("product_id", productId);
    if (dErr) throw new Error(`No se pudieron reemplazar variantes: ${dErr.message}`);
    const { error: iErr } = await db.from("product_variants").insert(
      variants.map((v) => ({
        product_id: productId,
        size: v.size,
        color: v.color,
        sku: v.sku,
        stock: v.stock,
        price_override: v.priceOverride ?? null,
      }))
    );
    if (iErr) throw new Error(`No se pudieron guardar variantes (¿SKU duplicado?): ${iErr.message}`);
  }

  async updateVariantStock(variantId: string, stock: number): Promise<void> {
    const db = getServiceClient();
    const { error } = await db.from("product_variants").update({ stock }).eq("id", variantId);
    if (error) throw new Error(`No se pudo actualizar stock: ${error.message}`);
  }

  async setProductActive(id: string, active: boolean): Promise<void> {
    const db = getServiceClient();
    const { error } = await db.from("products").update({ is_active: active }).eq("id", id);
    if (error) throw new Error(`No se pudo cambiar estado: ${error.message}`);
  }

  async setOrderStatus(id: string, status: OrderStatusInput): Promise<void> {
    const db = getServiceClient();
    const { data: order, error: oErr } = await db.from("orders").select("id,status").eq("id", id).single();
    if (oErr || !order) throw new Error("Pedido no encontrado");
    const prev = (order as { status: string }).status;
    if (prev === status) return;
    // Al cancelar se devuelve el stock reservado
    if (status === "cancelled" && prev !== "cancelled") {
      const { data: items } = await db.from("order_items").select("variant_id,quantity").eq("order_id", id);
      for (const it of (items ?? []) as { variant_id: string; quantity: number }[]) {
        const { data: v } = await db.from("product_variants").select("stock").eq("id", it.variant_id).single();
        if (v)
          await db
            .from("product_variants")
            .update({ stock: (v as { stock: number }).stock + it.quantity })
            .eq("id", it.variant_id);
      }
    }
    const { error: uErr } = await db.from("orders").update({ status }).eq("id", id);
    if (uErr) throw new Error(`No se pudo actualizar el pedido: ${uErr.message}`);
  }
}
