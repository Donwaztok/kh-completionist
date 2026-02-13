"use client";

import Script from "next/script";

const PUBLISHER_ID = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;

/**
 * Carrega o script do Google AdSense. Adicione no layout raiz.
 * Configure NEXT_PUBLIC_ADSENSE_PUBLISHER_ID no .env.local (ex: ca-pub-123456789)
 */
export function GoogleAdsense() {
  if (!PUBLISHER_ID || process.env.NODE_ENV !== "production") {
    return null;
  }

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${PUBLISHER_ID}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
