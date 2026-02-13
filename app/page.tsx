"use client";

import type {
  KHCollectionWithGames,
  KHGameWithAchievements,
  SteamPlayerSummary,
} from "@/lib/kingdom-hearts";

import { Button, Chip, Skeleton } from "@heroui/react";
import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Dashboard } from "@/components/Dashboard";
import { KHGameCard } from "@/components/KHGameCard";
import { SteamSearchForm } from "@/components/SteamSearchForm";

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

const staggerContainer = {
  animate: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

function gameKey(game: KHGameWithAchievements) {
  return `${game.appId}-${game.name}`;
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
  const [player, setPlayer] = useState<SteamPlayerSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const allGames = useMemo(
    () => collections.flatMap((c) => c.games),
    [collections],
  );
  const [selectedTab, setSelectedTab] = useState<string>("");

  useEffect(() => {
    if (allGames.length > 0 && !selectedTab) {
      setSelectedTab(gameKey(allGames[0]));
    }
  }, [allGames, selectedTab]);

  const handleSearch = useCallback(async (steamId: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/kingdom-hearts?steamid=${encodeURIComponent(steamId)}`,
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error fetching achievements");
      }

      setCollections(data.collections ?? []);
      setPlayer(data.player ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setCollections([]);
      setPlayer(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <motion.section
      animate="animate"
      className="flex flex-col gap-8 py-8 md:py-10"
      initial="initial"
      variants={staggerContainer}
    >
      <motion.div
        className="inline-block max-w-xl text-center mx-auto"
        variants={fadeInUp}
      >
        <h1 className="font-kh text-3xl md:text-4xl lg:text-5xl font-bold text-white">
          KH Completionist
        </h1>
      </motion.div>

      <motion.div className="flex justify-center" variants={fadeInUp}>
        <SteamSearchForm isLoading={loading} onSearch={handleSearch} />
      </motion.div>

      {error && (
        <motion.div
          animate="animate"
          className="rounded-lg bg-danger-50 dark:bg-danger-500/10 px-4 py-3 text-danger"
          initial="initial"
          variants={fadeInUp}
        >
          <p className="text-sm font-medium">{error}</p>
        </motion.div>
      )}

      {loading && (
        <motion.div variants={fadeInUp}>
          <GamesListSkeleton />
        </motion.div>
      )}

      {!loading && collections.length > 0 && (
        <motion.div
          animate="animate"
          className="flex flex-col gap-4"
          initial="initial"
          variants={staggerContainer}
        >
          {allGames.length > 0 && (
            <motion.div
              className="flex flex-col gap-1.5 items-start w-full"
              variants={fadeInUp}
            >
              {collections.map((collection) => (
                <div
                  key={collection.name}
                  className="flex flex-row items-center gap-3 p-1.5 rounded-xl bg-default-100 dark:bg-default-100/10 border border-default-200/50 w-full"
                >
                  <span className="text-xs font-semibold text-default-600 dark:text-default-500 uppercase tracking-wider shrink-0 min-w-[5rem]">
                    {collection.name}
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {collection.games.map((game) => {
                      const key = gameKey(game);
                      const isSelected = selectedTab === key;

                      return (
                        <Button
                          key={key}
                          className={`min-h-0 px-2 py-1 font-medium text-sm rounded-lg transition-all ${
                            isSelected
                              ? "bg-kh-gold text-kh-blue font-semibold hover:!bg-kh-gold hover:!text-kh-blue"
                              : "bg-transparent text-default-600 hover:bg-default-100"
                          }`}
                          size="sm"
                          variant="light"
                          onPress={() => setSelectedTab(key)}
                        >
                          <span className="flex items-center gap-2 whitespace-nowrap">
                            <span>{game.name}</span>
                            {game.isCompleted ? (
                              <Chip
                                className={`h-5 min-w-0 px-1.5 text-[10px] shrink-0 ${
                                  isSelected
                                    ? "bg-kh-blue/90 text-kh-gold-light border border-kh-gold/50"
                                    : "bg-kh-silver/25 text-kh-silver border border-kh-silver/40"
                                }`}
                                size="sm"
                                variant="flat"
                              >
                                🏆 100%
                              </Chip>
                            ) : (
                              <span className="tabular-nums text-xs shrink-0 opacity-70">
                                {game.percentage}%
                              </span>
                            )}
                          </span>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <Dashboard collections={collections} player={player} />
            <motion.div className="flex-1 min-w-0" variants={fadeInUp}>
              {allGames.length > 0
                ? allGames
                    .filter((g) => gameKey(g) === selectedTab)
                    .map((game) => (
                      <KHGameCard key={gameKey(game)} game={game} />
                    ))
                : null}
            </motion.div>
          </div>
        </motion.div>
      )}

      {!loading && collections.length === 0 && !error && (
        <motion.p
          animate="animate"
          className="text-default-500 text-center py-8"
          initial="initial"
          variants={fadeInUp}
        >
          Enter your SteamID or vanity URL and click Search to get started.
        </motion.p>
      )}
    </motion.section>
  );
}
