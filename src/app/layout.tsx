import type { Metadata } from "next";
import { Fraunces, Jost } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/hooks/useCart";
import { Footer, Header } from "@/components/layout";
import { SocialFloat } from "@/components/SocialFloat";
import { getSiteSettings } from "@/lib/settings";
import { getProductRepository } from "@/repositories/factory";

const display = Fraunces({ subsets: ["latin"], variable: "--font-display", style: ["normal", "italic"], weight: ["400", "500", "600"] });
const body = Jost({ subsets: ["latin"], variable: "--font-body", weight: ["300", "400", "500", "600"] });

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: `${settings.storeName} | Catálogo Santa Cruz`,
    description: "Catálogo virtual de lencería en Santa Cruz de la Sierra. Pedidos por WhatsApp, pago contraentrega.",
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();
  let categories: { slug: string; name: string }[] = [];
  try {
    categories = (await getProductRepository().listCategories()).map((c) => ({ slug: c.slug, name: c.name }));
  } catch {
    categories = [];
  }
  return (
    <html lang="es" data-scroll-behavior="smooth" className={`h-full ${display.variable} ${body.variable}`}>
      <body suppressHydrationWarning className="min-h-full bg-ivoire text-nuit antialiased">
        <CartProvider>
          <Header storeName={settings.storeName} />
          {children}
          <Footer
            storeName={settings.storeName}
            categories={categories}
            socials={{
              instagramUrl: settings.instagramUrl,
              tiktokUrl: settings.tiktokUrl,
              facebookUrl: settings.facebookUrl,
              whatsappNumber: settings.whatsappNumber,
            }}
          />
          <SocialFloat settings={settings} />
        </CartProvider>
      </body>
    </html>
  );
}
