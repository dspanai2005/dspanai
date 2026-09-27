import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { PRODUCT, calculatePrice } from "./product";

export type CartLine = {
  lineId: string;
  productId: string;
  weightGrams: number;
  quantity: number;
};

const STORAGE_KEY = "ds-panai-cart-v1";
const DETAILS_KEY = "ds-panai-details-v1";

export type ShippingDestination = "India" | "International";

export type CustomerDetails = {
  fullName: string;
  mobile: string;
  whatsapp: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  email: string;
  landmark: string;
  instructions: string;
  country: ShippingDestination;
};

export const EMPTY_DETAILS: CustomerDetails = {
  fullName: "",
  mobile: "",
  whatsapp: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  email: "",
  landmark: "",
  instructions: "",
  country: "India",
};

type CartContextValue = {
  lines: CartLine[];
  itemCount: number;
  subtotal: number;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  addLine: (weightGrams: number, quantity?: number) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  updateWeight: (lineId: string, weightGrams: number) => void;
  removeLine: (lineId: string) => void;
  clearCart: () => void;
  details: CustomerDetails;
  setDetails: (details: CustomerDetails) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [details, setDetailsState] = useState<CustomerDetails>(EMPTY_DETAILS);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw) as CartLine[]);
      const rawDetails = localStorage.getItem(DETAILS_KEY);
      if (rawDetails) setDetailsState({ ...EMPTY_DETAILS, ...JSON.parse(rawDetails) });
    } catch {
      /* ignore malformed storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  const setDetails = useCallback((next: CustomerDetails) => {
    setDetailsState(next);
    try {
      localStorage.setItem(DETAILS_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);

  const addLine = useCallback((weightGrams: number, quantity = 1) => {
    setLines((prev) => {
      const existing = prev.find(
        (l) => l.productId === PRODUCT.id && l.weightGrams === weightGrams,
      );
      if (existing) {
        return prev.map((l) =>
          l.lineId === existing.lineId ? { ...l, quantity: l.quantity + quantity } : l,
        );
      }
      return [
        ...prev,
        {
          lineId: `${PRODUCT.id}-${weightGrams}-${Date.now()}`,
          productId: PRODUCT.id,
          weightGrams,
          quantity,
        },
      ];
    });
    setDrawerOpen(true);
  }, []);

  const updateQuantity = useCallback((lineId: string, quantity: number) => {
    setLines((prev) =>
      quantity <= 0
        ? prev.filter((l) => l.lineId !== lineId)
        : prev.map((l) => (l.lineId === lineId ? { ...l, quantity } : l)),
    );
  }, []);

  const updateWeight = useCallback((lineId: string, weightGrams: number) => {
    setLines((prev) => prev.map((l) => (l.lineId === lineId ? { ...l, weightGrams } : l)));
  }, []);

  const removeLine = useCallback((lineId: string) => {
    setLines((prev) => prev.filter((l) => l.lineId !== lineId));
  }, []);

  const clearCart = useCallback(() => setLines([]), []);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = lines.reduce((sum, l) => sum + l.quantity, 0);
    const subtotal = lines.reduce((sum, l) => sum + calculatePrice(l.weightGrams) * l.quantity, 0);
    return {
      lines,
      itemCount,
      subtotal,
      drawerOpen,
      setDrawerOpen,
      addLine,
      updateQuantity,
      updateWeight,
      removeLine,
      clearCart,
      details,
      setDetails,
    };
  }, [
    lines,
    drawerOpen,
    addLine,
    updateQuantity,
    updateWeight,
    removeLine,
    clearCart,
    details,
    setDetails,
  ]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
