import type { Metadata } from "next";
import { Baloo_2, Quicksand } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { CartProvider } from "@/hooks/useCart";
import { Footer, Header } from "@/components/layout";
import { SocialFloat } from "@/components/SocialFloat";
import { getSiteSettings } from "@/lib/settings";
import { getProductRepository } from "@/repositories/factory";

const display = Baloo_2({ subsets: ["latin"], variable: "--font-display", weight: ["500", "600", "700"] });
const body = Quicksand({ subsets: ["latin"], variable: "--font-body", weight: ["300", "400", "500", "600", "700"] });

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: `${settings.storeName} | Catálogo Santa Cruz`,
    description: "Catálogo virtual de lencería en Santa Cruz de la Sierra. Pedidos por WhatsApp, pago contraentrega.",
    icons: { icon: "/ico.webp", apple: "/ico.webp" },
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
        <Analytics />
      </body>
    </html>
  );
}
