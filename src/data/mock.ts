import type { Category, Product } from "@/types/domain";

function img(seed: string, w = 800, h = 1000): string {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

export const MOCK_CATEGORIES: Category[] = [
  { id: "c1", slug: "conjuntos", name: "Conjuntos", description: "Conjuntos de encaje y algodón" },
  { id: "c2", slug: "bodys", name: "Bodys", description: "Bodys para toda ocasión" },
  { id: "c3", slug: "pijamas", name: "Pijamas", description: "Pijamas cómodas" },
  { id: "c4", slug: "panties", name: "Panties", description: "Panties pack x3" },
  { id: "c5", slug: "ofertas", name: "Ofertas", description: "Últimas unidades" },
];

function variant(productId: string, size: string, color: string, stock: number, i: number) {
  return {
    id: `${productId}-v${i}`,
    productId,
    size,
    color,
    sku: `${productId.toUpperCase()}-${size}-${color.slice(0, 3).toUpperCase()}`,
    stock,
  };
}

export const MOCK_PRODUCTS: Product[] = Array.from({ length: 14 }).map((_, idx) => {
  const n = idx + 1;
  const cat = MOCK_CATEGORIES[idx % 4];
  const id = `p${n}`;
  const basePrice = 90 + ((n * 17) % 120);
  const onSale = n % 4 === 0;
  return {
    id,
    slug: `producto-${n}`,
    name: `${cat.name.slice(0, -1)} Encaje Rosé ${n}`,
    description:
      "Tela suave de encaje con forro de algodón. Incluye guía de tallas. Envío con Yango/InDrive en Santa Cruz de la Sierra, costo a coordinar por WhatsApp.",
    basePrice,
    salePrice: onSale ? Math.round(basePrice * 0.85) : null,
    categoryId: cat.id,
    category: cat,
    images: [0, 1, 2].map((k) => ({
      id: `${id}-img${k}`,
      productId: id,
      url: img(`${id}-${k}`),
      alt: `Foto ${k + 1}`,
      position: k,
    })),
    variants: [
      variant(id, "S", "Negro", n % 5 === 0 ? 0 : 5, 1),
      variant(id, "M", "Negro", 8, 2),
      variant(id, "M", "Rosado", 4, 3),
      variant(id, "L", "Blanco", 6, 4),
    ],
    isActive: true,
    isFeatured: n <= 4,
    createdAt: new Date(Date.now() - n * 86400000).toISOString(),
  };
});
