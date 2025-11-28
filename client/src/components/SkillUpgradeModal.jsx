// SkillUpgradeModal.jsx
// Modal for upgrading Pokemon skills/moves (+1 to +5)

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Button } from './ui';
import {
  MAX_SKILL_LEVEL,
  getSkillLevelBonus,
  getSkillLevelDisplay,
  getSkillLevelColor,
  levelUpSkill,
} from '../utils/moves';
import typeColors from '../utils/typeColors';
import FullScreenModal from './modals/FullScreenModal';

/**
 * Single move upgrade card
 */
function MoveUpgradeCard({ move, moveIndex, onUpgrade, disabled }) {
  const level = move.skillLevel || 0;
  const isMaxLevel = level >= MAX_SKILL_LEVEL;
  const nextBonus = getSkillLevelBonus(level + 1);
  const currentBonus = getSkillLevelBonus(level);
  const color = getSkillLevelColor(level) || typeColors[move.type] || '#888';
  const nextColor = getSkillLevelColor(level + 1);

  return (
    <motion.div
      className={`relative p-4 rounded-xl border-2 transition-all ${
        isMaxLevel
          ? 'border-yellow-500/50 bg-yellow-500/10'
          : 'border-white/10 bg-white/5 hover:border-white/30'
      }`}
      whileHover={!isMaxLevel && !disabled ? { scale: 1.02 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Move Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className="px-2 py-0.5 rounded text-xs font-bold uppercase"
            style={{ backgroundColor: typeColors[move.type] || '#888', color: 'white' }}
          >
            {move.type}
          </div>
          <h3 className="text-lg font-bold text-white">{move.name}</h3>
          {level > 0 && (
            <span
              className="text-sm font-bold px-1.5 py-0.5 rounded"
              style={{ backgroundColor: `${color}30`, color }}
            >
              {getSkillLevelDisplay(level)}
            </span>
          )}
        </div>
        <div className="text-sm text-white/50">
          {move.category}
        </div>
      </div>

      {/* Current Stats */}
      <div className="grid grid-cols-3 gap-3 mb-3 text-sm">
        <div className="text-center p-2 bg-black/30 rounded-lg">
          <div className="text-white/50 text-xs">Power</div>
          <div className="text-white font-bold">
            {move.power || '-'}
            {level > 0 && move.power > 0 && (
              <span className="text-green-400 text-xs ml-1">(+{currentBonus.power})</span>
            )}
          </div>
        </div>
        <div className="text-center p-2 bg-black/30 rounded-lg">
          <div className="text-white/50 text-xs">Accuracy</div>
          <div className="text-white font-bold">
            {move.accuracy}%
            {level > 0 && (
              <span className="text-green-400 text-xs ml-1">(+{currentBonus.accuracy})</span>
            )}
          </div>
        </div>
        <div className="text-center p-2 bg-black/30 rounded-lg">
          <div className="text-white/50 text-xs">PP</div>
          <div className="text-white font-bold">
            {move.pp}/{move.maxPP}
            {level > 0 && (
              <span className="text-green-400 text-xs ml-1">(+{currentBonus.pp})</span>
            )}
          </div>
        </div>
      </div>

      {/* Effect if any */}
      {move.effect && (
        <div className="text-xs text-white/60 mb-3 p-2 bg-black/20 rounded">
          Effect: {move.effect.type}
          {move.effect.chance && (
            <span>
              {' '}({move.effect.chance}% chance)
              {level > 0 && move.effect._baseChance && (
                <span className="text-green-400"> +{currentBonus.effectChance}%</span>
              )}
            </span>
          )}
        </div>
      )}

      {/* Upgrade Preview */}
      {!isMaxLevel && (
        <div className="mb-3 p-3 rounded-lg border border-dashed border-white/20 bg-white/5">
          <div className="text-xs text-white/50 mb-2 flex items-center gap-2">
            <span>Next Level:</span>
            <span
              className="font-bold px-1.5 py-0.5 rounded"
              style={{ backgroundColor: `${nextColor}30`, color: nextColor }}
            >
              {getSkillLevelDisplay(level + 1)}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            {move.power > 0 && (
              <div className="text-green-400">+{nextBonus.power - currentBonus.power} Power</div>
            )}
            <div className="text-green-400">+{nextBonus.accuracy - currentBonus.accuracy}% Acc</div>
            <div className="text-green-400">+{nextBonus.pp - currentBonus.pp} PP</div>
            {move.effect?.chance && (
              <div className="text-green-400 col-span-3">+{nextBonus.effectChance - currentBonus.effectChance}% Effect</div>
            )}
          </div>
        </div>
      )}

      {/* Upgrade Button or Max Level Badge */}
      {isMaxLevel ? (
        <div className="flex items-center justify-center gap-2 py-2 text-yellow-400 font-bold">
          <span>MAX LEVEL</span>
        </div>
      ) : (
        <motion.button
          className="w-full py-2 rounded-lg font-bold text-white transition-all"
          style={{
            background: `linear-gradient(135deg, ${nextColor || '#3b82f6'}, ${nextColor || '#3b82f6'}80)`,
          }}
          onClick={() => onUpgrade(moveIndex)}
          disabled={disabled}
          whileHover={{ scale: 1.02, boxShadow: `0 0 20px ${nextColor}40` }}
          whileTap={{ scale: 0.98 }}
        >
          Upgrade to {getSkillLevelDisplay(level + 1)}
        </motion.button>
      )}

      {/* Level progress dots */}
      <div className="flex justify-center gap-1 mt-3">
        {[...Array(MAX_SKILL_LEVEL)].map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all ${
              i < level
                ? 'scale-100'
                : 'scale-75 opacity-30'
            }`}
            style={{
              backgroundColor: i < level ? getSkillLevelColor(i + 1) : '#666',
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

/**
 * Main Skill Upgrade Modal
 */
export default function SkillUpgradeModal({
  isOpen,
  onClose,
  pokemon,
  onUpgrade,
  availableUpgrades = 1, // Number of upgrades the player can apply
}) {
  const [upgradesUsed, setUpgradesUsed] = useState(0);

  if (!isOpen || !pokemon) return null;

  const handleUpgrade = (moveIndex) => {
    if (upgradesUsed >= availableUpgrades) return;

    const result = levelUpSkill(pokemon, moveIndex);
    if (result.success) {
      onUpgrade(result.pokemon, moveIndex, result.newLevel);
      setUpgradesUsed(prev => prev + 1);
    }
  };

  const remainingUpgrades = availableUpgrades - upgradesUsed;

  return (
    <FullScreenModal
      isOpen={isOpen}
      onClose={onClose}
      borderColor="purple-500"
      closeOnBackdrop={true}
      showCloseButton={false}
      maxWidth="2xl"
    >
      <Card className="border-none p-0 bg-gradient-to-b from-gray-900 to-black rounded-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <span className="text-3xl">⚡</span>
                  Skill Upgrade
                </h2>
                <p className="text-white/50 text-sm mt-1">
                  Enhance {pokemon.name}'s moves
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-white/50">Upgrades Available</div>
                <div className="text-2xl font-bold text-purple-400">{remainingUpgrades}</div>
              </div>
            </div>

            {/* Pokemon Info */}
            <div className="flex items-center gap-4 mb-6 p-4 bg-white/5 rounded-xl">
              <img
                src={pokemon.sprite}
                alt={pokemon.name}
                className="w-20 h-20 pixelated"
              />
              <div>
                <h3 className="text-xl font-bold text-white">{pokemon.name}</h3>
                <div className="flex gap-2 mt-1">
                  {pokemon.types?.map(type => (
                    <span
                      key={type}
                      className="px-2 py-0.5 rounded text-xs font-bold uppercase"
                      style={{ backgroundColor: typeColors[type] || '#888', color: 'white' }}
                    >
                      {type}
                    </span>
                  ))}
                </div>
                <div className="text-sm text-white/50 mt-1">Lv. {pokemon.level}</div>
              </div>
            </div>

            {/* Moves Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {pokemon.moves?.map((move, index) => (
                <MoveUpgradeCard
                  key={move.id || index}
                  move={move}
                  moveIndex={index}
                  onUpgrade={handleUpgrade}
                  disabled={remainingUpgrades <= 0}
                />
              ))}
            </div>

            {/* Info text */}
            <div className="text-center text-sm text-white/40 mb-4">
              Each upgrade increases Power (+8), Accuracy (+2%), PP (+1), and Effect Chance (+5%)
            </div>

            {/* Close Button */}
            <div className="flex justify-center">
              <Button
                onClick={onClose}
                className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg"
              >
                {remainingUpgrades > 0 ? 'Done' : 'Close'}
              </Button>
            </div>
      </Card>
    </FullScreenModal>
  );
}

/**
 * Compact skill level indicator for move displays
 */
export function SkillLevelBadge({ level, size = 'sm' }) {
  if (!level || level <= 0) return null;

  const color = getSkillLevelColor(level);
  const sizeClasses = {
    sm: 'text-xs px-1 py-0.5',
    md: 'text-sm px-1.5 py-0.5',
    lg: 'text-base px-2 py-1',
  };

  return (
    <motion.span
      className={`font-bold rounded ${sizeClasses[size]}`}
      style={{
        backgroundColor: `${color}30`,
        color,
        boxShadow: level >= 4 ? `0 0 8px ${color}40` : 'none',
      }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring' }}
    >
      {getSkillLevelDisplay(level)}
      {level >= MAX_SKILL_LEVEL && ' MAX'}
    </motion.span>
  );
}
