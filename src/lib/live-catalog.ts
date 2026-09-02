import { useSyncExternalStore } from "react";
import { PRODUCTS, PRODUCT_BY_ID, type Product } from "./products";

let livePrices: Record<string, number> = {};
const listeners = new Set<() => void>();

export function applyLivePrices(prices: Record<string, number>) {
  livePrices = prices;
  listeners.forEach((fn) => fn());
}

export function getLivePrice(id: string) {
  return livePrices[id] ?? PRODUCT_BY_ID[id]?.price ?? 0;
}

export function withLivePrice(product: Product): Product {
  return { ...product, price: getLivePrice(product.id) };
}

export function liveProducts() {
  return PRODUCTS.map(withLivePrice);
}

export function subscribeLivePrices(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function useLiveProducts() {
  return useSyncExternalStore(subscribeLivePrices, liveProducts, () => PRODUCTS);
}

export function useLivePrice(id: string) {
  return useSyncExternalStore(
    subscribeLivePrices,
    () => getLivePrice(id),
    () => PRODUCT_BY_ID[id]?.price ?? 0,
  );
}
