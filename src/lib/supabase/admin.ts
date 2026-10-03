import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env } from "../env";

let cached: SupabaseClient | null = null;

// Cliente privilegiado SOLO-servidor (bypassa RLS). Nunca importarlo en Client Components.
export function getServiceClient(): SupabaseClient {
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.supabaseSecretKey) {
    throw new Error("Falta SUPABASE_SECRET_KEY (o SUPABASE_SERVICE_ROLE_KEY) en el servidor. Revisa .env.local");
  }
  if (!cached) {
    cached = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.supabaseSecretKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return cached;
}
