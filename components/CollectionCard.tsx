"use client";

import { Card } from "@heroui/react";
import clsx from "clsx";
import type { KHCollectionWithGames } from "@/lib/kingdom-hearts";

import { KHGameCard } from "./KHGameCard";

export interface CollectionCardProps {
  collection: KHCollectionWithGames;
}

function CollectionProgressBar({
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

export function CollectionCard({ collection }: CollectionCardProps) {
  const totalAchievements = collection.games.reduce(
    (acc, g) => acc + g.totalAchievements,
    0
  );
  const unlockedAchievements = collection.games.reduce(
    (acc, g) => acc + g.unlockedAchievements,
    0
  );
  const avgPercentage =
    totalAchievements > 0
      ? Math.round((unlockedAchievements / totalAchievements) * 100)
      : 0;

  return (
    <Card className="border border-divider overflow-visible">
      <div className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold">
              📦 {collection.name}
            </h2>
            <p className="text-sm text-default-500 mt-1">
              {unlockedAchievements} / {totalAchievements} conquistas
            </p>
          </div>
          <div className="flex items-center gap-4 min-w-0">
            <span className="text-2xl font-bold shrink-0">
              {avgPercentage}%
            </span>
            <div className="flex-1 min-w-[120px] max-w-[200px]">
              <CollectionProgressBar value={avgPercentage} />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {collection.games.map((game) => (
            <KHGameCard key={`${game.appId}-${game.name}`} game={game} />
          ))}
        </div>
      </div>
    </Card>
  );
}
