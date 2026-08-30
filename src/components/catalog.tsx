import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { CATEGORIES, PRODUCTS, type Category } from "@/lib/products";
import { useIsClient } from "@/lib/use-is-client";
import { cn } from "@/lib/utils";

export function Catalog() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "todos">("todos");
  const ready = useIsClient();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PRODUCTS.filter((p) => {
      const matchCat = category === "todos" || p.category === category;
      const matchQ = q.length === 0 || p.name.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [query, category]);

  const featured = filtered.find((p) => p.id === "cajon-naranja");
  const rest = filtered.filter((p) => p.id !== "cajon-naranja");

  return (
    <section id="catalogo" className="scroll-mt-20 bg-paper px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-citrus">
          Catálogo
        </p>
        <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="max-w-md font-display text-3xl font-semibold uppercase tracking-tight text-ink sm:text-4xl">
            Frutas y verduras de hoy.
          </h2>
          <p className="max-w-sm text-sm text-ink-muted">
            Precios por kilo, unidad o paquete. Sumá al pedido y mandalo por WhatsApp.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3">
          <label className="relative block">
            <span className="sr-only">Buscar producto</span>
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar naranja, rúcula, palta…"
              className="h-12 w-full rounded-full bg-cream pl-11 pr-11 text-base text-ink shadow-[var(--shadow-card)] outline-none placeholder:text-ink-muted/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full text-ink-muted hover:bg-ink/8 hover:text-ink"
                aria-label="Limpiar búsqueda"
              >
                <X className="size-4" />
              </button>
            ) : null}
          </label>

          <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {CATEGORIES.map((cat) => {
              const active = category === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={cn(
                    "h-10 shrink-0 rounded-full px-4 text-sm font-medium transition-colors duration-150",
                    active
                      ? "bg-leaf text-cream"
                      : "bg-cream text-ink ring-1 ring-ink/8 hover:bg-sun/40",
                  )}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="mt-12 text-center text-ink-muted">
            No encontramos “{query}”. Probá con otro nombre o consultanos por WhatsApp.
          </p>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {featured ? <ProductCard product={featured} featured ready={ready} /> : null}
            {rest.map((product) => (
              <ProductCard key={product.id} product={product} ready={ready} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
