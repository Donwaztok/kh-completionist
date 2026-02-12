"use client";

import { Card, Chip, Progress } from "@heroui/react";
import clsx from "clsx";
import { motion } from "framer-motion";
import { useMemo } from "react";
import type {
  KHCollectionWithGames,
  SteamPlayerSummary,
} from "@/lib/kingdom-hearts";

const fadeInUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35 },
};

interface DashboardProps {
  collections: KHCollectionWithGames[];
  player: SteamPlayerSummary | null;
}

function StatCard({
  label,
  value,
  subValue,
  icon,
  color = "default",
}: {
  label: string;
  value: string | number;
  subValue?: string;
  icon: string;
  color?: "default" | "success" | "primary" | "warning";
}) {
  const colorClasses = {
    default: "bg-default-100/50 border-default-200",
    success: "bg-success-500/10 border-success-500/30",
    primary: "bg-primary-500/10 border-primary-500/30",
    warning: "bg-warning-500/10 border-warning-500/30",
  };

  return (
    <Card
      className={clsx(
        "border p-2.5 min-h-[70px] flex flex-col justify-between",
        colorClasses[color]
      )}
    >
      <div className="flex items-start justify-between gap-1">
        <span className="text-lg">{icon}</span>
        <span className="text-lg font-bold tabular-nums">{value}</span>
      </div>
      <div>
        <p className="text-xs font-medium text-default-700">{label}</p>
        {subValue && (
          <p className="text-[10px] text-default-500 mt-0.5">{subValue}</p>
        )}
      </div>
    </Card>
  );
}

function CollectionProgressBar({
  collection,
  overallPercent,
}: {
  collection: KHCollectionWithGames;
  overallPercent: number;
}) {
  const gameCount = collection.games.length;
  const completedCount = collection.games.filter((g) => g.isCompleted).length;

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-xs font-medium">{collection.name}</span>
        <span className="text-[10px] text-default-500">
          {completedCount}/{gameCount} • {overallPercent}%
        </span>
      </div>
      <Progress
        value={overallPercent}
        className="max-w-full"
        color={overallPercent === 100 ? "success" : "primary"}
        size="sm"
      />
    </div>
  );
}

function LastUnlockedAchievement({
  gameName,
  achievementName,
  unlockTime,
}: {
  gameName: string;
  achievementName: string;
  unlockTime: number;
}) {
  const date = new Date(unlockTime * 1000);
  const formatted = date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="flex flex-col gap-0 py-1.5 px-2 rounded hover:bg-default-100/50 transition-colors">
      <p className="text-xs font-medium truncate" title={achievementName}>
        {achievementName}
      </p>
      <p className="text-[10px] text-default-500">
        {gameName} • {formatted}
      </p>
    </div>
  );
}

export function Dashboard({ collections, player }: DashboardProps) {
  const allGames = useMemo(
    () => collections.flatMap((c) => c.games),
    [collections]
  );

  const stats = useMemo(() => {
    const totalGames = allGames.length;
    const completedCount = allGames.filter((g) => g.isCompleted).length;
    const inProgressCount = allGames.filter(
      (g) => !g.isCompleted && g.unlockedAchievements > 0
    ).length;
    const notStartedCount = allGames.filter(
      (g) => !g.isCompleted && g.unlockedAchievements === 0
    ).length;
    const totalAchievements = allGames.reduce((a, g) => a + g.totalAchievements, 0);
    const unlockedAchievements = allGames.reduce(
      (a, g) => a + g.unlockedAchievements,
      0
    );
    const overallPercent =
      totalAchievements > 0
        ? Math.round((unlockedAchievements / totalAchievements) * 100)
        : 0;

    return {
      totalGames,
      completedCount,
      inProgressCount,
      notStartedCount,
      totalAchievements,
      unlockedAchievements,
      overallPercent,
    };
  }, [allGames]);

  const collectionStats = useMemo(() => {
    return collections.map((col) => {
      const total = col.games.reduce((a, g) => a + g.totalAchievements, 0);
      const unlocked = col.games.reduce(
        (a, g) => a + g.unlockedAchievements,
        0
      );
      const percent = total > 0 ? Math.round((unlocked / total) * 100) : 0;
      return { collection: col, percent };
    });
  }, [collections]);

  const nextTargets = useMemo(() => {
    return allGames
      .filter((g) => !g.isCompleted && g.percentage > 0)
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 5);
  }, [allGames]);

  const lastUnlocked = useMemo(() => {
    const items: Array<{
      gameName: string;
      achievementName: string;
      unlockTime: number;
    }> = [];
    for (const game of allGames) {
      for (const a of game.achievements) {
        if (a.unlocked && a.unlockTime) {
          items.push({
            gameName: game.name,
            achievementName: a.name,
            unlockTime: a.unlockTime,
          });
        }
      }
    }
    items.sort((a, b) => b.unlockTime - a.unlockTime);
    return items.slice(0, 5);
  }, [allGames]);

  return (
    <motion.aside
      className="w-full lg:w-72 shrink-0 space-y-4 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto"
      initial="initial"
      animate="animate"
      variants={{
        animate: { transition: { staggerChildren: 0.06 } },
      }}
    >
      {/* Player card (if data available) */}
      {player && (
        <motion.div variants={fadeInUp}>
          <Card className="border border-kh-gold/30 bg-kh-blue-light/60 backdrop-blur-sm overflow-hidden">
            <div className="p-3 flex flex-row items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-kh-gold/50 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={player.avatarfull}
                  alt={player.personaname}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-kh font-semibold text-sm truncate">
                  {player.personaname}
                </h3>
                <a
                  href={player.profileurl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-kh-gold hover:underline truncate block"
                >
                  Steam Profile →
                </a>
              </div>
              <Chip
                size="sm"
                className="bg-kh-gold/20 text-kh-gold border-kh-gold/40 shrink-0"
              >
                {stats.overallPercent}%
              </Chip>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Stats - compact column layout */}
      <motion.div className="grid grid-cols-2 gap-2" variants={fadeInUp}>
        <StatCard
          label="Progress"
          value={`${stats.overallPercent}%`}
          subValue={`${stats.unlockedAchievements}/${stats.totalAchievements}`}
          icon="📊"
          color="primary"
        />
        <StatCard
          label="Completed"
          value={stats.completedCount}
          subValue={`of ${stats.totalGames}`}
          icon="🏆"
          color="success"
        />
        <StatCard
          label="In progress"
          value={stats.inProgressCount}
          subValue="games"
          icon="🔄"
        />
        <StatCard
          label="Not started"
          value={stats.notStartedCount}
          subValue="games"
          icon="📭"
        />
      </motion.div>

      {/* Progress by collection */}
      <motion.div variants={fadeInUp}>
        <Card className="border border-divider p-3">
          <h4 className="font-kh font-semibold text-sm mb-3">
            By collection
          </h4>
          <div className="space-y-3">
            {collectionStats.map(({ collection, percent }) => (
              <CollectionProgressBar
                key={collection.name}
                collection={collection}
                overallPercent={percent}
              />
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Next targets */}
      {nextTargets.length > 0 && (
        <motion.div variants={fadeInUp}>
          <Card className="border border-divider p-3">
            <h4 className="font-kh font-semibold text-sm mb-2">
              Next targets
            </h4>
            <div className="space-y-1.5">
              {nextTargets.map((game) => (
                <div
                  key={`${game.appId}-${game.name}`}
                  className="flex items-center justify-between gap-2 py-1.5 px-2 rounded bg-default-50 dark:bg-default-100/20"
                >
                  <span className="text-xs font-medium truncate">
                    {game.name}
                  </span>
                  <span className="text-xs font-bold tabular-nums shrink-0">
                    {game.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Recent achievements */}
      <motion.div variants={fadeInUp}>
        <Card className="border border-divider p-3">
          <h4 className="font-kh font-semibold text-sm mb-2">
            Recent achievements
          </h4>
          {lastUnlocked.length > 0 ? (
            <div className="space-y-0.5 divide-y divide-divider/30 max-h-36 overflow-y-auto">
              {lastUnlocked.map((item, i) => (
                <LastUnlockedAchievement
                  key={`${item.gameName}-${item.achievementName}-${i}`}
                  gameName={item.gameName}
                  achievementName={item.achievementName}
                  unlockTime={item.unlockTime}
                />
              ))}
            </div>
          ) : (
            <p className="text-default-500 text-xs py-2">
              None yet.
            </p>
          )}
        </Card>
      </motion.div>
    </motion.aside>
  );
}
