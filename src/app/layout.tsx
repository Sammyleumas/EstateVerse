import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/inter-tight";
import "./globals.css";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { PreferencesEffect } from "@/components/settings/PreferencesEffect";

export const metadata: Metadata = {
  title: {
    default: "ESTATEVERSE — Your World. Your Colour. Your Architecture.",
    template: "%s · ESTATEVERSE",
  },
  description:
    "Explore a signature contemporary residence in 3D, capture a colour from the world around you with your camera and transform its exterior in real time.",
  applicationName: "ESTATEVERSE",
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-GB" className="h-full antialiased" suppressHydrationWarning>
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only z-[60] bg-bone px-4 py-2 text-sm text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <PreferencesEffect />
        <Navigation />
        <main id="main" className="flex flex-1 flex-col">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
