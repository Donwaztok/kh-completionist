import "@/styles/globals.css";
import clsx from "clsx";
import { Metadata, Viewport } from "next";

import { Providers } from "./providers";

import { Navbar } from "@/components/navbar";
import { fontKH, fontSans } from "@/config/fonts";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="pt-BR">
      <head />
      <body
        className={clsx(
          "min-h-screen text-foreground bg-background font-sans antialiased",
          fontSans.variable,
          fontKH.variable,
        )}
      >
        <Providers
          themeProps={{
            attribute: "class",
            defaultTheme: "dark",
            forcedTheme: "dark",
            enableSystem: false,
          }}
        >
          <div className="relative flex flex-col min-h-screen kh-starry-bg">
            <Navbar />
            <main className="container mx-auto max-w-6xl pt-16 px-6 flex-grow relative z-10">
              {children}
            </main>
            <footer className="w-full flex items-center justify-center py-3 border-t border-kh-gold/10">
              <a
                className="link flex items-center gap-1 text-current hover:underline underline-offset-4"
                href="https://steamcommunity.com/dev"
                target="_blank"
                rel="noopener noreferrer"
                title="Steam Web API"
              >
                <span className="text-kh-silver/70">Powered by</span>
                <span className="text-kh-gold">Steam Web API</span>
              </a>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
