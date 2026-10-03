"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo entrar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-sm px-4 py-16">
      <h1 className="font-display text-3xl">Entrar al panel</h1>
      <p className="mt-1 text-sm font-light text-nuit/60">Solo la dueña de la tienda.</p>
      <form onSubmit={submit} className="mt-5 space-y-3 border border-figue/15 bg-white p-5">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Correo admin"
          className="w-full border border-nuit/20 px-3 py-2.5 text-sm outline-none focus:border-figue"
        />
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          className="w-full border border-nuit/20 px-3 py-2.5 text-sm outline-none focus:border-figue"
        />
        {error ? <p className="text-sm text-figue">{error}</p> : null}
        <button disabled={loading} className="w-full bg-figue py-3 text-white disabled:opacity-50">
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </main>
  );
}
