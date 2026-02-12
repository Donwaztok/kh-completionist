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
      className={clsx(
        "px-px transition-opacity hover:opacity-80 cursor-pointer",
        className,
      )}
    >
      {({ isSelected }) => (
        <Switch.Control
          className={clsx(
            "w-auto h-auto bg-transparent rounded-lg flex items-center justify-center",
            "group-data-[selected=true]:bg-transparent !text-default-500 pt-px px-0 mx-0",
          )}
        >
          <Switch.Thumb className="bg-transparent shadow-none border-0">
            <Switch.Icon>
              {isSelected || isSSR ? (
                <SunFilledIcon size={22} />
              ) : (
                <MoonFilledIcon size={22} />
              )}
            </Switch.Icon>
          </Switch.Thumb>
        </Switch.Control>
      )}
    </Switch>
  );
};
