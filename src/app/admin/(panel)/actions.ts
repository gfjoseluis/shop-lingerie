"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getAdminRepository } from "@/repositories/factory";
import { getServiceClient } from "@/lib/supabase/admin";
import { createServerSupabase } from "@/lib/supabase/server";
import { orderStatusSchema, productInputSchema } from "@/schemas/api";

export async function requireAdmin() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return user;
}

export async function logoutAction() {
  const supabase = await createServerSupabase();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

type Result = { ok: true; id?: string; url?: string } | { ok: false; error: string };

export async function saveProductAction(id: string | null, input: unknown): Promise<Result> {
  await requireAdmin();
  const parsed = productInputSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: `Datos inválidos: ${parsed.error.issues[0]?.message ?? ""}` };
  try {
    const repo = getAdminRepository();
    const product = id ? await repo.updateProduct(id, parsed.data) : await repo.createProduct(parsed.data);
    revalidatePath("/admin/productos");
    revalidatePath("/catalogo");
    revalidatePath("/");
    return { ok: true, id: product.id };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Error al guardar" };
  }
}

export async function toggleProductAction(id: string, active: boolean): Promise<Result> {
  await requireAdmin();
  try {
    await getAdminRepository().setProductActive(id, active);
    revalidatePath("/admin/productos");
    revalidatePath("/catalogo");
    revalidatePath("/");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Error" };
  }
}

export async function updateVariantStockAction(variantId: string, stock: number): Promise<Result> {
  await requireAdmin();
  if (!Number.isInteger(stock) || stock < 0 || stock > 100000) return { ok: false, error: "Stock inválido" };
  try {
    await getAdminRepository().updateVariantStock(variantId, stock);
    revalidatePath("/admin/productos");
    revalidatePath("/catalogo");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Error" };
  }
}

export async function uploadImageAction(formData: FormData): Promise<Result> {
  await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { ok: false, error: "Elige un archivo" };
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type))
    return { ok: false, error: "Solo JPG, PNG o WebP" };
  if (file.size > 5 * 1024 * 1024) return { ok: false, error: "Máximo 5MB por foto" };
  const ext = file.type.split("/")[1] === "jpeg" ? "jpg" : file.type.split("/")[1];
  const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const db = getServiceClient();
  const { error } = await db.storage.from("product-images").upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (error) return { ok: false, error: `Subida falló: ${error.message}` };
  const { data } = db.storage.from("product-images").getPublicUrl(path);
  return { ok: true, url: data.publicUrl };
}

export async function setOrderStatusAction(id: string, status: unknown): Promise<Result> {
  await requireAdmin();
  const parsed = orderStatusSchema.safeParse(status);
  if (!parsed.success) return { ok: false, error: "Estado inválido" };
  try {
    await getAdminRepository().setOrderStatus(id, parsed.data);
    revalidatePath("/admin/pedidos");
    revalidatePath("/admin");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Error" };
  }
}

function slugifyInput(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export async function saveCategoryAction(
  id: string | null,
  input: { name: string; slug: string; description?: string }
): Promise<Result> {
  await requireAdmin();
  const name = input.name.trim();
  const slug = slugifyInput(input.slug);
  if (name.length < 2 || slug.length < 2) return { ok: false, error: "Nombre y slug inválidos" };
  try {
    const repo = getAdminRepository();
    if (id) await repo.updateCategory(id, { name, description: input.description });
    else await repo.createCategory({ name, slug, description: input.description });
    revalidatePath("/admin/categorias");
    revalidatePath("/admin/productos");
    revalidatePath("/catalogo");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Error" };
  }
}

export async function deleteCategoryAction(id: string): Promise<Result> {
  await requireAdmin();
  try {
    await getAdminRepository().deleteCategory(id);
    revalidatePath("/admin/categorias");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Error" };
  }
}

const settingsKeySchema = z.enum([
  "store_name",
  "whatsapp_number",
  "instagram_url",
  "tiktok_url",
  "facebook_url",
]);

export async function saveSettingsAction(input: Record<string, string>): Promise<Result> {
  await requireAdmin();
  const clean: Record<string, string> = {};
  for (const key of settingsKeySchema.options) {
    clean[key] = (input[key] ?? "").trim();
  }
  if (clean.store_name.length < 2) return { ok: false, error: "El nombre de la tienda es muy corto" };
  const digits = clean.whatsapp_number.replace(/\D/g, "");
  if (!/^\d{8,15}$/.test(digits)) return { ok: false, error: "WhatsApp inválido: solo dígitos con código país (ej. 59170000000)" };
  clean.whatsapp_number = digits;
  for (const k of ["instagram_url", "tiktok_url", "facebook_url"] as const) {
    if (clean[k] && !/^https?:\/\/.+\..+/.test(clean[k])) return { ok: false, error: `URL inválida en ${k}` };
  }
  try {
    const db = getServiceClient();
    const { error } = await db
      .from("site_settings")
      .upsert(Object.entries(clean).map(([key, value]) => ({ key, value })), { onConflict: "key" });
    if (error) throw new Error(error.message);
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "No se pudo guardar (¿corriste migrate-03.sql?)" };
  }
  revalidatePath("/", "layout");
  return { ok: true };
}
