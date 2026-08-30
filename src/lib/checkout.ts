export type PaymentMethod = "efectivo" | "transferencia" | "mercadopago";

export type CheckoutDetails = {
  name: string;
  address: string;
  neighborhood: string;
  notes: string;
  payment: PaymentMethod | "";
};

export const EMPTY_CHECKOUT: CheckoutDetails = {
  name: "",
  address: "",
  neighborhood: "",
  notes: "",
  payment: "",
};

export const PAYMENT_OPTIONS: { id: PaymentMethod; label: string }[] = [
  { id: "efectivo", label: "Efectivo" },
  { id: "transferencia", label: "Transferencia" },
  { id: "mercadopago", label: "Mercado Pago" },
];

export function paymentLabel(id: PaymentMethod | "") {
  return PAYMENT_OPTIONS.find((option) => option.id === id)?.label ?? "";
}

export function isCheckoutReady(details: CheckoutDetails) {
  return (
    details.name.trim().length > 0 &&
    details.address.trim().length > 0 &&
    details.payment !== ""
  );
}
