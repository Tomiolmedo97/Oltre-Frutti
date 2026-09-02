import { useSyncExternalStore } from "react";
import { PRODUCTS, PRODUCT_BY_ID, type Product } from "./products";

let livePrices: Record<string, number> = {};
let snapshot: Product[] = PRODUCTS;
const listeners = new Set<() => void>();

function samePrices(a: Record<string, number>, b: Record<string, number>) {
  const keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) return false;
  return keys.every((key) => a[key] === b[key]);
}

export function applyLivePrices(prices: Record<string, number>) {
  if (samePrices(prices, livePrices)) return;
  livePrices = prices;
  snapshot = PRODUCTS.map((product) => ({
    ...product,
    price: prices[product.id] ?? product.price,
  }));
  listeners.forEach((fn) => fn());
}

export function getLivePrice(id: string) {
  return livePrices[id] ?? PRODUCT_BY_ID[id]?.price ?? 0;
}

export function withLivePrice(product: Product): Product {
  return { ...product, price: getLivePrice(product.id) };
}

export function liveProducts() {
  return snapshot;
}

export function subscribeLivePrices(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function useLiveProducts() {
  return useSyncExternalStore(subscribeLivePrices, liveProducts, liveProducts);
}

export function useLivePrice(id: string) {
  return useSyncExternalStore(
    subscribeLivePrices,
    () => getLivePrice(id),
    () => PRODUCT_BY_ID[id]?.price ?? 0,
  );
}
