// 📁 pokemonLeveling.js
// Pokemon XP and Leveling system

import { getRandomLearnableMove } from './moves';

// Chance to learn a new move on level up (20%)
const MOVE_LEARN_CHANCE = 0.20;

/**
 * XP required for each level (cumulative)
 * Uses a polynomial curve: level^2 * 10
 */
export function getXPForLevel(level) {
  return Math.floor(Math.pow(level, 2) * 10);
}

/**
 * Calculate XP needed to reach the next level
 */
export function getXPToNextLevel(currentLevel, currentXP) {
  const nextLevelXP = getXPForLevel(currentLevel + 1);
  const currentLevelXP = getXPForLevel(currentLevel);
  const xpInLevel = currentXP - currentLevelXP;
  const xpNeeded = nextLevelXP - currentLevelXP;
  return {
    xpInLevel: Math.max(0, xpInLevel),
    xpNeeded,
    progress: Math.min(1, Math.max(0, xpInLevel / xpNeeded)),
  };
}

/**
 * Calculate XP gained from defeating an enemy
 * @param {Object} enemy - The defeated enemy Pokemon
 * @param {number} playerLevel - The player Pokemon's level
 * @param {number} floor - Current floor (bonus XP for higher floors)
 */
export function calculateXPGain(enemy, playerLevel, floor = 1) {
  // Base XP from enemy level
  const enemyLevel = enemy.level || floor * 3;
  const baseXP = Math.floor(enemyLevel * 5);

  // Level difference bonus/penalty
  const levelDiff = enemyLevel - playerLevel;
  let levelMultiplier = 1.0;

  if (levelDiff > 0) {
    // Bonus for defeating higher level enemies
    levelMultiplier = 1 + (levelDiff * 0.1); // +10% per level above
  } else if (levelDiff < 0) {
    // Penalty for defeating lower level enemies
    levelMultiplier = Math.max(0.1, 1 + (levelDiff * 0.05)); // -5% per level below, min 10%
  }

  // Boss/Elite bonus
  let typeMultiplier = 1.0;
  if (enemy.isBoss) {
    typeMultiplier = 3.0; // Triple XP for bosses
  } else if (enemy.isElite) {
    typeMultiplier = 2.0; // Double XP for elites
  }

  // Floor bonus (later floors give more XP)
  const floorBonus = 1 + (floor * 0.02); // +2% per floor

  const totalXP = Math.floor(baseXP * levelMultiplier * typeMultiplier * floorBonus);

  return Math.max(1, totalXP);
}

/**
 * Stat growth rates per level (percentage of base stat)
 */
const STAT_GROWTH_RATE = {
  hp: 0.03,        // +3% HP per level
  attack: 0.025,   // +2.5% Attack per level
  defense: 0.025,  // +2.5% Defense per level
  special_attack: 0.025,
  special_defense: 0.025,
  speed: 0.02,     // +2% Speed per level
};

/**
 * Calculate stat increase for level up
 */
export function calculateStatGain(baseStat, statName, levelsGained = 1) {
  const growthRate = STAT_GROWTH_RATE[statName] || 0.02;
  const gain = Math.ceil(baseStat * growthRate * levelsGained);
  return Math.max(1, gain);
}

/**
 * Level up a Pokemon
 * @param {Object} pokemon - The Pokemon to level up
 * @param {number} xpGained - XP to add
 * @returns {Object} - Updated Pokemon and level up info
 */
export function addXPToPokemon(pokemon, xpGained) {
  const currentLevel = pokemon.level || 1;
  const currentXP = (pokemon.xp || 0) + xpGained;

  // Check for level up(s)
  let newLevel = currentLevel;
  let leveledUp = false;
  let levelsGained = 0;

  // Cap at level 100
  while (newLevel < 100 && currentXP >= getXPForLevel(newLevel + 1)) {
    newLevel++;
    levelsGained++;
    leveledUp = true;
  }

  // Calculate new stats if leveled up
  let newStats = { ...pokemon.stats };
  let statGains = {};
  let pendingMoveLearn = null;

  if (leveledUp) {
    // Calculate stat gains
    const baseStats = pokemon.baseStats || pokemon.stats;

    for (const stat of Object.keys(STAT_GROWTH_RATE)) {
      if (newStats[stat] !== undefined) {
        const gain = calculateStatGain(baseStats[stat] || newStats[stat], stat, levelsGained);
        statGains[stat] = gain;

        if (stat === 'hp') {
          // HP: increase both current and max
          newStats.hp_max = (newStats.hp_max || newStats.hp) + gain;
          newStats.hp = newStats.hp + gain; // Heal the gained amount
        } else {
          newStats[stat] = newStats[stat] + gain;
        }
      }
    }

    // Check for move learning opportunity (20% chance per level gained)
    // Only trigger once even if multiple levels gained
    if (Math.random() < MOVE_LEARN_CHANCE * levelsGained) {
      const newMove = getRandomLearnableMove(pokemon);
      if (newMove) {
        pendingMoveLearn = newMove;
      }
    }
  }

  const updatedPokemon = {
    ...pokemon,
    level: newLevel,
    xp: currentXP,
    stats: newStats,
    baseStats: pokemon.baseStats || pokemon.stats, // Preserve original base stats
  };

  return {
    pokemon: updatedPokemon,
    leveledUp,
    levelsGained,
    newLevel,
    xpGained,
    totalXP: currentXP,
    statGains,
    pendingMoveLearn, // New move to potentially learn
  };
}

/**
 * Distribute XP to team after battle
 * @param {Array} team - Player's Pokemon team
 * @param {Array} defeatedEnemies - Array of defeated enemy Pokemon
 * @param {number} floor - Current floor
 * @param {string} distribution - 'equal' or 'participants'
 * @returns {Object} - Updated team and XP results
 */
export function distributeXPToTeam(team, defeatedEnemies, floor, distribution = 'equal') {
  // Calculate total XP from all defeated enemies
  let totalXP = 0;
  for (const enemy of defeatedEnemies) {
    // Use average player level for calculation
    const avgLevel = Math.floor(team.reduce((sum, p) => sum + (p.level || 1), 0) / team.length);
    totalXP += calculateXPGain(enemy, avgLevel, floor);
  }

  // Get participating (alive) Pokemon
  const participants = team.filter(p => p.stats.hp > 0);

  // Distribute XP
  const xpPerPokemon = distribution === 'equal'
    ? Math.floor(totalXP / team.length)
    : Math.floor(totalXP / Math.max(1, participants.length));

  const results = {
    totalXP,
    xpPerPokemon,
    levelUps: [],
    updatedTeam: [],
    pendingMoveLearn: [], // Array of { pokemonIndex, pokemon, newMove }
  };

  for (let i = 0; i < team.length; i++) {
    const pokemon = team[i];
    // In 'equal' mode, all get XP. In 'participants' mode, only alive Pokemon
    const getsXP = distribution === 'equal' || pokemon.stats.hp > 0;

    if (getsXP) {
      const result = addXPToPokemon(pokemon, xpPerPokemon);
      results.updatedTeam.push(result.pokemon);

      if (result.leveledUp) {
        results.levelUps.push({
          name: pokemon.name,
          oldLevel: pokemon.level || 1,
          newLevel: result.newLevel,
          statGains: result.statGains,
        });

        // Check for pending move learn
        if (result.pendingMoveLearn) {
          results.pendingMoveLearn.push({
            pokemonIndex: i,
            pokemon: result.pokemon,
            newMove: result.pendingMoveLearn,
          });
        }
      }
    } else {
      results.updatedTeam.push(pokemon);
    }
  }

  return results;
}

/**
 * Get level display info for UI
 */
export function getLevelDisplayInfo(pokemon) {
  const level = pokemon.level || 1;
  const xp = pokemon.xp || 0;
  const { xpInLevel, xpNeeded, progress } = getXPToNextLevel(level, xp);

  return {
    level,
    xp,
    xpInLevel,
    xpNeeded,
    progress,
    isMaxLevel: level >= 100,
  };
}

/**
 * Initialize a Pokemon with XP system
 */
export function initializePokemonXP(pokemon, level = null) {
  const startLevel = level || pokemon.level || 1;
  const startXP = getXPForLevel(startLevel);

  return {
    ...pokemon,
    level: startLevel,
    xp: startXP,
    baseStats: { ...pokemon.stats }, // Store original stats
  };
}

export default {
  getXPForLevel,
  getXPToNextLevel,
  calculateXPGain,
  addXPToPokemon,
  distributeXPToTeam,
  getLevelDisplayInfo,
  initializePokemonXP,
};
