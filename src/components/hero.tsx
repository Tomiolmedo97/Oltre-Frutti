import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { useCartStore } from "@/lib/cart-store";
import { useIsClient } from "@/lib/use-is-client";

const FRUITS = [
  {
    src: "/hero/orange-half.jpg",
    className:
      "top-[4%] left-[-6%] w-32 sm:left-[3%] sm:w-36 md:w-44 lg:left-[7%]",
    rot: "-14deg",
    delay: "0ms",
  },
  {
    src: "/hero/strawberry.jpg",
    className:
      "top-[3%] left-[38%] w-16 sm:left-[28%] sm:w-20 md:w-22",
    rot: "12deg",
    delay: "180ms",
  },
  {
    src: "/hero/kiwi.jpg",
    className:
      "top-[6%] right-[-8%] w-28 sm:right-[2%] sm:w-32 md:w-36 lg:right-[6%]",
    rot: "8deg",
    delay: "240ms",
  },
  {
    src: "/hero/lime-whole.jpg",
    className:
      "bottom-[18%] right-[-6%] w-24 sm:right-[3%] sm:w-28 md:bottom-[14%] md:w-32",
    rot: "-16deg",
    delay: "400ms",
  },
] as const;

export function Hero() {
  const isClient = useIsClient();
  const openCart = useCartStore((s) => s.openCart);

  return (
    <section
      id="inicio"
      className="relative isolate overflow-hidden bg-sun"
      aria-labelledby="hero-title"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {FRUITS.map((fruit) => (
          <img
            key={fruit.src}
            src={isClient ? fruit.src : "data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA="}
            alt=""
            decoding="async"
            className={`fruit-float absolute rounded-full mix-blend-multiply ${fruit.className}`}
            style={{ animationDelay: fruit.delay, ["--rot" as string]: fruit.rot }}
          />
        ))}
      </div>

      <div className="relative mx-auto flex min-h-[calc(100svh-4rem)] max-w-4xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6 sm:py-20">
        <p className="rise-in mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-leaf/80">
          Verdulería a domicilio
        </p>
        <h1 id="hero-title" className="sr-only">
          Oltre Frutti
        </h1>
        <div className="rise-in" style={{ animationDelay: "80ms" }}>
          <Logo stacked priority />
        </div>
        <p
          className="rise-in mt-6 max-w-xl font-display text-lg font-medium uppercase tracking-[0.12em] text-leaf sm:text-xl"
          style={{ animationDelay: "140ms" }}
        >
          Frutas y verduras frescas, a domicilio.
        </p>
        <div
          className="rise-in mt-8 flex flex-wrap items-center justify-center gap-3"
          style={{ animationDelay: "220ms" }}
        >
          <Button asChild variant="leaf" size="lg">
            <a href="#catalogo">
              Ver catálogo
              <ArrowDown className="size-4" />
            </a>
          </Button>
          <Button type="button" variant="cream" size="lg" data-open-cart="" onClick={openCart}>
            Armar pedido
          </Button>
        </div>
      </div>

      <div className="relative bg-citrus px-4 py-5 sm:px-6 sm:py-6">
        <p className="mx-auto max-w-3xl text-center text-sm leading-relaxed text-cream sm:text-base">
          Recibí el pedido de 8:00 a 12:00. En Zona Norte el envío es gratis;
          si sos de otra zona, lo cotizamos con vos.
        </p>
      </div>
    </section>
  );
}
