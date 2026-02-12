"use client";

import { Skeleton } from "@heroui/react";
import { useCallback, useMemo, useState } from "react";

import { CollectionCard } from "@/components/CollectionCard";
import { KHFiltersBar } from "@/components/KHFiltersBar";
import { SteamSearchForm } from "@/components/SteamSearchForm";
import { subtitle, title } from "@/components/primitives";
import type { KHCollectionWithGames } from "@/lib/kingdom-hearts";
import type { AchievementFilter, SortOption } from "@/types/steam";

const COLLECTION_ORDER: Record<string, number> = {
  "1.5 + 2.5": 0,
  "2.8": 1,
  KH3: 2,
};

function filterAndSortCollections(
  collections: KHCollectionWithGames[],
  searchQuery: string,
  filter: AchievementFilter,
  sort: SortOption
): KHCollectionWithGames[] {
  let result = collections.map((col) => {
    let games = [...col.games];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      games = games.filter((g) => g.name.toLowerCase().includes(q));
    }

    switch (filter) {
      case "complete":
        games = games.filter((g) => g.percentage === 100);
        break;
      case "in_progress":
        games = games.filter((g) => g.percentage > 0 && g.percentage < 100);
        break;
      case "none":
        games = games.filter((g) => g.unlockedAchievements === 0);
        break;
      default:
        break;
    }

    switch (sort) {
      case "percentage_desc":
        games.sort((a, b) => b.percentage - a.percentage);
        break;
      case "percentage_asc":
        games.sort((a, b) => a.percentage - b.percentage);
        break;
      case "chronological":
        games.sort((a, b) => {
          const aIdx = col.games.findIndex((g) => g.appId === a.appId && g.name === a.name);
          const bIdx = col.games.findIndex((g) => g.appId === b.appId && g.name === b.name);
          return aIdx - bIdx;
        });
        break;
      case "name_asc":
        games.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "achievements_desc":
        games.sort((a, b) => b.unlockedAchievements - a.unlockedAchievements);
        break;
      default:
        break;
    }

    return { ...col, games };
  });

  if (sort === "chronological") {
    result = result.sort(
      (a, b) =>
        (COLLECTION_ORDER[a.name] ?? 99) - (COLLECTION_ORDER[b.name] ?? 99)
    );
  }

  return result;
}

function GamesListSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-lg border border-divider p-6 space-y-4">
          <div className="flex justify-between items-start gap-4">
            <Skeleton className="h-8 w-48 rounded-lg" />
            <Skeleton className="h-6 w-16 rounded-lg" />
          </div>
          <Skeleton className="h-2 w-full rounded-full" />
          <div className="space-y-4">
            {[1, 2].map((j) => (
              <div
                key={j}
                className="rounded-lg border border-divider p-4 space-y-3"
              >
                <div className="flex justify-between items-start gap-4">
                  <Skeleton className="h-6 w-3/4 rounded-lg" />
                  <Skeleton className="h-8 w-16 rounded-lg" />
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const [collections, setCollections] = useState<KHCollectionWithGames[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<AchievementFilter>("all");
  const [sort, setSort] = useState<SortOption>("percentage_desc");

  const filteredCollections = useMemo(
    () => filterAndSortCollections(collections, searchQuery, filter, sort),
    [collections, searchQuery, filter, sort]
  );

  const totalGames = useMemo(
    () => collections.reduce((acc, c) => acc + c.games.length, 0),
    [collections]
  );

  const completedCount = useMemo(
    () =>
      collections.reduce(
        (acc, c) => acc + c.games.filter((g) => g.isCompleted).length,
        0
      ),
    [collections]
  );

  const handleSearch = useCallback(async (steamId: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/kingdom-hearts?steamid=${encodeURIComponent(steamId)}`
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao buscar conquistas");
      }

      setCollections(data.collections ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      setCollections([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const filteredGamesCount = useMemo(
    () =>
      filteredCollections.reduce((acc, c) => acc + c.games.length, 0),
    [filteredCollections]
  );

  return (
    <section className="flex flex-col gap-8 py-8 md:py-10">
      <div className="inline-block max-w-xl text-center">
        <h1 className={title()}>Kingdom Hearts</h1>
        <h1 className={title({ color: "violet" })}>Steam Achievement Tracker</h1>
        <p className={subtitle({ class: "mt-4" })}>
          Insira seu SteamID ou vanity URL para ver suas conquistas da franquia
          Kingdom Hearts, organizadas por coleção.
        </p>
      </div>

      <div className="flex justify-center">
        <SteamSearchForm onSearch={handleSearch} isLoading={loading} />
      </div>

      {error && (
        <div className="rounded-lg bg-danger-50 dark:bg-danger-500/10 px-4 py-3 text-danger">
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {loading && <GamesListSkeleton />}

      {!loading && collections.length > 0 && (
        <>
          <div className="rounded-xl bg-default-100 dark:bg-default-50/50 p-4 md:p-6 border border-divider">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">
                  Progresso geral da franquia
                </h2>
                <p className="text-sm text-default-500 mt-1">
                  {completedCount} de {totalGames} jogos com 100% completo
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold">
                  {Math.round(
                    (collections.reduce(
                      (acc, c) =>
                        acc +
                        c.games.reduce(
                          (a, g) => a + g.unlockedAchievements,
                          0
                        ),
                      0
                    ) /
                      Math.max(
                        1,
                        collections.reduce(
                          (acc, c) =>
                            acc +
                            c.games.reduce((a, g) => a + g.totalAchievements, 0),
                          0
                        )
                      )) *
                      100
                  )}
                  %
                </span>
              </div>
            </div>
          </div>

          <KHFiltersBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filter={filter}
            onFilterChange={setFilter}
            sort={sort}
            onSortChange={setSort}
            totalGames={filteredGamesCount}
          />

          <div className="space-y-6">
            {filteredCollections.map((collection) =>
              collection.games.length > 0 ? (
                <CollectionCard
                  key={collection.name}
                  collection={collection}
                />
              ) : null
            )}

            {filteredCollections.every((c) => c.games.length === 0) && (
              <p className="text-default-500 text-center py-8">
                Nenhum jogo encontrado com os filtros aplicados.
              </p>
            )}
          </div>
        </>
      )}

      {!loading && collections.length === 0 && !error && (
        <p className="text-default-500 text-center py-8">
          Digite seu SteamID ou vanity URL e clique em Buscar para começar.
        </p>
      )}
    </section>
  );
}
