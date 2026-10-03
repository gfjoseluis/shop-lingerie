// Reseed taxonomía 8 categorías + atributos de lencería. Idempotente.
// Limpia: pedidos de prueba (Test%), productos fuera de la lista y categorías obsoletas.
// Uso: node --env-file=.env.local scripts/seed.mjs
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secret = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !secret) {
  console.error("Falta NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SECRET_KEY en .env.local");
  process.exit(1);
}
const db = createClient(url, secret, { auth: { persistSession: false, autoRefreshToken: false } });

const { error: bucketErr } = await db.storage.createBucket("product-images", { public: true });
if (bucketErr && !/already exists|duplicate/i.test(bucketErr.message)) {
  console.error("Bucket:", bucketErr.message);
  process.exit(1);
}
console.log("Bucket product-images OK");

const CATEGORIES = [
  { slug: "bralettes", name: "Bralettes", description: "Livianos sin aro, encaje visible" },
  { slug: "sostenes", name: "Sostenes", description: "Push-up, balconette y copas con soporte" },
  { slug: "panties", name: "Panties", description: "Clásicas, bikini y cacheteros de uso diario" },
  { slug: "tangas", name: "Tangas", description: "Brasileñas e hilo, sin marcas" },
  { slug: "fajas", name: "Fajas", description: "Compresión suave a firme" },
  { slug: "conjuntos", name: "Conjuntos", description: "Sets coordinados superior + inferior" },
  { slug: "ofertas", name: "Ofertas", description: "Precio especial, últimas unidades" },
  { slug: "adhesivos", name: "Adhesivos", description: "Silicona, pezoneras y cintas" },
];

// Limpieza de datos viejos (pruebas y taxonomía anterior)
const { data: testOrders } = await db.from("orders").select("id").like("customer_name", "Test%");
for (const o of testOrders ?? []) {
  await db.from("order_items").delete().eq("order_id", o.id);
  await db.from("orders").delete().eq("id", o.id);
}
console.log(`Pedidos de prueba borrados: ${(testOrders ?? []).length}`);

const PRODUCTS = [
  {
    slug: "bralette-encaje-soft", name: "Bralette Encaje Soft",
    description: "Sin aros ni relleno, encaje visible con forro de algodón. Comodidad todo el día.",
    base_price: 110, sale_price: null, cat: "bralettes", featured: true,
    cup_type: "soft", bra_style: "clasico", hooks: 2, material: "encaje",
    images: ["bralette-soft-0", "bralette-soft-1"],
    variants: [["S", "Negro", 6], ["M", "Negro", 8], ["M", "Rosado", 5], ["L", "Blanco", 4]],
  },
  {
    slug: "sosten-push-up-negro", name: "Sostén Push-Up Negro",
    description: "Relleno angular que junta y eleva. Busto pequeño o mediano con escote prominente. 3 broches.",
    base_price: 159, sale_price: 139, cat: "sostenes", featured: true,
    cup_type: "push-up", hooks: 3, material: "microfibra",
    images: ["pushup-0", "pushup-1", "pushup-2"],
    variants: [["34B", "Negro", 4], ["36B", "Negro", 6], ["36C", "Negro", 3]],
  },
  {
    slug: "panty-clasica-algodon", name: "Panty Clásica Algodón",
    description: "Cobertura tradicional a media cadera en algodón respirable. Licra en cintura.",
    base_price: 45, sale_price: null, cat: "panties", featured: false,
    cut_type: "clasica", material: "algodon",
    images: ["panty-clasica-0", "panty-clasica-1"],
    variants: [["S", "Blanco", 12], ["M", "Blanco", 15], ["L", "Beige", 10], ["XL", "Beige", 6]],
  },
  {
    slug: "tanga-brasilena-negra", name: "Tanga Brasileña Negra",
    description: "Bikini adelante y V atrás. Cero marcas bajo ropa ajustada.",
    base_price: 55, sale_price: null, cat: "tangas", featured: false,
    cut_type: "brasilena", material: "licra",
    images: ["tanga-0", "tanga-1"],
    variants: [["S", "Negro", 8], ["M", "Negro", 10], ["L", "Negro", 5]],
  },
  {
    slug: "faja-reductora-alta", name: "Faja Reductora Tiro Alto",
    description: "Compresión moderada que moldea abdomen y glúteos. Tiro hasta el ombligo.",
    base_price: 175, sale_price: null, cat: "fajas", featured: false,
    cut_type: "reductora", material: "licra",
    images: ["faja-0", "faja-1"],
    variants: [["M", "Beige", 5], ["L", "Beige", 4], ["XL", "Negro", 3]],
  },
  {
    slug: "conjunto-encaje-rose-clasico", name: "Conjunto Encaje Rosé Clásico",
    description: "Encaje suave con forro de algodón, broche regulable. Guía de tallas incluida.",
    base_price: 149, sale_price: 129, cat: "conjuntos", featured: true,
    material: "encaje",
    images: ["rose-clasico-0", "rose-clasico-1", "rose-clasico-2"],
    variants: [["S", "Negro", 5], ["M", "Negro", 8], ["M", "Rosado", 4], ["L", "Blanco", 6]],
  },
  {
    slug: "pack-oferta-tangas", name: "Pack Oferta x3 Tangas",
    description: "Tres tangas surtidas a precio especial. Hasta agotar stock.",
    base_price: 120, sale_price: 89, cat: "ofertas", featured: true,
    cut_type: "tanga", material: "licra",
    images: ["pack-tangas-0", "pack-tangas-1"],
    variants: [["S", "Surtido", 9], ["M", "Surtido", 12], ["L", "Surtido", 0]],
  },
  {
    slug: "pezoneras-silicona-nude", name: "Pezoneras de Silicona Nude",
    description: "Adhesivas reutilizables, sin tiros ni broches. Talla única. Ideales con escotes.",
    base_price: 65, sale_price: null, cat: "adhesivos", featured: false,
    adhesive_kind: "pezonera", material: "silicona", presentation: "Par",
    images: ["pezoneras-0"],
    variants: [["Único", "Nude", 30]],
  },
];

const { error: catErr } = await db.from("categories").upsert(CATEGORIES, { onConflict: "slug" });
if (catErr) {
  console.error("Categorías:", catErr.message);
  process.exit(1);
}
// Borra categorías obsoletas (bodys, pijamas...) que no tengan productos
const { data: allCats } = await db.from("categories").select("id,slug");
const keep = new Set(CATEGORIES.map((c) => c.slug));
for (const c of allCats ?? []) {
  if (keep.has(c.slug)) continue;
  const { count } = await db.from("products").select("id", { count: "exact", head: true }).eq("category_id", c.id);
  if (!count) {
    await db.from("categories").delete().eq("id", c.id);
    console.log(`Categoría obsoleta borrada: ${c.slug}`);
  } else {
    console.log(`Categoría ${c.slug} tiene ${count} productos, se conserva`);
  }
}
// Borra productos fuera de la lista nueva (cascada a imágenes/variantes)
const { data: allProducts } = await db.from("products").select("id,slug");
const keepSlugs = new Set(PRODUCTS.map((p) => p.slug));
for (const p of allProducts ?? []) {
  if (keepSlugs.has(p.slug)) continue;
  const { count } = await db.from("order_items").select("order_id", { count: "exact", head: true }).eq("variant_id", p.id);
  await db.from("products").delete().eq("id", p.id);
  console.log(`Producto viejo borrado: ${p.slug}`);
}

const { data: cats } = await db.from("categories").select("id,slug");
const catId = Object.fromEntries((cats ?? []).map((c) => [c.slug, c.id]));

for (const p of PRODUCTS) {
  const { data: prod, error: pErr } = await db
    .from("products")
    .upsert(
      {
        slug: p.slug, name: p.name, description: p.description,
        base_price: p.base_price, sale_price: p.sale_price,
        category_id: catId[p.cat], is_active: true, is_featured: p.featured,
        cup_type: p.cup_type ?? null, bra_style: p.bra_style ?? null,
        hooks: p.hooks ?? null, cut_type: p.cut_type ?? null,
        material: p.material ?? null, adhesive_kind: p.adhesive_kind ?? null,
        presentation: p.presentation ?? null,
      },
      { onConflict: "slug" }
    )
    .select("id")
    .single();
  if (pErr || !prod) {
    console.error(`Producto ${p.slug}:`, pErr?.message);
    process.exit(1);
  }
  const pid = prod.id;
  // Reemplaza imágenes y variantes del ejemplo (sin pedidos reales que las referencien)
  const { error: delErr } = await db.from("product_variants").delete().eq("product_id", pid);
  if (delErr) console.log(`  (variantes de ${p.slug} se conservan: ${delErr.message})`);
  await db.from("product_images").delete().eq("product_id", pid);
  const { error: iErr } = await db.from("product_images").insert(
    p.images.map((seed, i) => ({
      product_id: pid,
      url: `https://picsum.photos/seed/${seed}/800/1000`,
      alt: `Foto ${i + 1}`,
      position: i,
    }))
  );
  if (iErr) {
    console.error(`Imágenes ${p.slug}:`, iErr.message);
    process.exit(1);
  }
  for (const [size, color, stock] of p.variants) {
    const base = p.slug.slice(0, 3).toUpperCase().replace(/-/g, "");
    const sku = `${base}-${String(size).replace(/[^A-Z0-9]/gi, "").toUpperCase()}-${String(color).slice(0, 3).toUpperCase()}`;
    const { error: vErr } = await db.from("product_variants").upsert(
      { product_id: pid, size, color, sku, stock },
      { onConflict: "sku" }
    );
    if (vErr) {
      console.error(`Variante ${sku}:`, vErr.message);
      process.exit(1);
    }
  }
  // Variantes viejas del mismo producto que ya no van (cascada segura: sin pedidos)
  console.log(`OK ${p.slug}`);
}
console.log("Reseed completo");
