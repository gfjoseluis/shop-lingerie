import { unstable_cache } from "next/cache";
import { env } from "./env";

export interface SiteSettings {
  storeName: string;
  whatsappNumber: string;
  currency: string;
  instagramUrl: string;
  tiktokUrl: string;
  facebookUrl: string;
}

function fromEnv(): SiteSettings {
  return {
    storeName: env.NEXT_PUBLIC_STORE_NAME,
    whatsappNumber: env.NEXT_PUBLIC_WHATSAPP_NUMBER,
    currency: env.NEXT_PUBLIC_CURRENCY,
    instagramUrl: env.NEXT_PUBLIC_INSTAGRAM_URL ?? "",
    tiktokUrl: env.NEXT_PUBLIC_TIKTOK_URL ?? "",
    facebookUrl: env.NEXT_PUBLIC_FACEBOOK_URL ?? "",
  };
}

// Lee DB (cache 60s) con fallback a env si la tabla aún no existe.
async function readSettings(): Promise<SiteSettings> {
  const fallback = fromEnv();
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.supabasePublishableKey) return fallback;
  try {
    const { createClient } = await import("@supabase/supabase-js");
    const db = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.supabasePublishableKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data, error } = await db.from("site_settings").select("key,value");
    if (error || !data) return fallback;
    const map = Object.fromEntries((data as { key: string; value: string }[]).map((r) => [r.key, r.value]));
    return {
      storeName: map.store_name || fallback.storeName,
      whatsappNumber: map.whatsapp_number || fallback.whatsappNumber,
      currency: map.currency || fallback.currency,
      instagramUrl: map.instagram_url ?? fallback.instagramUrl,
      tiktokUrl: map.tiktok_url ?? fallback.tiktokUrl,
      facebookUrl: map.facebook_url ?? fallback.facebookUrl,
    };
  } catch {
    return fallback;
  }
}

export const getSiteSettings = unstable_cache(readSettings, ["site-settings"], { revalidate: 60 });
