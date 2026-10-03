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
    <div className="grid gap-10 md:grid-cols-2">
      <div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.images[img]?.url} alt={product.name} className="arch w-full border border-figue/15 aspect-[4/5] object-cover" />
        <div className="mt-3 flex gap-2">
          {product.images.map((im, i) => (
            <button key={im.id} onClick={() => setImg(i)} className={`overflow-hidden border ${i === img ? "border-figue" : "border-nuit/15"}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={im.url} alt={im.alt ?? ""} className="h-16 w-14 object-cover" />
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-sm font-light text-figue">{product.category?.name}</p>
        <h1 className="font-display mt-1 text-[2rem] leading-tight">{product.name}</h1>
        <p className="mt-2 font-display text-2xl text-figue">{formatPrice(price)}</p>
        {product.salePrice ? <p className="text-sm text-nuit/45 line-through">{formatPrice(product.basePrice)}</p> : null}
        <p className="mt-3 max-w-[52ch] text-[0.95rem] font-light leading-7 text-nuit/80">{product.description}</p>

        <div className="mt-5">
          <p className="text-sm">Color: <span className="font-medium">{color}</span></p>
          <div className="mt-2 flex gap-2">
            {colors.map((c) => (
              <button key={c} onClick={() => setColor(c)} className={`border px-4 py-2 text-sm ${c === color ? "border-figue bg-figue text-white" : "border-nuit/20"}`}>{c}</button>
            ))}
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm">Talla: <span className="font-medium">{size}</span></p>
          <div className="mt-2 flex gap-2">
            {sizes.map((s) => (
              <button key={s} onClick={() => setSize(s)} className={`border px-4 py-2 text-sm ${s === size ? "border-figue bg-figue text-white" : "border-nuit/20"}`}>{s}</button>
            ))}
          </div>
        </div>

        <div className="mt-4 bg-seda-soft p-4 text-[0.85rem] font-light leading-6">
          <p className="font-medium">Guía de tallas (busto/cadera cm)</p>
          <p>S 82-86 / 90-94 · M 87-92 / 95-100 · L 93-98 / 101-106 · XL 99-104 / 107-112</p>
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
          className="mt-5 w-full bg-nuit py-3.5 text-ivoire disabled:opacity-40"
        >
          Guardar en la bolsa
        </button>
        {added ? <p className="mt-2 text-sm text-figue">Guardado. Ve a la bolsa para finalizar por WhatsApp.</p> : null}
      </div>
    </div>
  );
}
