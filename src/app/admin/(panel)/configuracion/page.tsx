import { getSiteSettings } from "@/lib/settings";
import { SettingsForm } from "@/components/admin/SettingsForm";

export default async function ConfiguracionPage() {
  const settings = await getSiteSettings();
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-display mb-1 text-3xl">Configuración</h1>
      <p className="mb-5 text-sm font-light text-nuit/60">
        Nombre, WhatsApp y redes de la tienda. Sin redeploy: se aplica al guardar.
      </p>
      <SettingsForm initial={settings} />
    </main>
  );
}
