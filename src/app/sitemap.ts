import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { ProductService } from "@/services/shop.service";

// El dominio sale del request (localhost, vercel.app o propio): sin env que configurar.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  if (!host) return [];
  const base = `${proto}://${host}`;

  const svc = new ProductService();
  const now = new Date();
  const urls: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${base}/catalogo`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
  ];
  const cats = await svc.categories();
  for (const c of cats) {
    urls.push({ url: `${base}/catalogo?categoria=${c.slug}`, lastModified: now, changeFrequency: "weekly", priority: 0.7 });
  }
  const all = await svc.list({ page: 1, limit: 200 });
  for (const p of all.data) {
    urls.push({
      url: `${base}/producto/${p.slug}`,
      lastModified: p.createdAt ? new Date(p.createdAt) : now,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }
  return urls;
}
