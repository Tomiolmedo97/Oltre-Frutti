import { ShoppingBag } from "lucide-react";
import { useCartCount, useCartStore, useCartTotal } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";
import { useIsClient } from "@/lib/use-is-client";

export function CartBar() {
  const count = useCartCount();
  const total = useCartTotal();
  const openCart = useCartStore((s) => s.openCart);
  const isOpen = useCartStore((s) => s.isOpen);
  const isClient = useIsClient();

  if (!isClient || count === 0 || isOpen) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden">
      <button
        type="button"
        data-open-cart=""
        onClick={openCart}
        className="pointer-events-auto flex h-14 w-full items-center justify-between rounded-full bg-leaf px-5 text-cream shadow-[var(--shadow-card-hover)]"
      >
        <span className="inline-flex items-center gap-2 font-medium">
          <ShoppingBag className="size-4" />
          Ver pedido · {count}
        </span>
        <span className="font-display text-lg font-semibold tabular-nums">
          {formatPrice(total)}
        </span>
      </button>
    </div>
  );
}
