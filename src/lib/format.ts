import { env } from "./env";

export function formatPrice(value: number): string {
  return `${env.NEXT_PUBLIC_CURRENCY} ${value.toFixed(2)}`;
}

export function effectivePrice(basePrice: number, salePrice?: number | null): number {
  return salePrice && salePrice > 0 ? salePrice : basePrice;
}
