"use client";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export interface CartLine {
  variantId: string;
  productSlug: string;
  productName: string;
  imageUrl: string;
  size: string;
  color: string;
  unitPrice: number;
  quantity: number;
}

interface CartCtx {
  lines: CartLine[];
  count: number;
  subtotal: number;
  add: (line: CartLine) => void;
  remove: (variantId: string) => void;
  setQty: (variantId: string, qty: number) => void;
  clear: () => void;
}

const Ctx = createContext<CartCtx | null>(null);
const KEY = "sc-lenceria-cart-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {}
  }, [lines]);

  const value = useMemo<CartCtx>(() => {
    const subtotal = lines.reduce((a, l) => a + l.unitPrice * l.quantity, 0);
    return {
      lines,
      count: lines.reduce((a, l) => a + l.quantity, 0),
      subtotal,
      add: (line) =>
        setLines((prev) => {
          const ex = prev.find((p) => p.variantId === line.variantId);
          if (ex) return prev.map((p) => (p.variantId === line.variantId ? { ...p, quantity: Math.min(20, p.quantity + line.quantity) } : p));
          return [...prev, line];
        }),
      remove: (variantId) => setLines((prev) => prev.filter((p) => p.variantId !== variantId)),
      setQty: (variantId, qty) =>
        setLines((prev) => prev.map((p) => (p.variantId === variantId ? { ...p, quantity: Math.max(1, Math.min(20, qty)) } : p))),
      clear: () => setLines([]),
    };
  }, [lines]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart(): CartCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart fuera de CartProvider");
  return ctx;
}
