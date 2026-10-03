import type { Metadata } from "next";
import { Fraunces, Jost } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/hooks/useCart";
import { Footer, Header, WhatsAppFloat } from "@/components/layout";
import { env } from "@/lib/env";

const display = Fraunces({ subsets: ["latin"], variable: "--font-display", style: ["normal", "italic"], weight: ["400", "500", "600"] });
const body = Jost({ subsets: ["latin"], variable: "--font-body", weight: ["300", "400", "500", "600"] });

export const metadata: Metadata = {
  title: `${env.NEXT_PUBLIC_STORE_NAME} | Catálogo Santa Cruz`,
  description: "Catálogo virtual de lencería en Santa Cruz de la Sierra. Pedidos por WhatsApp, pago contraentrega.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`h-full ${display.variable} ${body.variable}`}>
      <body className="min-h-full bg-ivoire text-nuit antialiased">
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
