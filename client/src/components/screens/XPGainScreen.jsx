// XPGainScreen.jsx
// Display XP gains after battle with animated progression bars

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Card } from '../ui';
import { getXPToNextLevel } from '../../utils/pokemonLeveling';

// Stat name formatting
const formatStatName = (stat) => {
  const names = {
    hp: 'HP',
    attack: 'Attack',
    defense: 'Defense',
    special_attack: 'Sp. Atk',
    special_defense: 'Sp. Def',
    speed: 'Speed',
  };
  return names[stat] || stat;
};

// Individual Pokemon XP Card
function PokemonXPCard({ pokemon, originalPokemon, xpGained, levelUpInfo, delay }) {
  const [showProgress, setShowProgress] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);

  // Calculate XP progress
  const originalXP = originalPokemon?.xp || 0;
  const originalLevel = originalPokemon?.level || 1;
  const newXP = pokemon.xp || 0;
  const newLevel = pokemon.level || 1;

  const originalProgress = getXPToNextLevel(originalLevel, originalXP);
  const newProgress = getXPToNextLevel(newLevel, newXP);

  const didLevelUp = levelUpInfo !== null;

  // Trigger animations with delay
  useEffect(() => {
    const timer1 = setTimeout(() => setShowProgress(true), delay);
    const timer2 = setTimeout(() => {
      if (didLevelUp) setShowLevelUp(true);
    }, delay + 800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [delay, didLevelUp]);

  return (
    <motion.div
      className="bg-gaming-dark/80 rounded-lg p-4 border border-white/10"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: delay / 1000 }}
    >
      <div className="flex items-center gap-4">
        {/* Pokemon Sprite */}
        <div className="relative">
          <img
            src={pokemon.sprite}
            alt={pokemon.name}
            className="w-16 h-16 pixelated"
          />
          {didLevelUp && showLevelUp && (
            <motion.div
              className="absolute -top-2 -right-2 bg-yellow-500 text-black px-2 py-0.5 rounded-full text-xs font-bold"
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 500 }}
            >
              LVL UP!
            </motion.div>
          )}
        </div>

        {/* Pokemon Info & XP Bar */}
        <div className="flex-1">
          {/* Name and Level */}
          <div className="flex justify-between items-center mb-1">
            <span className="font-bold text-white">{pokemon.name}</span>
            <div className="flex items-center gap-2">
              {didLevelUp ? (
                <motion.div
                  className="flex items-center gap-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: (delay + 500) / 1000 }}
                >
                  <span className="text-white/50">Lv.{originalLevel}</span>
                  <motion.span
                    className="text-yellow-400"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: 2, duration: 0.3 }}
                  >
                    →
                  </motion.span>
                  <span className="text-yellow-400 font-bold">Lv.{newLevel}</span>
                </motion.div>
              ) : (
                <span className="text-white/70">Lv.{newLevel}</span>
              )}
            </div>
          </div>

          {/* XP Bar */}
          <div className="relative h-4 bg-black/50 rounded-full overflow-hidden mb-1">
            {/* Original XP (gray) */}
            <div
              className="absolute inset-y-0 left-0 bg-gray-600 rounded-full"
              style={{ width: `${didLevelUp ? 100 : originalProgress.progress * 100}%` }}
            />

            {/* New XP (animated) */}
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                background: didLevelUp
                  ? 'linear-gradient(90deg, #fbbf24, #f59e0b)'
                  : 'linear-gradient(90deg, #3b82f6, #2563eb)',
              }}
              initial={{ width: didLevelUp ? '100%' : `${originalProgress.progress * 100}%` }}
              animate={{
                width: showProgress
                  ? `${newProgress.progress * 100}%`
                  : didLevelUp ? '100%' : `${originalProgress.progress * 100}%`,
              }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />

            {/* XP Text */}
            <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white drop-shadow-lg">
              {newProgress.xpInLevel} / {newProgress.xpNeeded}
            </div>
          </div>

          {/* XP Gained */}
          <motion.div
            className="text-right text-sm"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (delay + 200) / 1000 }}
          >
            <span className="text-green-400 font-bold">+{xpGained} XP</span>
          </motion.div>
        </div>
      </div>

      {/* Level Up Stats */}
      <AnimatePresence>
        {didLevelUp && showLevelUp && levelUpInfo.statGains && (
          <motion.div
            className="mt-3 pt-3 border-t border-white/10"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="text-xs text-yellow-400 font-bold mb-2">Stat Increases:</div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {Object.entries(levelUpInfo.statGains).map(([stat, gain]) => (
                gain > 0 && (
                  <motion.div
                    key={stat}
                    className="flex justify-between bg-yellow-500/10 px-2 py-1 rounded"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <span className="text-white/70">{formatStatName(stat)}</span>
                    <span className="text-green-400 font-bold">+{gain}</span>
                  </motion.div>
                )
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function XPGainScreen({ xpResult, originalTeam, onComplete }) {
  const [canContinue, setCanContinue] = useState(false);

  // Enable continue button after animations
  useEffect(() => {
    const totalDelay = (originalTeam.length * 200) + 1500;
    const timer = setTimeout(() => setCanContinue(true), totalDelay);
    return () => clearTimeout(timer);
  }, [originalTeam.length]);

  if (!xpResult || !originalTeam) return null;

  const { totalXP, xpPerPokemon, levelUps, updatedTeam, pendingMoveLearn } = xpResult;

  // Create a map of level-ups by pokemon name for easy lookup
  const levelUpMap = {};
  levelUps?.forEach(lu => {
    levelUpMap[lu.name] = lu;
  });

  return (
    <motion.div
      className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="max-w-2xl w-full"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <Card className="p-6 border-2 border-blue-500/50">
          {/* Header */}
          <motion.div
            className="text-center mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <motion.div
              className="text-5xl mb-2"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{ duration: 1, repeat: 1 }}
            >
              ⭐
            </motion.div>
            <h2 className="text-2xl font-bold text-white mb-1">Victory!</h2>
            <p className="text-blue-400">
              Your team gained <span className="font-bold text-yellow-400">{totalXP} XP</span>
            </p>
          </motion.div>

          {/* Pokemon XP Cards */}
          <div className="space-y-3 mb-6 max-h-[50vh] overflow-y-auto pr-2">
            {updatedTeam.map((pokemon, index) => {
              const original = originalTeam[index];
              const levelUp = levelUpMap[pokemon.name] || null;

              return (
                <PokemonXPCard
                  key={pokemon.name + index}
                  pokemon={pokemon}
                  originalPokemon={original}
                  xpGained={xpPerPokemon}
                  levelUpInfo={levelUp}
                  delay={index * 200}
                />
              );
            })}
          </div>

          {/* Pending Move Learn Indicator */}
          {pendingMoveLearn && pendingMoveLearn.length > 0 && (
            <motion.div
              className="bg-purple-500/20 border border-purple-500/50 rounded-lg p-3 mb-4 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <span className="text-purple-300">
                📚 {pendingMoveLearn.length} Pokemon want{pendingMoveLearn.length > 1 ? '' : 's'} to learn a new move!
              </span>
            </motion.div>
          )}

          {/* Continue Button */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: canContinue ? 1 : 0.5 }}
          >
            <Button
              onClick={onComplete}
              disabled={!canContinue}
              className={`px-8 py-3 text-lg ${
                canContinue
                  ? 'bg-blue-600 hover:bg-blue-500'
                  : 'bg-gray-600 cursor-not-allowed'
              }`}
            >
              {canContinue ? 'Continue to Rewards →' : 'Loading...'}
            </Button>
          </motion.div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
