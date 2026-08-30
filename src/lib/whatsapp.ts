import { paymentLabel, type CheckoutDetails } from "./checkout";
import { formatPrice, formatQty } from "./format";
import { WHATSAPP_E164, type Product } from "./products";

export function buildWhatsAppUrl(
  lines: { product: Product; qty: number; lineTotal: number }[],
  checkout: CheckoutDetails,
) {
  const body = lines
    .map(({ product, qty, lineTotal }) => {
      return `• ${formatQty(qty, product.unit)} ${product.name} — ${formatPrice(lineTotal)}`;
    })
    .join("\n");

  const total = lines.reduce((sum, row) => sum + row.lineTotal, 0);

  const details = [
    `Nombre: ${checkout.name.trim()}`,
    `Dirección: ${checkout.address.trim()}`,
    checkout.neighborhood.trim()
      ? `Barrio: ${checkout.neighborhood.trim()}`
      : null,
    `Pago: ${paymentLabel(checkout.payment)}`,
    checkout.notes.trim() ? `Nota: ${checkout.notes.trim()}` : null,
  ]
    .filter((line) => line !== null)
    .join("\n");

  const text = `Hola Oltre Frutti! Quiero hacer este pedido:\n\n${body}\n\nTotal: ${formatPrice(total)}\n\n${details}`;

  return `https://wa.me/${WHATSAPP_E164}?text=${encodeURIComponent(text)}`;
}
