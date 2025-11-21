import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  processRunCompletion,
  loadProgression,
  getPlayerTitle,
  getXPForLevel,
} from '../utils/playerProgression';

export default function RunCompleteScreen({
  runData,
  isVictory = false,
  onContinue
}) {
  const [progression, setProgression] = useState(null);
  const [rewards, setRewards] = useState(null);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    // Process run completion and get rewards
    const currentProgression = loadProgression();
    const result = processRunCompletion(currentProgression, {
      ...runData,
      victory: isVictory,
    });

    setProgression(result.progression);
    setRewards(result.rewards);

    if (result.rewards.leveledUp) {
      setTimeout(() => setShowLevelUp(true), 1500);
    }

    // Animate rewards appearing
    const steps = [0, 1, 2, 3, 4];
    steps.forEach((step, index) => {
      setTimeout(() => setAnimationStep(step + 1), 300 * (index + 1));
    });
  }, [runData, isVictory]);

  if (!progression || !rewards) {
    return (
      <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
        <div className="w-12 h-12 border-4 border-gaming-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const title = getPlayerTitle(progression.level);
  const xpForNext = getXPForLevel(progression.level + 1);
  const xpProgress = Math.min(progression.currentXP / xpForNext, 1);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-lg w-full"
      >
        {/* Header */}
        <motion.div
          className={`text-center mb-8 ${isVictory ? 'text-yellow-400' : 'text-red-400'}`}
          initial={{ y: -50 }}
          animate={{ y: 0 }}
        >
          <motion.div
            className="text-6xl mb-4"
            animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 0.5 }}
          >
            {isVictory ? '🏆' : '💀'}
          </motion.div>
          <h1 className="text-4xl font-bold">
            {isVictory ? 'VICTORY!' : 'RUN OVER'}
          </h1>
          <p className="text-white/70 mt-2">
            {isVictory
              ? 'Congratulations, Tower Champion!'
              : `You reached floor ${runData.floorsCleared}`
            }
          </p>
        </motion.div>

        {/* Stats Summary */}
        <motion.div
          className="bg-gray-800/80 rounded-xl p-6 border border-gray-700 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: animationStep >= 1 ? 1 : 0, y: animationStep >= 1 ? 0 : 20 }}
        >
          <h3 className="text-lg font-bold text-white mb-4">Run Summary</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Floors Cleared</span>
              <span className="text-white font-bold">{runData.floorsCleared}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Battles Won</span>
              <span className="text-white font-bold">{runData.battlesWon}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Elites Defeated</span>
              <span className="text-purple-400 font-bold">{runData.elitesDefeated}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Bosses Defeated</span>
              <span className="text-red-400 font-bold">{runData.bossesDefeated}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Gold Earned</span>
              <span className="text-yellow-400 font-bold">{runData.goldEarned}</span>
            </div>
          </div>
        </motion.div>

        {/* Rewards */}
        <motion.div
          className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-xl p-6 border border-purple-500/30 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: animationStep >= 2 ? 1 : 0, y: animationStep >= 2 ? 0 : 20 }}
        >
          <h3 className="text-lg font-bold text-purple-300 mb-4">Rewards</h3>
          <div className="space-y-3">
            {/* XP Reward */}
            <motion.div
              className="flex items-center justify-between bg-black/30 rounded-lg p-3"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: animationStep >= 3 ? 0 : -20, opacity: animationStep >= 3 ? 1 : 0 }}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">⭐</span>
                <span className="text-white">Experience</span>
              </div>
              <motion.span
                className="text-xl font-bold text-yellow-400"
                initial={{ scale: 0 }}
                animate={{ scale: animationStep >= 3 ? 1 : 0 }}
                transition={{ type: 'spring', bounce: 0.5 }}
              >
                +{rewards.xpGained} XP
              </motion.span>
            </motion.div>

            {/* Token Reward */}
            <motion.div
              className="flex items-center justify-between bg-black/30 rounded-lg p-3"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: animationStep >= 4 ? 0 : -20, opacity: animationStep >= 4 ? 1 : 0 }}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🪙</span>
                <span className="text-white">Tower Tokens</span>
              </div>
              <motion.span
                className="text-xl font-bold text-amber-400"
                initial={{ scale: 0 }}
                animate={{ scale: animationStep >= 4 ? 1 : 0 }}
                transition={{ type: 'spring', bounce: 0.5 }}
              >
                +{rewards.tokensGained}
              </motion.span>
            </motion.div>

            {/* Permanent Gold */}
            <motion.div
              className="flex items-center justify-between bg-black/30 rounded-lg p-3"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: animationStep >= 5 ? 0 : -20, opacity: animationStep >= 5 ? 1 : 0 }}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">💰</span>
                <span className="text-white">Permanent Gold</span>
              </div>
              <motion.span
                className="text-xl font-bold text-yellow-300"
                initial={{ scale: 0 }}
                animate={{ scale: animationStep >= 5 ? 1 : 0 }}
                transition={{ type: 'spring', bounce: 0.5 }}
              >
                +{rewards.permanentGoldGain}
              </motion.span>
            </motion.div>
          </div>
        </motion.div>

        {/* Player Progress */}
        <motion.div
          className="bg-gray-800/80 rounded-xl p-4 border border-gray-700 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: animationStep >= 5 ? 1 : 0 }}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-xl">
              {title.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-white font-bold">{title.title}</span>
                <span className="text-gray-400">Level {progression.level}</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-yellow-400 to-amber-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${xpProgress * 100}%` }}
                  transition={{ delay: 0.5, duration: 1 }}
                />
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {progression.currentXP} / {xpForNext} XP
              </div>
            </div>
          </div>
        </motion.div>

        {/* Continue Button */}
        <motion.button
          onClick={onContinue}
          className="w-full py-4 bg-gradient-to-r from-gaming-accent to-purple-600 text-white font-bold text-lg rounded-xl hover:opacity-90 transition-opacity"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: animationStep >= 5 ? 1 : 0, y: animationStep >= 5 ? 0 : 20 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Continue
        </motion.button>

        {/* Level Up Animation */}
        <AnimatePresence>
          {showLevelUp && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.5 }}
              className="absolute inset-0 flex items-center justify-center bg-black/70 pointer-events-none"
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
                  Level {rewards.newLevel}
                </p>
                <p className="text-purple-300 mt-1">
                  {getPlayerTitle(rewards.newLevel).title}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
