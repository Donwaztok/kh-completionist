import { getGameForAchievement } from "@/config/achievement-mapping";

/**
 * Kingdom Hearts - AppIDs fixos na Steam
 * https://store.steampowered.com/app/2552430 - 1.5+2.5 ReMIX
 * https://store.steampowered.com/app/2552440 - 2.8 Final Chapter Prologue
 * https://store.steampowered.com/app/2552450 - KH3 + Re Mind (DLC)
 *
 * Coleções com sub-jogos individuais (mesmo app, progresso compartilhado).
 */
export const KINGDOM_HEARTS_GAMES = [
  {
    collection: "1.5 + 2.5",
    appId: 2552430,
    games: [
      { name: "Kingdom Hearts Final Mix" },
      { name: "Re:Chain of Memories" },
      { name: "Kingdom Hearts II Final Mix" },
      { name: "358/2 Days (cutscenes)" },
      { name: "Birth by Sleep Final Mix" },
      { name: "Re:Coded (cutscenes)" },
    ],
  },
  {
    collection: "2.8",
    appId: 2552440,
    games: [
      { name: "Dream Drop Distance HD" },
      { name: "0.2 Birth by Sleep – A Fragmentary Passage" },
      { name: "χ Back Cover (filme)" },
    ],
  },
  {
    collection: "KH3",
    appId: 2552450,
    games: [
      { name: "Kingdom Hearts III" },
      { name: "Re Mind (DLC)" },
    ],
  },
] as const;

const MAX_CONCURRENT = 4;

export type KHCollection = (typeof KINGDOM_HEARTS_GAMES)[number];
export type KHGame = KHCollection["games"][number];

export interface KHGameWithAchievements {
  name: string;
  appId: number;
  totalAchievements: number;
  unlockedAchievements: number;
  percentage: number;
  isCompleted: boolean;
  achievements: {
    name: string;
    description: string;
    unlocked: boolean;
    unlockTime?: number;
    icon?: string;
    icongray?: string;
  }[];
}

export interface KHCollectionWithGames {
  name: string;
  games: KHGameWithAchievements[];
}

interface SteamOwnedGame {
  appid: number;
  name: string;
}

interface PlayerAchievement {
  apiname: string;
  achieved: 0 | 1;
  unlocktime?: number;
}

interface SchemaAchievement {
  name: string;
  displayName?: string;
  description?: string;
  icon?: string;
  icongray?: string;
}

function getApiKey(): string {
  const key = process.env.STEAM_API_KEY;
  if (!key) {
    throw new Error("STEAM_API_KEY não configurada");
  }
  return key;
}

async function fetchFromSteam<T>(url: string): Promise<T> {
  const res = await fetch(url, { next: { revalidate: 300 } });
  const data = await res.json();

  if (res.status === 403) {
    throw new Error("Perfil privado ou inacessível");
  }

  return data;
}

async function fetchPlayerAchievements(
  steamId: string,
  appId: number
): Promise<PlayerAchievement[]> {
  const key = getApiKey();
  const url = `https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v1/?key=${key}&steamid=${steamId}&appid=${appId}`;

  const data = await fetchFromSteam<{
    playerstats?: { achievements?: PlayerAchievement[]; error?: string };
  }>(url);

  if (data?.playerstats?.error === "Requested app has no stats") {
    return [];
  }

  return data?.playerstats?.achievements ?? [];
}

async function fetchSchemaForGame(
  appId: number
): Promise<SchemaAchievement[]> {
  const key = getApiKey();
  const url = `https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/?key=${key}&appid=${appId}`;

  const data = await fetchFromSteam<{
    game?: { availableGameStats?: { achievements?: SchemaAchievement[] } };
  }>(url);

  return data?.game?.availableGameStats?.achievements ?? [];
}

async function fetchOwnedGames(steamId: string): Promise<SteamOwnedGame[]> {
  const key = getApiKey();
  const url = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${key}&steamid=${steamId}&include_appinfo=1&include_played_free_games=1`;

  const data = await fetchFromSteam<{
    response?: { games?: SteamOwnedGame[] };
  }>(url);

  return data?.response?.games ?? [];
}

async function processApp(
  steamId: string,
  appId: number,
  ownedAppIds: Set<number>
): Promise<{
  appId: number;
  allAchievements: Array<{
    name: string;
    description: string;
    unlocked: boolean;
    unlockTime?: number;
    icon?: string;
    icongray?: string;
    apiname: string;
  }>;
} | null> {
  if (!ownedAppIds.has(appId)) {
    return null;
  }

  const [playerAchievements, schemaAchievements] = await Promise.all([
    fetchPlayerAchievements(steamId, appId),
    fetchSchemaForGame(appId),
  ]);

  if (schemaAchievements.length === 0) {
    return null;
  }

  const playerAchiMap = new Map(
    playerAchievements.map((a) => [a.apiname, a])
  );

  const allAchievements = schemaAchievements.map((schema) => {
    const playerAchi = playerAchiMap.get(schema.name);
    return {
      name: schema.displayName ?? schema.name,
      description: schema.description ?? "",
      unlocked: playerAchi?.achieved === 1,
      unlockTime: playerAchi?.unlocktime,
      icon: schema.icon,
      icongray: schema.icongray,
      apiname: schema.name,
    };
  });

  return {
    appId,
    allAchievements,
  };
}

function filterAchievementsByGame(
  allAchievements: Array<{
    name: string;
    description: string;
    unlocked: boolean;
    unlockTime?: number;
    icon?: string;
    icongray?: string;
    apiname: string;
  }>,
  appId: number,
  gameName: string
): KHGameWithAchievements["achievements"] {
  return allAchievements
    .filter((a) => {
      const assignedGame = getGameForAchievement(
        appId,
        a.apiname,
        a.name,
        a.description
      );
      return assignedGame === gameName;
    })
    .map(({ apiname, ...rest }) => rest);
}

async function processInBatches<T, R>(
  items: T[],
  fn: (item: T) => Promise<R | null>,
  batchSize: number = MAX_CONCURRENT
): Promise<R[]> {
  const results: R[] = [];

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(fn));
    for (const r of batchResults) {
      if (r !== null) results.push(r);
    }
  }

  return results;
}

export async function fetchKingdomHeartsAchievements(
  steamId: string
): Promise<{ collections: KHCollectionWithGames[] }> {
  const ownedGames = await fetchOwnedGames(steamId);
  const ownedAppIds = new Set(ownedGames.map((g) => g.appid));

  const uniqueAppIds = Array.from(
    new Set(KINGDOM_HEARTS_GAMES.map((col) => col.appId))
  );

  const processedApps = await processInBatches(
    uniqueAppIds,
    (appId) => processApp(steamId, appId, ownedAppIds)
  );

  const processedByAppId = new Map(
    processedApps.map((p) => [p.appId, p])
  );

  const collections: KHCollectionWithGames[] = KINGDOM_HEARTS_GAMES.map(
    (col) => {
      const processed = processedByAppId.get(col.appId);
      if (!processed) {
        return { name: col.collection, games: [] };
      }
      const games: KHGameWithAchievements[] = col.games.map((game) => {
        const achievements = filterAchievementsByGame(
          processed.allAchievements,
          col.appId,
          game.name
        );
        const total = achievements.length;
        const unlocked = achievements.filter((a) => a.unlocked).length;
        const percentage = total > 0 ? Math.round((unlocked / total) * 100) : 0;
        return {
          name: game.name,
          appId: col.appId,
          totalAchievements: total,
          unlockedAchievements: unlocked,
          percentage,
          isCompleted: total > 0 && percentage === 100,
          achievements,
        };
      }).filter((g) => g.totalAchievements > 0);

      return { name: col.collection, games };
    }
  ).filter((col) => col.games.length > 0);

  return { collections };
}
