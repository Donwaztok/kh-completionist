"use client";

import type { AchievementFilter, SortOption } from "@/types/steam";

import { Input } from "@heroui/react";

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
  { value: "all", label: "All" },
  { value: "complete", label: "100%" },
  { value: "in_progress", label: "In progress" },
  { value: "none", label: "0 achievements" },
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "percentage_desc", label: "Highest percentage" },
  { value: "percentage_asc", label: "Lowest percentage" },
  { value: "name_asc", label: "A-Z" },
  { value: "achievements_desc", label: "Most achievements" },
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
          aria-label="Search by game name"
          className="flex-1 max-w-md"
          placeholder="Search game..."
          startContent={<SearchIcon className="size-4 text-default-400" />}
          value={searchQuery}
          onValueChange={onSearchChange}
        />

        <div className="flex flex-wrap gap-2">
          <select
            aria-label="Filter"
            className={selectClass}
            value={filter}
            onChange={(e) =>
              onFilterChange(e.target.value as AchievementFilter)
            }
          >
            {FILTER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <select
            aria-label="Sort"
            className={selectClass}
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
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
        {totalGames} game{totalGames !== 1 ? "s" : ""} with achievements
      </p>
    </div>
  );
}
