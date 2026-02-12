export interface SteamAchievement {
  name: string;
  description: string;
  unlocked: boolean;
  unlockTime?: number;
  icon?: string;
  icongray?: string;
}

export interface SteamGameWithAchievements {
  appId: number;
  name: string;
  totalAchievements: number;
  unlockedAchievements: number;
  percentage: number;
  achievements: SteamAchievement[];
}

export interface SteamApiResponse {
  games: SteamGameWithAchievements[];
}

export type AchievementFilter = "all" | "complete" | "in_progress" | "none";

export type SortOption =
  | "percentage_desc"
  | "percentage_asc"
  | "chronological"
  | "name_asc"
  | "achievements_desc";
