"use client";

import { Card, Select, SelectItem } from "@heroui/react";
import clsx from "clsx";
import { useMemo, useState } from "react";
import type { KHGameWithAchievements } from "@/lib/kingdom-hearts";
import type { SteamAchievement } from "@/types/steam";

import { AchievementList } from "./AchievementList";

type AchievementFilterType = "all" | "unlocked" | "locked";
type AchievementSortType = "none" | "unlocked_first" | "locked_first";

const FILTER_OPTIONS: { key: AchievementFilterType; label: string }[] = [
  { key: "all", label: "Todas" },
  { key: "unlocked", label: "Somente liberadas" },
  { key: "locked", label: "Somente não liberadas" },
];

const SORT_OPTIONS: { key: AchievementSortType; label: string }[] = [
  { key: "none", label: "Sem ordenação" },
  { key: "unlocked_first", label: "Conquistadas primeiro" },
  { key: "locked_first", label: "Não conquistadas primeiro" },
];

export interface KHGameCardProps {
  game: KHGameWithAchievements;
}

function ProgressBar({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const colorClass =
    value === 100
      ? "bg-success"
      : value > 0
        ? "bg-primary"
        : "bg-default-300";

  return (
    <div
      className={clsx(
        "h-2 rounded-full overflow-hidden bg-default-200",
        className
      )}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={clsx("h-full transition-all duration-300", colorClass)}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

function StatusBadge({ game }: { game: KHGameWithAchievements }) {
  if (game.isCompleted) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-success/20 text-success">
        🏆 100%
      </span>
    );
  }
  if (game.unlockedAchievements > 0) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary">
        🔄 Em progresso
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-default-200 text-default-600">
      ❌ Não iniciado
    </span>
  );
}

type AchievementWithIndex = SteamAchievement & { originalIndex: number };

function filterAndSortAchievements(
  achievements: AchievementWithIndex[],
  filter: AchievementFilterType,
  sort: AchievementSortType
): SteamAchievement[] {
  let result = [...achievements];

  switch (filter) {
    case "unlocked":
      result = result.filter((a) => a.unlocked);
      break;
    case "locked":
      result = result.filter((a) => !a.unlocked);
      break;
    default:
      break;
  }

  if (sort !== "none") {
    result.sort((a, b) => {
      const primary =
        sort === "unlocked_first"
          ? (b.unlocked ? 1 : 0) - (a.unlocked ? 1 : 0)
          : (a.unlocked ? 1 : 0) - (b.unlocked ? 1 : 0);
      if (primary !== 0) return primary;
      return a.originalIndex - b.originalIndex;
    });
  }

  return result.map(({ originalIndex: _, ...a }) => a);
}

export function KHGameCard({ game }: KHGameCardProps) {
  const [filter, setFilter] = useState<AchievementFilterType>("all");
  const [sort, setSort] = useState<AchievementSortType>("none");

  const achievements = useMemo(
    () =>
      game.achievements.map((a, i) => ({
        ...a,
        originalIndex: i,
      })),
    [game.achievements]
  );

  const filteredAchievements = useMemo(
    () => filterAndSortAchievements(achievements, filter, sort),
    [achievements, filter, sort]
  );

  return (
    <Card className="border border-kh-gold/20 bg-kh-blue-light/30 backdrop-blur-sm shadow-kh-glow-sm">
      <div className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold text-lg truncate" title={game.name}>
                {game.name}
              </h3>
              <StatusBadge game={game} />
            </div>
            <p className="text-sm text-default-500 mt-0.5">
              {game.unlockedAchievements} / {game.totalAchievements} conquistas
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="w-24 text-right">
              <span className="text-2xl font-bold">{game.percentage}%</span>
            </div>
            <div className="w-28 sm:w-36">
              <ProgressBar value={game.percentage} />
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-divider">
          <div className="flex flex-nowrap gap-2 mb-4 w-fit">
            <Select
              aria-label="Filtrar conquistas"
              selectedKeys={[filter]}
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0];
                setFilter((value as AchievementFilterType) ?? "all");
              }}
              size="sm"
              fullWidth={false}
              className="w-[180px]"
            >
              {FILTER_OPTIONS.map((opt) => (
                <SelectItem key={opt.key}>{opt.label}</SelectItem>
              ))}
            </Select>
            <Select
              aria-label="Ordenar conquistas"
              placeholder="Ordenar conquistas"
              selectedKeys={sort === "none" ? [] : [sort]}
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0];
                setSort((value as AchievementSortType) ?? "none");
              }}
              onClear={() => setSort("none")}
              isClearable
              disallowEmptySelection={false}
              size="sm"
              fullWidth={false}
              className="w-[180px]"
            >
              {SORT_OPTIONS.map((opt) => (
                <SelectItem key={opt.key}>{opt.label}</SelectItem>
              ))}
            </Select>
          </div>
          <AchievementList achievements={filteredAchievements} />
        </div>
      </div>
    </Card>
  );
}
