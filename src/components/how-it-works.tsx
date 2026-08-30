import { Clock, Leaf, MessageCircle, ShoppingBag, Sun, Truck } from "lucide-react";

const STEPS = [
  {
    icon: ShoppingBag,
    title: "Elegí",
    body: "Recorré el catálogo y sumá lo que necesitás, en la cantidad justa.",
  },
  {
    icon: MessageCircle,
    title: "Pedí",
    body: "Revisá tu lista, sacá lo que no va y envialo por WhatsApp.",
  },
  {
    icon: Sun,
    title: "Recibí",
    body: "Llegamos de 8:00 a 12:00. Si a la mañana no hay nadie, coordinamos por la tarde.",
  },
  {
    icon: Leaf,
    title: "Disfrutá",
    body: "Productos de estación, sin pedir de más y sin desperdiciar.",
  },
];

const SHIPPING = [
  {
    icon: Clock,
    title: "Horario de entrega",
    body: "Los envíos se hacen de 8:00 a 12:00. Si nadie puede recibirlo a la mañana, coordinamos un horario por la tarde.",
  },
  {
    icon: Truck,
    title: "Costo de envío",
    body: "En Zona Norte el envío es gratis. Si sos de otra zona, lo cotizamos directo con vos por WhatsApp.",
  },
];

export function HowItWorks() {
  return (
    <section id="como" className="bg-leaf px-4 py-16 text-cream sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sun">
          Cómo funciona
        </p>
        <h2 className="mt-2 max-w-lg font-display text-3xl font-semibold uppercase tracking-tight sm:text-4xl">
          Del catálogo a tu mesa, en cuatro pasos.
        </h2>
        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <li
              key={step.title}
              className="rounded-2xl bg-leaf-deep/60 p-5 ring-1 ring-cream/10"
            >
              <span className="inline-flex size-10 items-center justify-center rounded-full bg-sun text-ink">
                <step.icon className="size-4" strokeWidth={2.2} />
              </span>
              <p className="mt-4 font-display text-xs uppercase tracking-[0.2em] text-sun">
                0{i + 1}
              </p>
              <h3 className="mt-1 font-display text-2xl font-semibold uppercase tracking-tight">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-cream/80">{step.body}</p>
            </li>
          ))}
        </ol>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {SHIPPING.map((item) => (
            <div
              key={item.title}
              className="flex gap-4 rounded-2xl bg-sun px-5 py-5 text-ink"
            >
              <span className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-full bg-leaf text-cream">
                <item.icon className="size-4" strokeWidth={2.2} />
              </span>
              <div>
                <h3 className="font-display text-xl font-semibold uppercase tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-ink/80">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
