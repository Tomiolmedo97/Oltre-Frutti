import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { EMPTY_CHECKOUT, type CheckoutDetails } from "./checkout";
import { PRODUCT_BY_ID } from "./products";

type CartState = {
  items: Record<string, number>;
  checkout: CheckoutDetails;
  isOpen: boolean;
  hydrated: boolean;
  add: (id: string) => void;
  dec: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  setCheckout: (patch: Partial<CheckoutDetails>) => void;
  openCart: () => void;
  closeCart: () => void;
  setHydrated: () => void;
};

const memoryStorage: Storage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
  clear: () => undefined,
  key: () => null,
  length: 0,
};

function liveStorage(): Storage {
  if (typeof window === "undefined") return memoryStorage;
  try {
    const key = "__oltre_frutti_storage_test";
    window.localStorage.setItem(key, "1");
    window.localStorage.removeItem(key);
    return window.localStorage;
  } catch {
    return memoryStorage;
  }
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: {},
      checkout: EMPTY_CHECKOUT,
      isOpen: false,
      hydrated: false,
      add: (id) =>
        set((s) => ({
          items: { ...(s.items ?? {}), [id]: (s.items?.[id] ?? 0) + 1 },
        })),
      dec: (id) =>
        set((s) => {
          const next = { ...(s.items ?? {}) };
          const qty = (next[id] ?? 0) - 1;
          if (qty <= 0) delete next[id];
          else next[id] = qty;
          return { items: next };
        }),
      setQty: (id, qty) =>
        set((s) => {
          const next = { ...(s.items ?? {}) };
          if (qty <= 0) delete next[id];
          else next[id] = qty;
          return { items: next };
        }),
      remove: (id) =>
        set((s) => {
          const next = { ...(s.items ?? {}) };
          delete next[id];
          return { items: next };
        }),
      clear: () => set({ items: {} }),
      setCheckout: (patch) =>
        set((s) => ({
          checkout: { ...(s.checkout ?? EMPTY_CHECKOUT), ...patch },
        })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      setHydrated: () => set({ hydrated: true }),
    }),
    {
      name: "oltre-frutti-pedido",
      storage: createJSONStorage(() => liveStorage()),
      skipHydration: true,
      partialize: (s) => ({ items: s.items, checkout: s.checkout }),
      merge: (persisted, current) => {
        const stored = (persisted ?? {}) as {
          items?: Record<string, number>;
          checkout?: Partial<CheckoutDetails>;
        };
        const storedItems =
          stored.items && typeof stored.items === "object" && !Array.isArray(stored.items)
            ? stored.items
            : {};
        const currentItems = current.items ?? {};
        const items: Record<string, number> = { ...storedItems };
        for (const [id, qty] of Object.entries(currentItems)) {
          items[id] = Math.max(Number(items[id] ?? 0), Number(qty ?? 0));
        }
        return {
          ...current,
          items,
          checkout: { ...EMPTY_CHECKOUT, ...stored.checkout },
        };
      },
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.warn("No se pudo recuperar el pedido guardado", error);
        }
        state?.setHydrated();
      },
    },
  ),
);

export function useCartCount() {
  return useCartStore((s) => Object.values(s.items ?? {}).reduce((a, b) => a + b, 0));
}

export function useCartTotal() {
  return useCartStore((s) =>
    Object.entries(s.items ?? {}).reduce((sum, [id, qty]) => {
      const product = PRODUCT_BY_ID[id];
      if (!product) return sum;
      return sum + product.price * qty;
    }, 0),
  );
}

export function getLineItems(items: Record<string, number> | undefined) {
  return Object.entries(items ?? {}).flatMap(([id, qty]) => {
    const product = PRODUCT_BY_ID[id];
    if (!product) return [];
    return [{ product, qty, lineTotal: product.price * qty }];
  });
}
