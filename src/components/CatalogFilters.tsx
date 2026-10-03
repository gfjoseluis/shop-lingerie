"use client";
import { useRef, useState } from "react";
import type { Category } from "@/types/domain";
import { CUP_TYPES, CUT_TYPES, MATERIALS } from "@/data/guides";

export interface SelectedFilters {
  categoria: string[];
  talla: string[];
  copa: string[];
  corte: string[];
  tela: string[];
}

const TALLAS = ["S", "M", "L", "XL", "XXL", "34B", "36B", "36C", "38C", "Único"];

function Group({ title, name, options, selected }: { title: string; name: string; options: { value: string; label: string }[]; selected: string[] }) {
  return (
    <fieldset>
      <legend className="text-sm font-medium">{title}</legend>
      <div className="mt-2 space-y-1.5">
        {options.map((o) => (
          <label key={o.value} className="flex cursor-pointer items-center gap-2.5 text-sm font-light touch-manipulation">
            <input
              type="checkbox"
              name={name}
              value={o.value}
              defaultChecked={selected.includes(o.value)}
              className="h-4 w-4 accent-[#2c222b]"
            />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function CatalogFilters({
  cats,
  selected,
  sort,
  q,
  activeCount,
}: {
  cats: Category[];
  selected: SelectedFilters;
  sort: string;
  q?: string;
  activeCount: number;
}) {
  const [drawer, setDrawer] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const form = (
    <form
      ref={formRef}
      action="/catalogo"
      onChange={(e) => {
        // Auto-envía al marcar/desmarcar (no en el select de orden)
        if ((e.target as HTMLElement).tagName === "INPUT") formRef.current?.requestSubmit();
      }}
      className="space-y-6"
    >
      {q ? <input type="hidden" name="q" value={q} /> : null}
      <Group title="Colección" name="categoria" options={cats.map((c) => ({ value: c.slug, label: c.name }))} selected={selected.categoria} />
      <Group title="Talla" name="talla" options={TALLAS.map((t) => ({ value: t, label: t }))} selected={selected.talla} />
      <Group title="Copa" name="copa" options={CUP_TYPES.map((c) => ({ value: c.value, label: c.label }))} selected={selected.copa} />
      <Group title="Corte" name="corte" options={CUT_TYPES.map((c) => ({ value: c.value, label: c.label }))} selected={selected.corte} />
      <Group title="Tela" name="tela" options={MATERIALS.map((m) => ({ value: m.value, label: m.label }))} selected={selected.tela} />
      <div>
        <p className="text-sm font-medium">Orden</p>
        <select name="orden" aria-label="Orden" defaultValue={sort} onChange={() => formRef.current?.requestSubmit()} className="mt-2 w-full border border-nuit/20 bg-transparent px-3 py-2 text-sm">
          <option value="newest">Novedades</option>
          <option value="price_asc">Menor precio</option>
          <option value="price_desc">Mayor precio</option>
        </select>
      </div>
      {activeCount > 0 ? (
        <a href="/catalogo" className="inline-block text-sm underline underline-offset-4">
          Limpiar ({activeCount})
        </a>
      ) : null}
    </form>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setDrawer(true)}
        className="border border-nuit/25 px-5 py-2.5 text-sm touch-manipulation lg:hidden"
      >
        Filtrar{activeCount > 0 ? ` (${activeCount})` : ""}
      </button>
      <aside className="hidden w-60 shrink-0 lg:block">
        <div className="sticky top-24">{form}</div>
      </aside>
      {drawer ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Filtros">
          <div className="absolute inset-0 bg-nuit/40" onClick={() => setDrawer(false)} />
          <div className="absolute top-0 bottom-0 left-0 w-80 max-w-[85vw] overflow-y-auto bg-ivoire p-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-display text-xl">Filtros</p>
              <button type="button" onClick={() => setDrawer(false)} className="border border-nuit/25 px-3 py-1.5 text-sm" aria-label="Cerrar filtros">
                ✕
              </button>
            </div>
            {form}
            <button type="button" onClick={() => setDrawer(false)} className="mt-5 w-full bg-nuit py-3 text-sm text-ivoire">
              Ver resultados
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
