// Modelos de dominio. Español solo en UI, código en inglés (clean code).

export interface Category {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
}

export interface ProductVariant {
  id: string;
  productId: string;
  size: string; // S, M, L, XL, Único
  color: string;
  sku: string;
  stock: number;
  priceOverride?: number | null;
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  alt?: string | null;
  position: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  basePrice: number;
  salePrice?: number | null;
  categoryId: string;
  category?: Category | null;
  images: ProductImage[];
  variants: ProductVariant[];
  isActive: boolean;
  isFeatured?: boolean;
  createdAt?: string;
}

export interface OrderItemInput {
  variantId: string;
  quantity: number;
}

export interface OrderItem extends OrderItemInput {
  productName: string;
  size: string;
  color: string;
  unitPrice: number;
  subtotal: number;
}

export type OrderStatus = "pending" | "confirmed" | "delivered" | "cancelled";

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  neighborhood: string;
  address: string;
  reference?: string | null;
  notes?: string | null;
  items: OrderItem[];
  subtotal: number;
  shippingNote: string;
  status: OrderStatus;
  createdAt: string;
}

export interface Paginated<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProductFilters {
  q?: string;
  categorySlug?: string;
  size?: string;
  color?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  sort?: "newest" | "price_asc" | "price_desc";
  onlyAvailable?: boolean;
}
