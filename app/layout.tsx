import "@/styles/globals.css";
import clsx from "clsx";
import { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";

import { fontKH, fontSans } from "@/config/fonts";

import { Providers } from "./providers";

const ADSENSE_PUBLISHER_ID = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;

export const metadata: Metadata = {
  metadataBase: new URL("https://khcompletionist.vercel.app"),
  title: {
    default: "KH Completionist – Kingdom Hearts Steam Achievement Tracker",
    template: "%s | KH Completionist",
  },
  description:
    "Track your progress to 100% in Kingdom Hearts Steam achievements. Separate KH1, KH2, KH3 and ReMind DLC achievements by individual game.",
  keywords: [
    "Kingdom Hearts Steam achievements",
    "KH1 achievements Steam",
    "KH2 Final Mix achievements",
    "KH3 achievements Steam",
    "KH3 ReMind DLC achievements",
    "Kingdom Hearts 100% tracker",
    "Steam Kingdom Hearts completion",
  ],
  openGraph: {
    title: "KH Completionist – Kingdom Hearts Steam Achievement Tracker",
    description:
      "Track your Kingdom Hearts Steam achievements individually by game and complete the saga 100%.",
    url: "https://khcompletionist.vercel.app",
    siteName: "KH Completionist",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KH Completionist",
    description:
      "Track your progress to 100% across the Kingdom Hearts saga on Steam.",
  },
  robots: {
    index: true,
    follow: true,
  },
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
    <html suppressHydrationWarning lang="en">
      <head>
        {ADSENSE_PUBLISHER_ID && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUBLISHER_ID}`}
            crossOrigin="anonymous"
          ></script>
        )}
      </head>
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
            <main className="container mx-auto max-w-6xl py-8 px-6 flex-grow relative z-10">
              {children}
            </main>
          </div>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
