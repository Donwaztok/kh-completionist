"use client";

import { Button } from "@heroui/react";
import clsx from "clsx";
import NextLink from "next/link";
import { useState } from "react";

import { Logo } from "@/components/icons";
import { ThemeSwitch } from "@/components/theme-switch";
import { siteConfig } from "@/config/site";

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-divider bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
        <div className="flex basis-1/5 items-center gap-3 sm:basis-full">
          <NextLink className="flex max-w-fit items-center gap-2" href="/">
            <Logo />
            <p className="font-bold text-inherit hidden sm:block">
              {siteConfig.name}
            </p>
          </NextLink>
          <nav className="ml-2 hidden lg:flex">
            <ul className="flex gap-4">
              {siteConfig.navItems.map((item) => (
                <li key={item.href}>
                  <NextLink
                    className={clsx(
                      "link text-foreground hover:underline underline-offset-4",
                      "data-[active=true]:text-primary data-[active=true]:font-medium",
                    )}
                    href={item.href}
                  >
                    {item.label}
                  </NextLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end gap-2">
          <ThemeSwitch />
          <Button
            isIconOnly
            variant="ghost"
            aria-label="Toggle menu"
            className="lg:hidden"
            onPress={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg
              className="size-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </Button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="border-t border-divider px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-2">
            {siteConfig.navItems.map((item) => (
              <NextLink
                key={item.href}
                href={item.href}
                className="link text-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </NextLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
