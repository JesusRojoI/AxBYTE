'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from 'react';
import { calcVAT, calcTotal } from '@/lib/utils';

export interface CartItem {
  id: string;
  slug: string;
  nameKey: string;
  image: string;
  price: number;
  quantity: number;
  custom?: boolean;
  quoteId?: string;
}

// 👇 Tipo base para agregar: excluye id Y quantity (quantity va como 2do argumento)
type AddItemPayload = Omit<CartItem, 'id' | 'quantity'>;

interface CartContextType {
  items: CartItem[];
  addItem: (item: AddItemPayload, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  undoRemove: () => void;
  lastRemoved: { item: CartItem; index: number } | null;
  totalItems: number;
  subtotal: number;
  vat: number;
  total: number;
  isHydrated: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'axbyte_cart_v1';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [lastRemoved, setLastRemoved] = useState<{ item: CartItem; index: number } | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch (e) {
      console.error('Error loading cart', e);
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Error saving cart', e);
    }
  }, [items, isHydrated]);

  // 👇 AQUÍ usamos AddItemPayload (NO Omit<CartItem, 'id'>)
  const addItem = useCallback(
    (item: AddItemPayload, quantity = 1) => {
      setItems((prev) => {
        if (item.custom) {
          return [
            ...prev,
            { ...item, id: `custom_${Date.now()}_${Math.random()}`, quantity },
          ];
        }
        const existingIdx = prev.findIndex((p) => p.slug === item.slug && !p.custom);
        if (existingIdx >= 0) {
          const copy = [...prev];
          copy[existingIdx] = {
            ...copy[existingIdx],
            quantity: copy[existingIdx].quantity + quantity,
          };
          return copy;
        }
        return [
          ...prev,
          { ...item, id: `item_${Date.now()}_${Math.random()}`, quantity },
        ];
      });
    },
    []
  );

  const removeItem = useCallback((id: string) => {
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.id === id);
      if (idx < 0) return prev;
      setLastRemoved({ item: prev[idx], index: idx });
      return prev.filter((p) => p.id !== id);
    });
  }, []);

  const undoRemove = useCallback(() => {
    if (!lastRemoved) return;
    setItems((prev) => {
      const copy = [...prev];
      copy.splice(lastRemoved.index, 0, lastRemoved.item);
      return copy;
    });
    setLastRemoved(null);
  }, [lastRemoved]);

  const updateQuantity = useCallback((id: string, qty: number) => {
    if (qty < 1) return;
    setItems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantity: qty } : p))
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = Number(
    items.reduce((s, i) => s + i.price * i.quantity, 0).toFixed(2)
  );
  const vat = calcVAT(subtotal);
  const total = calcTotal(subtotal);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        undoRemove,
        lastRemoved,
        totalItems,
        subtotal,
        vat,
        total,
        isHydrated,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}