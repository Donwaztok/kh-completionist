"use client";

import { Chip } from "@heroui/react";
import type { SteamAchievement } from "@/types/steam";

export interface AchievementListProps {
  achievements: SteamAchievement[];
}

function formatUnlockTime(timestamp?: number): string {
  if (!timestamp) return "";
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function AchievementList({ achievements }: AchievementListProps) {
  if (achievements.length === 0) {
    return (
      <p className="text-sm text-default-500 py-2">
        Nenhuma conquista disponível.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {achievements.map((achievement, index) => (
        <li
          key={`${achievement.name}-${index}`}
          className={`flex items-start gap-3 p-3 rounded-lg ${
            achievement.unlocked ? "bg-success/20" : "bg-default-100/50"
          }`}
        >
          <div className="flex-shrink-0 mt-0.5">
            {achievement.icon || achievement.icongray ? (
              <img
                src={
                  achievement.unlocked
                    ? achievement.icon ?? achievement.icongray
                    : achievement.icongray ?? achievement.icon
                }
                alt=""
                className="w-10 h-10 rounded"
                loading="lazy"
              />
            ) : (
              <Chip
                size="sm"
                color={achievement.unlocked ? "success" : "default"}
                variant="flat"
              >
                {achievement.unlocked ? "✓" : "○"}
              </Chip>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p
              className={`font-medium text-sm ${achievement.unlocked ? "text-default-600" : ""}`}
            >
              {achievement.name}
            </p>
            {achievement.description && (
              <p className="text-xs text-default-500 mt-0.5">
                {achievement.description}
              </p>
            )}
            {achievement.unlocked && achievement.unlockTime && (
              <p className="text-xs text-default-400 mt-1">
                Desbloqueado em {formatUnlockTime(achievement.unlockTime)}
              </p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
