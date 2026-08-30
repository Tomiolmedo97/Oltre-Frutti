import { memo } from "react";
import { Plus } from "lucide-react";
import { QuantityStepper } from "@/components/quantity-stepper";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice, formatQty } from "@/lib/format";
import { UNIT_LABEL, productImage, type Product } from "@/lib/products";
import { isWeightUnit, lineTotal } from "@/lib/quantity";
import { cn } from "@/lib/utils";

type ProductCardProps = {
  product: Product;
  featured?: boolean;
  ready?: boolean;
};

export const ProductCard = memo(function ProductCard({
  product,
  featured = false,
  ready = false,
}: ProductCardProps) {
  const liveQty = useCartStore((s) => s.items?.[product.id] ?? 0);
  const qty = ready ? liveQty : 0;
  const weight = isWeightUnit(product.unit);
  const total = qty > 0 ? lineTotal(product.price, qty) : product.price;

  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl bg-cream shadow-[var(--shadow-card)] transition-[box-shadow,transform] duration-200 ease-out hover:shadow-[var(--shadow-card-hover)]",
        featured && "col-span-2 sm:flex-row",
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden bg-paper",
          featured ? "aspect-[4/3] sm:aspect-auto sm:w-[42%] sm:min-h-56" : "aspect-square",
        )}
      >
        <img
          src={productImage(product.id)}
          alt={product.name}
          width={featured ? 720 : 480}
          height={featured ? 540 : 480}
          loading="lazy"
          decoding="async"
          sizes={
            featured
              ? "(min-width: 640px) 42vw, 100vw"
              : "(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
          }
          className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
        {featured ? (
          <span className="absolute left-3 top-3 rounded-full bg-sun px-3 py-1 font-display text-xs font-semibold uppercase tracking-wider text-ink">
            Combo
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <div className="flex-1">
          <h3 className="font-display text-xl font-semibold uppercase tracking-tight text-ink">
            {product.name}
          </h3>
          <p className="mt-0.5 text-sm text-ink-muted">
            {qty > 0 && weight
              ? `${formatQty(qty, product.unit)} · ${formatPrice(product.price)} el kg`
              : UNIT_LABEL[product.unit].per}
          </p>
          <p className="mt-2 font-display text-2xl font-semibold tabular-nums text-leaf">
            {formatPrice(total)}
          </p>
        </div>

        {qty === 0 ? (
          <button
            type="button"
            data-add={product.id}
            onClick={() => useCartStore.getState().add(product.id)}
            className="inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-full bg-leaf text-sm font-medium text-cream transition-colors hover:bg-leaf-deep"
          >
            <Plus className="size-4" strokeWidth={2.4} />
            Agregar
          </button>
        ) : (
          <QuantityStepper
            className="w-full"
            unit={product.unit}
            value={qty}
            onDec={() => useCartStore.getState().dec(product.id)}
            onInc={() => useCartStore.getState().add(product.id)}
            onChange={(next) => useCartStore.getState().setQty(product.id, next)}
          />
        )}
      </div>
    </article>
  );
});
