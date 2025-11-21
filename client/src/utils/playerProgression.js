// Player Progression System
// Levels, XP, Talents, and Tower Tokens

const STORAGE_KEY = 'pokemon_tower_progression';

// ============================================
// LEVEL CONFIGURATION
// ============================================

export const MAX_LEVEL = 50;

// XP required for each level (exponential curve)
export function getXPForLevel(level) {
  if (level <= 1) return 0;
  // Base 100 XP, scaling exponentially
  return Math.floor(100 * Math.pow(1.15, level - 1));
}

// Total XP needed to reach a level
export function getTotalXPForLevel(level) {
  let total = 0;
  for (let i = 1; i <= level; i++) {
    total += getXPForLevel(i);
  }
  return total;
}

// ============================================
// XP REWARDS CONFIGURATION
// ============================================

export const XP_REWARDS = {
  // Combat XP
  battle_won: 10,
  elite_defeated: 25,
  boss_defeated: 50,
  legendary_defeated: 100,

  // Floor progression
  floor_cleared: 5,
  floor_5_reached: 20,
  floor_10_reached: 40,
  floor_15_reached: 60,
  floor_20_reached: 100,

  // Run completion
  run_completed: 50,
  run_victory: 200,
  flawless_battle: 15, // No damage taken

  // Achievements
  achievement_unlocked: 30,

  // Daily/First time bonuses
  first_run_of_day: 50,
  streak_bonus: 10, // Per day of streak
};

// ============================================
// TOWER TOKENS CONFIGURATION
// ============================================

export const TOKEN_REWARDS = {
  // Run rewards
  run_completed: 5,
  run_victory: 20,
  boss_defeated: 3,
  legendary_defeated: 10,

  // Floor milestones
  floor_5_first_time: 10,
  floor_10_first_time: 20,
  floor_15_first_time: 30,
  floor_20_first_time: 50,

  // Achievement rewards
  achievement_bronze: 5,
  achievement_silver: 10,
  achievement_gold: 25,

  // Streak bonuses
  daily_login: 2,
  weekly_streak: 15,

  // Special events
  perfect_run: 50, // No Pokemon fainted
};

// ============================================
// TALENT TREE CONFIGURATION
// ============================================

export const TALENT_BRANCHES = {
  COMBAT: 'combat',
  SURVIVAL: 'survival',
  FORTUNE: 'fortune',
  MASTERY: 'mastery',
};

export const TALENTS = {
  // ========== COMBAT BRANCH ==========
  // Tier 1 (Level 1+)
  sharp_claws: {
    id: 'sharp_claws',
    name: 'Sharp Claws',
    branch: TALENT_BRANCHES.COMBAT,
    tier: 1,
    maxRank: 5,
    icon: '⚔️',
    description: 'Increase physical attack damage by {value}%',
    valuePerRank: 2,
    effect: (rank) => ({ attack_bonus: rank * 0.02 }),
    requires: [],
    levelRequired: 1,
  },

  focus_energy: {
    id: 'focus_energy',
    name: 'Focus Energy',
    branch: TALENT_BRANCHES.COMBAT,
    tier: 1,
    maxRank: 5,
    icon: '🎯',
    description: 'Increase critical hit chance by {value}%',
    valuePerRank: 1,
    effect: (rank) => ({ crit_chance: rank * 0.01 }),
    requires: [],
    levelRequired: 1,
  },

  // Tier 2 (Level 5+)
  type_specialist: {
    id: 'type_specialist',
    name: 'Type Specialist',
    branch: TALENT_BRANCHES.COMBAT,
    tier: 2,
    maxRank: 3,
    icon: '🔮',
    description: 'Super effective moves deal {value}% more damage',
    valuePerRank: 5,
    effect: (rank) => ({ super_effective_bonus: rank * 0.05 }),
    requires: ['sharp_claws'],
    levelRequired: 5,
  },

  fierce_strikes: {
    id: 'fierce_strikes',
    name: 'Fierce Strikes',
    branch: TALENT_BRANCHES.COMBAT,
    tier: 2,
    maxRank: 3,
    icon: '💥',
    description: 'Critical hits deal {value}% more damage',
    valuePerRank: 10,
    effect: (rank) => ({ crit_damage: rank * 0.1 }),
    requires: ['focus_energy'],
    levelRequired: 5,
  },

  // Tier 3 (Level 10+)
  combo_master: {
    id: 'combo_master',
    name: 'Combo Master',
    branch: TALENT_BRANCHES.COMBAT,
    tier: 3,
    maxRank: 3,
    icon: '🔥',
    description: 'Consecutive attacks on the same target deal {value}% more damage',
    valuePerRank: 3,
    effect: (rank) => ({ combo_bonus: rank * 0.03 }),
    requires: ['type_specialist', 'fierce_strikes'],
    levelRequired: 10,
  },

  // Tier 4 (Level 20+) - Capstone
  berserker: {
    id: 'berserker',
    name: 'Berserker',
    branch: TALENT_BRANCHES.COMBAT,
    tier: 4,
    maxRank: 1,
    icon: '👹',
    description: 'When below 30% HP, deal 25% more damage',
    valuePerRank: 25,
    effect: (rank) => ({ low_hp_damage: 0.25 }),
    requires: ['combo_master'],
    levelRequired: 20,
  },

  // ========== SURVIVAL BRANCH ==========
  // Tier 1
  thick_skin: {
    id: 'thick_skin',
    name: 'Thick Skin',
    branch: TALENT_BRANCHES.SURVIVAL,
    tier: 1,
    maxRank: 5,
    icon: '🛡️',
    description: 'Increase defense by {value}%',
    valuePerRank: 2,
    effect: (rank) => ({ defense_bonus: rank * 0.02 }),
    requires: [],
    levelRequired: 1,
  },

  vitality: {
    id: 'vitality',
    name: 'Vitality',
    branch: TALENT_BRANCHES.SURVIVAL,
    tier: 1,
    maxRank: 5,
    icon: '❤️',
    description: 'Increase max HP by {value}%',
    valuePerRank: 3,
    effect: (rank) => ({ hp_bonus: rank * 0.03 }),
    requires: [],
    levelRequired: 1,
  },

  // Tier 2
  regeneration: {
    id: 'regeneration',
    name: 'Regeneration',
    branch: TALENT_BRANCHES.SURVIVAL,
    tier: 2,
    maxRank: 3,
    icon: '💚',
    description: 'Heal {value}% HP after each battle',
    valuePerRank: 3,
    effect: (rank) => ({ post_battle_heal: rank * 0.03 }),
    requires: ['vitality'],
    levelRequired: 5,
  },

  iron_will: {
    id: 'iron_will',
    name: 'Iron Will',
    branch: TALENT_BRANCHES.SURVIVAL,
    tier: 2,
    maxRank: 3,
    icon: '🪨',
    description: 'Reduce damage from super effective moves by {value}%',
    valuePerRank: 5,
    effect: (rank) => ({ resist_super_effective: rank * 0.05 }),
    requires: ['thick_skin'],
    levelRequired: 5,
  },

  // Tier 3
  second_wind: {
    id: 'second_wind',
    name: 'Second Wind',
    branch: TALENT_BRANCHES.SURVIVAL,
    tier: 3,
    maxRank: 3,
    icon: '🌬️',
    description: 'Healing effects are {value}% more effective',
    valuePerRank: 10,
    effect: (rank) => ({ healing_bonus: rank * 0.1 }),
    requires: ['regeneration', 'iron_will'],
    levelRequired: 10,
  },

  // Tier 4 - Capstone
  undying: {
    id: 'undying',
    name: 'Undying',
    branch: TALENT_BRANCHES.SURVIVAL,
    tier: 4,
    maxRank: 1,
    icon: '🔱',
    description: 'Once per run, survive a fatal blow with 1 HP',
    valuePerRank: 1,
    effect: (rank) => ({ cheat_death: true }),
    requires: ['second_wind'],
    levelRequired: 20,
  },

  // ========== FORTUNE BRANCH ==========
  // Tier 1
  gold_digger: {
    id: 'gold_digger',
    name: 'Gold Digger',
    branch: TALENT_BRANCHES.FORTUNE,
    tier: 1,
    maxRank: 5,
    icon: '💰',
    description: 'Earn {value}% more gold from battles',
    valuePerRank: 5,
    effect: (rank) => ({ gold_bonus: rank * 0.05 }),
    requires: [],
    levelRequired: 1,
  },

  lucky_find: {
    id: 'lucky_find',
    name: 'Lucky Find',
    branch: TALENT_BRANCHES.FORTUNE,
    tier: 1,
    maxRank: 5,
    icon: '🍀',
    description: 'Increase item drop rate by {value}%',
    valuePerRank: 3,
    effect: (rank) => ({ item_drop_bonus: rank * 0.03 }),
    requires: [],
    levelRequired: 1,
  },

  // Tier 2
  treasure_hunter: {
    id: 'treasure_hunter',
    name: 'Treasure Hunter',
    branch: TALENT_BRANCHES.FORTUNE,
    tier: 2,
    maxRank: 3,
    icon: '🗝️',
    description: 'Find {value}% more rare items',
    valuePerRank: 5,
    effect: (rank) => ({ rare_item_bonus: rank * 0.05 }),
    requires: ['lucky_find'],
    levelRequired: 5,
  },

  bargain_hunter: {
    id: 'bargain_hunter',
    name: 'Bargain Hunter',
    branch: TALENT_BRANCHES.FORTUNE,
    tier: 2,
    maxRank: 3,
    icon: '🏷️',
    description: 'Shop prices reduced by {value}%',
    valuePerRank: 5,
    effect: (rank) => ({ shop_discount: rank * 0.05 }),
    requires: ['gold_digger'],
    levelRequired: 5,
  },

  // Tier 3
  high_roller: {
    id: 'high_roller',
    name: 'High Roller',
    branch: TALENT_BRANCHES.FORTUNE,
    tier: 3,
    maxRank: 3,
    icon: '🎰',
    description: 'Chance for double rewards: {value}%',
    valuePerRank: 5,
    effect: (rank) => ({ double_reward_chance: rank * 0.05 }),
    requires: ['treasure_hunter', 'bargain_hunter'],
    levelRequired: 10,
  },

  // Tier 4 - Capstone
  midas_touch: {
    id: 'midas_touch',
    name: 'Midas Touch',
    branch: TALENT_BRANCHES.FORTUNE,
    tier: 4,
    maxRank: 1,
    icon: '👑',
    description: 'Start each run with 100 bonus gold',
    valuePerRank: 100,
    effect: (rank) => ({ starting_gold: 100 }),
    requires: ['high_roller'],
    levelRequired: 20,
  },

  // ========== MASTERY BRANCH ==========
  // Tier 1
  quick_learner: {
    id: 'quick_learner',
    name: 'Quick Learner',
    branch: TALENT_BRANCHES.MASTERY,
    tier: 1,
    maxRank: 5,
    icon: '📚',
    description: 'Earn {value}% more XP',
    valuePerRank: 5,
    effect: (rank) => ({ xp_bonus: rank * 0.05 }),
    requires: [],
    levelRequired: 1,
  },

  pokemon_bond: {
    id: 'pokemon_bond',
    name: 'Pokémon Bond',
    branch: TALENT_BRANCHES.MASTERY,
    tier: 1,
    maxRank: 5,
    icon: '💕',
    description: 'Starter Pokémon get {value}% bonus stats',
    valuePerRank: 2,
    effect: (rank) => ({ starter_bonus: rank * 0.02 }),
    requires: [],
    levelRequired: 1,
  },

  // Tier 2
  move_tutor: {
    id: 'move_tutor',
    name: 'Move Tutor',
    branch: TALENT_BRANCHES.MASTERY,
    tier: 2,
    maxRank: 3,
    icon: '📖',
    description: 'Pokémon start with {value} additional move slot(s)',
    valuePerRank: 1,
    effect: (rank) => ({ extra_moves: rank }),
    requires: ['quick_learner'],
    levelRequired: 5,
  },

  team_synergy: {
    id: 'team_synergy',
    name: 'Team Synergy',
    branch: TALENT_BRANCHES.MASTERY,
    tier: 2,
    maxRank: 3,
    icon: '🤝',
    description: 'Same-type Pokémon on team get {value}% bonus stats',
    valuePerRank: 3,
    effect: (rank) => ({ type_synergy: rank * 0.03 }),
    requires: ['pokemon_bond'],
    levelRequired: 5,
  },

  // Tier 3
  evolution_expert: {
    id: 'evolution_expert',
    name: 'Evolution Expert',
    branch: TALENT_BRANCHES.MASTERY,
    tier: 3,
    maxRank: 3,
    icon: '✨',
    description: 'Evolution stones {value}% more effective',
    valuePerRank: 10,
    effect: (rank) => ({ evolution_bonus: rank * 0.1 }),
    requires: ['move_tutor', 'team_synergy'],
    levelRequired: 10,
  },

  // Tier 4 - Capstone
  legendary_trainer: {
    id: 'legendary_trainer',
    name: 'Legendary Trainer',
    branch: TALENT_BRANCHES.MASTERY,
    tier: 4,
    maxRank: 1,
    icon: '🌟',
    description: 'Start with an extra team slot (4 Pokémon)',
    valuePerRank: 1,
    effect: (rank) => ({ extra_team_slot: 1 }),
    requires: ['evolution_expert'],
    levelRequired: 20,
  },
};

// Talent points per level
export function getTalentPointsForLevel(level) {
  // 1 point per level, bonus points at milestones
  let points = level;
  if (level >= 10) points += 2;
  if (level >= 20) points += 3;
  if (level >= 30) points += 4;
  if (level >= 40) points += 5;
  if (level >= 50) points += 6;
  return points;
}

// ============================================
// STARTER SHOP CONFIGURATION
// ============================================

export const STARTER_SHOP = {
  // Default starters (free)
  charizard: { price: 0, currency: 'tokens', unlocked: true },
  blastoise: { price: 0, currency: 'tokens', unlocked: true },
  venusaur: { price: 0, currency: 'tokens', unlocked: true },

  // Purchasable starters
  pikachu: {
    price: 50,
    currency: 'tokens',
    levelRequired: 5,
    description: 'The iconic Electric Mouse Pokémon'
  },
  gengar: {
    price: 100,
    currency: 'tokens',
    levelRequired: 10,
    description: 'A tricky Ghost-type specialist'
  },
  dragonite: {
    price: 150,
    currency: 'tokens',
    levelRequired: 15,
    description: 'A powerful Dragon-type with great stats'
  },
  tyranitar: {
    price: 200,
    currency: 'tokens',
    levelRequired: 20,
    description: 'The Armor Pokémon - Dark/Rock powerhouse'
  },
  metagross: {
    price: 250,
    currency: 'tokens',
    levelRequired: 25,
    description: 'Steel/Psychic pseudo-legendary'
  },
  garchomp: {
    price: 300,
    currency: 'tokens',
    levelRequired: 30,
    description: 'The ultimate Dragon/Ground predator'
  },

  // Premium starters (special)
  lucario: {
    price: 200,
    currency: 'tokens',
    levelRequired: 15,
    description: 'Aura Pokémon - Fighting/Steel',
    pokedexId: 448,
  },
  salamence: {
    price: 275,
    currency: 'tokens',
    levelRequired: 25,
    description: 'Dragon/Flying pseudo-legendary',
    pokedexId: 373,
  },
  mewtwo: {
    price: 500,
    currency: 'tokens',
    levelRequired: 40,
    achievementRequired: 'tower_champion',
    description: 'The ultimate Psychic Pokémon',
    pokedexId: 150,
  },
};

// ============================================
// TITLES/RANKS
// ============================================

export const PLAYER_TITLES = [
  { level: 1, title: 'Novice Trainer', icon: '🌱' },
  { level: 5, title: 'Pokémon Trainer', icon: '⭐' },
  { level: 10, title: 'Skilled Trainer', icon: '🎖️' },
  { level: 15, title: 'Veteran Trainer', icon: '🏅' },
  { level: 20, title: 'Expert Trainer', icon: '🥇' },
  { level: 25, title: 'Ace Trainer', icon: '💎' },
  { level: 30, title: 'Elite Trainer', icon: '👑' },
  { level: 35, title: 'Master Trainer', icon: '🔥' },
  { level: 40, title: 'Champion', icon: '🏆' },
  { level: 45, title: 'Legendary Trainer', icon: '⚡' },
  { level: 50, title: 'Tower Master', icon: '🌟' },
];

export function getPlayerTitle(level) {
  let currentTitle = PLAYER_TITLES[0];
  for (const title of PLAYER_TITLES) {
    if (level >= title.level) {
      currentTitle = title;
    }
  }
  return currentTitle;
}

// ============================================
// PROGRESSION STATE MANAGEMENT
// ============================================

const DEFAULT_PROGRESSION = {
  // Player level
  level: 1,
  currentXP: 0,
  totalXP: 0,

  // Currencies
  towerTokens: 0,
  permanentGold: 0,

  // Talents (talentId -> rank)
  talents: {},
  talentPointsSpent: 0,

  // Unlocked starters
  unlockedStarters: ['charizard', 'blastoise', 'venusaur'],

  // Daily tracking
  lastLoginDate: null,
  loginStreak: 0,
  runsToday: 0,

  // Milestone tracking
  highestFloorReached: 0,
  milestonesReached: [],

  // Statistics
  totalRuns: 0,
  totalWins: 0,
  totalBattles: 0,
  totalBossesDefeated: 0,
  totalElitesDefeated: 0,
};

// Load progression from storage
export function loadProgression() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...DEFAULT_PROGRESSION, ...parsed };
    }
  } catch (error) {
    console.error('[Progression] Failed to load:', error);
  }
  return { ...DEFAULT_PROGRESSION };
}

// Save progression to storage
export function saveProgression(progression) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progression));
    console.log('[Progression] Saved successfully');
  } catch (error) {
    console.error('[Progression] Failed to save:', error);
  }
}

// ============================================
// XP AND LEVELING FUNCTIONS
// ============================================

export function addXP(progression, amount, source = 'unknown') {
  const updated = { ...progression };

  // Apply XP bonus from talents
  const xpBonus = getTalentEffect(updated, 'xp_bonus') || 0;
  const bonusXP = Math.floor(amount * xpBonus);
  const totalAmount = amount + bonusXP;

  updated.currentXP += totalAmount;
  updated.totalXP += totalAmount;

  console.log(`[Progression] +${totalAmount} XP from ${source} (base: ${amount}, bonus: ${bonusXP})`);

  // Check for level ups
  let leveledUp = false;
  while (updated.level < MAX_LEVEL) {
    const xpNeeded = getXPForLevel(updated.level + 1);
    if (updated.currentXP >= xpNeeded) {
      updated.currentXP -= xpNeeded;
      updated.level += 1;
      leveledUp = true;
      console.log(`[Progression] LEVEL UP! Now level ${updated.level}`);
    } else {
      break;
    }
  }

  saveProgression(updated);
  return { progression: updated, leveledUp, xpGained: totalAmount };
}

// ============================================
// TOKEN FUNCTIONS
// ============================================

export function addTokens(progression, amount, source = 'unknown') {
  const updated = { ...progression };
  updated.towerTokens += amount;

  console.log(`[Progression] +${amount} Tower Tokens from ${source}`);

  saveProgression(updated);
  return updated;
}

export function spendTokens(progression, amount) {
  if (progression.towerTokens < amount) {
    return { success: false, progression };
  }

  const updated = { ...progression };
  updated.towerTokens -= amount;
  saveProgression(updated);

  return { success: true, progression: updated };
}

// ============================================
// TALENT FUNCTIONS
// ============================================

export function getTalentRank(progression, talentId) {
  return progression.talents[talentId] || 0;
}

export function canUnlockTalent(progression, talentId) {
  const talent = TALENTS[talentId];
  if (!talent) return { canUnlock: false, reason: 'Invalid talent' };

  // Check level requirement
  if (progression.level < talent.levelRequired) {
    return { canUnlock: false, reason: `Requires level ${talent.levelRequired}` };
  }

  // Check prerequisites
  for (const req of talent.requires) {
    const reqTalent = TALENTS[req];
    const reqRank = getTalentRank(progression, req);
    if (reqRank < reqTalent.maxRank) {
      return { canUnlock: false, reason: `Requires ${reqTalent.name} maxed` };
    }
  }

  // Check if already maxed
  const currentRank = getTalentRank(progression, talentId);
  if (currentRank >= talent.maxRank) {
    return { canUnlock: false, reason: 'Already maxed' };
  }

  // Check available points
  const availablePoints = getAvailableTalentPoints(progression);
  if (availablePoints <= 0) {
    return { canUnlock: false, reason: 'No talent points available' };
  }

  return { canUnlock: true };
}

export function unlockTalent(progression, talentId) {
  const { canUnlock, reason } = canUnlockTalent(progression, talentId);

  if (!canUnlock) {
    console.warn(`[Progression] Cannot unlock ${talentId}: ${reason}`);
    return { success: false, reason, progression };
  }

  const updated = { ...progression };
  updated.talents = { ...updated.talents };
  updated.talents[talentId] = (updated.talents[talentId] || 0) + 1;
  updated.talentPointsSpent += 1;

  saveProgression(updated);
  console.log(`[Progression] Unlocked ${talentId} rank ${updated.talents[talentId]}`);

  return { success: true, progression: updated };
}

export function resetTalents(progression) {
  const updated = { ...progression };
  updated.talents = {};
  updated.talentPointsSpent = 0;
  saveProgression(updated);

  console.log('[Progression] Talents reset');
  return updated;
}

export function getAvailableTalentPoints(progression) {
  const totalPoints = getTalentPointsForLevel(progression.level);
  return totalPoints - progression.talentPointsSpent;
}

// Get combined effect from all talents
export function getTalentEffect(progression, effectKey) {
  let totalEffect = 0;

  for (const [talentId, rank] of Object.entries(progression.talents)) {
    if (rank <= 0) continue;

    const talent = TALENTS[talentId];
    if (!talent) continue;

    const effect = talent.effect(rank);
    if (effect[effectKey] !== undefined) {
      if (typeof effect[effectKey] === 'boolean') {
        return effect[effectKey];
      }
      totalEffect += effect[effectKey];
    }
  }

  return totalEffect;
}

// Get all active talent effects as an object
export function getAllTalentEffects(progression) {
  const effects = {};

  for (const [talentId, rank] of Object.entries(progression.talents)) {
    if (rank <= 0) continue;

    const talent = TALENTS[talentId];
    if (!talent) continue;

    const effect = talent.effect(rank);
    for (const [key, value] of Object.entries(effect)) {
      if (effects[key] === undefined) {
        effects[key] = value;
      } else if (typeof value === 'boolean') {
        effects[key] = effects[key] || value;
      } else {
        effects[key] += value;
      }
    }
  }

  return effects;
}

// ============================================
// STARTER SHOP FUNCTIONS
// ============================================

export function canBuyStarter(progression, starterId) {
  const starterConfig = STARTER_SHOP[starterId];
  if (!starterConfig) {
    return { canBuy: false, reason: 'Invalid starter' };
  }

  // Check if already owned
  if (progression.unlockedStarters.includes(starterId)) {
    return { canBuy: false, reason: 'Already owned' };
  }

  // Check level requirement
  if (starterConfig.levelRequired && progression.level < starterConfig.levelRequired) {
    return { canBuy: false, reason: `Requires level ${starterConfig.levelRequired}` };
  }

  // Check achievement requirement
  if (starterConfig.achievementRequired) {
    // Would need to integrate with achievements system
    // For now, skip this check
  }

  // Check currency
  if (progression.towerTokens < starterConfig.price) {
    return { canBuy: false, reason: `Need ${starterConfig.price} tokens` };
  }

  return { canBuy: true, price: starterConfig.price };
}

export function buyStarter(progression, starterId) {
  const { canBuy, reason, price } = canBuyStarter(progression, starterId);

  if (!canBuy) {
    return { success: false, reason, progression };
  }

  const updated = { ...progression };
  updated.towerTokens -= price;
  updated.unlockedStarters = [...updated.unlockedStarters, starterId];

  saveProgression(updated);
  console.log(`[Progression] Bought starter: ${starterId}`);

  return { success: true, progression: updated };
}

// ============================================
// DAILY LOGIN FUNCTIONS
// ============================================

export function checkDailyLogin(progression) {
  const today = new Date().toDateString();
  const updated = { ...progression };

  if (updated.lastLoginDate !== today) {
    // New day!
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (updated.lastLoginDate === yesterday.toDateString()) {
      // Continuing streak
      updated.loginStreak += 1;
    } else {
      // Streak broken
      updated.loginStreak = 1;
    }

    updated.lastLoginDate = today;
    updated.runsToday = 0;

    // Award daily login bonus
    updated.towerTokens += TOKEN_REWARDS.daily_login;

    // Weekly streak bonus
    if (updated.loginStreak % 7 === 0) {
      updated.towerTokens += TOKEN_REWARDS.weekly_streak;
      console.log('[Progression] Weekly streak bonus!');
    }

    saveProgression(updated);
    console.log(`[Progression] Daily login! Streak: ${updated.loginStreak}`);
  }

  return updated;
}

// ============================================
// RUN COMPLETION REWARDS
// ============================================

export function processRunCompletion(progression, runData) {
  let updated = { ...progression };
  let xpGained = 0;
  let tokensGained = 0;

  const {
    floorsCleared = 0,
    battlesWon = 0,
    elitesDefeated = 0,
    bossesDefeated = 0,
    legendaryDefeated = false,
    victory = false,
    goldEarned = 0,
  } = runData;

  // Update statistics
  updated.totalRuns += 1;
  updated.totalBattles += battlesWon;
  updated.totalBossesDefeated += bossesDefeated;
  updated.totalElitesDefeated += elitesDefeated;

  if (victory) {
    updated.totalWins += 1;
  }

  // Track highest floor
  if (floorsCleared > updated.highestFloorReached) {
    updated.highestFloorReached = floorsCleared;

    // Check floor milestones
    const milestones = [5, 10, 15, 20];
    for (const milestone of milestones) {
      if (floorsCleared >= milestone && !updated.milestonesReached.includes(milestone)) {
        updated.milestonesReached.push(milestone);
        tokensGained += TOKEN_REWARDS[`floor_${milestone}_first_time`] || 0;
        console.log(`[Progression] Floor ${milestone} milestone reached!`);
      }
    }
  }

  // Calculate XP
  xpGained += battlesWon * XP_REWARDS.battle_won;
  xpGained += elitesDefeated * XP_REWARDS.elite_defeated;
  xpGained += bossesDefeated * XP_REWARDS.boss_defeated;
  xpGained += floorsCleared * XP_REWARDS.floor_cleared;
  xpGained += XP_REWARDS.run_completed;

  if (victory) {
    xpGained += XP_REWARDS.run_victory;
  }
  if (legendaryDefeated) {
    xpGained += XP_REWARDS.legendary_defeated;
  }

  // Calculate tokens
  tokensGained += TOKEN_REWARDS.run_completed;
  tokensGained += bossesDefeated * TOKEN_REWARDS.boss_defeated;

  if (victory) {
    tokensGained += TOKEN_REWARDS.run_victory;
  }
  if (legendaryDefeated) {
    tokensGained += TOKEN_REWARDS.legendary_defeated;
  }

  // First run of day bonus
  if (updated.runsToday === 0) {
    xpGained += XP_REWARDS.first_run_of_day;
  }
  updated.runsToday += 1;

  // Permanent gold (10% of earnings)
  const permanentGoldGain = Math.floor(goldEarned * 0.1);
  updated.permanentGold += permanentGoldGain;

  // Apply XP (with potential level up)
  const xpResult = addXP(updated, xpGained, 'run_completion');
  updated = xpResult.progression;

  // Apply tokens
  updated = addTokens(updated, tokensGained, 'run_completion');

  console.log(`[Progression] Run complete! XP: +${xpGained}, Tokens: +${tokensGained}`);

  return {
    progression: updated,
    rewards: {
      xpGained,
      tokensGained,
      permanentGoldGain,
      leveledUp: xpResult.leveledUp,
      newLevel: updated.level,
    }
  };
}

// ============================================
// UTILITY EXPORTS
// ============================================

export default {
  // Config
  MAX_LEVEL,
  TALENTS,
  TALENT_BRANCHES,
  STARTER_SHOP,
  PLAYER_TITLES,
  XP_REWARDS,
  TOKEN_REWARDS,

  // Level functions
  getXPForLevel,
  getTotalXPForLevel,
  getTalentPointsForLevel,
  getPlayerTitle,

  // State management
  loadProgression,
  saveProgression,

  // XP and leveling
  addXP,

  // Tokens
  addTokens,
  spendTokens,

  // Talents
  getTalentRank,
  canUnlockTalent,
  unlockTalent,
  resetTalents,
  getAvailableTalentPoints,
  getTalentEffect,
  getAllTalentEffects,

  // Starter shop
  canBuyStarter,
  buyStarter,

  // Daily
  checkDailyLogin,

  // Run completion
  processRunCompletion,
};
