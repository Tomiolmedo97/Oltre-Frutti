import { PRODUCTS } from "./products";

/** Planilla "Oltre Frutti - Precios". Solo se usa la columna Precio. */
export const PRICES_SHEET_ID = "1_CfYKo7GJzVj0Y9oAJ0_X16tUxay_FPDOpSzDH_D6Xc";

export function sheetCsvUrl(id = PRICES_SHEET_ID) {
  if (!id) return "";
  return `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:csv`;
}

export function parsePriceCell(raw: string) {
  const text = raw.trim().replace(/^\$/, "").replace(/\s/g, "");
  if (!text) return null;
  if (text.includes(",")) {
    const n = Number(text.replace(/\./g, "").replace(",", "."));
    return Number.isFinite(n) && n > 0 ? Math.round(n) : null;
  }
  const n = Number(text.replace(/\./g, ""));
  return Number.isFinite(n) && n > 0 ? Math.round(n) : null;
}

function splitCsvLine(line: string) {
  const cells: string[] = [];
  let current = "";
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === '"') {
      if (quoted && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        quoted = !quoted;
      }
    } else if (ch === "," && !quoted) {
      cells.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  cells.push(current.trim());
  return cells;
}

function normalizeName(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

export function parseSheetCsv(csv: string) {
  const lines = csv.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length < 2) return {} as Record<string, number>;

  const header = splitCsvLine(lines[0] ?? "").map((cell) =>
    cell.toLowerCase().replace(/['"]/g, ""),
  );
  const priceIdx = header.findIndex((cell) => cell.includes("precio"));
  const codeIdx = header.findIndex((cell) => cell.includes("codigo") || cell === "id");
  const nameIdx = header.findIndex((cell) => cell.includes("producto") || cell.includes("nombre"));
  if (priceIdx < 0) return {};

  const byCode = Object.fromEntries(PRODUCTS.map((p) => [p.id, p.id]));
  const byName = Object.fromEntries(PRODUCTS.map((p) => [normalizeName(p.name), p.id]));
  const prices: Record<string, number> = {};

  for (const line of lines.slice(1)) {
    const cells = splitCsvLine(line);
    const price = parsePriceCell(cells[priceIdx] ?? "");
    if (price == null) continue;
    const code = (cells[codeIdx] ?? "").trim();
    const name = (cells[nameIdx] ?? "").trim();
    const id = byCode[code] ?? byName[normalizeName(name)];
    if (id) prices[id] = price;
  }
  return prices;
}

let cached:
  | { at: number; prices: Record<string, number> }
  | null = null;
const CACHE_MS = 60_000;

export async function loadPricesFromSheet() {
  const url = sheetCsvUrl();
  if (!url) return {};
  if (cached && Date.now() - cached.at < CACHE_MS) return cached.prices;
  try {
    const res = await fetch(url, { redirect: "follow" });
    if (!res.ok) return cached?.prices ?? {};
    const csv = await res.text();
    if (csv.includes("<html") || !csv.includes(",")) return cached?.prices ?? {};
    const prices = parseSheetCsv(csv);
    cached = { at: Date.now(), prices };
    return prices;
  } catch {
    return cached?.prices ?? {};
  }
}
