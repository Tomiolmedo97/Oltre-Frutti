import { Leaf, MessageCircle, Truck } from "lucide-react";
import { LogoMark } from "@/components/logo";
import { WHATSAPP_DISPLAY, WHATSAPP_E164 } from "@/lib/products";

const PROMISES = [
  {
    icon: MessageCircle,
    title: "Consultá por otros productos",
    body: "Si no está en la lista, escribinos. Armamos el pedido a medida.",
  },
  {
    icon: Truck,
    title: "Envío mañana, Zona Norte gratis",
    body: "Entregas de 8:00 a 12:00. Si hace falta, coordinamos por la tarde. Otras zonas se cotizan.",
  },
  {
    icon: Leaf,
    title: "Productos frescos seleccionados",
    body: "Fruta y verdura de estación, elegida el mismo día.",
  },
];

export function SiteFooter() {
  return (
    <footer className="bg-citrus text-cream">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-12 sm:grid-cols-3 sm:px-6">
        {PROMISES.map((item) => (
          <div key={item.title} className="flex gap-3">
            <span className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-full bg-cream/15">
              <item.icon className="size-4" />
            </span>
            <div>
              <h3 className="font-display text-lg font-semibold uppercase tracking-tight">
                {item.title}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-cream/85">{item.body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-cream/15 bg-citrus-deep">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-8 sm:flex-row sm:items-center sm:px-6">
          <div className="flex items-center gap-4">
            <LogoMark
              alt="Oltre Frutti"
              className="size-20 rounded-2xl ring-1 ring-cream/20 sm:size-24"
            />
            <p className="max-w-xs text-sm leading-relaxed text-cream/90 sm:text-base">
              Frutas y verduras frescas, a domicilio.
            </p>
          </div>

          <div className="text-left sm:text-right">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sun">
              Hacé tu pedido por WhatsApp
            </p>
            <a
              href={`https://wa.me/${WHATSAPP_E164}`}
              className="mt-1 inline-block font-display text-3xl font-semibold tabular-nums tracking-tight text-cream hover:text-sun"
            >
              {WHATSAPP_DISPLAY}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
