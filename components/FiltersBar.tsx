"use client";

import { Input } from "@heroui/react";

import type { AchievementFilter, SortOption } from "@/types/steam";

import { SearchIcon } from "@/components/icons";

export interface FiltersBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filter: AchievementFilter;
  onFilterChange: (value: AchievementFilter) => void;
  sort: SortOption;
  onSortChange: (value: SortOption) => void;
  totalGames: number;
}

const FILTER_OPTIONS: { value: AchievementFilter; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "complete", label: "100%" },
  { value: "in_progress", label: "Em progresso" },
  { value: "none", label: "0 conquistas" },
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "percentage_desc", label: "Maior percentual" },
  { value: "percentage_asc", label: "Menor percentual" },
  { value: "name_asc", label: "A-Z" },
  { value: "achievements_desc", label: "Mais conquistas" },
];

const selectClass =
  "rounded-lg border border-default-200 px-3 py-2 text-sm bg-default-100 dark:bg-default-50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary min-w-[140px]";

export function FiltersBar({
  searchQuery,
  onSearchChange,
  filter,
  onFilterChange,
  sort,
  onSortChange,
  totalGames,
}: FiltersBarProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <Input
          aria-label="Buscar por nome do jogo"
          className="flex-1 max-w-md"
          placeholder="Buscar jogo..."
          value={searchQuery}
          onValueChange={onSearchChange}
          startContent={<SearchIcon className="size-4 text-default-400" />}
        />

        <div className="flex flex-wrap gap-2">
          <select
            aria-label="Filtro"
            value={filter}
            onChange={(e) => onFilterChange(e.target.value as AchievementFilter)}
            className={selectClass}
          >
            {FILTER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <select
            aria-label="Ordenação"
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className={selectClass}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="text-sm text-default-500">
        {totalGames} jogo{totalGames !== 1 ? "s" : ""} com conquistas
      </p>
    </div>
  );
}
