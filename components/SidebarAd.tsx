"use client";

import { useEffect } from "react";

/**
 * Anúncio para a coluna lateral (sidebar).
 * Formatos que cabem em 288px (lg:w-72):
 * - 250x250 (Medium Rectangle) – compacto, bom desempenho
 * - 160x600 (Wide Skyscraper) – formato vertical clássico de sidebar
 * - 300x250 – o mais performático, mas um pouco mais largo (usa responsivo)
 *
 * Configure NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR com o ID do slot no painel AdSense.
 */
export function SidebarAd() {
  const slotId = process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR;
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;

  useEffect(() => {
    if (
      slotId &&
      publisherId &&
      process.env.NODE_ENV === "production" &&
      typeof window !== "undefined" &&
      (window as Window & { adsbygoogle?: unknown[] }).adsbygoogle
    ) {
      try {
        (window as Window & { adsbygoogle?: unknown[] }).adsbygoogle?.push({});
      } catch {
        // Ignora erros de push (ex: ad block)
      }
    }
  }, [slotId, publisherId]);

  if (!slotId || !publisherId || process.env.NODE_ENV !== "production") {
    return null;
  }

  return (
    <div className="flex justify-center pt-2">
      <ins
        className="adsbygoogle"
        data-ad-client={publisherId}
        data-ad-slot={slotId}
        style={{ display: "inline-block", width: 250, height: 250 }}
        aria-hidden
      />
    </div>
  );
}
