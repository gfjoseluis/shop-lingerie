"use client";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { env } from "@/lib/env";

export function Header() {
  const { count } = useCart();
  const [q, setQ] = useState("");
  return (
    <header className="sticky top-0 z-40 border-b border-figue/15 bg-ivoire/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-baseline gap-6 px-4 py-4">
        <Link href="/" className="font-display text-[1.4rem] leading-none">
          {env.NEXT_PUBLIC_STORE_NAME}
          <span className="mt-1 block font-body text-[0.7rem] font-light tracking-wide text-nuit/60">
            Santa Cruz de la Sierra
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
          <button className="border border-figue px-4 py-2 text-sm text-figue transition hover:bg-figue hover:text-white">
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

export function Footer() {
  return (
    <footer className="mt-20 bg-nuit text-ivoire">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3">
        <div>
          <p className="font-display text-2xl">{env.NEXT_PUBLIC_STORE_NAME}</p>
          <p className="mt-2 max-w-[32ch] text-sm font-light leading-6 text-ivoire/70">
            Compra discreta por WhatsApp. Eliges, coordinamos Yango o InDrive y pagas al recibir.
          </p>
        </div>
        <div className="text-sm">
          <p className="text-ivoire/50">Entrega</p>
          <p className="mt-2 leading-6">Santa Cruz de la Sierra<br />Costo de envío a coordinar<br />Pago contraentrega en Bs</p>
        </div>
        <div className="text-sm">
          <p className="text-ivoire/50">Tienda</p>
          <div className="mt-2 flex flex-col gap-1">
            <Link href="/catalogo" className="w-fit underline underline-offset-4">Ver todo</Link>
            <Link href="/api-docs" className="w-fit underline underline-offset-4">API v1 para app móvil</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function WhatsAppFloat() {
  return (
    <a
      href={`https://wa.me/${env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${encodeURIComponent("Hola, quiero asesoría de tallas")}`}
      target="_blank"
      className="fixed bottom-5 right-5 z-40 bg-figue px-5 py-3 text-sm text-white"
      aria-label="WhatsApp"
    >
      Asesoría por WhatsApp
    </a>
  );
}
