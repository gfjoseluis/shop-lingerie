"use client";
import { useState, useTransition } from "react";
import { updateVariantStockAction } from "@/app/admin/(panel)/actions";

export function VariantStockRow({ variantId, stock }: { variantId: string; stock: number }) {
  const [value, setValue] = useState(String(stock));
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState("");

  return (
    <span className="inline-flex items-center gap-1">
      <input
        type="number"
        min={0}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-16 border border-nuit/20 px-1 py-0.5 text-xs"
      />
      <button
        disabled={pending}
        onClick={() =>
          start(async () => {
            const res = await updateVariantStockAction(variantId, Number(value));
            setMsg(res.ok ? "✓" : `Error: ${res.error}`);
          })
        }
        className="text-xs underline"
      >
        Guardar
      </button>
      {msg ? <span className="text-[11px] text-nuit/60">{msg}</span> : null}
    </span>
  );
}
