import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { LogoMark } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { useCartCount, useCartStore } from "@/lib/cart-store";
import {
  ANDROID_INSTALL_STEPS,
  INSTALL_SNOOZE_MS,
  IOS_INSTALL_STEPS,
  isAndroidDevice,
  markAppInstalled,
  readInstallDismissed,
  snoozeInstallPrompt,
} from "@/lib/install";
import { useIsClient } from "@/lib/use-is-client";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function InstallPrompt() {
  const isClient = useIsClient();
  const cartCount = useCartCount();
  const cartOpen = useCartStore((s) => s.isOpen);
  const [dismissed, setDismissed] = useState(true);
  const [guideOpen, setGuideOpen] = useState(false);
  const [android, setAndroid] = useState(false);
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (!isClient) return;
    const state = readInstallDismissed();
    setDismissed(state.hidden);
    setAndroid(isAndroidDevice());

    let timer: number | undefined;
    if (state.hidden && state.remainingMs > 0) {
      timer = window.setTimeout(() => setDismissed(false), state.remainingMs);
    }

    const onPrompt = (event: Event) => {
      event.preventDefault();
      setDeferred(event as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    const onInstalled = () => {
      try {
        markAppInstalled();
      } catch {
        /* ignore */
      }
      setDismissed(true);
      setGuideOpen(false);
    };
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      if (timer) window.clearTimeout(timer);
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, [isClient]);

  function snooze() {
    setDismissed(true);
    setGuideOpen(false);
    try {
      snoozeInstallPrompt();
    } catch {
      /* ignore */
    }
    window.setTimeout(() => setDismissed(false), INSTALL_SNOOZE_MS);
  }

  async function handleInstall() {
    if (deferred) {
      await deferred.prompt();
      const choice = await deferred.userChoice;
      setDeferred(null);
      if (choice.outcome === "accepted") {
        try {
          markAppInstalled();
        } catch {
          /* ignore */
        }
        setDismissed(true);
        setGuideOpen(false);
        return;
      }
    }
    setGuideOpen(true);
  }

  if (!isClient || dismissed || cartOpen || cartCount > 0) return null;

  const steps = android ? ANDROID_INSTALL_STEPS : IOS_INSTALL_STEPS;

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden">
        {!guideOpen ? (
          <div className="pointer-events-auto flex items-center gap-2.5 rounded-2xl bg-cream py-2.5 pl-2.5 pr-2 shadow-[var(--shadow-card-hover)] ring-1 ring-ink/8">
            <div className="size-11 shrink-0 overflow-hidden rounded-xl ring-1 ring-dashed ring-ink/15">
              <LogoMark className="size-11 rounded-xl" alt="Oltre Frutti" />
            </div>
            <p className="min-w-0 flex-1 text-sm leading-snug text-ink">
              Llevá Oltre Frutti siempre a mano y armá tu pedido en segundos.
            </p>
            <Button
              type="button"
              variant="leaf"
              size="sm"
              className="h-9 shrink-0 px-3.5 text-xs whitespace-nowrap"
              onClick={() => void handleInstall()}
            >
              Instalar
            </Button>
            <button
              type="button"
              onClick={snooze}
              className="grid size-8 shrink-0 place-items-center rounded-full text-ink-muted hover:bg-ink/8 hover:text-ink"
              aria-label="Cerrar aviso de instalación"
            >
              <X className="size-4" strokeWidth={2.2} />
            </button>
          </div>
        ) : null}
      </div>

      {guideOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-ink/50"
            aria-label="Cerrar instructivo"
            onClick={() => setGuideOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="oltre-install-title"
            className="relative z-10 w-full max-w-md rounded-3xl bg-cream p-5 shadow-[var(--shadow-card-hover)]"
          >
            <div className="flex items-start gap-3">
              <div className="size-12 shrink-0 overflow-hidden rounded-2xl ring-1 ring-dashed ring-ink/15">
                <LogoMark className="size-12 rounded-2xl" alt="" />
              </div>
              <div className="min-w-0 flex-1 pt-0.5">
                <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                  Seguí los pasos
                </p>
                <h2
                  id="oltre-install-title"
                  className="font-display text-2xl font-semibold tracking-tight text-ink"
                >
                  Para instalar Oltre Frutti
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setGuideOpen(false)}
                className="grid size-11 shrink-0 place-items-center rounded-full text-ink-muted hover:bg-ink/8 hover:text-ink"
                aria-label="Cerrar"
              >
                <X className="size-5" />
              </button>
            </div>

            <p className="mt-3 text-sm text-ink-muted">
              Usala como una app en tu celular: más rápida, a un toque desde el
              inicio.
            </p>

            <ol className="mt-5 space-y-3.5">
              {steps.map((step, index) => (
                <li key={step} className="flex gap-3">
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-leaf font-display text-xs font-semibold text-cream">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-snug text-ink">{step}</p>
                </li>
              ))}
            </ol>

            <Button
              type="button"
              variant="leaf"
              size="lg"
              className="mt-6 w-full"
              onClick={() => setGuideOpen(false)}
            >
              Entendido
            </Button>
          </div>
        </div>
      ) : null}
    </>
  );
}
