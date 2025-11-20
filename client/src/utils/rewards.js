// 📁 rewards.js
// Reward system with tiers and random generation

export const REWARD_TIERS = {
  COMMON: 'common',
  RARE: 'rare',
  EPIC: 'epic',
  LEGENDARY: 'legendary',
};

export const REWARD_POOL = {
  // HEALING REWARDS
  healing: [
    {
      id: 'heal-small',
      type: 'heal',
      tier: REWARD_TIERS.COMMON,
      icon: '💊',
      title: 'Potion',
      description: 'Restore 20 HP to a Pokémon',
      value: 20,
      color: 'from-green-600 to-green-400',
      borderColor: 'border-green-400',
      glowColor: 'rgba(16, 185, 129, 0.6)',
    },
    {
      id: 'heal-medium',
      type: 'heal',
      tier: REWARD_TIERS.RARE,
      icon: '🧪',
      title: 'Super Potion',
      description: 'Restore 50 HP to a Pokémon',
      value: 50,
      color: 'from-green-500 to-emerald-400',
      borderColor: 'border-emerald-400',
      glowColor: 'rgba(16, 185, 129, 0.7)',
    },
    {
      id: 'heal-large',
      type: 'heal',
      tier: REWARD_TIERS.EPIC,
      icon: '💉',
      title: 'Hyper Potion',
      description: 'Restore 100 HP to a Pokémon',
      value: 100,
      color: 'from-emerald-600 to-teal-400',
      borderColor: 'border-teal-400',
      glowColor: 'rgba(20, 184, 166, 0.8)',
    },
    {
      id: 'heal-full',
      type: 'heal',
      tier: REWARD_TIERS.LEGENDARY,
      icon: '✨',
      title: 'Max Potion',
      description: 'Fully restore a Pokémon\'s HP',
      value: 999,
      color: 'from-yellow-500 to-amber-400',
      borderColor: 'border-yellow-400',
      glowColor: 'rgba(251, 191, 36, 0.9)',
    },
  ],

  // STAT BOOST REWARDS
  statBoost: [
    {
      id: 'buff-attack-small',
      type: 'buff',
      stat: 'attack',
      tier: REWARD_TIERS.COMMON,
      icon: '💪',
      title: 'Protein',
      description: '+5 Attack to a Pokémon',
      value: 5,
      color: 'from-red-600 to-red-400',
      borderColor: 'border-red-400',
      glowColor: 'rgba(239, 68, 68, 0.6)',
    },
    {
      id: 'buff-attack-large',
      type: 'buff',
      stat: 'attack',
      tier: REWARD_TIERS.RARE,
      icon: '⚔️',
      title: 'Power Bracer',
      description: '+15 Attack to a Pokémon',
      value: 15,
      color: 'from-red-500 to-orange-400',
      borderColor: 'border-orange-400',
      glowColor: 'rgba(249, 115, 22, 0.7)',
    },
    {
      id: 'buff-defense-small',
      type: 'buff',
      stat: 'defense',
      tier: REWARD_TIERS.COMMON,
      icon: '🛡️',
      title: 'Iron',
      description: '+5 Defense to a Pokémon',
      value: 5,
      color: 'from-gray-600 to-gray-400',
      borderColor: 'border-gray-400',
      glowColor: 'rgba(156, 163, 175, 0.6)',
    },
    {
      id: 'buff-defense-large',
      type: 'buff',
      stat: 'defense',
      tier: REWARD_TIERS.RARE,
      icon: '🏰',
      title: 'Power Belt',
      description: '+15 Defense to a Pokémon',
      value: 15,
      color: 'from-slate-600 to-blue-400',
      borderColor: 'border-blue-400',
      glowColor: 'rgba(59, 130, 246, 0.7)',
    },
    {
      id: 'buff-speed-small',
      type: 'buff',
      stat: 'speed',
      tier: REWARD_TIERS.COMMON,
      icon: '⚡',
      title: 'Carbos',
      description: '+5 Speed to a Pokémon',
      value: 5,
      color: 'from-yellow-600 to-yellow-400',
      borderColor: 'border-yellow-400',
      glowColor: 'rgba(234, 179, 8, 0.6)',
    },
    {
      id: 'buff-speed-large',
      type: 'buff',
      stat: 'speed',
      tier: REWARD_TIERS.RARE,
      icon: '💨',
      title: 'Power Anklet',
      description: '+15 Speed to a Pokémon',
      value: 15,
      color: 'from-cyan-600 to-cyan-400',
      borderColor: 'border-cyan-400',
      glowColor: 'rgba(6, 182, 212, 0.7)',
    },
    {
      id: 'buff-all-stats',
      type: 'buff',
      stat: 'all',
      tier: REWARD_TIERS.LEGENDARY,
      icon: '🌟',
      title: 'Rare Candy',
      description: '+10 to all stats of a Pokémon',
      value: 10,
      color: 'from-purple-600 to-pink-400',
      borderColor: 'border-pink-400',
      glowColor: 'rgba(236, 72, 153, 0.9)',
    },
  ],

  // CAPTURE REWARDS
  capture: [
    {
      id: 'catch-random',
      type: 'catch',
      tier: REWARD_TIERS.RARE,
      icon: '🎯',
      title: 'Poké Ball',
      description: 'Catch a random wild Pokémon',
      color: 'from-blue-600 to-blue-400',
      borderColor: 'border-blue-400',
      glowColor: 'rgba(59, 130, 246, 0.7)',
    },
    {
      id: 'catch-rare',
      type: 'catch',
      tier: REWARD_TIERS.EPIC,
      icon: '⚾',
      title: 'Great Ball',
      description: 'Catch a stronger Pokémon',
      color: 'from-indigo-600 to-blue-400',
      borderColor: 'border-indigo-400',
      glowColor: 'rgba(99, 102, 241, 0.8)',
    },
    {
      id: 'catch-legendary',
      type: 'catch',
      tier: REWARD_TIERS.LEGENDARY,
      icon: '🌐',
      title: 'Master Ball',
      description: 'Catch a very rare Pokémon',
      color: 'from-purple-700 to-fuchsia-400',
      borderColor: 'border-fuchsia-400',
      glowColor: 'rgba(217, 70, 239, 0.9)',
    },
  ],

  // SPECIAL REWARDS
  special: [
    {
      id: 'revive',
      type: 'revive',
      tier: REWARD_TIERS.RARE,
      icon: '💫',
      title: 'Revive',
      description: 'Revive a fainted Pokémon with 50% HP',
      value: 0.5,
      color: 'from-pink-600 to-rose-400',
      borderColor: 'border-rose-400',
      glowColor: 'rgba(244, 63, 94, 0.7)',
    },
    {
      id: 'max-revive',
      type: 'revive',
      tier: REWARD_TIERS.LEGENDARY,
      icon: '💖',
      title: 'Max Revive',
      description: 'Revive a fainted Pokémon with full HP',
      value: 1,
      color: 'from-rose-600 to-pink-400',
      borderColor: 'border-pink-400',
      glowColor: 'rgba(236, 72, 153, 0.9)',
    },
    {
      id: 'team-heal',
      type: 'teamHeal',
      tier: REWARD_TIERS.EPIC,
      icon: '🏥',
      title: 'Full Heal',
      description: 'Heal entire team by 30 HP',
      value: 30,
      color: 'from-teal-600 to-green-400',
      borderColor: 'border-green-400',
      glowColor: 'rgba(16, 185, 129, 0.8)',
    },
    {
      id: 'pp-restore',
      type: 'ppRestore',
      tier: REWARD_TIERS.RARE,
      icon: '🔋',
      title: 'Ether',
      description: 'Restore PP of all moves',
      value: 10,
      color: 'from-violet-600 to-purple-400',
      borderColor: 'border-purple-400',
      glowColor: 'rgba(139, 92, 246, 0.7)',
    },
  ],
};

// Tier weights for random selection
const TIER_WEIGHTS = {
  [REWARD_TIERS.COMMON]: 50,
  [REWARD_TIERS.RARE]: 30,
  [REWARD_TIERS.EPIC]: 15,
  [REWARD_TIERS.LEGENDARY]: 5,
};

/**
 * Generate random rewards based on tier weights
 * @param {number} count - Number of rewards to generate (default: 3)
 * @param {number} floorLevel - Current floor level (affects legendary chance)
 * @returns {Array} Array of reward objects
 */
export function generateRandomRewards(count = 3, floorLevel = 1) {
  const allRewards = [
    ...REWARD_POOL.healing,
    ...REWARD_POOL.statBoost,
    ...REWARD_POOL.capture,
    ...REWARD_POOL.special,
  ];

  // Increase legendary chance based on floor
  const adjustedWeights = { ...TIER_WEIGHTS };
  if (floorLevel >= 10) {
    adjustedWeights[REWARD_TIERS.LEGENDARY] = 10;
    adjustedWeights[REWARD_TIERS.EPIC] = 20;
  }
  if (floorLevel >= 15) {
    adjustedWeights[REWARD_TIERS.LEGENDARY] = 15;
    adjustedWeights[REWARD_TIERS.EPIC] = 25;
  }

  const selectedRewards = [];
  const usedTypes = new Set();

  // Generate rewards
  for (let i = 0; i < count; i++) {
    // Randomly select a tier based on weights
    const randomTier = weightedRandomTier(adjustedWeights);

    // Filter rewards by tier and avoid duplicate types
    const availableRewards = allRewards.filter(
      (r) => r.tier === randomTier && !usedTypes.has(r.type)
    );

    if (availableRewards.length === 0) {
      // Fallback: allow any tier if no rewards available
      const fallbackRewards = allRewards.filter((r) => !usedTypes.has(r.type));
      if (fallbackRewards.length > 0) {
        const selected = fallbackRewards[Math.floor(Math.random() * fallbackRewards.length)];
        selectedRewards.push(selected);
        usedTypes.add(selected.type);
      }
    } else {
      const selected = availableRewards[Math.floor(Math.random() * availableRewards.length)];
      selectedRewards.push(selected);
      usedTypes.add(selected.type);
    }
  }

  return selectedRewards;
}

/**
 * Select a random tier based on weights
 */
function weightedRandomTier(weights) {
  const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);
  let random = Math.random() * totalWeight;

  for (const [tier, weight] of Object.entries(weights)) {
    random -= weight;
    if (random <= 0) {
      return tier;
    }
  }

  return REWARD_TIERS.COMMON; // Fallback
}
