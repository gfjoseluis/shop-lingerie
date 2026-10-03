"use client";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { env } from "@/lib/env";

export function Header() {
  const { count } = useCart();
  const [q, setQ] = useState("");
  return (
    <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        <Link href="/" className="font-bold text-lg tracking-tight">
          {env.NEXT_PUBLIC_STORE_NAME}
        </Link>
        <form action="/catalogo" className="hidden flex-1 sm:block">
          <input
            name="q"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar conjuntos, bodys, color..."
            className="w-full rounded-full border px-4 py-2 text-sm outline-none focus:ring-2"
          />
        </form>
        <nav className="ml-auto flex items-center gap-3 text-sm">
          <Link href="/catalogo" className="hover:underline">
            Catálogo
          </Link>
          <Link href="/carrito" className="rounded-full border px-3 py-1.5">
            Carrito ({count})
          </Link>
        </nav>
      </div>
      <form action="/catalogo" className="px-4 pb-3 sm:hidden">
        <input
          name="q"
          placeholder="Buscar..."
          className="w-full rounded-full border px-4 py-2 text-sm"
        />
      </form>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-16 border-t bg-zinc-50">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-zinc-600">
        <p className="font-semibold text-zinc-900">{env.NEXT_PUBLIC_STORE_NAME} — Santa Cruz de la Sierra, Bolivia</p>
        <p className="mt-1">Pago contraentrega. Envíos con Yango / InDrive (costo a coordinar por WhatsApp).</p>
        <p className="mt-2">
          <Link href="/api-docs" className="underline">
            API v1 docs
          </Link>
        </p>
      </div>
    </footer>
  );
}

export function WhatsAppFloat() {
  return (
    <a
      href={`https://wa.me/${env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${encodeURIComponent("Hola, quiero info de lencería")}`}
      target="_blank"
      className="fixed bottom-5 right-5 z-40 rounded-full bg-green-600 px-5 py-3 text-white shadow-lg"
      aria-label="WhatsApp"
    >
      WhatsApp
    </a>
  );
}
