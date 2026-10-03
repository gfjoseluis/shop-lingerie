import { BAND_GUIDE, BOTTOM_SIZE_GUIDE, CUP_LETTERS } from "@/data/guides";
import { ADHESIVOS_SLUG, INFERIOR_SLUGS, SUPERIOR_SLUGS } from "@/types/domain";

export function SizeGuide({ categorySlug }: { categorySlug?: string | null }) {
  if (!categorySlug) return null;
  if (SUPERIOR_SLUGS.includes(categorySlug)) {
    return (
      <div className="bg-seda-soft p-4 text-[0.85rem] font-light leading-6">
        <p className="font-medium">Guía de tallas: banda + copa</p>
        <p className="mt-1">La talla combina tu banda (números) con tu copa (letra): ej. 36B.</p>
        <div className="mt-2 grid grid-cols-2 gap-3">
          <div>
            <p className="font-medium">Banda (contorno cm)</p>
            {BAND_GUIDE.map((b) => (
              <p key={b.banda}>{b.banda}: {b.contorno}</p>
            ))}
          </div>
          <div>
            <p className="font-medium">Copa</p>
            {CUP_LETTERS.map((c) => (
              <p key={c.letra}>{c.letra}: {c.para}</p>
            ))}
          </div>
        </div>
      </div>
    );
  }
  if (INFERIOR_SLUGS.includes(categorySlug)) {
    return (
      <div className="bg-seda-soft p-4 text-[0.85rem] font-light leading-6">
        <p className="font-medium">Guía de tallas (cintura / cadera cm)</p>
        {BOTTOM_SIZE_GUIDE.map((r) => (
          <p key={r.size}>{r.size}: {r.cintura} / {r.cadera}</p>
        ))}
      </div>
    );
  }
  if (categorySlug === ADHESIVOS_SLUG) {
    return (
      <div className="bg-seda-soft p-4 text-[0.85rem] font-light leading-6">
        <p className="font-medium">Sobre las tallas</p>
        <p>Silicona por copa (A–D), pezoneras y cintas en talla única. Revisa la presentación del producto.</p>
      </div>
    );
  }
  return null;
}
