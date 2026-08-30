import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { EMPTY_CHECKOUT, type CheckoutDetails } from "./checkout";
import { PRODUCT_BY_ID } from "./products";
import { defaultAddQty, lineTotal, normalizeQty, stepFor } from "./quantity";

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
        set((s) => {
          const product = PRODUCT_BY_ID[id];
          if (!product) return s;
          const current = s.items?.[id] ?? 0;
          const nextQty =
            current <= 0
              ? defaultAddQty(product.unit)
              : normalizeQty(current + stepFor(product.unit), product.unit);
          const items = { ...(s.items ?? {}) };
          if (nextQty <= 0) delete items[id];
          else items[id] = nextQty;
          return { items };
        }),
      dec: (id) =>
        set((s) => {
          const product = PRODUCT_BY_ID[id];
          if (!product) return s;
          const items = { ...(s.items ?? {}) };
          const nextQty = normalizeQty(
            (items[id] ?? 0) - stepFor(product.unit),
            product.unit,
          );
          if (nextQty <= 0) delete items[id];
          else items[id] = nextQty;
          return { items };
        }),
      setQty: (id, qty) =>
        set((s) => {
          const product = PRODUCT_BY_ID[id];
          if (!product) return s;
          const items = { ...(s.items ?? {}) };
          const nextQty = normalizeQty(qty, product.unit);
          if (nextQty <= 0) delete items[id];
          else items[id] = nextQty;
          return { items };
        }),
      remove: (id) =>
        set((s) => {
          const items = { ...(s.items ?? {}) };
          delete items[id];
          return { items };
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
  return useCartStore(
    (s) => Object.values(s.items ?? {}).filter((qty) => qty > 0).length,
  );
}

export function useCartTotal() {
  return useCartStore((s) =>
    Object.entries(s.items ?? {}).reduce((sum, [id, qty]) => {
      const product = PRODUCT_BY_ID[id];
      if (!product) return sum;
      return sum + lineTotal(product.price, qty);
    }, 0),
  );
}

export function getLineItems(items: Record<string, number> | undefined) {
  return Object.entries(items ?? {}).flatMap(([id, qty]) => {
    const product = PRODUCT_BY_ID[id];
    if (!product) return [];
    return [{ product, qty, lineTotal: lineTotal(product.price, qty) }];
  });
}
