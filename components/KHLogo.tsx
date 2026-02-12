"use client";

import type { IconSvgProps } from "@/types";

/**
 * Símbolo do coração inspirado em Kingdom Hearts
 * Coração com topo em forma de coroa (duas pontas curvadas para dentro)
 * Design original, evoca a estética da franquia sem reproduzir o logo oficial
 */
export function KHLogo({
  size = 36,
  width,
  height,
  className = "",
  ...props
}: IconSvgProps) {
  const s = size || width || height || 36;
  return (
    <svg
      viewBox="0 0 32 32"
      width={s}
      height={s}
      className={className}
      {...props}
    >
      {/* Coração com topo em coroa - duas pontas curvadas para dentro */}
      <path
        d="M16 28
           C16 28 3 17 3 11
           C3 6 7 3.5 11 4
           C13 4 14.5 6 16 8.5
           C17.5 6 19 4 21 4
           C25 3.5 29 6 29 11
           C29 17 16 28 16 28Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
}
