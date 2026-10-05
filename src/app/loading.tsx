// Esqueleto elegante para transiciones de ruta (nunca bloquea contenido).
export default function Loading() {
  return (
    <main className="mx-auto max-w-6xl animate-pulse px-4 pt-10 sm:pt-16" aria-hidden>
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <div className="h-4 w-40 bg-nuit/10" />
          <div className="h-14 w-3/4 bg-nuit/10" />
          <div className="h-14 w-2/3 bg-nuit/10" />
          <div className="h-5 w-1/2 bg-nuit/10" />
          <div className="h-11 w-52 bg-nuit/10" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="arch aspect-3/4 bg-nuit/10" />
          <div className="pt-10">
            <div className="aspect-square bg-nuit/10" />
          </div>
        </div>
      </div>
    </main>
  );
}
