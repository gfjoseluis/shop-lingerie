import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Permite probar desde el celular en la misma WiFi (ej. http://192.168.0.9:3000).
  // Si tu IP cambia (ipconfig), agrega la nueva aquí y reinicia `npm run dev`.
  allowedDevOrigins: ["192.168.0.9"],
  images: {
    // Optimización + caché (Vercel) para fotos de Supabase y placeholders
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },
};

export default nextConfig;
