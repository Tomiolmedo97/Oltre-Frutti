import type { Unit } from "./products";

export const KG_STEP = 0.1;
export const KG_DEFAULT = 0.5;
export const KG_MIN = 0.05;

export const WEIGHT_PRESETS = [
  { label: "250 g", qty: 0.25 },
  { label: "500 g", qty: 0.5 },
  { label: "1 kg", qty: 1 },
  { label: "2 kg", qty: 2 },
] as const;

export function isWeightUnit(unit: Unit) {
  return unit === "kg";
}

export function stepFor(unit: Unit) {
  return isWeightUnit(unit) ? KG_STEP : 1;
}

export function defaultAddQty(unit: Unit) {
  return isWeightUnit(unit) ? KG_DEFAULT : 1;
}

export function normalizeQty(qty: number, unit: Unit) {
  if (!Number.isFinite(qty) || qty <= 0) return 0;
  if (isWeightUnit(unit)) {
    const grams = Math.round(qty * 1000);
    if (grams < Math.round(KG_MIN * 1000)) return 0;
    return grams / 1000;
  }
  const n = Math.round(qty);
  return n < 1 ? 0 : n;
}

export function lineTotal(price: number, qty: number) {
  return Math.round(price * qty);
}

export function parseWeightInput(raw: string): number | null {
  const text = raw.trim().toLowerCase().replace(",", ".").replace(/\s+/g, "");
  if (!text) return null;
  if (text.endsWith("kg")) {
    const n = Number.parseFloat(text.slice(0, -2));
    return Number.isFinite(n) && n > 0 ? n : null;
  }
  if (text.endsWith("gr")) {
    const n = Number.parseFloat(text.slice(0, -2));
    return Number.isFinite(n) && n > 0 ? n / 1000 : null;
  }
  if (text.endsWith("g")) {
    const n = Number.parseFloat(text.slice(0, -1));
    return Number.isFinite(n) && n > 0 ? n / 1000 : null;
  }
  const n = Number.parseFloat(text);
  if (!Number.isFinite(n) || n <= 0) return null;
  if (text.includes(".")) return n;
  if (n >= 20) return n / 1000;
  return n;
}

export function editValue(qty: number, unit: Unit) {
  if (isWeightUnit(unit)) {
    if (qty >= 1) return String(qty).replace(".", ",");
    return String(Math.round(qty * 1000));
  }
  return String(qty);
}
