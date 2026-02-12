"use client";

import type { SteamAchievement } from "@/types/steam";

export interface AchievementListProps {
  achievements: SteamAchievement[];
}

function formatUnlockTime(timestamp?: number): string {
  if (!timestamp) return "";
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function AchievementList({ achievements }: AchievementListProps) {
  if (achievements.length === 0) {
    return (
      <p className="text-sm text-default-500 py-2">
        No achievements available.
      </p>
    );
  }

  return (
    <ul className="space-y-1.5">
      {achievements.map((achievement, index) => (
        <li
          key={`${achievement.name}-${index}`}
          className={`flex items-center gap-2 py-2 px-2 rounded ${
            achievement.unlocked ? "bg-success/20" : "bg-default-100/50"
          }`}
        >
          <div className="flex-shrink-0">
            {achievement.icon || achievement.icongray ? (
              <img
                src={
                  achievement.unlocked
                    ? achievement.icon ?? achievement.icongray
                    : achievement.icongray ?? achievement.icon
                }
                alt=""
                className="w-6 h-6 rounded"
                loading="lazy"
              />
            ) : (
              <span
                className={`inline-flex w-6 h-6 items-center justify-center rounded text-xs ${
                  achievement.unlocked ? "bg-success/30 text-success" : "bg-default-200 text-default-500"
                }`}
              >
                {achievement.unlocked ? "✓" : "○"}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p
              className={`font-medium text-xs truncate ${achievement.unlocked ? "text-default-600" : ""}`}
            >
              {achievement.name}
            </p>
            {achievement.description && (
              <p className="text-[10px] text-default-500 truncate mt-0.5">
                {achievement.description}
              </p>
            )}
            {achievement.unlocked && achievement.unlockTime && (
              <p className="text-[10px] text-default-400 mt-0.5">
                {formatUnlockTime(achievement.unlockTime)}
              </p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
