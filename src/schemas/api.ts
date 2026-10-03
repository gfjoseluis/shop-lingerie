import { z } from "zod";

export const productQuerySchema = z.object({
  q: z.string().max(100).optional(),
  categoria: multiString(60),
  talla: multiString(10),
  color: multiString(30),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(48).default(12),
  orden: z.enum(["newest", "price_asc", "price_desc"]).default("newest"),
  soloDisponible: z.coerce.boolean().optional(),
  copa: multiString(30),
  corte: multiString(30),
  tela: multiString(30),
});

// Acepta ?x=a&x=b o ?x=a y normaliza a string[]
function multiString(maxLen: number) {
  return z.preprocess((v) => {
    if (Array.isArray(v))
      return v.filter((x): x is string => typeof x === "string").map((s) => s.slice(0, maxLen)).slice(0, 20);
    if (typeof v === "string" && v) return [v.slice(0, maxLen)];
    return [];
  }, z.array(z.string()).default([]));
}

export const orderItemSchema = z.object({
  variantId: z.string().min(1),
  quantity: z.number().int().min(1).max(20),
});

export const createOrderSchema = z.object({
  customerName: z.string().min(2).max(80),
  customerPhone: z.string().min(7).max(20),
  neighborhood: z.string().min(2).max(80),
  address: z.string().min(4).max(200),
  reference: z.string().max(200).optional().or(z.literal("")),
  notes: z.string().max(500).optional().or(z.literal("")),
  items: z.array(orderItemSchema).min(1).max(50),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

export const orderStatusSchema = z.enum(["pending", "confirmed", "delivered", "cancelled"]);
export type OrderStatusInput = z.infer<typeof orderStatusSchema>;

const slugSchema = z
  .string()
  .min(2)
  .max(80)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug inválido: solo minúsculas, números y guiones");

export const variantInputSchema = z.object({
  size: z.string().min(1).max(10),
  color: z.string().min(1).max(30),
  sku: z.string().min(2).max(60),
  stock: z.number().int().min(0).max(100000),
  priceOverride: z.number().min(0).max(1000000).nullable().optional(),
});

export const productImageInputSchema = z.object({
  url: z.string().url().max(500),
  alt: z.string().max(120).optional().or(z.literal("")),
});

export const productInputSchema = z.object({
  name: z.string().min(2).max(120),
  slug: slugSchema,
  description: z.string().min(4).max(2000),
  basePrice: z.number().min(0).max(1000000),
  salePrice: z.number().min(0).max(1000000).nullable().optional(),
  categoryId: z.string().uuid("Categoría inválida"),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  images: z.array(productImageInputSchema).max(8).default([]),
  variants: z.array(variantInputSchema).min(1).max(60),
  cupType: z.string().max(30).nullable().optional(),
  braStyle: z.string().max(30).nullable().optional(),
  hooks: z.number().int().min(1).max(8).nullable().optional(),
  cutType: z.string().max(30).nullable().optional(),
  material: z.string().max(30).nullable().optional(),
  adhesiveKind: z.string().max(30).nullable().optional(),
  presentation: z.string().max(60).nullable().optional(),
});

export type ProductInput = z.infer<typeof productInputSchema>;
