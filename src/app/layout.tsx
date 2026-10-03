import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/hooks/useCart";
import { Footer, Header, WhatsAppFloat } from "@/components/layout";
import { env } from "@/lib/env";

export const metadata: Metadata = {
  title: `${env.NEXT_PUBLIC_STORE_NAME} | Catálogo Santa Cruz`,
  description: "Catálogo virtual de lencería en Santa Cruz de la Sierra. Pedidos por WhatsApp, pago contraentrega.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="h-full">
      <body className="min-h-full bg-zinc-50 text-zinc-900 antialiased">
        <CartProvider>
          <Header />
          {children}
          <Footer />
          <WhatsAppFloat />
        </CartProvider>
      </body>
    </html>
  );
}
