"use client";

import { Button, Input } from "@heroui/react";
import { useCallback, useEffect, useState } from "react";

import { SearchIcon } from "@/components/icons";

const STORAGE_KEY = "kh-steam-achievement-tracker-last-steamid";

export interface SteamSearchFormProps {
  onSearch: (steamId: string) => void;
  isLoading?: boolean;
}

export function SteamSearchForm({ onSearch, isLoading = false }: SteamSearchFormProps) {
  const [value, setValue] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setValue(saved);
    } catch {
      // localStorage pode não estar disponível
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
    [value, onSearch]
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-2xl">
      <Input
        aria-label="SteamID ou vanity URL"
        className="flex-1"
        placeholder="SteamID64 ou vanity URL (ex: donwaztok)"
        value={value}
        onValueChange={setValue}
        isDisabled={isLoading}
        autoComplete="off"
        startContent={<SearchIcon className="size-4 text-default-400" />}
      />
        <Button
        type="submit"
        variant="solid"
        color="primary"
        isDisabled={!value.trim() || isLoading}
        className="sm:w-auto font-kh font-semibold"
      >
        {isLoading ? "Buscando..." : "Buscar minhas conquistas"}
      </Button>
    </form>
  );
}
