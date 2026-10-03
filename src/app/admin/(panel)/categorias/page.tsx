import { getAdminRepository } from "@/repositories/factory";
import { CategoryManager } from "@/components/admin/CategoryManager";

export default async function CategoriasPage() {
  const cats = await getAdminRepository().listCategories();
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-display mb-1 text-3xl">Categorías ({cats.length})</h1>
      <p className="mb-5 text-sm font-light text-nuit/60">
        El slug no se puede cambiar (rompería enlaces). No se puede borrar una categoría con productos.
      </p>
      <CategoryManager initial={cats} />
    </main>
  );
}
