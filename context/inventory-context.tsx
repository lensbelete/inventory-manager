import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

import { createId, isoNow } from '@/lib/id';
import type { Product, Transaction, User } from '@/types/inventory';

type OkResult = { ok: true };
type ErrResult = { ok: false; error: string };
export type ActionResult = OkResult | ErrResult;

function delay(ms = 220) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

type InventoryContextValue = {
  users: User[];
  products: Product[];
  transactions: Transaction[];
  pending: boolean;
  registerUser: (email: string, fullName: string) => Promise<ActionResult>;
  registerProduct: (sku: string, name: string, price: number, quantity: number) => Promise<ActionResult>;
  adjustStock: (sku: string, delta: number) => Promise<ActionResult>;
};

const InventoryContext = createContext<InventoryContextValue | null>(null);

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pending, setPending] = useState(false);

  const registerUser = useCallback(async (email: string, fullName: string): Promise<ActionResult> => {
    setPending(true);
    try {
      await delay();
      const e = email.trim().toLowerCase();
      const name = fullName.trim();
      if (!e) return { ok: false, error: 'Email is required.' };
      if (!validateEmail(e)) return { ok: false, error: 'Enter a valid email address.' };
      if (!name) return { ok: false, error: 'Full name is required.' };
      let added: User | null = null;
      setUsers((prev) => {
        if (prev.some((u) => u.email.toLowerCase() === e)) return prev;
        added = { id: createId(), email: e, fullName: name, createdAt: isoNow() };
        return [...prev, added];
      });
      if (!added) return { ok: false, error: 'A user with this email already exists.' };
      return { ok: true };
    } finally {
      setPending(false);
    }
  }, []);

  const registerProduct = useCallback(async (sku: string, name: string, price: number, quantity: number): Promise<ActionResult> => {
    setPending(true);
    try {
      await delay();
      const s = sku.trim().toUpperCase();
      const n = name.trim();
      if (!s) return { ok: false, error: 'SKU is required.' };
      if (!n) return { ok: false, error: 'Product name is required.' };
      if (!Number.isFinite(price) || price < 0) return { ok: false, error: 'Price must be a non-negative number.' };
      if (!Number.isInteger(quantity) || quantity < 0) {
        return { ok: false, error: 'Quantity must be a non-negative whole number.' };
      }
      const newProduct: Product = {
        id: createId(),
        sku: s,
        name: n,
        price,
        quantity,
        updatedAt: isoNow(),
      };
      let inserted = false;
      setProducts((prev) => {
        if (prev.some((p) => p.sku.toUpperCase() === s)) return prev;
        inserted = true;
        return [...prev, newProduct];
      });
      if (!inserted) return { ok: false, error: 'A product with this SKU already exists.' };
      setTransactions((prev) => [
        {
          id: createId(),
          type: 'PRODUCT_CREATED',
          sku: newProduct.sku,
          productName: newProduct.name,
          delta: quantity,
          quantityAfter: quantity,
          createdAt: isoNow(),
        },
        ...prev,
      ]);
      return { ok: true };
    } finally {
      setPending(false);
    }
  }, []);

  const adjustStock = useCallback(async (sku: string, rawDelta: number): Promise<ActionResult> => {
    setPending(true);
    try {
      await delay();
      const d = Math.trunc(rawDelta);
      const key = sku.trim().toUpperCase();
      if (!key) return { ok: false, error: 'Select a product.' };
      if (d === 0) return { ok: false, error: 'Enter a non-zero whole number for the adjustment.' };
      let err: string | null = null;
      let tx: Transaction | null = null;
      setProducts((prev) => {
        const i = prev.findIndex((p) => p.sku.toUpperCase() === key);
        if (i < 0) {
          err = 'Product not found.';
          return prev;
        }
        const p = prev[i]!;
        const nextQty = p.quantity + d;
        if (nextQty < 0) {
          err = 'Stock cannot go negative.';
          return prev;
        }
        const updated: Product = { ...p, quantity: nextQty, updatedAt: isoNow() };
        const next = [...prev];
        next[i] = updated;
        tx = {
          id: createId(),
          type: d > 0 ? 'STOCK_ADDED' : 'STOCK_REMOVED',
          sku: p.sku,
          productName: p.name,
          delta: d,
          quantityAfter: nextQty,
          createdAt: isoNow(),
        };
        return next;
      });
      if (err) return { ok: false, error: err };
      if (!tx) return { ok: false, error: 'Could not update stock.' };
      setTransactions((prev) => [tx!, ...prev]);
      return { ok: true };
    } finally {
      setPending(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      users,
      products,
      transactions,
      pending,
      registerUser,
      registerProduct,
      adjustStock,
    }),
    [users, products, transactions, pending, registerUser, registerProduct, adjustStock],
  );

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>;
}

export function useInventory(): InventoryContextValue {
  const ctx = useContext(InventoryContext);
  if (!ctx) throw new Error('useInventory must be used within InventoryProvider');
  return ctx;
}
