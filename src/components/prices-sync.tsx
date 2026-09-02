import { useEffect } from "react";
import { applyLivePrices } from "@/lib/live-catalog";
import { loadPricesFromSheet } from "@/lib/sheet-prices";

export function PricesSync({ prices }: { prices?: Record<string, number> }) {
  useEffect(() => {
    if (prices && Object.keys(prices).length > 0) applyLivePrices(prices);
    let alive = true;
    async function refresh() {
      const next = await loadPricesFromSheet();
      if (alive && Object.keys(next).length > 0) applyLivePrices(next);
    }
    void refresh();
    const timer = window.setInterval(() => void refresh(), 60_000);
    return () => {
      alive = false;
      window.clearInterval(timer);
    };
  }, [prices]);
  return null;
}
