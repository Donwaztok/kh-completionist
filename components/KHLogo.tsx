"use client";

import type { IconSvgProps } from "@/types";

/**
 * Heart symbol inspired by Kingdom Hearts
 * Heart with crown-shaped top (two inward curved tips)
 * Original design, evokes franchise aesthetic without reproducing the official logo
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
      className={className}
      height={s}
      viewBox="0 0 32 32"
      width={s}
      {...props}
    >
      {/* Heart with crown top - two inward curved tips */}
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
