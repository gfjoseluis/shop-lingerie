"use client";
import { useState } from "react";

// Comparte la pieza: Web Share API si existe, si no abre WhatsApp con el link.
export function ShareButton({ title, path }: { title: string; path: string }) {
  const [done, setDone] = useState(false);

  async function share() {
    const url = `${window.location.origin}${path}`;
    const text = `${title} — míralo aquí: ${url}`;
    try {
      if (navigator.share) {
        await navigator.share({ title, text, url });
        setDone(true);
        setTimeout(() => setDone(false), 2500);
        return;
      }
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    } catch {
      // Usuario canceló el diálogo: no hacer nada
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      className="border border-nuit/25 px-4 py-2 text-sm touch-manipulation"
      aria-label="Compartir por WhatsApp"
    >
      {done ? "¡Compartido!" : "Compartir"}
    </button>
  );
}
