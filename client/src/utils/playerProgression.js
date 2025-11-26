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

export const TRAINER_SKILLS = {
  heal: {
    id: 'heal',
    name: 'Emergency Heal',
    icon: '💚',
    description: 'Heal your active Pokémon for 50% HP.',
    cooldown: 2, // Floors
    effect: { type: 'heal', percent: 50 },
  },
  enrage: {
    id: 'enrage',
    name: 'Enrage',
    icon: '😡',
    description: 'Your Pokémon deals 50% more damage this turn.',
    cooldown: 1, // Floors
    effect: { type: 'buff', stat: 'damage', value: 0.5, duration: 1 },
  },
  shield: {
    id: 'shield',
    name: 'Energy Shield',
    icon: '🛡️',
    description: 'Reduce incoming damage by 75% this turn.',
    cooldown: 2, // Floors
    effect: { type: 'buff', stat: 'damage_reduction', value: 0.75, duration: 1 },
  },
  refresh: {
    id: 'refresh',
    name: 'Refresh',
    icon: '✨',
    description: 'Cure all status effects on your active Pokémon.',
    cooldown: 1, // Floors
    effect: { type: 'cure_status' },
  },
};

export const TALENTS = {
  // ========== COMBAT BRANCH (Offense & Active Skills) ==========
  // Tier 1
  training_regimen: {
    id: 'training_regimen',
    name: 'Training Regimen',
    branch: TALENT_BRANCHES.COMBAT,
    tier: 1,
    maxRank: 5,
    icon: '⚔️',
    description: 'Increase all damage dealt by {value}%',
    valuePerRank: 5,
    effect: (rank) => ({ damage_bonus: rank * 0.05 }),
    requires: [],
    levelRequired: 1,
  },
  
  unlock_enrage: {
    id: 'unlock_enrage',
    name: 'Skill: Enrage',
    branch: TALENT_BRANCHES.COMBAT,
    tier: 1,
    maxRank: 1,
    icon: '😡',
    description: 'Unlock Active Skill: Enrage (Deal +50% dmg for 1 turn)',
    valuePerRank: 1,
    effect: (rank) => ({ unlock_skill: 'enrage' }),
    requires: [],
    levelRequired: 2,
    isActive: true,
  },

  // Tier 2
  critical_eye: {
    id: 'critical_eye',
    name: 'Critical Eye',
    branch: TALENT_BRANCHES.COMBAT,
    tier: 2,
    maxRank: 3,
    icon: '🎯',
    description: 'Increase Critical Hit Chance by {value}%',
    valuePerRank: 5,
    effect: (rank) => ({ crit_chance: rank * 0.05 }),
    requires: ['training_regimen'],
    levelRequired: 5,
  },

  executioner: {
    id: 'executioner',
    name: 'Executioner',
    branch: TALENT_BRANCHES.COMBAT,
    tier: 2,
    maxRank: 3,
    icon: '🪓',
    description: 'Deal {value}% more damage to enemies below 50% HP',
    valuePerRank: 10,
    effect: (rank) => ({ low_hp_damage_bonus: rank * 0.1 }),
    requires: ['unlock_enrage'],
    levelRequired: 5,
  },

  // Tier 3
  momentum: {
    id: 'momentum',
    name: 'Momentum',
    branch: TALENT_BRANCHES.COMBAT,
    tier: 3,
    maxRank: 3,
    icon: '⏩',
    description: 'Gain {value}% Speed every turn in battle (max 5 stacks)',
    valuePerRank: 5,
    effect: (rank) => ({ speed_stack: rank * 0.05 }),
    requires: ['critical_eye'],
    levelRequired: 10,
  },

  // Tier 4 (Capstone)
  warlord: {
    id: 'warlord',
    name: 'Warlord',
    branch: TALENT_BRANCHES.COMBAT,
    tier: 4,
    maxRank: 1,
    icon: '👹',
    description: 'Start every battle with +1 Attack Stage',
    valuePerRank: 1,
    effect: (rank) => ({ start_battle_buff: { stat: 'attack', stages: 1 } }),
    requires: ['momentum'],
    levelRequired: 20,
  },

  // ========== SURVIVAL BRANCH (Defense & Active Skills) ==========
  // Tier 1
  thick_hide: {
    id: 'thick_hide',
    name: 'Thick Hide',
    branch: TALENT_BRANCHES.SURVIVAL,
    tier: 1,
    maxRank: 5,
    icon: '🛡️',
    description: 'Reduce all damage taken by {value}%',
    valuePerRank: 3,
    effect: (rank) => ({ damage_reduction: rank * 0.03 }),
    requires: [],
    levelRequired: 1,
  },

  unlock_heal: {
    id: 'unlock_heal',
    name: 'Skill: Emergency Heal',
    branch: TALENT_BRANCHES.SURVIVAL,
    tier: 1,
    maxRank: 1,
    icon: '💚',
    description: 'Unlock Active Skill: Heal 50% HP (5 turn cooldown)',
    valuePerRank: 1,
    effect: (rank) => ({ unlock_skill: 'heal' }),
    requires: [],
    levelRequired: 2,
    isActive: true,
  },

  // Tier 2
  regeneration: {
    id: 'regeneration',
    name: 'Regeneration',
    branch: TALENT_BRANCHES.SURVIVAL,
    tier: 2,
    maxRank: 3,
    icon: '🌿',
    description: 'Heal {value}% max HP at the start of every turn',
    valuePerRank: 2,
    effect: (rank) => ({ turn_heal: rank * 0.02 }),
    requires: ['thick_hide'],
    levelRequired: 5,
  },

  unlock_shield: {
    id: 'unlock_shield',
    name: 'Skill: Energy Shield',
    branch: TALENT_BRANCHES.SURVIVAL,
    tier: 2,
    maxRank: 1,
    icon: '🛡️',
    description: 'Unlock Active Skill: Reduce dmg by 75% for 1 turn',
    valuePerRank: 1,
    effect: (rank) => ({ unlock_skill: 'shield' }),
    requires: ['unlock_heal'],
    levelRequired: 8,
    isActive: true,
  },

  // Tier 3
  resilience: {
    id: 'resilience',
    name: 'Resilience',
    branch: TALENT_BRANCHES.SURVIVAL,
    tier: 3,
    maxRank: 3,
    icon: '🧘',
    description: 'Status effects last {value} fewer turns (min 1)',
    valuePerRank: 1,
    effect: (rank) => ({ status_duration_reduction: rank }),
    requires: ['regeneration'],
    levelRequired: 10,
  },

  // Tier 4 (Capstone)
  immortal: {
    id: 'immortal',
    name: 'Immortal',
    branch: TALENT_BRANCHES.SURVIVAL,
    tier: 4,
    maxRank: 1,
    icon: '🔱',
    description: 'Once per run, revive with 50% HP when defeated',
    valuePerRank: 1,
    effect: (rank) => ({ revive_chance: 1.0 }),
    requires: ['resilience'],
    levelRequired: 20,
  },

  // ========== FORTUNE BRANCH (Economy & Loot) ==========
  // Tier 1
  gold_interest: {
    id: 'gold_interest',
    name: 'Compound Interest',
    branch: TALENT_BRANCHES.FORTUNE,
    tier: 1,
    maxRank: 5,
    icon: '📈',
    description: 'Gain {value}% of your current gold as interest after each floor (max 50)',
    valuePerRank: 2,
    effect: (rank) => ({ gold_interest: rank * 0.02 }),
    requires: [],
    levelRequired: 1,
  },

  bounty_hunter: {
    id: 'bounty_hunter',
    name: 'Bounty Hunter',
    branch: TALENT_BRANCHES.FORTUNE,
    tier: 1,
    maxRank: 5,
    icon: '💰',
    description: 'Bosses and Elites drop {value}% more gold',
    valuePerRank: 20,
    effect: (rank) => ({ elite_gold_bonus: rank * 0.2 }),
    requires: [],
    levelRequired: 1,
  },

  // Tier 2
  lucky_charm: {
    id: 'lucky_charm',
    name: 'Lucky Charm',
    branch: TALENT_BRANCHES.FORTUNE,
    tier: 2,
    maxRank: 3,
    icon: '🍀',
    description: 'Increase chance to find Rare/Epic items by {value}%',
    valuePerRank: 10,
    effect: (rank) => ({ rare_drop_chance: rank * 0.1 }),
    requires: ['gold_interest'],
    levelRequired: 5,
  },

  discount_card: {
    id: 'discount_card',
    name: 'VIP Member',
    branch: TALENT_BRANCHES.FORTUNE,
    tier: 2,
    maxRank: 3,
    icon: '🏷️',
    description: 'Shop prices are reduced by {value}%',
    valuePerRank: 10,
    effect: (rank) => ({ shop_discount: rank * 0.1 }),
    requires: ['bounty_hunter'],
    levelRequired: 5,
  },

  // Tier 3
  shiny_hunter: {
    id: 'shiny_hunter',
    name: 'Shiny Hunter',
    branch: TALENT_BRANCHES.FORTUNE,
    tier: 3,
    maxRank: 3,
    icon: '✨',
    description: 'Significantly increase chance to encounter Shiny Pokémon (x{value})',
    valuePerRank: 2,
    effect: (rank) => ({ shiny_chance_multiplier: 1 + (rank * 2) }),
    requires: ['lucky_charm'],
    levelRequired: 10,
  },

  // Tier 4 (Capstone)
  tycoon: {
    id: 'tycoon',
    name: 'Tycoon',
    branch: TALENT_BRANCHES.FORTUNE,
    tier: 4,
    maxRank: 1,
    icon: '👑',
    description: 'You can reroll Shop items and Event choices once per floor',
    valuePerRank: 1,
    effect: (rank) => ({ free_reroll: true }),
    requires: ['shiny_hunter'],
    levelRequired: 20,
  },

  // ========== MASTERY BRANCH (Utility & Progression) ==========
  // Tier 1
  fast_learner: {
    id: 'fast_learner',
    name: 'Fast Learner',
    branch: TALENT_BRANCHES.MASTERY,
    tier: 1,
    maxRank: 5,
    icon: '📚',
    description: 'Gain {value}% more XP from battles',
    valuePerRank: 10,
    effect: (rank) => ({ xp_bonus: rank * 0.1 }),
    requires: [],
    levelRequired: 1,
  },

  unlock_refresh: {
    id: 'unlock_refresh',
    name: 'Skill: Refresh',
    branch: TALENT_BRANCHES.MASTERY,
    tier: 1,
    maxRank: 1,
    icon: '✨',
    description: 'Unlock Active Skill: Cure all status effects (3 turn cooldown)',
    valuePerRank: 1,
    effect: (rank) => ({ unlock_skill: 'refresh' }),
    requires: [],
    levelRequired: 3,
    isActive: true,
  },

  // Tier 2
  move_tutor: {
    id: 'move_tutor',
    name: 'Move Tutor',
    branch: TALENT_BRANCHES.MASTERY,
    tier: 2,
    maxRank: 3,
    icon: '📖',
    description: 'Start run with {value} extra random Move Tutor move(s)',
    valuePerRank: 1,
    effect: (rank) => ({ start_extra_moves: rank }),
    requires: ['fast_learner'],
    levelRequired: 5,
  },

  evolution_master: {
    id: 'evolution_master',
    name: 'Evolution Master',
    branch: TALENT_BRANCHES.MASTERY,
    tier: 2,
    maxRank: 3,
    icon: '🧬',
    description: 'Evolved Pokémon gain +{value}% stats',
    valuePerRank: 5,
    effect: (rank) => ({ evolution_stat_bonus: rank * 0.05 }),
    requires: ['unlock_refresh'],
    levelRequired: 5,
  },

  // Tier 3
  synergy_master: {
    id: 'synergy_master',
    name: 'Synergy Master',
    branch: TALENT_BRANCHES.MASTERY,
    tier: 3,
    maxRank: 3,
    icon: '🤝',
    description: 'Relic bonuses are {value}% more effective',
    valuePerRank: 10,
    effect: (rank) => ({ relic_effectiveness: rank * 0.1 }),
    requires: ['move_tutor'],
    levelRequired: 10,
  },

  // Tier 4 (Capstone)
  legendary_soul: {
    id: 'legendary_soul',
    name: 'Legendary Soul',
    branch: TALENT_BRANCHES.MASTERY,
    tier: 4,
    maxRank: 1,
    icon: '🌟',
    description: 'Your Starter Pokémon becomes a "Legendary" variant (Higher stats)',
    valuePerRank: 1,
    effect: (rank) => ({ starter_legendary_boost: true }),
    requires: ['synergy_master'],
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
  // Default starters (free - first stage evolutions)
  charmander: { price: 0, currency: 'tokens', unlocked: true },
  squirtle: { price: 0, currency: 'tokens', unlocked: true },
  bulbasaur: { price: 0, currency: 'tokens', unlocked: true },

  // Purchasable starters - Evolved Forms
  charizard: {
    price: 100,
    currency: 'tokens',
    levelRequired: 10,
    description: 'The fully evolved Fire/Flying starter - powerful and iconic'
  },
  blastoise: {
    price: 100,
    currency: 'tokens',
    levelRequired: 10,
    description: 'The fully evolved Water starter - defensive powerhouse'
  },
  venusaur: {
    price: 100,
    currency: 'tokens',
    levelRequired: 10,
    description: 'The fully evolved Grass/Poison starter - balanced and versatile'
  },

  // Other purchasable starters
  pikachu: {
    price: 50,
    currency: 'tokens',
    levelRequired: 5,
    description: 'The iconic Electric Mouse Pokémon'
  },
  gengar: {
    price: 125,
    currency: 'tokens',
    levelRequired: 12,
    description: 'A tricky Ghost-type specialist'
  },
  dragonite: {
    price: 175,
    currency: 'tokens',
    levelRequired: 18,
    description: 'A powerful Dragon-type with great stats'
  },
  tyranitar: {
    price: 225,
    currency: 'tokens',
    levelRequired: 22,
    description: 'The Armor Pokémon - Dark/Rock powerhouse'
  },
  metagross: {
    price: 275,
    currency: 'tokens',
    levelRequired: 28,
    description: 'Steel/Psychic pseudo-legendary'
  },
  garchomp: {
    price: 325,
    currency: 'tokens',
    levelRequired: 32,
    description: 'The ultimate Dragon/Ground predator'
  },

  // Premium starters (special)
  lucario: {
    price: 225,
    currency: 'tokens',
    levelRequired: 18,
    description: 'Aura Pokémon - Fighting/Steel',
    pokedexId: 448,
  },
  salamence: {
    price: 300,
    currency: 'tokens',
    levelRequired: 28,
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
  unlockedStarters: ['charmander', 'squirtle', 'bulbasaur'],

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

// Get all unlocked trainer skills
export function getUnlockedSkills(progression) {
  const skills = [];

  for (const [talentId, rank] of Object.entries(progression.talents)) {
    if (rank <= 0) continue;

    const talent = TALENTS[talentId];
    if (!talent) continue;

    const effect = talent.effect(rank);
    if (effect.unlock_skill) {
      skills.push(effect.unlock_skill);
    }
  }

  return skills;
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

  // IMPORTANT: Save progression to localStorage!
  saveProgression(updated);

  console.log(`[Progression] Run complete! XP: +${xpGained}, Tokens: +${tokensGained}, Gold: +${permanentGoldGain}`);

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
