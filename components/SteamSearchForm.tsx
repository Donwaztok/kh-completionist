"use client";

import NextLink from "next/link";
import { Button, Input } from "@heroui/react";
import { useCallback, useEffect, useState } from "react";

import { GithubIcon, SearchIcon } from "@/components/icons";
import { siteConfig } from "@/config/site";

const STORAGE_KEY = "kh-steam-achievement-tracker-last-steamid";

export interface SteamSearchFormProps {
  onSearch: (steamId: string) => void;
  isLoading?: boolean;
}

export function SteamSearchForm({
  onSearch,
  isLoading = false,
}: SteamSearchFormProps) {
  const [value, setValue] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) setValue(saved);
    } catch {
      // localStorage may not be available
    }
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = value.trim();

      if (!trimmed) return;

      try {
        localStorage.setItem(STORAGE_KEY, trimmed);
      } catch {
        // ignore
      }

      onSearch(trimmed);
    },
    [value, onSearch],
  );

  return (
    <form
      className="flex flex-col sm:flex-row gap-3 w-full max-w-2xl"
      onSubmit={handleSubmit}
    >
      <Input
        aria-label="SteamID or vanity URL"
        autoComplete="off"
        className="flex-1"
        isDisabled={isLoading}
        placeholder="SteamID64 or vanity URL (e.g. donwaztok)"
        value={value}
        onValueChange={setValue}
      />
      <div className="flex gap-2">
        <Button
          isIconOnly
          aria-label={isLoading ? "Searching..." : "Search"}
          color="primary"
          isDisabled={!value.trim() || isLoading}
          isLoading={isLoading}
          type="submit"
          variant="solid"
        >
          <SearchIcon className="size-5" />
        </Button>
        <Button
          isIconOnly
          aria-label="GitHub"
          as={NextLink}
          href={siteConfig.links.github}
          rel="noopener noreferrer"
          target="_blank"
          variant="flat"
        >
          <GithubIcon className="size-5" />
        </Button>
      </div>
    </form>
  );
}
