"use client";

import { Button, Skeleton } from "@heroui/react";
import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";

import { KHGameCard } from "@/components/KHGameCard";
import { SteamSearchForm } from "@/components/SteamSearchForm";
import { subtitle, title } from "@/components/primitives";
import type { KHCollectionWithGames, KHGameWithAchievements } from "@/lib/kingdom-hearts";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const allGames = useMemo(
    () => collections.flatMap((c) => c.games),
    [collections]
  );
  const [selectedTab, setSelectedTab] = useState<string>("");

  useEffect(() => {
    if (allGames.length > 0 && !selectedTab) {
      setSelectedTab(gameKey(allGames[0]));
    }
  }, [allGames, selectedTab]);

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

  return (
    <motion.section
      className="flex flex-col gap-8 py-8 md:py-10"
      initial="initial"
      animate="animate"
      variants={staggerContainer}
    >
      <motion.div
        className="inline-block max-w-xl text-center mx-auto"
        variants={fadeInUp}
      >
        <h1 className="font-kh text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-1">
          Kingdom Hearts
        </h1>
        <h2 className={`${title({ color: "violet", size: "sm" })} font-kh`}>
          Steam Achievement Tracker
        </h2>
        <p className={subtitle({ class: "mt-4 mx-auto" })}>
          Insira seu SteamID ou vanity URL para ver suas conquistas da franquia
          Kingdom Hearts, organizadas por jogo.
        </p>
      </motion.div>

      <motion.div
        className="flex justify-center"
        variants={fadeInUp}
      >
        <SteamSearchForm onSearch={handleSearch} isLoading={loading} />
      </motion.div>

      {error && (
        <motion.div
          className="rounded-lg bg-danger-50 dark:bg-danger-500/10 px-4 py-3 text-danger"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
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
          className="space-y-6"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <motion.div
            className="rounded-xl bg-kh-blue-light/50 backdrop-blur-sm p-4 md:p-6 border border-kh-gold/20 shadow-kh-glow-sm"
            variants={fadeInUp}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-kh text-lg font-semibold text-white">
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
                        c.games.reduce((a, g) => a + g.unlockedAchievements, 0),
                      0
                    ) /
                      Math.max(
                        1,
                        collections.reduce(
                          (acc, c) =>
                            acc +
                            c.games.reduce(
                              (a, g) => a + g.totalAchievements,
                              0
                            ),
                          0
                        )
                      )) *
                    100
                  )}
                  %
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div className="space-y-6" variants={fadeInUp}>
            {allGames.length > 0 ? (
              <>
                <div className="flex flex-col gap-1 items-start">
                  {collections.map((collection) => (
                    <div
                      key={collection.name}
                      className="flex flex-row items-center gap-3 p-1.5 rounded-xl bg-default-100 dark:bg-default-100/10 border border-default-200/50 w-fit max-w-full"
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
                              size="sm"
                              variant="light"
                              className={`min-h-0 px-2 py-1 font-medium text-sm rounded-lg transition-all ${isSelected
                                ? "bg-kh-gold text-kh-blue font-semibold"
                                : "bg-transparent text-default-600 hover:bg-default-100"
                                }`}
                              onPress={() => setSelectedTab(key)}
                            >
                              <span className="flex items-center gap-2">
                                <span className="truncate max-w-[180px]">
                                  {game.name}
                                </span>
                                <span
                                  className={`tabular-nums text-xs shrink-0 ${game.isCompleted ? "text-success" : "opacity-70"
                                    }`}
                                >
                                  {game.percentage}%
                                </span>
                              </span>
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-2">
                  {allGames
                    .filter((g) => gameKey(g) === selectedTab)
                    .map((game) => (
                      <KHGameCard key={gameKey(game)} game={game} />
                    ))}
                </div>
              </>
            ) : null}
          </motion.div>
        </motion.div>
      )}

      {!loading && collections.length === 0 && !error && (
        <motion.p
          className="text-default-500 text-center py-8"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          Digite seu SteamID ou vanity URL e clique em Buscar para começar.
        </motion.p>
      )}
    </motion.section>
  );
}
