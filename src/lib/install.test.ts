import assert from "node:assert/strict";
import test from "node:test";
import { INSTALL_SNOOZE_MS, readInstallDismissed } from "./install.ts";

test("sin cierre, el aviso se muestra", () => {
  const store: Record<string, string> = {};
  globalThis.window = {
    localStorage: {
      getItem: (k: string) => store[k] ?? null,
      setItem: (k: string, v: string) => {
        store[k] = v;
      },
    },
    navigator: { standalone: false },
    matchMedia: () => ({ matches: false }),
  } as never;
  assert.equal(readInstallDismissed(1_000).hidden, false);
});

test("después de cerrar, queda oculto 1 hora y luego vuelve", () => {
  const store: Record<string, string> = {
    "oltre-frutti-install-dismissed": "1000",
  };
  globalThis.window = {
    localStorage: {
      getItem: (k: string) => store[k] ?? null,
    },
    navigator: { standalone: false },
    matchMedia: () => ({ matches: false }),
  } as never;
  assert.equal(readInstallDismissed(1_000).hidden, true);
  assert.equal(readInstallDismissed(1_000 + INSTALL_SNOOZE_MS - 1).hidden, true);
  assert.equal(readInstallDismissed(1_000 + INSTALL_SNOOZE_MS).hidden, false);
});
