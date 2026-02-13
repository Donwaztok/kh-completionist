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

/** Classe para garantir visibilidade do Skeleton HeroUI em dark mode */
const SKELETON_CLASS = "!bg-default-300";

function GamesListSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {/* Barra de tabs das collections + jogos */}
      <div className="flex flex-col gap-1.5 items-start w-full">
        <div className="flex flex-row items-center gap-3 p-1.5 rounded-xl bg-default-100 dark:bg-default-100/10 border border-default-200/50 w-full">
          <Skeleton className={`h-3.5 w-16 rounded-md shrink-0 ${SKELETON_CLASS}`} />
          <div className="flex flex-wrap gap-1">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className={`h-8 w-24 rounded-lg ${SKELETON_CLASS}`} />
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Dashboard sidebar */}
        <aside className="w-full lg:w-72 shrink-0 space-y-4">
          {/* Player card skeleton */}
          <div className="rounded-xl border border-kh-gold/30 bg-kh-blue-light/20 overflow-hidden">
            <div className="p-3 flex flex-row items-center gap-3">
              <Skeleton className={`h-12 w-12 rounded-full shrink-0 ${SKELETON_CLASS}`} />
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className={`h-4 w-32 rounded-md ${SKELETON_CLASS}`} />
                <Skeleton className={`h-3 w-24 rounded-md ${SKELETON_CLASS}`} />
              </div>
              <Skeleton className={`h-6 w-12 rounded-lg shrink-0 ${SKELETON_CLASS}`} />
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-lg border p-2.5 min-h-[70px] flex flex-col justify-between bg-default-100/50"
              >
                <div className="flex items-start justify-between gap-1">
                  <Skeleton className={`h-5 w-5 rounded ${SKELETON_CLASS}`} />
                  <Skeleton className={`h-5 w-10 rounded ${SKELETON_CLASS}`} />
                </div>
                <div className="space-y-1">
                  <Skeleton className={`h-3 w-16 rounded ${SKELETON_CLASS}`} />
                  <Skeleton className={`h-2.5 w-20 rounded ${SKELETON_CLASS}`} />
                </div>
              </div>
            ))}
          </div>

          {/* By collection */}
          <div className="rounded-xl border border-divider p-3">
            <Skeleton className={`h-4 w-24 rounded mb-3 ${SKELETON_CLASS}`} />
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between">
                    <Skeleton className={`h-3 w-20 rounded ${SKELETON_CLASS}`} />
                    <Skeleton className={`h-3 w-12 rounded ${SKELETON_CLASS}`} />
                  </div>
                  <Skeleton className={`h-1.5 w-full rounded-full ${SKELETON_CLASS}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Next targets */}
          <div className="rounded-xl border border-divider p-3">
            <Skeleton className={`h-4 w-28 rounded mb-2 ${SKELETON_CLASS}`} />
            <div className="space-y-1.5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between py-1.5 px-2 rounded bg-default-50 dark:bg-default-100/20">
                  <Skeleton className={`h-3 w-24 rounded ${SKELETON_CLASS}`} />
                  <Skeleton className={`h-3 w-8 rounded ${SKELETON_CLASS}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Recent achievements */}
          <div className="rounded-xl border border-divider p-3">
            <Skeleton className={`h-4 w-36 rounded mb-2 ${SKELETON_CLASS}`} />
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="py-1.5 px-2 space-y-1">
                  <Skeleton className={`h-3 w-full rounded ${SKELETON_CLASS}`} />
                  <Skeleton className={`h-2.5 w-32 rounded ${SKELETON_CLASS}`} />
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* KHGameCard principal */}
        <div className="flex-1 min-w-0">
          <div className="rounded-xl border border-kh-gold/20 bg-kh-blue-light/20 backdrop-blur-sm overflow-hidden">
            <div className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className={`h-5 w-40 rounded-lg ${SKELETON_CLASS}`} />
                    <Skeleton className={`h-6 w-20 rounded-full ${SKELETON_CLASS}`} />
                  </div>
                  <Skeleton className={`h-4 w-32 rounded ${SKELETON_CLASS}`} />
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <Skeleton className={`h-8 w-14 rounded ${SKELETON_CLASS}`} />
                  <Skeleton className={`h-2 w-28 sm:w-36 rounded-full ${SKELETON_CLASS}`} />
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-divider">
                <div className="flex gap-2 mb-3">
                  <Skeleton className={`h-9 w-[180px] rounded-lg ${SKELETON_CLASS}`} />
                  <Skeleton className={`h-9 w-[180px] rounded-lg ${SKELETON_CLASS}`} />
                </div>
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="flex items-center gap-3 py-2">
                      <Skeleton className={`h-8 w-8 rounded shrink-0 ${SKELETON_CLASS}`} />
                      <div className="flex-1 space-y-1 min-w-0">
                        <Skeleton className={`h-4 w-full max-w-[80%] rounded ${SKELETON_CLASS}`} />
                        <Skeleton className={`h-3 w-20 rounded ${SKELETON_CLASS}`} />
                      </div>
                      <Skeleton className={`h-5 w-8 rounded shrink-0 ${SKELETON_CLASS}`} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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

      <section
        aria-label="About KH Completionist"
        className="mt-12 pt-8 border-t border-divider max-w-2xl mx-auto space-y-4 text-default-600 dark:text-default-500 text-sm"
      >
        <h2 className="text-lg font-semibold text-foreground">
          About Kingdom Hearts Steam Achievement Tracker
        </h2>
        <p>
          KH Completionist is a Kingdom Hearts Steam achievement tracker that
          helps you reach 100% completion across the entire saga. Unlike the
          Steam client, which groups achievements by collection (1.5+2.5, 2.8,
          KH3), this tool separates achievements by individual game.
        </p>
        <h3 className="text-base font-medium text-foreground">
          Track Each Game Individually
        </h3>
        <p>
          Steam bundles multiple games into single collections. KH Completionist
          breaks down your KH1 Final Mix achievements, KH2 Final Mix
          achievements, KH3 achievements, and KH3 ReMind DLC achievements so you
          can complete each title individually. Pursue Kingdom Hearts 100%
          completion game by game.
        </p>
        <h3 className="text-base font-medium text-foreground">
          Games Included
        </h3>
        <p>
          The tracker covers all Kingdom Hearts titles on Steam: KH1 Final Mix,
          KH2 Final Mix, Birth by Sleep, Dream Drop Distance, and KH3 with its
          ReMind DLC. Enter your SteamID to see your Kingdom Hearts Steam
          achievements and track progress toward full completion.
        </p>
      </section>
    </motion.section>
  );
}
