"use client";

import { Button, InputGroup } from "@heroui/react";
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
      <InputGroup
        aria-label="SteamID ou vanity URL"
        className="flex-1"
        variant="secondary"
      >
        <InputGroup.Prefix>
          <SearchIcon className="size-4 text-default-400" />
        </InputGroup.Prefix>
        <InputGroup.Input
          placeholder="SteamID64 ou vanity URL (ex: donwaztok)"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={isLoading}
          autoComplete="off"
        />
      </InputGroup>
        <Button
        type="submit"
        variant="primary"
        isDisabled={!value.trim() || isLoading}
        className="sm:w-auto"
      >
        {isLoading ? "Buscando..." : "Buscar minhas conquistas"}
      </Button>
    </form>
  );
}
