"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Category } from "@/types/domain";
import { deleteCategoryAction, saveCategoryAction } from "@/app/admin/(panel)/actions";

export function CategoryManager({ initial }: { initial: Category[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    start(async () => {
      const res = await saveCategoryAction(null, { name, slug, description });
      if (!res.ok) setError(res.error);
      else {
        setName("");
        setSlug("");
        setDescription("");
        router.refresh();
      }
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="border border-figue/15 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-seda-soft text-left">
              <th className="p-2">Nombre</th>
              <th className="p-2">Slug</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {initial.map((c) => (
              <CategoryRow key={c.id} category={c} />
            ))}
          </tbody>
        </table>
      </div>
      <form onSubmit={create} className="h-fit space-y-3 border border-figue/15 bg-white p-5">
        <h2 className="font-display text-xl">Nueva categoría</h2>
        <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre (ej. Cacheteros)" className="w-full border border-nuit/20 px-3 py-2.5 text-sm outline-none focus:border-figue" />
        <input required value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"))} placeholder="slug (ej. cacheteros)" className="w-full border border-nuit/20 px-3 py-2.5 text-sm outline-none focus:border-figue" />
        <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descripción (opcional)" className="w-full border border-nuit/20 px-3 py-2.5 text-sm outline-none focus:border-figue" />
        {error ? <p className="text-sm text-figue">{error}</p> : null}
        <button disabled={pending} className="w-full bg-figue py-2.5 text-white disabled:opacity-50">
          Crear
        </button>
      </form>
    </div>
  );
}

function CategoryRow({ category }: { category: Category }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(category.name);
  const [description, setDescription] = useState(category.description ?? "");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  return (
    <tr className="border-b align-top">
      <td className="p-2">
        {editing ? (
          <span className="flex flex-col gap-1">
            <input value={name} onChange={(e) => setName(e.target.value)} className="border border-nuit/20 px-2 py-1 text-sm" />
            <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descripción" className="border border-nuit/20 px-2 py-1 text-sm" />
            {error ? <span className="text-xs text-figue">{error}</span> : null}
          </span>
        ) : (
          <span>
            <span className="font-medium">{category.name}</span>
            {category.description ? <span className="block text-xs text-nuit/50">{category.description}</span> : null}
          </span>
        )}
      </td>
      <td className="p-2 text-xs text-nuit/55">{category.slug}</td>
      <td className="whitespace-nowrap p-2 text-right">
        {editing ? (
          <span className="flex gap-1">
            <button
              disabled={pending}
              onClick={() =>
                start(async () => {
                  const res = await saveCategoryAction(category.id, { name, slug: category.slug, description });
                  if (!res.ok) setError(res.error);
                  else {
                    setEditing(false);
                    router.refresh();
                  }
                })
              }
              className="border border-figue px-2 py-1 text-xs text-figue"
            >
              Guardar
            </button>
            <button onClick={() => setEditing(false)} className="border border-nuit/25 px-2 py-1 text-xs">
              Cancelar
            </button>
          </span>
        ) : (
          <span className="flex gap-1">
            <button onClick={() => setEditing(true)} className="border border-nuit/25 px-2 py-1 text-xs">
              Editar
            </button>
            <button
              disabled={pending}
              onClick={() => {
                if (!confirm(`Borrar "${category.name}"? Solo si no tiene productos.`)) return;
                start(async () => {
                  const res = await deleteCategoryAction(category.id);
                  if (!res.ok) alert(res.error);
                  else router.refresh();
                });
              }}
              className="border border-nuit/25 px-2 py-1 text-xs text-figue"
            >
              Borrar
            </button>
          </span>
        )}
      </td>
    </tr>
  );
}
