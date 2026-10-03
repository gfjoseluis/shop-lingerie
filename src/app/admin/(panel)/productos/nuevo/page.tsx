import { notFound } from "next/navigation";
import { getAdminRepository } from "@/repositories/factory";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function NuevoProductoPage() {
  const cats = await getAdminRepository().listCategories();
  if (cats.length === 0) notFound();
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-display mb-5 text-3xl">Nuevo producto</h1>
      <ProductForm categories={cats} />
    </main>
  );
}
