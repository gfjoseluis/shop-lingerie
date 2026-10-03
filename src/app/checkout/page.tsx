import { CheckoutForm } from "@/components/CheckoutForm";
import { getSiteSettings } from "@/lib/settings";

export default async function CheckoutPage() {
  const settings = await getSiteSettings();
  return <CheckoutForm settings={settings} />;
}
