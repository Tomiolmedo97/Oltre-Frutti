import { useEffect, useMemo, useState } from "react";
import { ShoppingBag, Trash2, X } from "lucide-react";
import { CheckoutFields } from "@/components/checkout-fields";
import { QuantityStepper } from "@/components/quantity-stepper";
import { Button } from "@/components/ui/button";
import { EMPTY_CHECKOUT, isCheckoutReady } from "@/lib/checkout";
import { getLineItems, useCartStore, useCartTotal } from "@/lib/cart-store";
import { formatPrice, formatQty } from "@/lib/format";
import { useLiveProducts } from "@/lib/live-catalog";
import { productImage } from "@/lib/products";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { toast } from "sonner";

export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const checkout = useCartStore((s) => s.checkout) ?? EMPTY_CHECKOUT;
  const items = useCartStore((s) => s.items) ?? {};
  const closeCart = useCartStore((s) => s.closeCart);
  const add = useCartStore((s) => s.add);
  const dec = useCartStore((s) => s.dec);
  const remove = useCartStore((s) => s.remove);
  const clear = useCartStore((s) => s.clear);
  const total = useCartTotal();
  const catalog = useLiveProducts();
  const lines = useMemo(() => getLineItems(items), [items, catalog]);
  const [attempted, setAttempted] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  function handleRemove(id: string, name: string) {
    remove(id);
    toast(`${name} se sacó del pedido`, {
      action: {
        label: "Deshacer",
        onClick: () => add(id),
      },
    });
  }

  function handleClear() {
    clear();
    setAttempted(false);
    closeCart();
    toast("Pedido vaciado");
  }

  function handleOrder() {
    if (!isCheckoutReady(checkout)) {
      setAttempted(true);
      toast("Completá tus datos para enviar el pedido");
      document.getElementById("checkout-datos")?.scrollIntoView({
        block: "start",
        behavior: "smooth",
      });
      return;
    }
    window.open(buildWhatsAppUrl(lines, checkout), "_blank", "noopener,noreferrer");
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-labelledby="oltre-cart-title">
      <button
        type="button"
        className="absolute inset-0 bg-ink/50"
        aria-label="Cerrar pedido"
        onClick={closeCart}
      />
      <aside className="relative z-10 flex h-full w-full max-w-md flex-col bg-paper shadow-[var(--shadow-card)]">
        <div className="flex items-center justify-between gap-3 border-b border-ink/8 px-5 py-4">
          <h2
            id="oltre-cart-title"
            className="font-display text-2xl font-semibold uppercase tracking-tight text-ink"
          >
            Tu pedido
          </h2>
          <button
            type="button"
            onClick={closeCart}
            className="grid size-11 place-items-center rounded-full text-ink hover:bg-ink/8"
            aria-label="Cerrar pedido"
          >
            <X className="size-5" />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-col items-center px-8 pb-10 pt-10 text-center">
            <span className="grid size-14 place-items-center rounded-full bg-leaf/8 text-leaf">
              <ShoppingBag className="size-6" strokeWidth={1.8} />
            </span>
            <p className="mt-4 font-display text-2xl font-semibold uppercase tracking-tight text-ink">
              Todavía vacío
            </p>
            <p className="mt-2 max-w-xs text-sm text-ink-muted">
              Sumá frutas y verduras del catálogo. Acá vas a ver la lista y vas a poder
              sacar lo que no quieras.
            </p>
            <Button variant="leaf" className="mt-6" onClick={closeCart} asChild>
              <a href="#catalogo">Ir al catálogo</a>
            </Button>
          </div>
        ) : (
          <>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
              <ul className="px-4 py-3">
                {lines.map(({ product, qty, lineTotal }) => (
                  <li
                    key={product.id}
                    className="flex gap-3 border-b border-ink/8 py-3 last:border-b-0"
                  >
                    <img
                      src={productImage(product.id)}
                      alt=""
                      width={72}
                      height={72}
                      className="size-18 shrink-0 rounded-xl object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate font-display text-lg font-semibold uppercase tracking-tight text-ink">
                            {product.name}
                          </p>
                          <p className="text-xs text-ink-muted">
                            {formatQty(qty, product.unit)} · {formatPrice(product.price)}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemove(product.id, product.name)}
                          className="grid size-11 shrink-0 place-items-center rounded-full text-ink-muted hover:bg-citrus/10 hover:text-citrus"
                          aria-label={`Sacar ${product.name} del pedido`}
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                      <div className="mt-2 flex items-center justify-between gap-3">
                        <QuantityStepper
                          compact
                          className="min-w-0 flex-1"
                          unit={product.unit}
                          value={qty}
                          onDec={() => dec(product.id)}
                          onInc={() => add(product.id)}
                          onChange={(next) => useCartStore.getState().setQty(product.id, next)}
                        />
                        <p className="shrink-0 font-display text-lg font-semibold tabular-nums text-leaf">
                          {formatPrice(lineTotal)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="px-4">
                <CheckoutFields attempted={attempted} />
              </div>
            </div>

            <div className="border-t border-ink/8 bg-cream px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-ink-muted">Total</span>
                <span className="font-display text-3xl font-semibold tabular-nums text-ink">
                  {formatPrice(total)}
                </span>
              </div>
              <button
                type="button"
                onClick={handleOrder}
                className="mt-3 inline-flex h-12 w-full items-center justify-center rounded-full bg-leaf text-base font-medium text-cream transition-colors hover:bg-leaf-deep"
              >
                Pedir por WhatsApp
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="mt-2 h-10 w-full text-sm text-ink-muted hover:text-ink"
              >
                Vaciar pedido
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
