import Link from "next/link";
import type { Product } from "@/types/domain";
import { effectivePrice, formatPrice } from "@/lib/format";

export function ProductCard({ p, large = false }: { p: Product; large?: boolean }) {
  const price = effectivePrice(p.basePrice, p.salePrice);
  const soldOut = p.variants.every((v) => v.stock === 0);
  return (
    <Link href={`/producto/${p.slug}`} className="group block">
      <div className="arch overflow-hidden border border-figue/15 bg-seda-soft">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={p.images[0]?.url}
          alt={p.images[0]?.alt ?? p.name}
          className={`w-full object-cover transition duration-500 group-hover:scale-[1.03] ${large ? "aspect-3/4" : "aspect-4/5"}`}
          loading="lazy"
        />
      </div>
      <div className="flex items-start justify-between gap-3 pt-3">
        <div>
          <p className="text-[0.72rem] font-light tracking-wide text-nuit/55">{p.category?.name}</p>
          <h3 className="font-display text-[1.05rem] leading-tight">{p.name}</h3>
          <p className={`mt-1 text-[0.8rem] ${soldOut ? "text-figue" : "text-nuit/60"}`}>
            {soldOut ? "Agotado por ahora" : `${p.variants.filter((v) => v.stock > 0).length} variantes disponibles`}
          </p>
        </div>
        <div className="text-right">
          <p className="font-medium text-figue">{formatPrice(price)}</p>
          {p.salePrice ? <p className="text-[0.8rem] text-nuit/45 line-through">{formatPrice(p.basePrice)}</p> : null}
        </div>
      </div>
    </Link>
  );
}
