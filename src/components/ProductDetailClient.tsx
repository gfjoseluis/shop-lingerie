"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Product } from "@/types/domain";
import { effectivePrice, formatPrice } from "@/lib/format";
import { useCart } from "@/hooks/useCart";
import { ShopImage } from "@/components/ShopImage";
import { SizeGuide } from "@/components/SizeGuide";
import { ShareButton } from "@/components/ShareButton";
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
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const touchX = useRef<number | null>(null);
  const touchY = useRef<number | null>(null);
  const lastTap = useRef(0);

  function go(delta: number) {
    setZoom(false);
    setOrigin({ x: 50, y: 50 });
    setLightbox((v) => (v === null ? v : (v + delta + product.images.length) % product.images.length));
  }

  function closeLightbox() {
    setLightbox(null);
    setZoom(false);
    setOrigin({ x: 50, y: 50 });
  }

  // Teclado + bloqueo de scroll en lightbox
  useEffect(() => {
    if (lightbox === null) return;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightbox, product.images.length]);

  const variant = product.variants.find((v) => v.color === color && v.size === size);
  const price = effectivePrice(product.basePrice, product.salePrice);

  return (
    <>
    <div className="grid gap-10 md:grid-cols-2">
      <div>
        <button
          type="button"
          onClick={() => setLightbox(img)}
          aria-label="Ampliar foto"
          className="block w-full cursor-zoom-in touch-manipulation"
        >
          <ShopImage
            src={product.images[img]?.url ?? ""}
            alt={product.name}
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="arch aspect-4/5 w-full border border-figue/15"
          />
        </button>
        <div className="mt-3 flex gap-2">
          {product.images.map((im, i) => (
            <button
              key={im.id}
              type="button"
              onClick={() => setImg(i)}
              aria-label={`Ver foto ${i + 1}`}
              className={`touch-manipulation cursor-pointer overflow-hidden border p-1 select-none ${i === img ? "border-figue" : "border-nuit/15"}`}
            >
              <ShopImage src={im.url} alt={im.alt ?? ""} sizes="60px" className="pointer-events-none h-16 w-14" />
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
                className={`touch-manipulation min-h-[44px] cursor-pointer rounded-full border px-4 py-2 text-sm font-medium select-none ${c === color ? "border-figue bg-figue text-nuit" : "border-nuit/20"}`}
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
                className={`touch-manipulation min-h-[44px] cursor-pointer rounded-full border px-4 py-2 text-sm font-medium select-none ${s === size ? "border-figue bg-figue text-nuit" : "border-nuit/20"}`}
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
          {variant
            ? variant.stock === 0
              ? "Agotado en esta variante"
              : variant.stock <= 3
                ? `¡Últimas ${variant.stock}! (SKU ${variant.sku})`
                : `Stock: ${variant.stock} (SKU ${variant.sku})`
            : "Combinación no disponible"}
        </p>

        <div className="mt-5 flex gap-2">
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
            className="flex-1 touch-manipulation rounded-full bg-figue py-3.5 font-semibold text-nuit disabled:opacity-40"
          >
            Guardar en la bolsa
          </button>
          <ShareButton title={product.name} path={`/producto/${product.slug}`} />
        </div>
        {added ? <p className="mt-2 text-sm text-figue">Guardado. Ve a la bolsa para finalizar por WhatsApp.</p> : null}
      </div>
    </div>

    {lightbox !== null && product.images[lightbox] ? (
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Foto ${lightbox + 1} de ${product.images.length}. Toca para ${zoom ? "reducir" : "ampliar"}.`}
        className="fixed inset-0 z-50 flex items-center justify-center bg-nuit/90 p-4"
        onClick={closeLightbox}
      >
        <button
          type="button"
          onClick={closeLightbox}
          aria-label="Cerrar"
          className="absolute top-4 right-4 z-10 flex h-11 w-11 touch-manipulation items-center justify-center border border-ivoire/40 text-xl text-ivoire"
        >
          ✕
        </button>
        <p className="absolute top-6 left-5 z-10 text-sm text-ivoire/70">
          {lightbox + 1} / {product.images.length}
        </p>
        {product.images.length > 1 ? (
          <>
            <button
              type="button"
              aria-label="Foto anterior"
              onClick={(e) => { e.stopPropagation(); go(-1); }}
              className="absolute left-2 z-10 flex h-11 w-11 touch-manipulation items-center justify-center bg-ivoire/10 text-xl text-ivoire sm:left-6"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Foto siguiente"
              onClick={(e) => { e.stopPropagation(); go(1); }}
              className="absolute right-2 z-10 flex h-11 w-11 touch-manipulation items-center justify-center bg-ivoire/10 text-xl text-ivoire sm:right-6"
            >
              ›
            </button>
          </>
        ) : null}
        <div
          className={`max-h-[85vh] w-full max-w-2xl overflow-hidden touch-none ${zoom ? "cursor-zoom-out" : "cursor-zoom-in"}`}
          onClick={(e) => {
            e.stopPropagation();
            // Doble toque/clic alterna zoom; clic simple no hace nada (el fondo cierra)
            const now = Date.now();
            if (now - lastTap.current < 300) {
              lastTap.current = 0;
              setZoom((z) => !z);
              if (zoom) setOrigin({ x: 50, y: 50 });
            } else {
              lastTap.current = now;
            }
          }}
          onMouseMove={(e) => {
            if (!zoom) return;
            const r = e.currentTarget.getBoundingClientRect();
            setOrigin({
              x: Math.min(100, Math.max(0, ((e.clientX - r.left) / r.width) * 100)),
              y: Math.min(100, Math.max(0, ((e.clientY - r.top) / r.height) * 100)),
            });
          }}
          onTouchStart={(e) => {
            touchX.current = e.touches[0].clientX;
            touchY.current = e.touches[0].clientY;
          }}
          onTouchMove={(e) => {
            // Con zoom: el dedo panea la foto en ambos ejes; sin zoom: se evalúa swipe al soltar
            if (!zoom || touchX.current === null || touchY.current === null) return;
            const el = e.currentTarget;
            const r = el.getBoundingClientRect();
            const dx = e.touches[0].clientX - touchX.current;
            const dy = e.touches[0].clientY - touchY.current;
            touchX.current = e.touches[0].clientX;
            touchY.current = e.touches[0].clientY;
            setOrigin((o) => ({
              x: Math.min(100, Math.max(0, o.x - (dx / r.width) * 100)),
              y: Math.min(100, Math.max(0, o.y - (dy / r.height) * 100)),
            }));
          }}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const startX = touchX.current;
            touchX.current = null;
            touchY.current = null;
            if (zoom) return;
            const dx = e.changedTouches[0].clientX - startX;
            if (Math.abs(dx) < 40) return;
            go(dx < 0 ? 1 : -1);
          }}
        >
          <div
            style={{ transform: zoom ? "scale(2)" : "scale(1)", transformOrigin: `${origin.x}% ${origin.y}%` }}
            className="transition-transform duration-200"
          >
            <ShopImage
              src={product.images[lightbox].url}
              alt={product.images[lightbox].alt ?? product.name}
              sizes="100vw"
              className="pointer-events-none aspect-4/5 w-full select-none"
            />
          </div>
        </div>
        <p className="absolute bottom-5 left-0 right-0 z-10 text-center text-xs text-ivoire/60">
          {zoom ? "Arrastra para explorar · toca 2 veces para reducir" : "Toca 2 veces para ampliar"}
        </p>
      </div>
    ) : null}
    </>
  );
}
