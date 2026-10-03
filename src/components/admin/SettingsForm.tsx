"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { SiteSettings } from "@/lib/settings";
import { saveSettingsAction } from "@/app/admin/(panel)/actions";

const FIELDS: { key: keyof SiteSettings; label: string; placeholder: string; help: string; type?: string }[] = [
  { key: "storeName", label: "Nombre de la tienda", placeholder: "Ej. Lencería Linita", help: "Aparece en el encabezado, pie y mensajes de WhatsApp." },
  { key: "whatsappNumber", label: "WhatsApp de pedidos", placeholder: "Ej. 59170000000", help: "Solo dígitos con código país, sin + ni espacios. Recibe los pedidos.", type: "tel" },
  { key: "instagramUrl", label: "Instagram", placeholder: "https://instagram.com/tu-tienda (vacío = ocultar)", help: "Vacío oculta la burbuja." },
  { key: "tiktokUrl", label: "TikTok", placeholder: "https://tiktok.com/@tu-tienda (vacío = ocultar)", help: "Vacío oculta la burbuja." },
  { key: "facebookUrl", label: "Facebook", placeholder: "https://facebook.com/tu-tienda (vacío = ocultar)", help: "Vacío oculta la burbuja." },
];

const TO_DB: Record<keyof SiteSettings, string> = {
  storeName: "store_name",
  whatsappNumber: "whatsapp_number",
  currency: "currency",
  instagramUrl: "instagram_url",
  tiktokUrl: "tiktok_url",
  facebookUrl: "facebook_url",
};

export function SettingsForm({ initial }: { initial: SiteSettings }) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string>>({
    store_name: initial.storeName,
    whatsapp_number: initial.whatsappNumber,
    instagram_url: initial.instagramUrl,
    tiktok_url: initial.tiktokUrl,
    facebook_url: initial.facebookUrl,
  });
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [pending, start] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaved(false);
    start(async () => {
      const res = await saveSettingsAction(values);
      if (!res.ok) setError(res.error);
      else {
        setSaved(true);
        router.refresh();
      }
    });
  }

  return (
    <form onSubmit={submit} className="max-w-xl space-y-4 border border-figue/15 bg-white p-5">
      {FIELDS.map((f) => {
        const dbKey = TO_DB[f.key];
        const id = `cfg-${dbKey}`;
        return (
          <div key={dbKey}>
            <label htmlFor={id} className="text-sm text-nuit/70">{f.label}</label>
            <input
              id={id}
              type={f.type ?? "text"}
              value={values[dbKey] ?? ""}
              onChange={(e) => setValues((p) => ({ ...p, [dbKey]: e.target.value }))}
              placeholder={f.placeholder}
              required={dbKey === "store_name" || dbKey === "whatsapp_number"}
              className="mt-1 w-full border border-nuit/20 px-3 py-2.5 text-sm outline-none focus:border-figue"
            />
            <p className="mt-1 text-xs font-light text-nuit/55">{f.help}</p>
          </div>
        );
      })}
      <p className="text-xs font-light text-nuit/55">La moneda ({initial.currency}) se cambia en variables de entorno.</p>
      {error ? <p className="text-sm text-figue">{error}</p> : null}
      {saved ? <p className="text-sm text-green-700">Guardado. La tienda ya muestra los cambios.</p> : null}
      <button disabled={pending} className="bg-figue px-6 py-2.5 text-sm text-white disabled:opacity-50">
        Guardar configuración
      </button>
    </form>
  );
}
