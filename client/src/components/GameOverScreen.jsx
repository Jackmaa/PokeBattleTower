import React, { useEffect, useRef, useState } from "react";
import { useResetRecoilState, useRecoilValue } from "recoil";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Card } from "./ui";

import { teamState } from "../recoil/atoms/team";
import { floorState } from "../recoil/atoms/floor";
import { battleState } from "../recoil/atoms/battle";
import { gameStartedState, gameViewState } from "../recoil/atoms/game";
import { activePokemonIndexState } from "../recoil/atoms/active";
import { rewardState } from "../recoil/atoms/reward";
import { highlightedStatState } from "../recoil/atoms/highlight";
import { battleLogState } from "../recoil/atoms/battleLog";
import { towerMapState, currentNodeState } from "../recoil/atoms/towerMap";
import { enemyTeamState } from "../recoil/atoms/enemy";
import { currencyState, inventoryState } from "../recoil/atoms/inventory";
import { relicsState } from "../recoil/atoms/relics";
import { saveRunStats } from "../utils/statsTracker";
import { updateMetaProgressAfterRun } from "../utils/metaProgression";
import {
  processRunCompletion,
  loadProgression,
  getPlayerTitle,
  getXPForLevel,
} from "../utils/playerProgression";

export default function GameOverScreen({ isVictory = false }) {
  // Get current values before reset for stats
  const team = useRecoilValue(teamState);
  const floor = useRecoilValue(floorState);
  const currency = useRecoilValue(currencyState);

  const resetTeam = useResetRecoilState(teamState);
  const resetFloor = useResetRecoilState(floorState);
  const resetBattle = useResetRecoilState(battleState);
  const resetGame = useResetRecoilState(gameStartedState);
  const resetGameView = useResetRecoilState(gameViewState);
  const resetActiveIndex = useResetRecoilState(activePokemonIndexState);
  const resetReward = useResetRecoilState(rewardState);
  const resetHighlight = useResetRecoilState(highlightedStatState);
  const resetBattleLog = useResetRecoilState(battleLogState);
  const resetTowerMap = useResetRecoilState(towerMapState);
  const resetCurrentNode = useResetRecoilState(currentNodeState);
  const resetEnemyTeam = useResetRecoilState(enemyTeamState);
  const resetCurrency = useResetRecoilState(currencyState);
  const resetInventory = useResetRecoilState(inventoryState);
  const resetRelics = useResetRecoilState(relicsState);

  const statsSaved = useRef(false);
  const [newUnlocks, setNewUnlocks] = useState({ achievements: [], starters: [] });
  const [progressionRewards, setProgressionRewards] = useState(null);
  const [progression, setProgression] = useState(null);
  const [animationStep, setAnimationStep] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);

  // Save run stats and process rewards when game over screen appears
  useEffect(() => {
    if (!statsSaved.current && team && team.length > 0) {
      const battlesWon = Math.max(0, floor - 1);
      const bossesDefeated = Math.floor(floor / 5); // Boss every 5 floors
      const elitesDefeated = Math.floor(floor / 4); // Rough estimate

      const runData = {
        floor,
        floorsCleared: floor,
        team,
        goldEarned: currency,
        battlesWon,
        bossesDefeated,
        elitesDefeated,
        victory: isVictory,
        legendaryDefeated: isVictory, // Assume legendary defeated on victory
        starter: team[0]?.baseName || team[0]?.name || 'Unknown',
        playtime: 0
      };

      // Save to leaderboard
      saveRunStats(runData);

      // Update meta-progression (achievements, etc.)
      const metaResult = updateMetaProgressAfterRun(runData);

      // Store new unlocks to display
      if (metaResult.newAchievements.length > 0 || metaResult.newStarters.length > 0) {
        setNewUnlocks({
          achievements: metaResult.newAchievements,
          starters: metaResult.newStarters
        });
      }

      // Process player progression (XP, tokens)
      const currentProgression = loadProgression();
      const result = processRunCompletion(currentProgression, {
        floorsCleared: floor,
        battlesWon,
        elitesDefeated,
        bossesDefeated,
        legendaryDefeated: isVictory,
        victory: isVictory,
        goldEarned: currency,
      });

      setProgression(result.progression);
      setProgressionRewards(result.rewards);

      if (result.rewards.leveledUp) {
        setTimeout(() => setShowLevelUp(true), 2000);
        setTimeout(() => setShowLevelUp(false), 4000);
      }

      statsSaved.current = true;
    }

    // Animate rewards appearing
    const steps = [0, 1, 2, 3, 4, 5];
    steps.forEach((step, index) => {
      setTimeout(() => setAnimationStep(step + 1), 400 * (index + 1));
    });
  }, [floor, currency, team, isVictory]);

  const restart = () => {
    // Reset all game states
    resetTeam();
    resetFloor();
    resetBattle();
    resetGame();
    resetGameView();
    resetActiveIndex();
    resetReward();
    resetHighlight();
    resetBattleLog();
    resetTowerMap();
    resetCurrentNode();
    resetEnemyTeam();
    resetCurrency();
    resetInventory();
    resetRelics();
  };

  const title = progression ? getPlayerTitle(progression.level) : null;
  const xpForNext = progression ? getXPForLevel(progression.level + 1) : 100;
  const xpProgress = progression ? Math.min(progression.currentXP / xpForNext, 1) : 0;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="max-w-lg w-full"
        initial={{ scale: 0.5, rotate: isVictory ? 0 : -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", duration: 0.6 }}
      >
        <Card className={`p-6 border-2 ${isVictory ? 'border-yellow-500/50' : 'border-gaming-danger/50'}`}>
          {/* Header Animation */}
          <motion.div
            className="text-center mb-4"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="text-7xl mb-2">{isVictory ? '🏆' : '💀'}</div>
          </motion.div>

          {/* Title */}
          <motion.h2
            className={`text-4xl font-bold text-center mb-2 ${isVictory ? 'text-yellow-400' : 'text-gaming-danger'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {isVictory ? 'VICTORY!' : 'Game Over'}
          </motion.h2>

          <motion.p
            className="text-center text-white/70 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {isVictory ? 'You conquered the Battle Tower!' : `You reached floor ${floor}`}
          </motion.p>

          {/* Run Summary */}
          <motion.div
            className="mb-4 p-3 bg-white/5 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: animationStep >= 1 ? 1 : 0, y: animationStep >= 1 ? 0 : 20 }}
          >
            <div className="grid grid-cols-3 gap-2 text-center text-sm">
              <div>
                <div className="text-white/60">Floor</div>
                <div className="text-xl font-bold text-white">{floor}</div>
              </div>
              <div>
                <div className="text-white/60">Battles</div>
                <div className="text-xl font-bold text-white">{Math.max(0, floor - 1)}</div>
              </div>
              <div>
                <div className="text-white/60">Gold</div>
                <div className="text-xl font-bold text-yellow-400">{currency}</div>
              </div>
            </div>
          </motion.div>

          {/* Progression Rewards */}
          {progressionRewards && (
            <motion.div
              className="mb-4 p-3 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-lg border border-purple-500/30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: animationStep >= 2 ? 1 : 0, y: animationStep >= 2 ? 0 : 20 }}
            >
              <h3 className="text-sm font-bold text-purple-300 mb-2">Rewards</h3>
              <div className="space-y-2">
                {/* XP */}
                <motion.div
                  className="flex items-center justify-between bg-black/30 rounded px-3 py-2"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: animationStep >= 3 ? 0 : -20, opacity: animationStep >= 3 ? 1 : 0 }}
                >
                  <div className="flex items-center gap-2">
                    <span>⭐</span>
                    <span className="text-white text-sm">Experience</span>
                  </div>
                  <span className="font-bold text-yellow-400">+{progressionRewards.xpGained}</span>
                </motion.div>

                {/* Tokens */}
                <motion.div
                  className="flex items-center justify-between bg-black/30 rounded px-3 py-2"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: animationStep >= 4 ? 0 : -20, opacity: animationStep >= 4 ? 1 : 0 }}
                >
                  <div className="flex items-center gap-2">
                    <span>🪙</span>
                    <span className="text-white text-sm">Tower Tokens</span>
                  </div>
                  <span className="font-bold text-amber-400">+{progressionRewards.tokensGained}</span>
                </motion.div>

                {/* Permanent Gold */}
                <motion.div
                  className="flex items-center justify-between bg-black/30 rounded px-3 py-2"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: animationStep >= 5 ? 0 : -20, opacity: animationStep >= 5 ? 1 : 0 }}
                >
                  <div className="flex items-center gap-2">
                    <span>💰</span>
                    <span className="text-white text-sm">Permanent Gold</span>
                  </div>
                  <span className="font-bold text-yellow-300">+{progressionRewards.permanentGoldGain}</span>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Player Progress Bar */}
          {progression && title && (
            <motion.div
              className="mb-4 p-3 bg-gray-800/50 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: animationStep >= 5 ? 1 : 0 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-lg">
                  {title.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-bold text-sm">{title.title}</span>
                    <span className="text-gray-400 text-xs">Lv.{progression.level}</span>
                  </div>
                  <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-yellow-400 to-amber-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${xpProgress * 100}%` }}
                      transition={{ delay: 0.5, duration: 1 }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* New Unlocks */}
          {(newUnlocks.achievements.length > 0 || newUnlocks.starters.length > 0) && (
            <motion.div
              className="mb-4 p-3 bg-green-600/20 border border-green-500/50 rounded-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: animationStep >= 6 ? 1 : 0, scale: animationStep >= 6 ? 1 : 0.9 }}
            >
              <h3 className="text-sm font-bold text-green-400 mb-2">New Unlocks!</h3>
              {newUnlocks.achievements.map(achievement => (
                <div key={achievement.id} className="flex items-center gap-2 text-white text-sm mb-1">
                  <span>{achievement.icon}</span>
                  <span className="font-bold">{achievement.name}</span>
                </div>
              ))}
              {newUnlocks.starters.map(starter => (
                <div key={starter.id} className="flex items-center gap-2 text-white text-sm mb-1">
                  <span>🎁</span>
                  <span className="font-bold">New Starter: {starter.name}</span>
                </div>
              ))}
            </motion.div>
          )}

          {/* Restart Button */}
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: animationStep >= 6 ? 1 : 0, y: animationStep >= 6 ? 0 : 20 }}
          >
            <Button
              variant="primary"
              size="lg"
              onClick={restart}
              className="w-full"
            >
              {isVictory ? '🎮 Play Again' : '🔁 Try Again'}
            </Button>
          </motion.div>
        </Card>
      </motion.div>

      {/* Level Up Animation */}
      <AnimatePresence>
        {showLevelUp && progressionRewards?.leveledUp && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            className="absolute inset-0 flex items-center justify-center bg-black/70 pointer-events-none z-10"
          >
            <div className="text-center">
              <motion.div
                className="text-8xl mb-4"
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{ duration: 0.5 }}
              >
                🎉
              </motion.div>
              <motion.h2
                className="text-4xl font-bold text-yellow-400"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.3 }}
              >
                LEVEL UP!
              </motion.h2>
              <p className="text-2xl text-white mt-2">
                Level {progressionRewards.newLevel}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
