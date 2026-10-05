import Link from "next/link";
import type { Product } from "@/types/domain";
import { effectivePrice, formatPrice } from "@/lib/format";
import { ShopImage } from "@/components/ShopImage";

export function ProductCard({ p, large = false }: { p: Product; large?: boolean }) {
  const price = effectivePrice(p.basePrice, p.salePrice);
  const soldOut = p.variants.every((v) => v.stock === 0);
  const available = p.variants.reduce((a, v) => a + v.stock, 0);
  const lowStock = !soldOut && available <= 3;
  return (
    <Link href={`/producto/${p.slug}`} className="group block">
      <ShopImage
        src={p.images[0]?.url ?? ""}
        alt={p.images[0]?.alt ?? p.name}
        className={`arch overflow-hidden border border-figue/15 bg-seda-soft ${large ? "aspect-3/4" : "aspect-4/5"}`}
        imgClassName="transition duration-500 group-hover:scale-[1.03]"
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
      />
      <div className="flex items-start justify-between gap-3 pt-3">
        <div>
          <p className="text-[0.72rem] font-light tracking-wide text-nuit/55">{p.category?.name}</p>
          <h3 className="font-display text-[1.05rem] leading-tight">{p.name}</h3>
          <p className={`mt-1 text-[0.8rem] ${soldOut ? "text-figue" : lowStock ? "font-medium text-figue" : "text-nuit/60"}`}>
            {soldOut
              ? "Agotado por ahora"
              : lowStock
                ? `¡Últimas ${available}!`
                : `${p.variants.filter((v) => v.stock > 0).length} variantes disponibles`}
          </p>
        </div>
        <div className="text-right">
          <p className="font-medium text-nuit">{formatPrice(price)}</p>
          {p.salePrice ? <p className="text-[0.8rem] text-nuit/45 line-through">{formatPrice(p.basePrice)}</p> : null}
        </div>
      </div>
    </Link>
  );
}
