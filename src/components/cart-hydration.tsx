import { useLayoutEffect } from "react";
import { useCartStore } from "@/lib/cart-store";

declare global {
  interface Window {
    __oltreBoot?: boolean;
    __OLTRE_READY?: boolean;
    __OLTRE_CART_OPEN?: boolean;
  }
}

export function CartHydration() {
  useLayoutEffect(() => {
    void useCartStore.persist.rehydrate();
    const shouldOpen = window.__OLTRE_CART_OPEN === true;
    window.__OLTRE_READY = true;
    document.getElementById("oltre-fast-cart")?.remove();
    document.getElementById("oltre-fast-badge")?.remove();
    document.getElementById("oltre-fast-toast")?.remove();
    document.body.style.overflow = "";
    if (shouldOpen) useCartStore.getState().openCart();
  }, []);
  return null;
}
