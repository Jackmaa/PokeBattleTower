// 📁 metaProgression.js
// Meta-progression system for unlockables and achievements

const META_KEY = 'pbt_meta_progress';

// Default starting starters
const DEFAULT_STARTERS = ['charizard', 'blastoise', 'venusaur'];

// Unlockable starters (after certain conditions)
const UNLOCKABLE_STARTERS = [
  { id: 'pikachu', name: 'Pikachu', condition: 'win_once', description: 'Win a run to unlock' },
  { id: 'gengar', name: 'Gengar', condition: 'floor_10', description: 'Reach floor 10 to unlock' },
  { id: 'dragonite', name: 'Dragonite', condition: 'floor_15', description: 'Reach floor 15 to unlock' },
  { id: 'tyranitar', name: 'Tyranitar', condition: 'win_3', description: 'Win 3 runs to unlock' },
  { id: 'metagross', name: 'Metagross', condition: 'floor_20', description: 'Complete the tower to unlock' },
  { id: 'garchomp', name: 'Garchomp', condition: 'catch_20', description: 'Catch 20 Pokemon total to unlock' },
];

// Achievements with rewards
// Reward types:
//   - { type: 'gold', amount: X } - Permanent gold
//   - { type: 'relic', relicId: 'specific_relic' } - Specific relic unlock
//   - { type: 'starter', starterId: 'pokemon_id' } - Starter unlock
const ACHIEVEMENTS = [
  {
    id: 'first_win',
    name: 'Tower Conqueror',
    icon: '🏆',
    description: 'Complete the tower for the first time',
    condition: 'win_once',
    reward: { type: 'relic', relicId: 'lucky_coin', relicName: 'Lucky Coin', relicDescription: '+10% gold from battles' }
  },
  {
    id: 'floor_5',
    name: 'Getting Started',
    icon: '🎯',
    description: 'Reach floor 5',
    condition: 'floor_5',
    reward: { type: 'gold', amount: 100 }
  },
  {
    id: 'floor_10',
    name: 'Halfway There',
    icon: '⭐',
    description: 'Reach floor 10',
    condition: 'floor_10',
    reward: { type: 'relic', relicId: 'iron_fist', relicName: 'Iron Fist', relicDescription: '+5% physical damage' }
  },
  {
    id: 'floor_15',
    name: 'Almost There',
    icon: '🌟',
    description: 'Reach floor 15',
    condition: 'floor_15',
    reward: { type: 'gold', amount: 500 }
  },
  {
    id: 'floor_20',
    name: 'Tower Master',
    icon: '👑',
    description: 'Reach floor 20',
    condition: 'floor_20',
    reward: { type: 'relic', relicId: 'crown_of_mastery', relicName: 'Crown of Mastery', relicDescription: '+10% all stats' }
  },
  {
    id: 'gold_1000',
    name: 'Wealthy',
    icon: '💰',
    description: 'Earn 1000 gold in a single run',
    condition: 'gold_1000',
    reward: { type: 'gold', amount: 200 }
  },
  {
    id: 'gold_5000',
    name: 'Rich',
    icon: '💎',
    description: 'Earn 5000 gold in a single run',
    condition: 'gold_5000',
    reward: { type: 'relic', relicId: 'golden_crown', relicName: 'Golden Crown', relicDescription: '+25% gold from all sources' }
  },
  {
    id: 'catch_10',
    name: 'Collector',
    icon: '📦',
    description: 'Catch 10 Pokemon total',
    condition: 'catch_10',
    reward: { type: 'gold', amount: 150 }
  },
  {
    id: 'catch_20',
    name: 'Pokemon Master',
    icon: '🎓',
    description: 'Catch 20 Pokemon total',
    condition: 'catch_20',
    reward: { type: 'relic', relicId: 'master_ball_charm', relicName: 'Master Ball Charm', relicDescription: 'Caught Pokemon get +5 to all stats' }
  },
  {
    id: 'win_3',
    name: 'Veteran',
    icon: '🎖️',
    description: 'Win 3 runs',
    condition: 'win_3',
    reward: { type: 'gold', amount: 300 }
  },
  {
    id: 'win_10',
    name: 'Legend',
    icon: '🏅',
    description: 'Win 10 runs',
    condition: 'win_10',
    reward: { type: 'relic', relicId: 'legendary_medal', relicName: 'Legendary Medal', relicDescription: 'Start each run with +20% HP' }
  },
  {
    id: 'no_damage',
    name: 'Perfect',
    icon: '✨',
    description: 'Win a battle without taking damage',
    condition: 'no_damage',
    reward: { type: 'relic', relicId: 'perfect_gem', relicName: 'Perfect Gem', relicDescription: '+10% crit chance' }
  },
  {
    id: 'mega_evolve',
    name: 'Mega Power',
    icon: '💎',
    description: 'Mega Evolve a Pokemon',
    condition: 'mega_evolve',
    reward: { type: 'gold', amount: 250 }
  },
];

// Difficulty modifiers
const DIFFICULTY_LEVELS = [
  { id: 'easy', name: 'Easy', icon: '🟢', multipliers: { enemy_hp: 0.7, enemy_attack: 0.7, gold: 0.5, xp: 0.5 } },
  { id: 'normal', name: 'Normal', icon: '🟡', multipliers: { enemy_hp: 1.0, enemy_attack: 1.0, gold: 1.0, xp: 1.0 } },
  { id: 'hard', name: 'Hard', icon: '🔴', multipliers: { enemy_hp: 1.3, enemy_attack: 1.3, gold: 1.5, xp: 1.5 } },
  { id: 'extreme', name: 'Extreme', icon: '💀', multipliers: { enemy_hp: 1.6, enemy_attack: 1.6, gold: 2.0, xp: 2.0 }, unlockCondition: 'win_once' },
];

/**
 * Get default meta progress state
 */
function getDefaultMetaProgress() {
  return {
    version: '1.0',
    unlockedStarters: [...DEFAULT_STARTERS],
    unlockedAchievements: [],
    claimedRewards: [], // Track which achievement rewards have been claimed
    unlockedRelics: [], // Relics unlocked via achievements (permanently available)
    totalWins: 0,
    totalRuns: 0,
    highestFloor: 0,
    totalGoldEarned: 0,
    totalPokemonCaught: 0,
    permanentGold: 0, // Currency that persists between runs
    selectedDifficulty: 'normal',
    firstPlayDate: Date.now(),
    lastPlayDate: Date.now(),
    // Relic collection system
    relicCollection: {
      discovered: [],  // Relic IDs discovered during runs (available to buy)
      owned: [],       // Relic IDs purchased and owned
      equipped: [],    // Relic IDs currently equipped for next run
      slots: 1,        // Number of equip slots available
    },
    stats: {
      totalBattlesWon: 0,
      totalDamageDealt: 0,
      totalMegaEvolutions: 0,
      perfectBattles: 0,
    }
  };
}

/**
 * Load meta progress from localStorage
 */
export function getMetaProgress() {
  try {
    const data = localStorage.getItem(META_KEY);
    if (!data) {
      return getDefaultMetaProgress();
    }
    const progress = JSON.parse(data);
    // Merge with defaults in case new fields were added
    const merged = { ...getDefaultMetaProgress(), ...progress };

    // Ensure relicCollection exists
    if (!merged.relicCollection) {
      merged.relicCollection = { discovered: [], owned: [], equipped: [], slots: 1 };
    }
    if (!merged.claimedRewards) {
      merged.claimedRewards = [];
    }
    if (!merged.unlockedRelics) {
      merged.unlockedRelics = [];
    }

    // Migration: Ensure achievement relic rewards are in relicCollection.owned
    let needsSave = false;
    for (const achievement of ACHIEVEMENTS) {
      if (merged.unlockedAchievements.includes(achievement.id) && achievement.reward) {
        const reward = achievement.reward;

        // If not claimed yet, apply reward
        if (!merged.claimedRewards.includes(achievement.id)) {
          applyAchievementReward(merged, achievement);
          merged.claimedRewards.push(achievement.id);
          needsSave = true;
          console.log(`[Migration] Applied missing reward for achievement: ${achievement.name}`);
        }
        // If claimed but relic not in owned (old data), fix it
        else if (reward.type === 'relic' && !merged.relicCollection.owned.includes(reward.relicId)) {
          merged.relicCollection.owned.push(reward.relicId);
          if (!merged.relicCollection.discovered.includes(reward.relicId)) {
            merged.relicCollection.discovered.push(reward.relicId);
          }
          needsSave = true;
          console.log(`[Migration] Fixed missing relic in collection: ${reward.relicId}`);
        }
      }
    }

    if (needsSave) {
      saveMetaProgress(merged);
    }

    return merged;
  } catch (error) {
    console.error('Failed to load meta progress:', error);
    return getDefaultMetaProgress();
  }
}

/**
 * Save meta progress to localStorage
 */
export function saveMetaProgress(progress) {
  try {
    progress.lastPlayDate = Date.now();
    localStorage.setItem(META_KEY, JSON.stringify(progress));
    return true;
  } catch (error) {
    console.error('Failed to save meta progress:', error);
    return false;
  }
}

/**
 * Update meta progress after a run
 */
export function updateMetaProgressAfterRun(runData) {
  const progress = getMetaProgress();

  progress.totalRuns++;
  progress.totalGoldEarned += runData.goldEarned || 0;
  progress.totalPokemonCaught += runData.pokemonCaught || 0;

  // Update highest floor
  if (runData.floor > progress.highestFloor) {
    progress.highestFloor = runData.floor;
  }

  // Track wins
  if (runData.victory) {
    progress.totalWins++;
  }

  // Add 10% of gold earned to permanent gold
  progress.permanentGold += Math.floor((runData.goldEarned || 0) * 0.1);

  // Check and unlock achievements
  const newAchievements = checkAchievements(progress, runData);

  // Check and unlock starters
  const newStarters = checkStarterUnlocks(progress);

  // Save progress
  saveMetaProgress(progress);

  return {
    progress,
    newAchievements,
    newStarters
  };
}

/**
 * Check and unlock achievements
 */
function checkAchievements(progress, runData = {}) {
  const newAchievements = [];

  for (const achievement of ACHIEVEMENTS) {
    if (progress.unlockedAchievements.includes(achievement.id)) {
      continue; // Already unlocked
    }

    let unlocked = false;

    switch (achievement.condition) {
      case 'win_once':
        unlocked = progress.totalWins >= 1;
        break;
      case 'win_3':
        unlocked = progress.totalWins >= 3;
        break;
      case 'win_10':
        unlocked = progress.totalWins >= 10;
        break;
      case 'floor_5':
        unlocked = progress.highestFloor >= 5;
        break;
      case 'floor_10':
        unlocked = progress.highestFloor >= 10;
        break;
      case 'floor_15':
        unlocked = progress.highestFloor >= 15;
        break;
      case 'floor_20':
        unlocked = progress.highestFloor >= 20;
        break;
      case 'gold_1000':
        unlocked = (runData.goldEarned || 0) >= 1000;
        break;
      case 'gold_5000':
        unlocked = (runData.goldEarned || 0) >= 5000;
        break;
      case 'catch_10':
        unlocked = progress.totalPokemonCaught >= 10;
        break;
      case 'catch_20':
        unlocked = progress.totalPokemonCaught >= 20;
        break;
      case 'mega_evolve':
        unlocked = progress.stats.totalMegaEvolutions >= 1;
        break;
      case 'no_damage':
        unlocked = progress.stats.perfectBattles >= 1;
        break;
    }

    if (unlocked) {
      progress.unlockedAchievements.push(achievement.id);

      // Auto-apply reward when achievement is unlocked
      if (achievement.reward && !progress.claimedRewards.includes(achievement.id)) {
        applyAchievementReward(progress, achievement);
        progress.claimedRewards.push(achievement.id);
      }

      newAchievements.push(achievement);
    }
  }

  return newAchievements;
}

/**
 * Apply reward from an achievement
 */
function applyAchievementReward(progress, achievement) {
  const reward = achievement.reward;
  if (!reward) return;

  // Ensure relicCollection exists
  if (!progress.relicCollection) {
    progress.relicCollection = { discovered: [], owned: [], equipped: [], slots: 1 };
  }

  switch (reward.type) {
    case 'gold':
      progress.permanentGold += reward.amount;
      break;
    case 'relic':
      // Add relic directly to owned (achievement relics are free!)
      if (!progress.relicCollection.owned.includes(reward.relicId)) {
        progress.relicCollection.owned.push(reward.relicId);
      }
      // Also add to discovered for display
      if (!progress.relicCollection.discovered.includes(reward.relicId)) {
        progress.relicCollection.discovered.push(reward.relicId);
      }
      // Keep unlockedRelics for backwards compatibility
      if (!progress.unlockedRelics) {
        progress.unlockedRelics = [];
      }
      if (!progress.unlockedRelics.includes(reward.relicId)) {
        progress.unlockedRelics.push(reward.relicId);
      }
      break;
    case 'starter':
      // Add starter to unlocked starters
      if (!progress.unlockedStarters.includes(reward.starterId)) {
        progress.unlockedStarters.push(reward.starterId);
      }
      break;
  }
}

/**
 * Check and unlock starters
 */
function checkStarterUnlocks(progress) {
  const newStarters = [];

  for (const starter of UNLOCKABLE_STARTERS) {
    if (progress.unlockedStarters.includes(starter.id)) {
      continue; // Already unlocked
    }

    let unlocked = false;

    switch (starter.condition) {
      case 'win_once':
        unlocked = progress.totalWins >= 1;
        break;
      case 'win_3':
        unlocked = progress.totalWins >= 3;
        break;
      case 'floor_10':
        unlocked = progress.highestFloor >= 10;
        break;
      case 'floor_15':
        unlocked = progress.highestFloor >= 15;
        break;
      case 'floor_20':
        unlocked = progress.highestFloor >= 20;
        break;
      case 'catch_20':
        unlocked = progress.totalPokemonCaught >= 20;
        break;
    }

    if (unlocked) {
      progress.unlockedStarters.push(starter.id);
      newStarters.push(starter);
    }
  }

  return newStarters;
}

/**
 * Get all achievements with unlock status
 */
export function getAllAchievements() {
  const progress = getMetaProgress();
  return ACHIEVEMENTS.map(achievement => ({
    ...achievement,
    unlocked: progress.unlockedAchievements.includes(achievement.id)
  }));
}

/**
 * Get all available starters (default + unlocked)
 */
export function getAvailableStarters() {
  const progress = getMetaProgress();
  return progress.unlockedStarters;
}

/**
 * Get all starters with unlock status
 */
export function getAllStarters() {
  const progress = getMetaProgress();

  const defaultStarterInfo = DEFAULT_STARTERS.map(id => ({
    id,
    name: id.charAt(0).toUpperCase() + id.slice(1),
    unlocked: true,
    isDefault: true
  }));

  const unlockableStarterInfo = UNLOCKABLE_STARTERS.map(starter => ({
    ...starter,
    unlocked: progress.unlockedStarters.includes(starter.id),
    isDefault: false
  }));

  return [...defaultStarterInfo, ...unlockableStarterInfo];
}

/**
 * Get available difficulty levels
 */
export function getDifficultyLevels() {
  const progress = getMetaProgress();

  return DIFFICULTY_LEVELS.map(diff => ({
    ...diff,
    unlocked: !diff.unlockCondition || (
      diff.unlockCondition === 'win_once' && progress.totalWins >= 1
    ),
    selected: progress.selectedDifficulty === diff.id
  }));
}

/**
 * Set difficulty level
 */
export function setDifficulty(difficultyId) {
  const progress = getMetaProgress();
  progress.selectedDifficulty = difficultyId;
  saveMetaProgress(progress);
}

/**
 * Get current difficulty multipliers
 */
export function getDifficultyMultipliers() {
  const progress = getMetaProgress();
  const difficulty = DIFFICULTY_LEVELS.find(d => d.id === progress.selectedDifficulty);
  return difficulty?.multipliers || DIFFICULTY_LEVELS[1].multipliers; // Default to normal
}

/**
 * Spend permanent gold
 */
export function spendPermanentGold(amount) {
  const progress = getMetaProgress();
  if (progress.permanentGold >= amount) {
    progress.permanentGold -= amount;
    saveMetaProgress(progress);
    return true;
  }
  return false;
}

/**
 * Track a special stat
 */
export function trackStat(statName, amount = 1) {
  const progress = getMetaProgress();
  if (progress.stats[statName] !== undefined) {
    progress.stats[statName] += amount;
    saveMetaProgress(progress);
  }
}

/**
 * Get unlocked achievement relics (permanently available from achievements)
 */
export function getUnlockedAchievementRelics() {
  const progress = getMetaProgress();
  return progress.unlockedRelics || [];
}

/**
 * Get all achievements with their unlock and reward status
 */
export function getAchievementsWithRewards() {
  const progress = getMetaProgress();
  return ACHIEVEMENTS.map(achievement => ({
    ...achievement,
    unlocked: progress.unlockedAchievements.includes(achievement.id),
    rewardClaimed: progress.claimedRewards?.includes(achievement.id) || false,
  }));
}

/**
 * Reset all meta progress (for debugging)
 */
export function resetMetaProgress() {
  localStorage.removeItem(META_KEY);
  return getDefaultMetaProgress();
}

// ============================================
// RELIC COLLECTION FUNCTIONS
// ============================================

/**
 * Get relic collection from localStorage
 */
export function getRelicCollection() {
  const progress = getMetaProgress();
  return progress.relicCollection || {
    discovered: [],
    owned: [],
    equipped: [],
    slots: 1,
  };
}

/**
 * Discover a relic (add to collection as available to buy)
 */
export function discoverRelic(relicId) {
  const progress = getMetaProgress();
  if (!progress.relicCollection) {
    progress.relicCollection = { discovered: [], owned: [], equipped: [], slots: 1 };
  }
  if (!progress.relicCollection.discovered.includes(relicId)) {
    progress.relicCollection.discovered.push(relicId);
    saveMetaProgress(progress);
  }
  return progress.relicCollection;
}

/**
 * Purchase a relic (move from discovered to owned, deduct gold)
 */
export function purchaseRelic(relicId, price) {
  const progress = getMetaProgress();
  if (progress.permanentGold < price) {
    return { success: false, message: 'Not enough gold' };
  }
  if (!progress.relicCollection.discovered.includes(relicId)) {
    return { success: false, message: 'Relic not discovered' };
  }
  if (progress.relicCollection.owned.includes(relicId)) {
    return { success: false, message: 'Already owned' };
  }

  progress.permanentGold -= price;
  progress.relicCollection.owned.push(relicId);
  saveMetaProgress(progress);
  return { success: true, relicCollection: progress.relicCollection, permanentGold: progress.permanentGold };
}

/**
 * Sell a relic (remove from owned, add gold)
 */
export function sellRelic(relicId, price) {
  const progress = getMetaProgress();
  if (!progress.relicCollection.owned.includes(relicId)) {
    return { success: false, message: 'Relic not owned' };
  }

  // Remove from owned and equipped
  progress.relicCollection.owned = progress.relicCollection.owned.filter(id => id !== relicId);
  progress.relicCollection.equipped = progress.relicCollection.equipped.filter(id => id !== relicId);
  progress.permanentGold += price;
  saveMetaProgress(progress);
  return { success: true, relicCollection: progress.relicCollection, permanentGold: progress.permanentGold };
}

/**
 * Equip a relic
 */
export function equipRelic(relicId) {
  const progress = getMetaProgress();
  if (!progress.relicCollection.owned.includes(relicId)) {
    return { success: false, message: 'Relic not owned' };
  }
  if (progress.relicCollection.equipped.includes(relicId)) {
    return { success: false, message: 'Already equipped' };
  }
  if (progress.relicCollection.equipped.length >= progress.relicCollection.slots) {
    return { success: false, message: 'No available slots' };
  }

  progress.relicCollection.equipped.push(relicId);
  saveMetaProgress(progress);
  return { success: true, relicCollection: progress.relicCollection };
}

/**
 * Unequip a relic
 */
export function unequipRelic(relicId) {
  const progress = getMetaProgress();
  if (!progress.relicCollection.equipped.includes(relicId)) {
    return { success: false, message: 'Relic not equipped' };
  }

  progress.relicCollection.equipped = progress.relicCollection.equipped.filter(id => id !== relicId);
  saveMetaProgress(progress);
  return { success: true, relicCollection: progress.relicCollection };
}

/**
 * Purchase an additional equip slot
 */
export function purchaseSlot(price) {
  const progress = getMetaProgress();
  if (progress.permanentGold < price) {
    return { success: false, message: 'Not enough gold' };
  }

  progress.permanentGold -= price;
  progress.relicCollection.slots += 1;
  saveMetaProgress(progress);
  return { success: true, relicCollection: progress.relicCollection, permanentGold: progress.permanentGold };
}
