import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional().or(z.literal("")),
  // Supabase nuevo (2025+): publishable key. Legacy: anon key. Aceptamos ambos.
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().optional().or(z.literal("")),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional().or(z.literal("")),
  // Solo servidor. Nuevo: secret key. Legacy: service_role. Nunca usar en cliente.
  SUPABASE_SECRET_KEY: z.string().optional().or(z.literal("")),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional().or(z.literal("")),
  NEXT_PUBLIC_WHATSAPP_NUMBER: z.string().default("59170000000"),
  NEXT_PUBLIC_STORE_NAME: z.string().default("Santa Cruz Lencería"),
  NEXT_PUBLIC_CURRENCY: z.string().default("Bs"),
  NEXT_PUBLIC_INSTAGRAM_URL: z.string().url().optional().or(z.literal("")),
  NEXT_PUBLIC_TIKTOK_URL: z.string().url().optional().or(z.literal("")),
  NEXT_PUBLIC_FACEBOOK_URL: z.string().url().optional().or(z.literal("")),
});

const raw = envSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY ?? "",
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  NEXT_PUBLIC_WHATSAPP_NUMBER: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "59170000000",
  NEXT_PUBLIC_STORE_NAME: process.env.NEXT_PUBLIC_STORE_NAME ?? "Santa Cruz Lencería",
  NEXT_PUBLIC_CURRENCY: process.env.NEXT_PUBLIC_CURRENCY ?? "Bs",
  NEXT_PUBLIC_INSTAGRAM_URL: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "",
  NEXT_PUBLIC_TIKTOK_URL: process.env.NEXT_PUBLIC_TIKTOK_URL ?? "",
  NEXT_PUBLIC_FACEBOOK_URL: process.env.NEXT_PUBLIC_FACEBOOK_URL ?? "",
});

// Key pública efectiva: prefiere la nueva publishable, fallback a anon legacy.
const supabasePublishableKey =
  raw.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || raw.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Key secreta efectiva solo-servidor: prefiere secret nueva, fallback service_role.
const supabaseSecretKey = raw.SUPABASE_SECRET_KEY || raw.SUPABASE_SERVICE_ROLE_KEY || "";

export const env = {
  ...raw,
  supabasePublishableKey,
  supabaseSecretKey,
};

export function hasSupabase(): boolean {
  return Boolean(env.NEXT_PUBLIC_SUPABASE_URL && env.supabasePublishableKey);
}
