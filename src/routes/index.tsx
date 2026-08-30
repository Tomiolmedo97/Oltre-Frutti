import { createFileRoute } from "@tanstack/react-router";
import { CartBar } from "@/components/cart-bar";
import { CartDrawer } from "@/components/cart-drawer";
import { Catalog } from "@/components/catalog";
import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <div className="min-h-svh bg-paper pb-20 md:pb-0">
      <a
        href="#catalogo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-cream focus:px-4 focus:py-2"
      >
        Saltar al catálogo
      </a>
      <SiteHeader />
      <main>
        <Hero />
        <Catalog />
        <HowItWorks />
      </main>
      <SiteFooter />
      <CartDrawer />
      <CartBar />
    </div>
  );
}
