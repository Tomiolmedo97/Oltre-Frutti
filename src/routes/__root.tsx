import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { CartHydration } from "@/components/cart-hydration";
import { CART_BOOT_SCRIPT } from "@/lib/cart-boot";
import { Toaster } from "sonner";
import appCss from "../styles.css?url";

const APP_NAME = "Oltre Frutti";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      {
        name: "description",
        content:
          "Frutas y verduras frescas a domicilio. Armá tu pedido online y envialo por WhatsApp.",
      },
      { name: "theme-color", content: "#f4c400" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-title", content: APP_NAME },
      { property: "og:title", content: APP_NAME },
      {
        property: "og:description",
        content: "Frutas y verduras frescas, a domicilio.",
      },
      { property: "og:image", content: "/og.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "icon", href: "/favicon.ico" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32.png" },
      { rel: "icon", type: "image/png", sizes: "48x48", href: "/favicon-48.png" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Oswald:wght@500;600;700&display=swap",
      },
    ],
  }),
  component: () => (
    <html lang="es" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <script dangerouslySetInnerHTML={{ __html: CART_BOOT_SCRIPT }} />
        <PreviewHostBridge />
        <CartHydration />
        <AuthProvider>
          <Outlet />
          <Toaster
            position="bottom-center"
            toastOptions={{
              className:
                "font-[Figtree,sans-serif] !bg-cream !text-ink !border-ink/10",
            }}
          />
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  ),
});
