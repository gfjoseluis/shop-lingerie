"use client";
import { useTransition } from "react";
import { toggleProductAction } from "@/app/admin/(panel)/actions";

export function ToggleActive({ id, active }: { id: string; active: boolean }) {
  const [pending, start] = useTransition();
  return (
    <button
      disabled={pending}
      onClick={() => start(async () => { await toggleProductAction(id, !active); })}
      className={`border px-3 py-1.5 text-xs ${active ? "border-nuit/25" : "border-figue text-figue"}`}
    >
      {active ? "Ocultar" : "Publicar"}
    </button>
  );
}
