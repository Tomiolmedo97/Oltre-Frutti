export const INSTALL_DISMISS_KEY = "oltre-frutti-install-dismissed";

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
