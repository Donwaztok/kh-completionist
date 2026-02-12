"use client";

import NextLink from "next/link";

import { KHLogo } from "@/components/icons";
import { siteConfig } from "@/config/site";

export const Navbar = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-kh-gold/20 bg-kh-blue/90 backdrop-blur-md">
      <div className="container mx-auto flex h-16 max-w-7xl items-center px-4">
        <NextLink className="flex max-w-fit items-center gap-2" href="/">
          <KHLogo className="text-kh-gold" />
          <p className="font-bold text-inherit hidden sm:block">
            {siteConfig.name}
          </p>
        </NextLink>
      </div>
    </header>
  );
};
