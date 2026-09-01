export const INSTALL_DISMISS_KEY = "oltre-frutti-install-dismissed";
export const INSTALL_SNOOZE_MS = 60 * 60 * 1000;
const INSTALLED_VALUE = "installed";

export function isStandaloneApp() {
  if (typeof window === "undefined") return false;
  const nav = window.navigator as Navigator & { standalone?: boolean };
  return (
    nav.standalone === true ||
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: fullscreen)").matches
  );
}

export function isAndroidDevice() {
  return typeof window !== "undefined" && /Android/i.test(window.navigator.userAgent);
}

export function readInstallDismissed(now = Date.now()) {
  if (typeof window === "undefined") return { hidden: true, remainingMs: 0 };
  if (isStandaloneApp()) return { hidden: true, remainingMs: 0 };
  try {
    const raw = window.localStorage.getItem(INSTALL_DISMISS_KEY);
    if (!raw) return { hidden: false, remainingMs: 0 };
    if (raw === INSTALLED_VALUE) return { hidden: true, remainingMs: 0 };
    const at = Number(raw);
    if (!Number.isFinite(at) || at <= 1) return { hidden: false, remainingMs: 0 };
    const remainingMs = at + INSTALL_SNOOZE_MS - now;
    if (remainingMs <= 0) return { hidden: false, remainingMs: 0 };
    return { hidden: true, remainingMs };
  } catch {
    return { hidden: false, remainingMs: 0 };
  }
}

export function snoozeInstallPrompt(now = Date.now()) {
  window.localStorage.setItem(INSTALL_DISMISS_KEY, String(now));
}

export function markAppInstalled() {
  window.localStorage.setItem(INSTALL_DISMISS_KEY, INSTALLED_VALUE);
}

export const IOS_INSTALL_STEPS = [
  'Tocá “Compartir” en la barra del navegador.',
  'Elegí “Agregar a pantalla de inicio”.',
  'Revisá el nombre, tocá “Agregar” y abrí Oltre Frutti desde tu inicio.',
] as const;

export const ANDROID_INSTALL_STEPS = [
  "Tocá el menú (⋮) arriba a la derecha en el navegador.",
  "Elegí “Instalar app” o “Agregar a la pantalla de inicio”.",
  "Confirmá y abrí Oltre Frutti desde tu inicio.",
] as const;
