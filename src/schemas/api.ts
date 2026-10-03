import { z } from "zod";

export const productQuerySchema = z.object({
  q: z.string().max(100).optional(),
  categoria: z.string().max(60).optional(),
  talla: z.string().max(10).optional(),
  color: z.string().max(30).optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(48).default(12),
  orden: z.enum(["newest", "price_asc", "price_desc"]).default("newest"),
  soloDisponible: z.coerce.boolean().optional(),
});

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
