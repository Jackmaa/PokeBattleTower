// 📁 rewards.js
// Reward system with enhanced tiers and balanced scaling

export const REWARD_TIERS = {
  COMMON: 'common',
  UNCOMMON: 'uncommon',
  RARE: 'rare',
  EPIC: 'epic',
  LEGENDARY: 'legendary',
};

// Tier visual configuration
export const TIER_CONFIG = {
  [REWARD_TIERS.COMMON]: {
    label: 'Common',
    borderColor: 'border-gray-400',
    bgGradient: 'from-gray-600 to-gray-500',
    glowColor: 'rgba(156, 163, 175, 0.4)',
    textColor: 'text-gray-300',
  },
  [REWARD_TIERS.UNCOMMON]: {
    label: 'Uncommon',
    borderColor: 'border-green-400',
    bgGradient: 'from-green-600 to-green-500',
    glowColor: 'rgba(74, 222, 128, 0.5)',
    textColor: 'text-green-400',
  },
  [REWARD_TIERS.RARE]: {
    label: 'Rare',
    borderColor: 'border-blue-400',
    bgGradient: 'from-blue-600 to-blue-500',
    glowColor: 'rgba(59, 130, 246, 0.6)',
    textColor: 'text-blue-400',
  },
  [REWARD_TIERS.EPIC]: {
    label: 'Epic',
    borderColor: 'border-purple-400',
    bgGradient: 'from-purple-600 to-purple-500',
    glowColor: 'rgba(168, 85, 247, 0.7)',
    textColor: 'text-purple-400',
  },
  [REWARD_TIERS.LEGENDARY]: {
    label: 'Legendary',
    borderColor: 'border-yellow-400',
    bgGradient: 'from-yellow-500 to-amber-500',
    glowColor: 'rgba(251, 191, 36, 0.8)',
    textColor: 'text-yellow-400',
  },
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
      tier: REWARD_TIERS.UNCOMMON,
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
      tier: REWARD_TIERS.RARE,
      icon: '💉',
      title: 'Hyper Potion',
      description: 'Restore 100 HP to a Pokémon',
      value: 100,
      color: 'from-emerald-600 to-teal-400',
      borderColor: 'border-teal-400',
      glowColor: 'rgba(20, 184, 166, 0.8)',
    },
    {
      id: 'heal-mega',
      type: 'heal',
      tier: REWARD_TIERS.EPIC,
      icon: '🩹',
      title: 'Mega Potion',
      description: 'Restore 200 HP to a Pokémon',
      value: 200,
      color: 'from-teal-500 to-cyan-400',
      borderColor: 'border-cyan-400',
      glowColor: 'rgba(6, 182, 212, 0.8)',
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

  // STAT BOOST REWARDS - Now properly scaled by tier!
  statBoost: [
    // COMMON: +3 single stat
    {
      id: 'buff-attack-common',
      type: 'buff',
      stat: 'attack',
      tier: REWARD_TIERS.COMMON,
      icon: '💪',
      title: 'Protein',
      description: '+3 Attack to a Pokémon',
      value: 3,
      color: 'from-red-600 to-red-400',
      borderColor: 'border-red-400',
      glowColor: 'rgba(239, 68, 68, 0.5)',
    },
    {
      id: 'buff-defense-common',
      type: 'buff',
      stat: 'defense',
      tier: REWARD_TIERS.COMMON,
      icon: '🛡️',
      title: 'Iron',
      description: '+3 Defense to a Pokémon',
      value: 3,
      color: 'from-gray-600 to-gray-400',
      borderColor: 'border-gray-400',
      glowColor: 'rgba(156, 163, 175, 0.5)',
    },
    {
      id: 'buff-speed-common',
      type: 'buff',
      stat: 'speed',
      tier: REWARD_TIERS.COMMON,
      icon: '⚡',
      title: 'Carbos',
      description: '+3 Speed to a Pokémon',
      value: 3,
      color: 'from-yellow-600 to-yellow-400',
      borderColor: 'border-yellow-400',
      glowColor: 'rgba(234, 179, 8, 0.5)',
    },

    // UNCOMMON: +8 single stat
    {
      id: 'buff-attack-uncommon',
      type: 'buff',
      stat: 'attack',
      tier: REWARD_TIERS.UNCOMMON,
      icon: '⚔️',
      title: 'Power Bracer',
      description: '+8 Attack to a Pokémon',
      value: 8,
      color: 'from-red-500 to-orange-400',
      borderColor: 'border-orange-400',
      glowColor: 'rgba(249, 115, 22, 0.6)',
    },
    {
      id: 'buff-defense-uncommon',
      type: 'buff',
      stat: 'defense',
      tier: REWARD_TIERS.UNCOMMON,
      icon: '🏰',
      title: 'Power Belt',
      description: '+8 Defense to a Pokémon',
      value: 8,
      color: 'from-slate-600 to-blue-400',
      borderColor: 'border-blue-400',
      glowColor: 'rgba(59, 130, 246, 0.6)',
    },
    {
      id: 'buff-speed-uncommon',
      type: 'buff',
      stat: 'speed',
      tier: REWARD_TIERS.UNCOMMON,
      icon: '💨',
      title: 'Power Anklet',
      description: '+8 Speed to a Pokémon',
      value: 8,
      color: 'from-cyan-600 to-cyan-400',
      borderColor: 'border-cyan-400',
      glowColor: 'rgba(6, 182, 212, 0.6)',
    },

    // RARE: +15 single stat OR +5 all stats
    {
      id: 'buff-attack-rare',
      type: 'buff',
      stat: 'attack',
      tier: REWARD_TIERS.RARE,
      icon: '🗡️',
      title: 'Attack Shard',
      description: '+15 Attack to a Pokémon',
      value: 15,
      color: 'from-red-500 to-rose-400',
      borderColor: 'border-rose-400',
      glowColor: 'rgba(244, 63, 94, 0.7)',
    },
    {
      id: 'buff-defense-rare',
      type: 'buff',
      stat: 'defense',
      tier: REWARD_TIERS.RARE,
      icon: '🔰',
      title: 'Defense Shard',
      description: '+15 Defense to a Pokémon',
      value: 15,
      color: 'from-blue-500 to-indigo-400',
      borderColor: 'border-indigo-400',
      glowColor: 'rgba(99, 102, 241, 0.7)',
    },
    {
      id: 'buff-speed-rare',
      type: 'buff',
      stat: 'speed',
      tier: REWARD_TIERS.RARE,
      icon: '🌀',
      title: 'Speed Shard',
      description: '+15 Speed to a Pokémon',
      value: 15,
      color: 'from-yellow-500 to-lime-400',
      borderColor: 'border-lime-400',
      glowColor: 'rgba(163, 230, 53, 0.7)',
    },
    {
      id: 'buff-all-rare',
      type: 'buff',
      stat: 'all',
      tier: REWARD_TIERS.RARE,
      icon: '💎',
      title: 'Rare Candy',
      description: '+5 to ALL stats of a Pokémon',
      value: 5,
      color: 'from-blue-500 to-purple-400',
      borderColor: 'border-purple-400',
      glowColor: 'rgba(139, 92, 246, 0.7)',
    },

    // EPIC: +25 single stat OR +12 all stats
    {
      id: 'buff-attack-epic',
      type: 'buff',
      stat: 'attack',
      tier: REWARD_TIERS.EPIC,
      icon: '🔥',
      title: 'Attack Crystal',
      description: '+25 Attack to a Pokémon',
      value: 25,
      color: 'from-orange-500 to-red-500',
      borderColor: 'border-orange-400',
      glowColor: 'rgba(249, 115, 22, 0.8)',
    },
    {
      id: 'buff-defense-epic',
      type: 'buff',
      stat: 'defense',
      tier: REWARD_TIERS.EPIC,
      icon: '🧱',
      title: 'Defense Crystal',
      description: '+25 Defense to a Pokémon',
      value: 25,
      color: 'from-indigo-500 to-blue-500',
      borderColor: 'border-indigo-400',
      glowColor: 'rgba(99, 102, 241, 0.8)',
    },
    {
      id: 'buff-speed-epic',
      type: 'buff',
      stat: 'speed',
      tier: REWARD_TIERS.EPIC,
      icon: '⚡',
      title: 'Speed Crystal',
      description: '+25 Speed to a Pokémon',
      value: 25,
      color: 'from-yellow-400 to-amber-500',
      borderColor: 'border-yellow-400',
      glowColor: 'rgba(251, 191, 36, 0.8)',
    },
    {
      id: 'buff-all-epic',
      type: 'buff',
      stat: 'all',
      tier: REWARD_TIERS.EPIC,
      icon: '🌟',
      title: 'Hyper Candy',
      description: '+12 to ALL stats of a Pokémon',
      value: 12,
      color: 'from-purple-500 to-pink-400',
      borderColor: 'border-pink-400',
      glowColor: 'rgba(236, 72, 153, 0.8)',
    },

    // LEGENDARY: +40 single stat OR +20 all stats
    {
      id: 'buff-attack-legendary',
      type: 'buff',
      stat: 'attack',
      tier: REWARD_TIERS.LEGENDARY,
      icon: '☄️',
      title: 'Attack Essence',
      description: '+40 Attack to a Pokémon',
      value: 40,
      color: 'from-red-500 to-yellow-400',
      borderColor: 'border-yellow-400',
      glowColor: 'rgba(251, 191, 36, 0.9)',
    },
    {
      id: 'buff-defense-legendary',
      type: 'buff',
      stat: 'defense',
      tier: REWARD_TIERS.LEGENDARY,
      icon: '🛡️',
      title: 'Defense Essence',
      description: '+40 Defense to a Pokémon',
      value: 40,
      color: 'from-blue-500 to-yellow-400',
      borderColor: 'border-yellow-400',
      glowColor: 'rgba(251, 191, 36, 0.9)',
    },
    {
      id: 'buff-speed-legendary',
      type: 'buff',
      stat: 'speed',
      tier: REWARD_TIERS.LEGENDARY,
      icon: '💫',
      title: 'Speed Essence',
      description: '+40 Speed to a Pokémon',
      value: 40,
      color: 'from-cyan-400 to-yellow-400',
      borderColor: 'border-yellow-400',
      glowColor: 'rgba(251, 191, 36, 0.9)',
    },
    {
      id: 'buff-all-legendary',
      type: 'buff',
      stat: 'all',
      tier: REWARD_TIERS.LEGENDARY,
      icon: '👑',
      title: 'King\'s Candy',
      description: '+20 to ALL stats of a Pokémon',
      value: 20,
      color: 'from-yellow-400 to-amber-300',
      borderColor: 'border-yellow-300',
      glowColor: 'rgba(253, 224, 71, 0.9)',
    },
  ],

  // CAPTURE REWARDS - Now with level bonus based on tier
  capture: [
    {
      id: 'catch-common',
      type: 'catch',
      tier: REWARD_TIERS.UNCOMMON,
      icon: '🔴',
      title: 'Poké Ball',
      description: 'Catch a wild Pokémon',
      levelBonus: 0, // Base level from floor
      color: 'from-red-600 to-red-400',
      borderColor: 'border-red-400',
      glowColor: 'rgba(239, 68, 68, 0.6)',
    },
    {
      id: 'catch-rare',
      type: 'catch',
      tier: REWARD_TIERS.RARE,
      icon: '🔵',
      title: 'Great Ball',
      description: 'Catch a Pokémon (+5 levels)',
      levelBonus: 5,
      color: 'from-blue-600 to-blue-400',
      borderColor: 'border-blue-400',
      glowColor: 'rgba(59, 130, 246, 0.7)',
    },
    {
      id: 'catch-epic',
      type: 'catch',
      tier: REWARD_TIERS.EPIC,
      icon: '🟡',
      title: 'Ultra Ball',
      description: 'Catch a Pokémon (+10 levels)',
      levelBonus: 10,
      color: 'from-yellow-500 to-amber-400',
      borderColor: 'border-amber-400',
      glowColor: 'rgba(251, 191, 36, 0.8)',
    },
    {
      id: 'catch-legendary',
      type: 'catch',
      tier: REWARD_TIERS.LEGENDARY,
      icon: '🟣',
      title: 'Master Ball',
      description: 'Catch a Pokémon (+15 levels)',
      levelBonus: 15,
      color: 'from-purple-600 to-fuchsia-400',
      borderColor: 'border-fuchsia-400',
      glowColor: 'rgba(217, 70, 239, 0.9)',
    },
  ],

  // RELIC REWARDS - Permanent collectibles
  relics: [
    {
      id: 'relic-common',
      type: 'relic',
      tier: REWARD_TIERS.UNCOMMON,
      relicTier: 'common',
      icon: '🎁',
      title: 'Common Relic',
      description: 'Obtain a random common relic',
      color: 'from-gray-500 to-gray-400',
      borderColor: 'border-gray-400',
      glowColor: 'rgba(156, 163, 175, 0.6)',
    },
    {
      id: 'relic-uncommon',
      type: 'relic',
      tier: REWARD_TIERS.RARE,
      relicTier: 'uncommon',
      icon: '🎁',
      title: 'Uncommon Relic',
      description: 'Obtain a random uncommon relic',
      color: 'from-green-500 to-emerald-400',
      borderColor: 'border-emerald-400',
      glowColor: 'rgba(52, 211, 153, 0.7)',
    },
    {
      id: 'relic-rare',
      type: 'relic',
      tier: REWARD_TIERS.EPIC,
      relicTier: 'rare',
      icon: '💎',
      title: 'Rare Relic',
      description: 'Obtain a random rare relic',
      color: 'from-blue-500 to-cyan-400',
      borderColor: 'border-cyan-400',
      glowColor: 'rgba(34, 211, 238, 0.8)',
    },
    {
      id: 'relic-legendary',
      type: 'relic',
      tier: REWARD_TIERS.LEGENDARY,
      relicTier: 'legendary',
      icon: '👑',
      title: 'Legendary Relic',
      description: 'Obtain a legendary relic!',
      color: 'from-yellow-400 to-amber-300',
      borderColor: 'border-yellow-300',
      glowColor: 'rgba(253, 224, 71, 0.9)',
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
      id: 'team-heal-small',
      type: 'teamHeal',
      tier: REWARD_TIERS.UNCOMMON,
      icon: '🏥',
      title: 'Team Heal',
      description: 'Heal entire team by 30 HP',
      value: 30,
      color: 'from-teal-600 to-green-400',
      borderColor: 'border-green-400',
      glowColor: 'rgba(16, 185, 129, 0.6)',
    },
    {
      id: 'team-heal-large',
      type: 'teamHeal',
      tier: REWARD_TIERS.EPIC,
      icon: '🏥',
      title: 'Full Team Heal',
      description: 'Heal entire team by 80 HP',
      value: 80,
      color: 'from-emerald-500 to-teal-400',
      borderColor: 'border-teal-400',
      glowColor: 'rgba(20, 184, 166, 0.8)',
    },
    {
      id: 'pp-restore',
      type: 'ppRestore',
      tier: REWARD_TIERS.UNCOMMON,
      icon: '🔋',
      title: 'Ether',
      description: 'Restore PP of all moves',
      value: 10,
      color: 'from-violet-600 to-purple-400',
      borderColor: 'border-purple-400',
      glowColor: 'rgba(139, 92, 246, 0.6)',
    },
  ],
};

// Tier weights for random selection (chance-based)
const TIER_WEIGHTS = {
  [REWARD_TIERS.COMMON]: 40,
  [REWARD_TIERS.UNCOMMON]: 30,
  [REWARD_TIERS.RARE]: 18,
  [REWARD_TIERS.EPIC]: 9,
  [REWARD_TIERS.LEGENDARY]: 3,
};

/**
 * Generate random rewards based on tier weights
 * @param {number} count - Number of rewards to generate (default: 3)
 * @param {number} floorLevel - Current floor level (affects legendary chance slightly)
 * @returns {Array} Array of reward objects
 */
export function generateRandomRewards(count = 3, floorLevel = 1) {
  const allRewards = [
    ...REWARD_POOL.healing,
    ...REWARD_POOL.statBoost,
    ...REWARD_POOL.capture,
    ...REWARD_POOL.special,
    ...REWARD_POOL.relics,
  ];

  // Slightly increase better tier chances on higher floors (but not drastically)
  const adjustedWeights = { ...TIER_WEIGHTS };
  if (floorLevel >= 8) {
    adjustedWeights[REWARD_TIERS.LEGENDARY] = 4;
    adjustedWeights[REWARD_TIERS.EPIC] = 11;
  }
  if (floorLevel >= 15) {
    adjustedWeights[REWARD_TIERS.LEGENDARY] = 5;
    adjustedWeights[REWARD_TIERS.EPIC] = 13;
  }

  const selectedRewards = [];
  const usedIds = new Set();

  // Generate rewards
  for (let i = 0; i < count; i++) {
    // Randomly select a tier based on weights
    const randomTier = weightedRandomTier(adjustedWeights);

    // Filter rewards by tier and avoid duplicates
    let availableRewards = allRewards.filter(
      (r) => r.tier === randomTier && !usedIds.has(r.id)
    );

    // If no rewards in this tier, try any tier
    if (availableRewards.length === 0) {
      availableRewards = allRewards.filter((r) => !usedIds.has(r.id));
    }

    if (availableRewards.length > 0) {
      const selected = availableRewards[Math.floor(Math.random() * availableRewards.length)];
      selectedRewards.push(selected);
      usedIds.add(selected.id);
    }
  }

  return selectedRewards;
}

/**
 * Calculate the level for a captured Pokemon based on floor and reward tier
 * @param {number} floor - Current floor
 * @param {number} levelBonus - Bonus from the ball type (0, 5, 10, 15)
 * @returns {number} - Pokemon level
 */
export function calculateCaptureLevel(floor, levelBonus = 0) {
  // Base level scales with floor: floor * 2 + 5
  // Floor 1 = Lv 7, Floor 10 = Lv 25, Floor 19 = Lv 43
  const baseLevel = Math.floor(floor * 2 + 5);
  return Math.min(100, baseLevel + levelBonus);
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

/**
 * Get tier configuration for visual display
 */
export function getTierConfig(tier) {
  return TIER_CONFIG[tier] || TIER_CONFIG[REWARD_TIERS.COMMON];
}
