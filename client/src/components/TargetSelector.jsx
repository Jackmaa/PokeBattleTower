// 📁 TargetSelector.jsx
// Target selection UI for NvM combat

import { motion, AnimatePresence } from 'framer-motion';
import { TARGET_TYPES } from '../utils/moves';

/**
 * Single target option
 */
function TargetOption({ target, isSelected, onClick, isEnemy }) {
  const hpPercent = Math.round((target.currentHP / target.maxHP) * 100);

  const getHpColor = () => {
    if (hpPercent > 50) return 'bg-green-500';
    if (hpPercent > 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <motion.button
      className={`relative flex flex-col items-center p-2 rounded-lg border-2 transition-all ${
        isSelected
          ? 'border-yellow-400 bg-yellow-400/20 scale-105'
          : isEnemy
            ? 'border-red-500/50 bg-red-900/20 hover:border-red-400'
            : 'border-blue-500/50 bg-blue-900/20 hover:border-blue-400'
      }`}
      onClick={onClick}
      whileHover={{ scale: isSelected ? 1.05 : 1.08 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Target indicator */}
      {isSelected && (
        <motion.div
          className="absolute -top-2 left-1/2 -translate-x-1/2"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <span className="text-yellow-400 text-lg">🎯</span>
        </motion.div>
      )}

      {/* Portrait */}
      <div className={`w-14 h-14 rounded-lg overflow-hidden border ${
        isEnemy ? 'border-red-600' : 'border-blue-600'
      }`}>
        <img
          src={target.pokemon.sprite}
          alt={target.pokemon.name}
          className={`w-full h-full object-contain ${isEnemy ? 'scale-x-[-1]' : ''}`}
        />
      </div>

      {/* HP bar */}
      <div className="w-14 h-1.5 bg-gray-700 rounded-full mt-1 overflow-hidden">
        <motion.div
          className={`h-full ${getHpColor()}`}
          initial={{ width: 0 }}
          animate={{ width: `${hpPercent}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Name and HP text */}
      <p className="text-[10px] text-white/80 mt-0.5 capitalize truncate max-w-14">
        {target.pokemon.name.split(' ')[0]}
      </p>
      <p className="text-[9px] text-white/50">
        {target.currentHP}/{target.maxHP}
      </p>

      {/* Status icon */}
      {target.status && (
        <div className="absolute top-1 right-1 text-sm">
          {target.status === 'paralyzed' && '⚡'}
          {target.status === 'burned' && '🔥'}
          {target.status === 'poisoned' && '☠️'}
          {target.status === 'frozen' && '❄️'}
          {target.status === 'asleep' && '💤'}
        </div>
      )}
    </motion.button>
  );
}

/**
 * Main target selector component
 */
export default function TargetSelector({
  move,
  attacker,
  validTargets = [],
  selectedTargetId,
  onSelectTarget,
  onConfirm,
  onCancel,
  battleState,
}) {
  if (!move) return null;

  const targetType = move.target || TARGET_TYPES.SINGLE_ENEMY;

  // For self-targeting moves, auto-select
  const isSelfTarget = targetType === TARGET_TYPES.SELF;
  const isAOE = targetType === TARGET_TYPES.ALL_ENEMIES ||
                targetType === TARGET_TYPES.ALL_ALLIES ||
                targetType === TARGET_TYPES.ALL_OTHER;

  // Get display info based on target type
  const getTargetTypeLabel = () => {
    switch (targetType) {
      case TARGET_TYPES.SINGLE_ENEMY:
        return 'Select an enemy target';
      case TARGET_TYPES.ALL_ENEMIES:
        return 'Hits all enemies';
      case TARGET_TYPES.SINGLE_ALLY:
        return 'Select an ally';
      case TARGET_TYPES.ALL_ALLIES:
        return 'Affects all allies';
      case TARGET_TYPES.SELF:
        return 'Targets self';
      case TARGET_TYPES.RANDOM_ENEMY:
        return 'Hits random enemy';
      case TARGET_TYPES.ALL_OTHER:
        return 'Hits all other combatants';
      default:
        return 'Select target';
    }
  };

  // Separate enemies and allies for display
  const enemies = validTargets.filter(t => t.isEnemy !== attacker.isEnemy);
  const allies = validTargets.filter(t => t.isEnemy === attacker.isEnemy && t.id !== attacker.id);

  return (
    <motion.div
      className="glass-card p-4 border-2 border-yellow-500/50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-bold text-yellow-400">
            {move.name}
          </h3>
          <p className="text-xs text-white/60">
            {getTargetTypeLabel()}
          </p>
        </div>

        {/* Move type badge */}
        <div className={`px-2 py-0.5 rounded text-xs font-bold capitalize bg-${move.type || 'normal'}-500/30 text-${move.type || 'normal'}-300`}>
          {move.type}
        </div>
      </div>

      {/* Self-target indicator */}
      {isSelfTarget && (
        <div className="text-center py-4">
          <div className="inline-flex flex-col items-center">
            <div className="w-16 h-16 rounded-lg border-2 border-blue-500 overflow-hidden">
              <img
                src={attacker.pokemon.sprite}
                alt={attacker.pokemon.name}
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-sm text-white mt-1 capitalize">{attacker.pokemon.name}</p>
            <p className="text-xs text-white/60">Self</p>
          </div>
        </div>
      )}

      {/* AOE indicator */}
      {isAOE && !isSelfTarget && (
        <div className="text-center py-2 mb-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/20 rounded-lg">
            <span className="text-lg">💥</span>
            <span className="text-sm text-red-300 font-bold">Area Attack</span>
          </div>
        </div>
      )}

      {/* Enemy targets */}
      {enemies.length > 0 && !isSelfTarget && (
        <div className="mb-3">
          <p className="text-xs text-red-400 font-bold mb-2 flex items-center gap-1">
            <span>👾</span> Enemies
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {enemies.map(target => (
              <TargetOption
                key={target.id}
                target={target}
                isEnemy={true}
                isSelected={isAOE || selectedTargetId === target.id}
                onClick={() => !isAOE && onSelectTarget(target.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Ally targets (for healing/support moves) */}
      {allies.length > 0 && (targetType === TARGET_TYPES.SINGLE_ALLY || targetType === TARGET_TYPES.ALL_ALLIES) && (
        <div className="mb-3">
          <p className="text-xs text-blue-400 font-bold mb-2 flex items-center gap-1">
            <span>🤝</span> Allies
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {allies.map(target => (
              <TargetOption
                key={target.id}
                target={target}
                isEnemy={false}
                isSelected={isAOE || selectedTargetId === target.id}
                onClick={() => !isAOE && onSelectTarget(target.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2 mt-4">
        <motion.button
          className="flex-1 py-2 px-4 rounded-lg bg-gray-700 text-gray-300 text-sm font-bold hover:bg-gray-600 transition-colors"
          onClick={onCancel}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Cancel
        </motion.button>

        <motion.button
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-colors ${
            selectedTargetId || isSelfTarget || isAOE
              ? 'bg-yellow-500 text-black hover:bg-yellow-400'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
          onClick={() => {
            if (selectedTargetId || isSelfTarget || isAOE) {
              const finalTargetId = isSelfTarget ? attacker.id : (selectedTargetId || validTargets[0]?.id);
              onConfirm(finalTargetId);
            }
          }}
          disabled={!selectedTargetId && !isSelfTarget && !isAOE}
          whileHover={selectedTargetId || isSelfTarget || isAOE ? { scale: 1.02 } : {}}
          whileTap={selectedTargetId || isSelfTarget || isAOE ? { scale: 0.98 } : {}}
        >
          {isAOE ? 'Attack All!' : 'Confirm'}
        </motion.button>
      </div>
    </motion.div>
  );
}

/**
 * Compact inline target selector (for quick selection)
 */
export function InlineTargetSelector({ targets, selectedId, onSelect, isEnemy = true }) {
  return (
    <div className="flex gap-1 flex-wrap">
      {targets.map(target => {
        const hpPercent = Math.round((target.currentHP / target.maxHP) * 100);

        return (
          <motion.button
            key={target.id}
            className={`p-1 rounded border transition-all ${
              selectedId === target.id
                ? 'border-yellow-400 bg-yellow-400/20'
                : isEnemy
                  ? 'border-red-500/30 hover:border-red-400'
                  : 'border-blue-500/30 hover:border-blue-400'
            }`}
            onClick={() => onSelect(target.id)}
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-8 h-8 rounded overflow-hidden">
              <img
                src={target.pokemon.sprite}
                alt={target.pokemon.name}
                className={`w-full h-full object-contain ${isEnemy ? 'scale-x-[-1]' : ''}`}
              />
            </div>
            <div className="w-8 h-0.5 bg-gray-700 mt-0.5">
              <div
                className={`h-full ${hpPercent > 50 ? 'bg-green-500' : hpPercent > 25 ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{ width: `${hpPercent}%` }}
              />
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
