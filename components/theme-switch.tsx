"use client";

import { Switch } from "@heroui/react";
import { useIsSSR } from "@react-aria/ssr";
import clsx from "clsx";
import { useTheme } from "next-themes";
import { FC } from "react";

import { MoonFilledIcon, SunFilledIcon } from "@/components/icons";

export interface ThemeSwitchProps {
  className?: string;
}

export const ThemeSwitch: FC<ThemeSwitchProps> = ({ className }) => {
  const { theme, setTheme } = useTheme();
  const isSSR = useIsSSR();

  const isLight = theme === "light" || isSSR;

  return (
    <Switch
      aria-label={`Switch to ${isLight ? "dark" : "light"} mode`}
      isSelected={isLight}
      onChange={() => setTheme(isLight ? "dark" : "light")}
      thumbIcon={({ isSelected }) =>
        isSelected || isSSR ? (
          <SunFilledIcon size={22} />
        ) : (
          <MoonFilledIcon size={22} />
        )
      }
      className={clsx(
        "px-px transition-opacity hover:opacity-80 cursor-pointer",
        className,
      )}
    />
  );
};
