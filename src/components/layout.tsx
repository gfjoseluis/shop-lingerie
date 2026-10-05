"use client";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/hooks/useCart";

export function Header({ storeName }: { storeName: string }) {
  const { count } = useCart();
  const [q, setQ] = useState("");
  return (
    <header className="sticky top-0 z-40 border-b border-figue/15 bg-ivoire/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-baseline gap-6 px-4 py-4">
        <Link href="/" className="font-display text-[1.4rem] leading-none">
          {storeName}
          <span className="mt-1 block font-body text-[0.7rem] font-light tracking-wide text-nuit/60">
            Catálogo privado
          </span>
        </Link>
        <form action="/catalogo" className="hidden flex-1 items-center gap-2 sm:flex">
          <input
            name="q"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Encaje negro en M, body seda…"
            className="w-full border-b border-nuit/25 bg-transparent py-2 text-[0.95rem] outline-none placeholder:text-nuit/40 focus:border-figue"
          />
          <button className="border border-nuit px-4 py-2 text-sm text-nuit transition hover:bg-nuit hover:text-ivoire">
            Buscar
          </button>
        </form>
        <nav className="ml-auto flex items-baseline gap-5 text-[0.95rem]">
          <Link href="/catalogo" className="underline decoration-figue/40 underline-offset-4 hover:decoration-figue">
            Catálogo
          </Link>
          <Link href="/carrito" className="bg-nuit px-4 py-2 text-ivoire">
            Bolsa · {count}
          </Link>
        </nav>
      </div>
      <form action="/catalogo" className="px-4 pb-3 sm:hidden">
        <input name="q" placeholder="Buscar en el catálogo…" className="w-full border-b border-nuit/25 bg-transparent py-2 outline-none focus:border-figue" />
      </form>
    </header>
  );
}

export function Footer({
  storeName,
  categories,
  socials,
}: {
  storeName: string;
  categories: { slug: string; name: string }[];
  socials: { instagramUrl: string; tiktokUrl: string; facebookUrl: string; whatsappNumber: string };
}) {
  const year = new Date().getFullYear();
  const socialLinks = [
    socials.instagramUrl ? { label: "Instagram", href: socials.instagramUrl } : null,
    socials.tiktokUrl ? { label: "TikTok", href: socials.tiktokUrl } : null,
    socials.facebookUrl ? { label: "Facebook", href: socials.facebookUrl } : null,
  ].filter((s): s is { label: string; href: string } => s !== null);

  return (
    <footer className="mt-20 border-t border-nuit/15">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3">
        <div>
          <p className="font-display text-2xl">{storeName}</p>
          <p className="mt-2 max-w-[32ch] text-sm font-light leading-6 text-nuit/65">
            Compra discreta por WhatsApp. Eliges, coordinamos Yango o InDrive y pagas al recibir.
          </p>
          <Link
            href={`https://wa.me/${socials.whatsappNumber}?text=${encodeURIComponent("Hola, quiero asesoría de tallas")}`}
            target="_blank"
            className="mt-3 inline-block bg-nuit px-5 py-2.5 text-sm text-ivoire"
          >
            Escríbenos por WhatsApp
          </Link>
        </div>
        <div className="text-sm">
          <p className="text-nuit/50">Tienda</p>
          <div className="mt-2 flex flex-col gap-1">
            <Link href="/catalogo" className="w-fit underline underline-offset-4">
              Ver todo el catálogo
            </Link>
            {categories.slice(0, 5).map((c) => (
              <Link key={c.slug} href={`/catalogo?categoria=${c.slug}`} className="w-fit underline underline-offset-4">
                {c.name}
              </Link>
            ))}
          </div>
        </div>
        <div className="text-sm">
          <p className="text-nuit/50">Ayuda y redes</p>
          <p className="mt-2 leading-6">
            Santa Cruz de la Sierra
            <br />
            Envío a coordinar · Pago contraentrega
          </p>
          {socialLinks.length > 0 ? (
            <div className="mt-3 flex flex-col gap-1">
              {socialLinks.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener" className="w-fit underline underline-offset-4">
                  {s.label}
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </div>
      <div className="border-t border-nuit/10">
        <p className="mx-auto max-w-6xl px-4 py-4 text-xs font-light text-nuit/50">
          © {year} {storeName} · Santa Cruz de la Sierra, Bolivia · Precios en Bs
        </p>
      </div>
    </footer>
  );
}
