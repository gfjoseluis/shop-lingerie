// Crea el usuario admin (Auth email/password). Uso:
//   ADMIN_EMAIL=tu@correo.com ADMIN_PASSWORD=clave node --env-file=.env.local scripts/create-admin.mjs
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secret = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;
if (!url || !secret || !email || !password || password === "cambia-esto") {
  console.error("Configura ADMIN_EMAIL y ADMIN_PASSWORD (distinta de cambia-esto) en .env.local");
  process.exit(1);
}
const db = createClient(url, secret, { auth: { persistSession: false, autoRefreshToken: false } });
const { data, error } = await db.auth.admin.createUser({ email, password, email_confirm: true });
if (error) {
  console.error("Error:", error.message);
  process.exit(1);
}
console.log(`Admin creado: ${data.user.email}`);
