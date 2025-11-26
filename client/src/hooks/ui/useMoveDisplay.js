// useMoveDisplay.js
// Custom hook for move display logic and configuration

import { useMemo } from 'react';
import typeColors from '../../utils/typeColors';
import { TARGET_TYPES } from '../../utils/moves';

// Check if move is AOE
const isAOEMove = (target) => {
  return target === TARGET_TYPES.ALL_ENEMIES ||
         target === TARGET_TYPES.ALL_ALLIES ||
         target === TARGET_TYPES.ALL_OTHER;
};

// Status effect configuration for badges
const STATUS_CONFIG = {
  poisoned: { emoji: '☠️', color: 'rgba(168, 85, 247, 0.5)', border: 'rgba(168, 85, 247, 0.7)', text: '#d8b4fe' },
  badly_poisoned: { emoji: '☠️', color: 'rgba(147, 51, 234, 0.5)', border: 'rgba(147, 51, 234, 0.7)', text: '#c084fc' },
  paralyzed: { emoji: '⚡', color: 'rgba(234, 179, 8, 0.5)', border: 'rgba(234, 179, 8, 0.7)', text: '#fde047' },
  burned: { emoji: '🔥', color: 'rgba(249, 115, 22, 0.5)', border: 'rgba(249, 115, 22, 0.7)', text: '#fdba74' },
  frozen: { emoji: '❄️', color: 'rgba(6, 182, 212, 0.5)', border: 'rgba(6, 182, 212, 0.7)', text: '#67e8f9' },
};

// Effect type badges
const EFFECT_CONFIG = {
  recoil: { emoji: '💔', label: 'Recoil', color: 'rgba(239, 68, 68, 0.5)', border: 'rgba(239, 68, 68, 0.7)', text: '#fca5a5' },
  flinch: { emoji: '😵', label: 'Flinch', color: 'rgba(251, 191, 36, 0.5)', border: 'rgba(251, 191, 36, 0.7)', text: '#fde047' },
  team_buff: { emoji: '🛡️', label: 'Team Buff', color: 'rgba(59, 130, 246, 0.5)', border: 'rgba(59, 130, 246, 0.7)', text: '#93c5fd' },
  heal: { emoji: '💚', label: 'Heal', color: 'rgba(34, 197, 94, 0.5)', border: 'rgba(34, 197, 94, 0.7)', text: '#86efac' },
  stat_change: { emoji: '📊', label: 'Stats', color: 'rgba(168, 85, 247, 0.5)', border: 'rgba(168, 85, 247, 0.7)', text: '#d8b4fe' },
};

const MAX_SKILL_LEVEL = 5;

/**
 * Hook for move display logic and badge generation
 * Centralizes move card styling and badge configuration
 *
 * @param {Object} move - The move object
 * @param {Object} options - Display options
 * @param {boolean} options.showEnhancedInfo - Show additional badges and info
 * @param {boolean} options.showSkillLevel - Show skill level badge
 * @param {boolean} options.showFused - Show fused badge
 * @param {boolean} options.showPP - Show PP info
 *
 * @returns {Object} - { typeColor, isOutOfPP, isAOE, badges, styles, config }
 *
 * @example
 * const { typeColor, badges, isOutOfPP } = useMoveDisplay(move, {
 *   showEnhancedInfo: true
 * });
 */
export function useMoveDisplay(move, options = {}) {
  const {
    showEnhancedInfo = false,
    showSkillLevel = true,
    showFused = true,
    showPP = true,
  } = options;

  const typeColor = typeColors[move.type] || '#999';
  const isOutOfPP = showPP && move.pp !== undefined && move.pp <= 0;
  const isAOE = move.target ? isAOEMove(move.target) : false;
  const skillLevel = move.skillLevel || 0;
  const isMaxLevel = skillLevel >= MAX_SKILL_LEVEL;
  const isFused = move.isFused || false;

  // Generate badges based on move properties
  const badges = useMemo(() => {
    const result = [];

    // Skill level badge
    if (showSkillLevel && skillLevel > 0) {
      result.push({
        type: 'skillLevel',
        level: skillLevel,
        label: `★${skillLevel}`,
        color: isMaxLevel ? 'rgba(234, 179, 8, 0.5)' : 'rgba(59, 130, 246, 0.5)',
        border: isMaxLevel ? 'rgba(234, 179, 8, 0.7)' : 'rgba(59, 130, 246, 0.7)',
        text: isMaxLevel ? '#fde047' : '#93c5fd',
      });
    }

    // Fused badge
    if (showFused && isFused) {
      result.push({
        type: 'fused',
        label: 'FUSED',
        color: 'rgba(168, 85, 247, 0.5)',
        border: 'rgba(168, 85, 247, 0.7)',
        text: '#d8b4fe',
      });
    }

    // Out of PP badge
    if (isOutOfPP) {
      result.push({
        type: 'outOfPP',
        label: 'NO PP',
        color: 'rgba(127, 127, 127, 0.5)',
        border: 'rgba(127, 127, 127, 0.7)',
        text: '#9ca3af',
      });
    }

    // AOE badge
    if (isAOE) {
      result.push({
        type: 'aoe',
        label: '💥 AOE',
        color: 'rgba(249, 115, 22, 0.3)',
        border: 'rgba(249, 115, 22, 0.5)',
        text: '#fdba74',
      });
    }

    // Priority badge
    if (move.priority > 0) {
      result.push({
        type: 'priority',
        label: `+${move.priority} Priority`,
        color: 'rgba(234, 179, 8, 0.3)',
        border: 'rgba(234, 179, 8, 0.5)',
        text: '#fde047',
      });
    }

    // Effect badges (if enhanced info is requested)
    if (showEnhancedInfo && move.effect?.type && EFFECT_CONFIG[move.effect.type]) {
      const effectConfig = EFFECT_CONFIG[move.effect.type];
      result.push({
        type: 'effect',
        effectType: move.effect.type,
        label: `${effectConfig.emoji} ${effectConfig.label}`,
        ...effectConfig,
      });
    }

    // Status badges (if enhanced info is requested)
    if (showEnhancedInfo && move.effect?.status && STATUS_CONFIG[move.effect.status]) {
      const statusConfig = STATUS_CONFIG[move.effect.status];
      result.push({
        type: 'status',
        statusType: move.effect.status,
        label: `${statusConfig.emoji} ${move.effect.status.toUpperCase()}`,
        ...statusConfig,
      });
    }

    return result;
  }, [move, skillLevel, isFused, isOutOfPP, isAOE, isMaxLevel, showEnhancedInfo, showSkillLevel, showFused]);

  // Generate styles for move cards
  const styles = useMemo(() => ({
    container: {
      borderColor: typeColor,
      backgroundColor: isOutOfPP ? '#333' : `${typeColor}20`,
    },
    typeChip: {
      backgroundColor: typeColor,
      color: '#fff',
    },
    nameColor: {
      color: typeColor,
    },
  }), [typeColor, isOutOfPP]);

  return {
    typeColor,
    isOutOfPP,
    isAOE,
    skillLevel,
    isMaxLevel,
    isFused,
    badges,
    styles,
    config: {
      STATUS_CONFIG,
      EFFECT_CONFIG,
      MAX_SKILL_LEVEL,
    },
  };
}
