import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import type { Product, CartItem } from "../types";

// ── Constants ──

const STORAGE_KEY = "ata-cart";

// ── State & Actions ──

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: "ADD_ITEM"; product: Product; quantity?: number }
  | { type: "REMOVE_ITEM"; productId: string }
  | { type: "UPDATE_QUANTITY"; productId: string; quantity: number }
  | { type: "CLEAR_CART" };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find(
        (i) => i.product.id === action.product.id
      );
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.product.id === action.product.id
              ? { ...i, quantity: i.quantity + (action.quantity || 1) }
              : i
          ),
        };
      }
      return {
        items: [
          ...state.items,
          { product: action.product, quantity: action.quantity || 1 },
        ],
      };
    }
    case "REMOVE_ITEM":
      return {
        items: state.items.filter((i) => i.product.id !== action.productId),
      };
    case "UPDATE_QUANTITY":
      if (action.quantity <= 0) {
        return {
          items: state.items.filter((i) => i.product.id !== action.productId),
        };
      }
      return {
        items: state.items.map((i) =>
          i.product.id === action.productId
            ? { ...i, quantity: action.quantity }
            : i
        ),
      };
    case "CLEAR_CART":
      return { items: [] };
    default:
      return state;
  }
}

// ── localStorage helpers ──

function loadCartFromStorage(): CartState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { items: [] };
    const parsed = JSON.parse(raw);
    // Validate structure: must be an array of {product, quantity}
    if (
      !Array.isArray(parsed) ||
      !parsed.every(
        (item: unknown) =>
          typeof item === "object" &&
          item !== null &&
          "product" in item &&
          "quantity" in item
      )
    ) {
      localStorage.removeItem(STORAGE_KEY);
      return { items: [] };
    }
    return { items: parsed as CartItem[] };
  } catch {
    // Corrupted JSON → wipe and start fresh
    localStorage.removeItem(STORAGE_KEY);
    return { items: [] };
  }
}

function saveCartToStorage(items: CartItem[]) {
  try {
    if (items.length === 0) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  } catch {
    // Storage full or unavailable — fail silently
  }
}

// ── Context ──

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, loadCartFromStorage);

  // Sync to localStorage on every state change
  useEffect(() => {
    saveCartToStorage(state.items);
  }, [state.items]);

  const addItem = useCallback(
    (product: Product, quantity?: number) =>
      dispatch({ type: "ADD_ITEM", product, quantity }),
    []
  );

  const removeItem = useCallback(
    (productId: string) => dispatch({ type: "REMOVE_ITEM", productId }),
    []
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number) =>
      dispatch({ type: "UPDATE_QUANTITY", productId, quantity }),
    []
  );

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" });
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const totalItems = useMemo(
    () => state.items.reduce((sum, i) => sum + i.quantity, 0),
    [state.items]
  );

  const subtotal = useMemo(
    () => state.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
    [state.items]
  );

  const value = useMemo<CartContextType>(
    () => ({
      items: state.items,
      totalItems,
      subtotal,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    }),
    [state.items, totalItems, subtotal, addItem, removeItem, updateQuantity, clearCart]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
