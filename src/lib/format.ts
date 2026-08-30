import { UNIT_LABEL, type Unit } from "./products";
import { isWeightUnit } from "./quantity";

export function formatPrice(n: number) {
  return `$${Math.round(n).toLocaleString("es-AR")}`;
}

export function formatQty(qty: number, unit: Unit) {
  if (isWeightUnit(unit)) {
    const grams = Math.round(qty * 1000);
    if (grams % 1000 === 0) return `${grams / 1000} kg`;
    if (grams >= 1000) {
      return `${(grams / 1000).toLocaleString("es-AR", { maximumFractionDigits: 3 })} kg`;
    }
    return `${grams} g`;
  }
  const labels = UNIT_LABEL[unit];
  const label = qty === 1 ? labels.one : labels.many;
  return `${qty} ${label}`;
}
