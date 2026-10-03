import Link from "next/link";
import type { Product } from "@/types/domain";
import { effectivePrice, formatPrice } from "@/lib/format";

export function ProductCard({ p }: { p: Product }) {
  const price = effectivePrice(p.basePrice, p.salePrice);
  const soldOut = p.variants.every((v) => v.stock === 0);
  return (
    <Link href={`/producto/${p.slug}`} className="overflow-hidden rounded-2xl border bg-white transition hover:shadow-md">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={p.images[0]?.url} alt={p.images[0]?.alt ?? p.name} className="aspect-[4/5] w-full object-cover" loading="lazy" />
      <div className="p-3">
        <p className="text-xs text-zinc-500">{p.category?.name}</p>
        <h3 className="line-clamp-1 font-medium">{p.name}</h3>
        <div className="mt-1 flex items-center gap-2">
          <span className="font-bold">{formatPrice(price)}</span>
          {p.salePrice ? <span className="text-sm text-zinc-400 line-through">{formatPrice(p.basePrice)}</span> : null}
        </div>
        {soldOut ? <p className="mt-1 text-xs text-red-600">Agotado</p> : <p className="mt-1 text-xs text-green-700">Disponible</p>}
      </div>
    </Link>
  );
}
