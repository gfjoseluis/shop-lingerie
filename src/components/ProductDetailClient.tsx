"use client";
import { useMemo, useState } from "react";
import type { Product } from "@/types/domain";
import { effectivePrice, formatPrice } from "@/lib/format";
import { useCart } from "@/hooks/useCart";

export function ProductDetailClient({ product }: { product: Product }) {
  const { add } = useCart();
  const colors = useMemo(() => [...new Set(product.variants.map((v) => v.color))], [product]);
  const sizes = useMemo(() => [...new Set(product.variants.map((v) => v.size))], [product]);
  const [color, setColor] = useState(colors[0]);
  const [size, setSize] = useState(sizes[0]);
  const [img, setImg] = useState(0);
  const [added, setAdded] = useState(false);

  const variant = product.variants.find((v) => v.color === color && v.size === size);
  const price = effectivePrice(product.basePrice, product.salePrice);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.images[img]?.url} alt={product.name} className="aspect-[4/5] w-full rounded-2xl object-cover" />
        <div className="mt-2 flex gap-2">
          {product.images.map((im, i) => (
            <button key={im.id} onClick={() => setImg(i)} className={`overflow-hidden rounded-lg border ${i === img ? "ring-2" : ""}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={im.url} alt={im.alt ?? ""} className="h-16 w-14 object-cover" />
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-sm text-zinc-500">{product.category?.name}</p>
        <h1 className="text-2xl font-bold">{product.name}</h1>
        <p className="mt-2 text-2xl font-bold">{formatPrice(price)}</p>
        {product.salePrice ? <p className="text-sm text-zinc-400 line-through">{formatPrice(product.basePrice)}</p> : null}
        <p className="mt-3 text-sm leading-6">{product.description}</p>

        <div className="mt-4">
          <p className="text-sm font-semibold">Color: {color}</p>
          <div className="mt-1 flex gap-2">
            {colors.map((c) => (
              <button key={c} onClick={() => setColor(c)} className={`rounded-full border px-3 py-1 text-sm ${c === color ? "bg-zinc-900 text-white" : "bg-white"}`}>{c}</button>
            ))}
          </div>
        </div>
        <div className="mt-3">
          <p className="text-sm font-semibold">Talla: {size}</p>
          <div className="mt-1 flex gap-2">
            {sizes.map((s) => (
              <button key={s} onClick={() => setSize(s)} className={`rounded-full border px-3 py-1 text-sm ${s === size ? "bg-zinc-900 text-white" : "bg-white"}`}>{s}</button>
            ))}
          </div>
        </div>

        <div className="mt-3 rounded-xl bg-zinc-100 p-3 text-xs">
          <p className="font-semibold">Guía de tallas (busto/cadera cm)</p>
          <p>S: 82-86 / 90-94 · M: 87-92 / 95-100 · L: 93-98 / 101-106 · XL: 99-104 / 107-112</p>
        </div>

        <p className="mt-3 text-sm">
          {variant ? (variant.stock > 0 ? `Stock: ${variant.stock} (SKU ${variant.sku})` : "Agotado en esta variante") : "Combinación no disponible"}
        </p>

        <button
          disabled={!variant || variant.stock === 0}
          onClick={() => {
            if (!variant) return;
            add({
              variantId: variant.id,
              productSlug: product.slug,
              productName: product.name,
              imageUrl: product.images[0]?.url ?? "",
              size: variant.size,
              color: variant.color,
              unitPrice: price,
              quantity: 1,
            });
            setAdded(true);
          }}
          className="mt-4 w-full rounded-full bg-zinc-900 py-3 text-white disabled:opacity-40"
        >
          Añadir al carrito
        </button>
        {added ? <p className="mt-2 text-sm text-green-700">Agregado. Ve al carrito para finalizar por WhatsApp.</p> : null}
      </div>
    </div>
  );
}
