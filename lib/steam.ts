import type {
  SteamAchievement,
  SteamGameWithAchievements,
} from "@/types/steam";

const STEAM_API_BASE = "https://api.steampowered.com";

function getApiKey(): string {
  const key = process.env.STEAM_API_KEY;
  if (!key) {
    throw new Error("STEAM_API_KEY not configured");
  }
  return key;
}

/**
 * Resolve vanity URL ou valida SteamID64
 * SteamID64 are 17-digit numbers
 */
export async function resolveSteamId(
  input: string
): Promise<string | null> {
  const trimmed = input.trim();

  // If numeric and 17 digits, it's SteamID64
  if (/^\d{17}$/.test(trimmed)) {
    return trimmed;
  }

  const key = getApiKey();
  const url = `${STEAM_API_BASE}/ISteamUser/ResolveVanityURL/v1/?key=${key}&vanityurl=${encodeURIComponent(trimmed)}`;

  const res = await fetch(url, { next: { revalidate: 300 } });
  const data = await res.json();

  if (res.status === 403) {
    throw new Error("Private or inaccessible profile");
  }

  if (data?.response?.steamid) {
    return data.response.steamid;
  }

  return null;
}

interface OwnedGame {
  appid: number;
  name: string;
  playtime_forever?: number;
}

interface OwnedGamesResponse {
  response?: {
    game_count?: number;
    games?: OwnedGame[];
  };
}

export async function fetchOwnedGames(steamId: string): Promise<OwnedGame[]> {
  const key = getApiKey();
  const url = `${STEAM_API_BASE}/IPlayerService/GetOwnedGames/v1/?key=${key}&steamid=${steamId}&include_appinfo=1&include_played_free_games=1`;

  const res = await fetch(url, { next: { revalidate: 300 } });
  const data: OwnedGamesResponse = await res.json();

  if (res.status === 403) {
    throw new Error("Private or inaccessible profile");
  }

  if (!data?.response?.games) {
    return [];
  }

  return data.response.games;
}

interface PlayerAchievement {
  apiname: string;
  achieved: 0 | 1;
  unlocktime?: number;
}

interface PlayerAchievementsResponse {
  playerstats?: {
    achievements?: PlayerAchievement[];
    error?: string;
  };
}

interface SchemaAchievement {
  name: string;
  displayName?: string;
  description?: string;
}

interface SchemaResponse {
  game?: {
    availableGameStats?: {
      achievements?: SchemaAchievement[];
    };
  };
}

async function fetchPlayerAchievements(
  steamId: string,
  appId: number
): Promise<PlayerAchievement[]> {
  const key = getApiKey();
  const url = `${STEAM_API_BASE}/ISteamUserStats/GetPlayerAchievements/v1/?key=${key}&steamid=${steamId}&appid=${appId}`;

  const res = await fetch(url, { next: { revalidate: 300 } });
  const data: PlayerAchievementsResponse = await res.json();

  if (data?.playerstats?.error === "Requested app has no stats") {
    return [];
  }

  return data?.playerstats?.achievements ?? [];
}

async function fetchSchemaForGame(appId: number): Promise<SchemaAchievement[]> {
  const key = getApiKey();
  const url = `${STEAM_API_BASE}/ISteamUserStats/GetSchemaForGame/v2/?key=${key}&appid=${appId}`;

  const res = await fetch(url, { next: { revalidate: 300 } });
  const data: SchemaResponse = await res.json();

  return (
    data?.game?.availableGameStats?.achievements ?? []
  );
}

async function processGame(
  steamId: string,
  game: OwnedGame
): Promise<SteamGameWithAchievements | null> {
  const [playerAchievements, schemaAchievements] = await Promise.all([
    fetchPlayerAchievements(steamId, game.appid),
    fetchSchemaForGame(game.appid),
  ]);

  if (schemaAchievements.length === 0) {
    return null;
  }

  const achievementMap = new Map(
    schemaAchievements.map((a) => [
      a.name,
      {
        name: a.displayName ?? a.name,
        description: a.description ?? "",
      },
    ])
  );

  const playerAchievementMap = new Map(
    playerAchievements.map((a) => [a.apiname, a])
  );

  const achievements: SteamAchievement[] = schemaAchievements.map((schema) => {
    const playerAchi = playerAchievementMap.get(schema.name);
    const meta = achievementMap.get(schema.name) ?? {
      name: schema.name,
      description: "",
    };
    return {
      name: meta.name,
      description: meta.description,
      unlocked: playerAchi?.achieved === 1,
      unlockTime: playerAchi?.unlocktime,
    };
  });

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const total = achievements.length;
  const percentage = total > 0 ? Math.round((unlockedCount / total) * 100) : 0;

  return {
    appId: game.appid,
    name: game.name,
    totalAchievements: total,
    unlockedAchievements: unlockedCount,
    percentage,
    achievements,
  };
}

const MAX_CONCURRENT = 5;

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

export async function fetchAllAchievements(
  steamId: string
): Promise<SteamGameWithAchievements[]> {
  const games = await fetchOwnedGames(steamId);
  const results = await processInBatches(
    games,
    (game) => processGame(steamId, game)
  );

  return results.filter(Boolean);
}
