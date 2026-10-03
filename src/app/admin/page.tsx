import { ProductService } from "@/services/shop.service";
import { formatPrice, effectivePrice } from "@/lib/format";

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ key?: string }> }) {
  const { key } = await searchParams;
  const ok = key === process.env.ADMIN_PASSWORD && process.env.ADMIN_PASSWORD;
  if (!ok) {
    return (
      <main className="mx-auto max-w-md px-4 py-10">
        <h1 className="text-xl font-bold">Admin</h1>
        <p className="mt-1 text-sm">Acceso con contraseña temporal (?key=...). Luego se migra a Supabase Auth.</p>
        <form action="/admin" className="mt-3 flex gap-2">
          <input name="key" type="password" placeholder="ADMIN_PASSWORD" className="flex-1 rounded-xl border px-3 py-2" />
          <button className="rounded-full bg-zinc-900 px-4 text-white text-sm">Entrar</button>
        </form>
      </main>
    );
  }
  const svc = new ProductService();
  const res = await svc.list({ page: 1, limit: 48 });
  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="text-xl font-bold">Admin — stock atómico</h1>
      <p className="text-sm text-zinc-600">MVP con placeholders. Carga real de fotos/precio/stock aquí tras conectar Supabase.</p>
      <div className="mt-4 overflow-x-auto rounded border bg-white">
        <table className="w-full text-sm">
          <thead><tr className="border-b bg-zinc-50 text-left"><th className="p-2">Producto</th><th className="p-2">Precio</th><th className="p-2">Variantes / stock</th></tr></thead>
          <tbody>
            {res.data.map((p) => (
              <tr key={p.id} className="border-b">
                <td className="p-2">{p.name}<br /><span className="text-xs text-zinc-500">{p.slug}</span></td>
                <td className="p-2">{formatPrice(effectivePrice(p.basePrice, p.salePrice))}</td>
                <td className="p-2">{p.variants.map((v) => `${v.size}/${v.color}:${v.stock}`).join(" · ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
