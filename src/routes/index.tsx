import { createFileRoute } from "@tanstack/react-router";
import { CartBar } from "@/components/cart-bar";
import { CartDrawer } from "@/components/cart-drawer";
import { Catalog } from "@/components/catalog";
import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { InstallPrompt } from "@/components/install-prompt";
import { PricesSync } from "@/components/prices-sync";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { loadPricesFromSheet } from "@/lib/sheet-prices";

export const Route = createFileRoute("/")({
  loader: async () => ({ prices: await loadPricesFromSheet() }),
  component: Home,
});

function Home() {
  const { prices } = Route.useLoaderData();
  return (
    <div className="min-h-svh bg-paper pb-32 md:pb-0">
      <a
        href="#catalogo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-cream focus:px-4 focus:py-2"
      >
        Saltar al catálogo
      </a>
      <PricesSync prices={prices} />
      <SiteHeader />
      <main>
        <Hero />
        <Catalog />
        <HowItWorks />
      </main>
      <SiteFooter />
      <CartDrawer />
      <CartBar />
      <InstallPrompt />
    </div>
  );
}
