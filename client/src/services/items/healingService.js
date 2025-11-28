// healingService.js
// Service for healing Pokemon and calculating team HP

/**
 * Heal entire team to full HP and restore PP
 * @param {Array} team - Array of Pokemon objects
 * @returns {Array} - Healed team
 */
export function healTeam(team) {
  return team.map(pokemon => ({
    ...pokemon,
    stats: {
      ...pokemon.stats,
      hp: pokemon.stats.hp_max,
    },
    moves: pokemon.moves?.map(move => ({
      ...move,
      pp: move.maxPP,
    })) || [],
  }));
}

/**
 * Heal a single Pokemon to full HP and restore PP
 * @param {Object} pokemon - Pokemon object
 * @returns {Object} - Healed Pokemon
 */
export function healPokemon(pokemon) {
  return {
    ...pokemon,
    stats: {
      ...pokemon.stats,
      hp: pokemon.stats.hp_max,
    },
    moves: pokemon.moves?.map(move => ({
      ...move,
      pp: move.maxPP,
    })) || [],
  };
}

/**
 * Partially heal a Pokemon by a percentage
 * @param {Object} pokemon - Pokemon object
 * @param {number} percentage - Percentage to heal (0-1)
 * @returns {Object} - Partially healed Pokemon
 */
export function partialHealPokemon(pokemon, percentage = 0.5) {
  const currentHP = pokemon.stats.hp;
  const maxHP = pokemon.stats.hp_max;
  const healAmount = Math.floor((maxHP - currentHP) * percentage);
  const newHP = Math.min(currentHP + healAmount, maxHP);

  return {
    ...pokemon,
    stats: {
      ...pokemon.stats,
      hp: newHP,
    },
  };
}

/**
 * Calculate total team HP stats
 * @param {Array} team - Array of Pokemon objects
 * @returns {Object} - { current, max, percentage }
 */
export function calculateTeamHP(team) {
  const totalHP = team.reduce((sum, p) => sum + p.stats.hp, 0);
  const maxHP = team.reduce((sum, p) => sum + p.stats.hp_max, 0);

  return {
    current: totalHP,
    max: maxHP,
    percentage: maxHP > 0 ? totalHP / maxHP : 0,
  };
}

/**
 * Check if any Pokemon in team needs healing
 * @param {Array} team - Array of Pokemon objects
 * @returns {boolean} - True if any Pokemon is not at full HP
 */
export function teamNeedsHealing(team) {
  return team.some(pokemon => pokemon.stats.hp < pokemon.stats.hp_max);
}

/**
 * Get count of fainted Pokemon in team
 * @param {Array} team - Array of Pokemon objects
 * @returns {number} - Count of fainted Pokemon
 */
export function getFaintedCount(team) {
  return team.filter(pokemon => pokemon.stats.hp <= 0).length;
}
