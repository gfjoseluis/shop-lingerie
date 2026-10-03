import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { logoutAction } from "./actions";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-ivoire">
      <header className="border-b border-figue/15 bg-nuit text-ivoire">
        <div className="mx-auto flex max-w-6xl items-center gap-5 px-4 py-3 text-sm">
          <Link href="/admin" className="font-display text-lg">
            Admin
          </Link>
          <nav className="flex gap-4">
            <Link href="/admin/productos" className="underline underline-offset-4">
              Productos
            </Link>
            <Link href="/admin/categorias" className="underline underline-offset-4">
              Categorías
            </Link>
            <Link href="/admin/pedidos" className="underline underline-offset-4">
              Pedidos
            </Link>
            <Link href="/admin/configuracion" className="underline underline-offset-4">
              Configuración
            </Link>
            <Link href="/" className="text-ivoire/60">
              Ver tienda
            </Link>
          </nav>
          <span className="ml-auto hidden text-ivoire/60 sm:block">{user.email}</span>
          <form action={logoutAction}>
            <button className="border border-ivoire/40 px-3 py-1.5">Salir</button>
          </form>
        </div>
      </header>
      {children}
    </div>
  );
}
