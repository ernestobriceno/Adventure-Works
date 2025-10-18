import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import type { Product } from "@/data/products";

/** Item del carrito: guardamos el Product completo para mantener tag/category, etc. */
export type CartItem = { product: Product; qty: number };

type CartState = { items: CartItem[] };

type Action =
  | { type: "ADD"; product: Product; qty?: number }
  | { type: "INC"; id: string }
  | { type: "DEC"; id: string }
  | { type: "REMOVE"; id: string }
  | { type: "CLEAR" };

const CartContext = createContext<{
  items: CartItem[];
  add: (product: Product, qty?: number) => void;
  inc: (id: string) => void;
  dec: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  subtotal: number;
  count: number;
} | null>(null);

/** Precio unitario con descuento si el producto está en DEAL (-25%) */
export function getUnitPrice(p: Product): number {
  return p.tag === "deal" ? +(p.price * 0.75).toFixed(2) : p.price;
}

function reducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case "ADD": {
      const qty = action.qty ?? 1;
      const idx = state.items.findIndex((it) => it.product.id === action.product.id);
      if (idx >= 0) {
        const items = [...state.items];
        items[idx] = { ...items[idx], qty: items[idx].qty + qty };
        return { items };
      }
      return { items: [...state.items, { product: action.product, qty }] };
    }
    case "INC": {
      return {
        items: state.items.map((it) =>
          it.product.id === action.id ? { ...it, qty: it.qty + 1 } : it
        ),
      };
    }
    case "DEC": {
      return {
        items: state.items
          .map((it) =>
            it.product.id === action.id ? { ...it, qty: it.qty - 1 } : it
          )
          .filter((it) => it.qty > 0),
      };
    }
    case "REMOVE": {
      return { items: state.items.filter((it) => it.product.id !== action.id) };
    }
    case "CLEAR": {
      return { items: [] };
    }
    default:
      return state;
  }
}

const STORAGE_KEY = "cart.v1";

/** Estado con persistencia en localStorage */
function usePersistedCart(): [CartState, React.Dispatch<Action>] {
  const [state, dispatch] = useReducer(reducer, undefined!, () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as CartState;
    } catch {}
    return { items: [] };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return [state, dispatch];
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = usePersistedCart();

  const subtotal = useMemo(
    () =>
      state.items.reduce(
        (acc, it) => acc + getUnitPrice(it.product) * it.qty,
        0
      ),
    [state.items]
  );

  const count = useMemo(
    () => state.items.reduce((acc, it) => acc + it.qty, 0),
    [state.items]
  );

  const value = useMemo(
    () => ({
      items: state.items,
      add: (product: Product, qty?: number) => dispatch({ type: "ADD", product, qty }),
      inc: (id: string) => dispatch({ type: "INC", id }),
      dec: (id: string) => dispatch({ type: "DEC", id }),
      remove: (id: string) => dispatch({ type: "REMOVE", id }),
      clear: () => dispatch({ type: "CLEAR" }),
      subtotal,
      count,
    }),
    [state.items, subtotal, count]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
