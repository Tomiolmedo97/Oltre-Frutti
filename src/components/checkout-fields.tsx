import { EMPTY_CHECKOUT, PAYMENT_OPTIONS } from "@/lib/checkout";
import { useCartStore } from "@/lib/cart-store";
import { cn } from "@/lib/utils";

const inputClass =
  "mt-1 h-11 w-full rounded-xl bg-cream px-3 text-base text-ink shadow-[var(--shadow-card)] outline-none placeholder:text-ink-muted/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf";

type CheckoutFieldsProps = {
  attempted: boolean;
};

export function CheckoutFields({ attempted }: CheckoutFieldsProps) {
  const checkout = useCartStore((s) => s.checkout) ?? EMPTY_CHECKOUT;
  const setCheckout = useCartStore((s) => s.setCheckout);
  const nameError = attempted && checkout.name.trim() === "";
  const addressError = attempted && checkout.address.trim() === "";
  const paymentError = attempted && checkout.payment === "";

  return (
    <div id="checkout-datos" className="border-t border-ink/8 px-1 pb-2 pt-4">
      <h3 className="font-display text-lg font-semibold uppercase tracking-tight text-ink">
        Tus datos
      </h3>
      <p className="mt-0.5 text-sm text-ink-muted">
        Van en el mensaje de WhatsApp. Se guardan en este celular.
      </p>

      <div className="mt-3 grid gap-3">
        <div>
          <label htmlFor="checkout-name" className="text-sm font-medium text-ink">
            Nombre
          </label>
          <input
            id="checkout-name"
            type="text"
            autoComplete="name"
            value={checkout.name}
            onChange={(e) => setCheckout({ name: e.target.value })}
            className={inputClass}
            placeholder="Cómo te llamás"
            aria-invalid={nameError}
            aria-describedby={nameError ? "checkout-name-error" : undefined}
          />
          {nameError ? (
            <p id="checkout-name-error" className="mt-1 text-sm text-citrus">
              Completá tu nombre.
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="checkout-address" className="text-sm font-medium text-ink">
            Dirección
          </label>
          <input
            id="checkout-address"
            type="text"
            autoComplete="street-address"
            value={checkout.address}
            onChange={(e) => setCheckout({ address: e.target.value })}
            className={inputClass}
            placeholder="Calle y número"
            aria-invalid={addressError}
            aria-describedby={addressError ? "checkout-address-error" : undefined}
          />
          {addressError ? (
            <p id="checkout-address-error" className="mt-1 text-sm text-citrus">
              Completá la dirección.
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="checkout-neighborhood" className="text-sm font-medium text-ink">
            Barrio <span className="font-normal text-ink-muted">(opcional)</span>
          </label>
          <input
            id="checkout-neighborhood"
            type="text"
            autoComplete="address-level2"
            value={checkout.neighborhood}
            onChange={(e) => setCheckout({ neighborhood: e.target.value })}
            className={inputClass}
            placeholder="Barrio o zona"
          />
          <p className="mt-1 text-xs leading-relaxed text-ink-muted">
            Zona Norte: envío gratis. Otras zonas se cotizan por WhatsApp.
          </p>
        </div>

        <fieldset>
          <legend className="text-sm font-medium text-ink">Cómo pagás</legend>
          <div className="mt-2 grid grid-cols-1 gap-2">
            {PAYMENT_OPTIONS.map((option) => {
              const selected = checkout.payment === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setCheckout({ payment: option.id })}
                  className={cn(
                    "h-11 rounded-full px-4 text-sm font-medium transition-colors duration-150",
                    selected
                      ? "bg-leaf text-cream"
                      : "bg-cream text-ink ring-1 ring-ink/10 hover:bg-sun/40",
                  )}
                  aria-pressed={selected}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
          {paymentError ? (
            <p id="checkout-payment-error" className="mt-1 text-sm text-citrus">
              Elegí un método de pago.
            </p>
          ) : null}
        </fieldset>

        <div>
          <label htmlFor="checkout-notes" className="text-sm font-medium text-ink">
            Comentario <span className="font-normal text-ink-muted">(opcional)</span>
          </label>
          <textarea
            id="checkout-notes"
            value={checkout.notes}
            onChange={(e) => setCheckout({ notes: e.target.value })}
            rows={3}
            className={cn(inputClass, "h-auto min-h-20 resize-none py-2.5")}
            placeholder="Ej. recibir a la tarde, tomate no muy maduro…"
          />
        </div>
      </div>
    </div>
  );
}
