"use client";

import { Button, Card } from "@heroui/react";
import clsx from "clsx";
import { useState } from "react";
import type { KHGameWithAchievements } from "@/lib/kingdom-hearts";

import { AchievementList } from "./AchievementList";

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

export function KHGameCard({ game }: KHGameCardProps) {
  const [expanded, setExpanded] = useState(false);

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

        <Button
          variant="ghost"
          size="sm"
          className="mt-3"
          onPress={() => setExpanded(!expanded)}
        >
          {expanded ? "Ocultar conquistas" : "Ver conquistas"}
        </Button>

        {expanded && (
          <div className="mt-4 pt-4 border-t border-divider">
            <AchievementList
              achievements={game.achievements.map((a) => ({
                name: a.name,
                description: a.description,
                unlocked: a.unlocked,
                unlockTime: a.unlockTime,
                icon: a.icon,
                icongray: a.icongray,
              }))}
            />
          </div>
        )}
      </div>
    </Card>
  );
}
