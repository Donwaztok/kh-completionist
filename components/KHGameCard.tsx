"use client";

import { Card } from "@heroui/react";
import clsx from "clsx";
import { useMemo, useState } from "react";
import type { KHGameWithAchievements } from "@/lib/kingdom-hearts";
import type { SteamAchievement } from "@/types/steam";

import { AchievementList } from "./AchievementList";

type AchievementFilterType = "all" | "unlocked" | "locked";
type AchievementSortType = "unlocked_first" | "locked_first";

const selectClass =
  "rounded-lg border border-default-200 px-3 py-2 text-sm bg-default-100 dark:bg-default-50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary min-w-[160px]";

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

function filterAndSortAchievements(
  achievements: SteamAchievement[],
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

  result.sort((a, b) => {
    if (sort === "unlocked_first") return (b.unlocked ? 1 : 0) - (a.unlocked ? 1 : 0);
    return (a.unlocked ? 1 : 0) - (b.unlocked ? 1 : 0);
  });

  return result;
}

export function KHGameCard({ game }: KHGameCardProps) {
  const [filter, setFilter] = useState<AchievementFilterType>("all");
  const [sort, setSort] = useState<AchievementSortType>("unlocked_first");

  const achievements = useMemo(
    () =>
      game.achievements.map((a) => ({
        name: a.name,
        description: a.description,
        unlocked: a.unlocked,
        unlockTime: a.unlockTime,
        icon: a.icon,
        icongray: a.icongray,
      })),
    [game.achievements]
  );

  const filteredAchievements = useMemo(
    () => filterAndSortAchievements(achievements, filter, sort),
    [achievements, filter, sort]
  );

  return (
    <Card className="border border-divider">
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
          <div className="flex flex-wrap gap-2 mb-4">
            <select
              aria-label="Filtrar conquistas"
              value={filter}
              onChange={(e) => setFilter(e.target.value as AchievementFilterType)}
              className={selectClass}
            >
              <option value="all">Todas</option>
              <option value="unlocked">Somente liberadas</option>
              <option value="locked">Somente não liberadas</option>
            </select>
            <select
              aria-label="Ordenar conquistas"
              value={sort}
              onChange={(e) => setSort(e.target.value as AchievementSortType)}
              className={selectClass}
            >
              <option value="unlocked_first">Conquistadas primeiro</option>
              <option value="locked_first">Não conquistadas primeiro</option>
            </select>
          </div>
          <AchievementList achievements={filteredAchievements} />
        </div>
      </div>
    </Card>
  );
}
