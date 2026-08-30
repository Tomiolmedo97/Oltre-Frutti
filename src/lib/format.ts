import { UNIT_LABEL, type Unit } from "./products";

export function formatPrice(n: number) {
  return `$${n.toLocaleString("es-AR")}`;
}

export function formatQty(qty: number, unit: Unit) {
  const labels = UNIT_LABEL[unit];
  const label = qty === 1 ? labels.one : labels.many;
  return `${qty} ${label}`;
}
