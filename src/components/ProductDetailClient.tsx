"use client";
import { useMemo, useState } from "react";
import type { Product } from "@/types/domain";
import { effectivePrice, formatPrice } from "@/lib/format";
import { useCart } from "@/hooks/useCart";
import { SizeGuide } from "@/components/SizeGuide";
import {
  ADHESIVE_KINDS,
  BRA_STYLES,
  CUP_TYPES,
  CUT_TYPES,
  MATERIALS,
  guideHelp,
  guideLabel,
} from "@/data/guides";

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
        <img src={product.images[img]?.url} alt={product.name} className="arch w-full border border-figue/15 aspect-4/5 object-cover" />
        <div className="mt-3 flex gap-2">
          {product.images.map((im, i) => (
            <button
              key={im.id}
              type="button"
              onClick={() => setImg(i)}
              aria-label={`Ver foto ${i + 1}`}
              className={`touch-manipulation cursor-pointer overflow-hidden border p-1 select-none ${i === img ? "border-figue" : "border-nuit/15"}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={im.url} alt={im.alt ?? ""} draggable={false} className="h-16 w-14 object-cover pointer-events-none" />
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-sm font-light text-laiton">{product.category?.name}</p>
        <h1 className="font-display mt-1 text-[2rem] leading-tight">{product.name}</h1>
        <p className="mt-2 font-display text-2xl text-nuit">{formatPrice(price)}</p>
        {product.salePrice ? <p className="text-sm text-nuit/45 line-through">{formatPrice(product.basePrice)}</p> : null}
        <p className="mt-3 max-w-[52ch] text-[0.95rem] font-light leading-7 text-nuit/80">{product.description}</p>

        {(product.cupType || product.braStyle || product.cutType || product.material || product.hooks || product.adhesiveKind || product.presentation) && (
          <dl className="mt-4 space-y-1.5 border-t border-figue/15 pt-3 text-sm">
            {product.cupType && (
              <div className="flex gap-2"><dt className="text-nuit/55">Copa:</dt><dd className="font-medium">{guideLabel(CUP_TYPES, product.cupType)}</dd></div>
            )}
            {product.cupType && guideHelp(CUP_TYPES, product.cupType) && (
              <p className="-mt-1 text-[0.83rem] font-light text-nuit/60">{guideHelp(CUP_TYPES, product.cupType)}</p>
            )}
            {product.braStyle && (
              <div className="flex gap-2"><dt className="text-nuit/55">Estilo:</dt><dd className="font-medium">{guideLabel(BRA_STYLES, product.braStyle)}</dd></div>
            )}
            {product.hooks ? (
              <div className="flex gap-2"><dt className="text-nuit/55">Broches:</dt><dd className="font-medium">{product.hooks} (banda {product.hooks >= 3 ? "ancha, mayor soporte" : "estándar"})</dd></div>
            ) : null}
            {product.cutType && (
              <div className="flex gap-2"><dt className="text-nuit/55">Corte:</dt><dd className="font-medium">{guideLabel(CUT_TYPES, product.cutType)}</dd></div>
            )}
            {product.cutType && guideHelp(CUT_TYPES, product.cutType) && (
              <p className="-mt-1 text-[0.83rem] font-light text-nuit/60">{guideHelp(CUT_TYPES, product.cutType)}</p>
            )}
            {product.material && (
              <div className="flex gap-2"><dt className="text-nuit/55">Tela:</dt><dd className="font-medium">{guideLabel(MATERIALS, product.material)}</dd></div>
            )}
            {product.adhesiveKind && (
              <div className="flex gap-2"><dt className="text-nuit/55">Tipo:</dt><dd className="font-medium">{guideLabel(ADHESIVE_KINDS, product.adhesiveKind)}</dd></div>
            )}
            {product.adhesiveKind && guideHelp(ADHESIVE_KINDS, product.adhesiveKind) && (
              <p className="-mt-1 text-[0.83rem] font-light text-nuit/60">{guideHelp(ADHESIVE_KINDS, product.adhesiveKind)}</p>
            )}
            {product.presentation && (
              <div className="flex gap-2"><dt className="text-nuit/55">Presentación:</dt><dd className="font-medium">{product.presentation}</dd></div>
            )}
          </dl>
        )}

        <div className="mt-5">
          <p className="text-sm">Color: <span className="font-medium">{color}</span></p>
          <div className="mt-2 flex flex-wrap gap-2">
            {colors.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                aria-pressed={c === color}
                className={`touch-manipulation min-h-[44px] cursor-pointer border px-4 py-2 text-sm select-none ${c === color ? "border-nuit bg-nuit text-ivoire" : "border-nuit/20"}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm">Talla: <span className="font-medium">{size}</span></p>
          <div className="mt-2 flex flex-wrap gap-2">
            {sizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                aria-pressed={s === size}
                className={`touch-manipulation min-h-[44px] cursor-pointer border px-4 py-2 text-sm select-none ${s === size ? "border-nuit bg-nuit text-ivoire" : "border-nuit/20"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <SizeGuide categorySlug={product.category?.slug} />
        </div>

        <p className="mt-3 text-sm">
          {variant ? (variant.stock > 0 ? `Stock: ${variant.stock} (SKU ${variant.sku})` : "Agotado en esta variante") : "Combinación no disponible"}
        </p>

        <button
          type="button"
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
          className="mt-5 w-full touch-manipulation bg-nuit py-3.5 text-ivoire disabled:opacity-40"
        >
          Guardar en la bolsa
        </button>
        {added ? <p className="mt-2 text-sm text-figue">Guardado. Ve a la bolsa para finalizar por WhatsApp.</p> : null}
      </div>
    </div>
  );
}
