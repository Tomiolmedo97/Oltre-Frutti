import { ShoppingBag } from "lucide-react";
import { Logo } from "@/components/logo";
import { useCartCount, useCartStore } from "@/lib/cart-store";
import { useIsClient } from "@/lib/use-is-client";

export function SiteHeader() {
  const liveCount = useCartCount();
  const isClient = useIsClient();
  const count = isClient ? liveCount : 0;
  const openCart = useCartStore((s) => s.openCart);

  return (
    <header className="sticky top-0 z-40 overflow-hidden border-b border-ink/8 bg-sun/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:h-[4.25rem] sm:px-6">
        <a
          href="#inicio"
          className="relative flex h-12 max-w-28 shrink-0 items-center overflow-hidden"
          aria-label="Oltre Frutti, inicio"
        >
          <Logo alt="" />
        </a>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Principal">
          <a
            href="#catalogo"
            className="rounded-full px-3.5 py-2 text-sm font-medium text-ink/80 transition-colors hover:bg-leaf/10 hover:text-ink"
          >
            Catálogo
          </a>
          <a
            href="#como"
            className="rounded-full px-3.5 py-2 text-sm font-medium text-ink/80 transition-colors hover:bg-leaf/10 hover:text-ink"
          >
            Cómo funciona
          </a>
          <button
            type="button"
            data-open-cart=""
            onClick={openCart}
            className="rounded-full px-3.5 py-2 text-sm font-medium text-ink/80 transition-colors hover:bg-leaf/10 hover:text-ink"
          >
            Pedido
          </button>
        </nav>

        <button
          type="button"
          data-open-cart=""
          onClick={openCart}
          className="relative inline-flex h-11 items-center gap-2 rounded-full bg-leaf px-3.5 text-sm font-medium text-cream transition-colors hover:bg-leaf-deep"
          aria-label={
            count > 0 ? `Abrir pedido, ${count} productos` : "Abrir pedido"
          }
        >
          <ShoppingBag className="size-4" strokeWidth={2.2} />
          <span className="hidden sm:inline">Pedido</span>
          {count > 0 ? (
            <span className="grid min-w-5 place-items-center rounded-full bg-sun px-1.5 text-xs font-semibold tabular-nums text-ink">
              {count}
            </span>
          ) : null}
        </button>
      </div>
    </header>
  );
}
