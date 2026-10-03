"use client";
import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Category, Product } from "@/types/domain";
import { ADHESIVE_KINDS, BRA_STYLES, CUT_TYPES, CUP_TYPES, MATERIALS, SIZE_PRESETS } from "@/data/guides";
import { saveProductAction, uploadImageAction } from "@/app/admin/(panel)/actions";

interface VariantRow {
  size: string;
  color: string;
  sku: string;
  stock: number;
  priceOverride: number | null;
}
interface ImageRow {
  url: string;
  alt: string;
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);
}

export function ProductForm({ categories, initial }: { categories: Category[]; initial?: Product | null }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial));
  const [description, setDescription] = useState(initial?.description ?? "");
  const [basePrice, setBasePrice] = useState(initial ? String(initial.basePrice) : "");
  const [salePrice, setSalePrice] = useState(initial?.salePrice ? String(initial.salePrice) : "");
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? categories[0]?.id ?? "");
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);
  const [isFeatured, setIsFeatured] = useState(initial?.isFeatured ?? false);
  const [cupType, setCupType] = useState(initial?.cupType ?? "");
  const [braStyle, setBraStyle] = useState(initial?.braStyle ?? "");
  const [hooks, setHooks] = useState(initial?.hooks ? String(initial.hooks) : "");
  const [cutType, setCutType] = useState(initial?.cutType ?? "");
  const [material, setMaterial] = useState(initial?.material ?? "");
  const [adhesiveKind, setAdhesiveKind] = useState(initial?.adhesiveKind ?? "");
  const [presentation, setPresentation] = useState(initial?.presentation ?? "");

  const catSlug = categories.find((c) => c.id === categoryId)?.slug ?? "";
  const isSuperior = catSlug === "bralettes" || catSlug === "sostenes";
  const isInferior = catSlug === "panties" || catSlug === "tangas" || catSlug === "fajas";
  const isAdhesivo = catSlug === "adhesivos";
  const presetKey = isAdhesivo ? (adhesiveKind === "silicona" ? "silicona" : "unico") : isSuperior ? "superior" : isInferior ? "inferior" : "unico";
  const presets = SIZE_PRESETS[presetKey] ?? [];
  const [images, setImages] = useState<ImageRow[]>(
    initial?.images.map((im) => ({ url: im.url, alt: im.alt ?? "" })) ?? []
  );
  const [urlInput, setUrlInput] = useState("");
  const [variants, setVariants] = useState<VariantRow[]>(
    initial?.variants.map((v) => ({
      size: v.size,
      color: v.color,
      sku: v.sku,
      stock: v.stock,
      priceOverride: v.priceOverride ?? null,
    })) ?? [{ size: "M", color: "Negro", sku: "", stock: 5, priceOverride: null }]
  );
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const autoSku = useMemo(() => {
    const base = slugify(slug || name).slice(0, 12).toUpperCase().replace(/-/g, "").slice(0, 6) || "PRD";
    return (size: string, color: string) => `${base}-${size}-${color.slice(0, 3).toUpperCase()}`;
  }, [slug, name]);

  async function onUpload(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await uploadImageAction(fd);
      if (!res.ok) throw new Error(res.error);
      setImages((prev) => [...prev, { url: res.url!, alt: name }].slice(0, 8));
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo subir");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const filled = variants.map((v) => ({
      size: v.size.trim(),
      color: v.color.trim(),
      sku: v.sku.trim() || autoSku(v.size, v.color),
      stock: Number(v.stock) || 0,
      priceOverride: v.priceOverride,
    }));
    if (filled.some((v) => !v.size || !v.color || !v.sku)) {
      setError("Completa talla, color y SKU en cada variante.");
      return;
    }
    const skus = filled.map((v) => v.sku.toLowerCase());
    if (new Set(skus).size !== skus.length) {
      setError("Hay SKUs repetidos entre variantes.");
      return;
    }
    setSaving(true);
    try {
      const res = await saveProductAction(initial?.id ?? null, {
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim(),
        basePrice: Number(basePrice),
        salePrice: salePrice ? Number(salePrice) : null,
        categoryId,
        isActive,
        isFeatured,
        images: images.filter((im) => im.url),
        variants: filled,
        cupType: isSuperior && cupType ? cupType : null,
        braStyle: catSlug === "bralettes" && braStyle ? braStyle : null,
        hooks: (isSuperior || catSlug === "conjuntos") && hooks ? Number(hooks) : null,
        cutType: isInferior && cutType ? cutType : null,
        material: material || null,
        adhesiveKind: isAdhesivo && adhesiveKind ? adhesiveKind : null,
        presentation: isAdhesivo && presentation.trim() ? presentation.trim() : null,
      });
      if (!res.ok) throw new Error(res.error);
      router.push("/admin/productos");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo guardar");
    } finally {
      setSaving(false);
    }
  }

  const input = "w-full border border-nuit/20 px-3 py-2.5 text-sm outline-none focus:border-figue bg-white";

  return (
    <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <div className="space-y-3 border border-figue/15 bg-white p-5">
        <h2 className="font-display text-xl">Datos</h2>
        <div>
          <label htmlFor="pf-nombre" className="text-sm text-nuit/70">Nombre del producto</label>
          <input id="pf-nombre" required value={name} onChange={(e) => { setName(e.target.value); if (!slugTouched) setSlug(slugify(e.target.value)); }} placeholder="Ej. Sostén Push-Up Negro" className={`${input} mt-1`} />
        </div>
        <div>
          <label htmlFor="pf-slug" className="text-sm text-nuit/70">Slug (URL)</label>
          <input id="pf-slug" required value={slug} onChange={(e) => { setSlug(slugify(e.target.value)); setSlugTouched(true); }} placeholder="sosten-push-up-negro" className={`${input} mt-1`} />
          <p className="mt-1 text-xs font-light text-nuit/55">Se genera solo desde el nombre; tócalo solo si quieres personalizarlo.</p>
        </div>
        <div>
          <label htmlFor="pf-desc" className="text-sm text-nuit/70">Descripción</label>
          <textarea id="pf-desc" required value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Tela, calce, ocasión de uso..." rows={4} className={`${input} mt-1`} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm" htmlFor="pf-precio">Precio Bs<input id="pf-precio" required type="number" min={0} step="0.01" value={basePrice} onChange={(e) => setBasePrice(e.target.value)} className={`${input} mt-1`} /></label>
          <label className="text-sm" htmlFor="pf-oferta">Oferta Bs (opcional)<input id="pf-oferta" type="number" min={0} step="0.01" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} placeholder="—" className={`${input} mt-1`} /></label>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm" htmlFor="pf-cat">Categoría
            <select id="pf-cat" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className={`${input} mt-1`}>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>
          <div className="flex items-end gap-4 pb-2 text-sm">
            <label className="flex items-center gap-2"><input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} /> Visible</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} /> Destacado</label>
          </div>
        </div>
        <label className="block text-sm">Material / tela
          <select value={material} onChange={(e) => setMaterial(e.target.value)} className={input}>
            <option value="">—</option>
            {MATERIALS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
        </label>

        {isSuperior && (
          <div className="grid grid-cols-3 gap-3">
            <label className="text-sm">Tipo de copa
              <select value={cupType} onChange={(e) => setCupType(e.target.value)} className={input}>
                <option value="">—</option>
                {CUP_TYPES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </label>
            {catSlug === "bralettes" && (
              <label className="text-sm">Estilo
                <select value={braStyle} onChange={(e) => setBraStyle(e.target.value)} className={input}>
                  <option value="">—</option>
                  {BRA_STYLES.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}
                </select>
              </label>
            )}
            <label className="text-sm">Broches (1–8)
              <input type="number" min={1} max={8} value={hooks} onChange={(e) => setHooks(e.target.value)} placeholder="—" className={input} />
            </label>
          </div>
        )}
        {isInferior && (
          <label className="block text-sm">Tipo de corte
            <select value={cutType} onChange={(e) => setCutType(e.target.value)} className={input}>
              <option value="">—</option>
              {CUT_TYPES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </label>
        )}
        {isAdhesivo && (
          <div className="grid grid-cols-2 gap-3">
            <label className="text-sm">Tipo
              <select value={adhesiveKind} onChange={(e) => setAdhesiveKind(e.target.value)} className={input}>
                <option value="">—</option>
                {ADHESIVE_KINDS.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
              </select>
            </label>
            <label className="text-sm">Presentación / medida
              <input value={presentation} onChange={(e) => setPresentation(e.target.value)} placeholder='Ej. "Par" o "5 cm x 5 m"' className={input} />
            </label>
          </div>
        )}

        <h2 className="font-display pt-3 text-xl">Variantes y stock</h2>
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-nuit/55">Tallas rápidas ({catSlug || "elige categoría"}):</span>
          {presets.map((s) => (
            <button key={s} type="button" onClick={() => setVariants((p) => (p.some((v) => v.size === s) ? p : [...p, { size: s, color: p[0]?.color ?? "Negro", sku: "", stock: 5, priceOverride: null }]))} className="border border-nuit/25 px-2 py-1">
              + {s}
            </button>
          ))}
        </div>
        {initial && initial.variants.length > 0 && (
          <p className="text-xs text-nuit/55">Si el producto ya tiene pedidos, no se pueden reemplazar variantes: edita el stock directo en la tabla de abajo del editor.</p>
        )}
        <div className="space-y-2">
          <div className="grid grid-cols-[70px_1fr_1fr_80px_auto] gap-2 text-xs text-nuit/55" aria-hidden>
            <span>Talla</span><span>Color</span><span>SKU</span><span>Stock</span><span></span>
          </div>
          {variants.map((v, i) => (
            <div key={i} className="grid grid-cols-[70px_1fr_1fr_80px_auto] items-center gap-2">
              <input value={v.size} onChange={(e) => setVariants((p) => p.map((x, j) => (j === i ? { ...x, size: e.target.value } : x)))} placeholder="Talla" className={input} />
              <input value={v.color} onChange={(e) => setVariants((p) => p.map((x, j) => (j === i ? { ...x, color: e.target.value } : x)))} placeholder="Color" className={input} />
              <input value={v.sku} onChange={(e) => setVariants((p) => p.map((x, j) => (j === i ? { ...x, sku: e.target.value } : x)))} placeholder={`SKU auto: ${autoSku(v.size || "M", v.color || "NEG")}`} className={input} />
              <input type="number" min={0} value={v.stock} onChange={(e) => setVariants((p) => p.map((x, j) => (j === i ? { ...x, stock: Number(e.target.value) } : x)))} placeholder="Stock" className={input} />
              <button type="button" onClick={() => setVariants((p) => p.filter((_, j) => j !== i))} className="px-2 text-figue" aria-label="Quitar variante">✕</button>
            </div>
          ))}
        </div>
        <button type="button" onClick={() => setVariants((p) => [...p, { size: "", color: "", sku: "", stock: 0, priceOverride: null }])} className="border border-nuit/25 px-4 py-2 text-sm">
          + Variante
        </button>
      </div>

      <div className="space-y-3 border border-figue/15 bg-white p-5">
        <h2 className="font-display text-xl">Fotos ({images.length}/8)</h2>
        <div className="grid grid-cols-2 gap-2">
          {images.map((im, i) => (
            <div key={i} className="relative border border-nuit/15">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={im.url} alt={im.alt} className="aspect-[4/5] w-full object-cover" />
              <div className="flex gap-1 p-1">
                {i > 0 && <button type="button" onClick={() => setImages((p) => { const n = [...p]; [n[i - 1], n[i]] = [n[i], n[i - 1]]; return n; })} className="text-xs underline">←</button>}
                <button type="button" onClick={() => setImages((p) => p.filter((_, j) => j !== i))} className="ml-auto text-xs text-figue underline">Quitar</button>
              </div>
            </div>
          ))}
        </div>
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => onUpload(e.target.files)} className="hidden" />
        <button type="button" disabled={uploading || images.length >= 8} onClick={() => fileRef.current?.click()} className="w-full border border-figue px-4 py-2.5 text-sm text-figue disabled:opacity-40">
          {uploading ? "Subiendo..." : "Subir foto (JPG/PNG/WebP ≤5MB)"}
        </button>
        <div className="flex gap-2">
          <input value={urlInput} onChange={(e) => setUrlInput(e.target.value)} placeholder="...o pegar URL https://" className={input} />
          <button type="button" onClick={() => { if (urlInput.trim() && images.length < 8) { setImages((p) => [...p, { url: urlInput.trim(), alt: name }]); setUrlInput(""); } }} className="shrink-0 border border-nuit/25 px-3 text-sm">Añadir</button>
        </div>

        {error ? <p className="text-sm text-figue">{error}</p> : null}
        <button disabled={saving} className="w-full bg-figue py-3 text-white disabled:opacity-50">
          {saving ? "Guardando..." : initial ? "Guardar cambios" : "Crear producto"}
        </button>
      </div>
    </form>
  );
}
