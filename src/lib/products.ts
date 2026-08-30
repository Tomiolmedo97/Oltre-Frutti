export type Unit = "kg" | "unidad" | "paquete" | "maple" | "cajón";

export type Category = "combos" | "frutas" | "verduras" | "hierbas" | "otros";

export type Product = {
  id: string;
  name: string;
  unit: Unit;
  price: number;
  category: Category;
};

export const CATEGORIES: { id: Category | "todos"; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "frutas", label: "Frutas" },
  { id: "verduras", label: "Verduras" },
  { id: "hierbas", label: "Hierbas" },
  { id: "combos", label: "Combos" },
  { id: "otros", label: "Otros" },
];

export const UNIT_LABEL: Record<Unit, { one: string; many: string; per: string }> = {
  kg: { one: "kg", many: "kg", per: "por kg" },
  unidad: { one: "unidad", many: "unidades", per: "por unidad" },
  paquete: { one: "paquete", many: "paquetes", per: "por paquete" },
  maple: { one: "maple", many: "maples", per: "por maple" },
  cajón: { one: "cajón", many: "cajones", per: "por cajón" },
};

export const PRODUCTS: Product[] = [
  { id: "cajon-naranja", name: "Cajón naranja", unit: "cajón", price: 14000, category: "combos" },
  { id: "naranja", name: "Naranja", unit: "kg", price: 1000, category: "frutas" },
  { id: "limon", name: "Limón", unit: "kg", price: 2000, category: "frutas" },
  { id: "palta", name: "Palta", unit: "kg", price: 12000, category: "frutas" },
  { id: "rucula", name: "Rúcula", unit: "unidad", price: 800, category: "verduras" },
  { id: "tomate", name: "Tomate", unit: "kg", price: 3500, category: "verduras" },
  { id: "tomate-cherry", name: "Tomate cherry", unit: "kg", price: 6000, category: "verduras" },
  { id: "albahaca", name: "Albahaca", unit: "unidad", price: 2000, category: "hierbas" },
  { id: "champinon", name: "Champiñón", unit: "paquete", price: 5500, category: "verduras" },
  { id: "manzana-verde", name: "Manzana verde", unit: "kg", price: 3500, category: "frutas" },
  { id: "manzana-roja", name: "Manzana roja", unit: "kg", price: 3500, category: "frutas" },
  { id: "cebolla", name: "Cebolla", unit: "kg", price: 1800, category: "verduras" },
  { id: "papa", name: "Papa", unit: "kg", price: 2000, category: "verduras" },
  { id: "banana", name: "Banana", unit: "kg", price: 3000, category: "frutas" },
  { id: "zanahoria", name: "Zanahoria", unit: "kg", price: 2500, category: "verduras" },
  { id: "kiwi", name: "Kiwi", unit: "kg", price: 9000, category: "frutas" },
  { id: "lechuga-francesa", name: "Lechuga francesa", unit: "kg", price: 6000, category: "verduras" },
  { id: "frutilla", name: "Frutilla", unit: "kg", price: 11000, category: "frutas" },
  { id: "menta", name: "Menta", unit: "unidad", price: 3000, category: "hierbas" },
  { id: "morron-rojo", name: "Morrón rojo", unit: "kg", price: 6300, category: "verduras" },
  { id: "acelga", name: "Acelga", unit: "unidad", price: 900, category: "verduras" },
  { id: "verdeo", name: "Verdeo", unit: "paquete", price: 6000, category: "verduras" },
  { id: "berenjena", name: "Berenjena", unit: "kg", price: 3200, category: "verduras" },
  { id: "pera", name: "Pera", unit: "kg", price: 3000, category: "frutas" },
  { id: "huevo", name: "Huevo maple N1", unit: "maple", price: 7500, category: "otros" },
  { id: "zucchini", name: "Zucchini", unit: "kg", price: 5800, category: "verduras" },
  { id: "cabutia", name: "Cabutia", unit: "unidad", price: 3900, category: "verduras" },
  { id: "calabaza", name: "Calabaza", unit: "unidad", price: 3500, category: "verduras" },
  { id: "mandarina", name: "Mandarina", unit: "kg", price: 2600, category: "frutas" },
  { id: "pepino", name: "Pepino", unit: "kg", price: 3000, category: "verduras" },
  { id: "espinaca", name: "Espinaca", unit: "unidad", price: 3000, category: "verduras" },
];

export const PRODUCT_BY_ID = Object.fromEntries(PRODUCTS.map((p) => [p.id, p])) as Record<
  string,
  Product
>;

export function productImage(id: string) {
  return `/products/${id}.jpg`;
}

export const WHATSAPP_DISPLAY = "11 3451-2663";
export const WHATSAPP_E164 = "5491134512663";
