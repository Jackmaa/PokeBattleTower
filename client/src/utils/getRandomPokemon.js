import axios from "axios";
import { generatePokemonMoves } from "./moves";
import { initializePokemonXP } from "./pokemonLeveling";

/**
 * Stat growth rates per level (percentage of base stat)
 * Matches the rates in pokemonLeveling.js
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
 * Scale a Pokemon's stats based on level
 * @param {Object} baseStats - Base stats at level 1
 * @param {number} level - Target level
 * @returns {Object} - Scaled stats
 */
function scaleStatsForLevel(baseStats, level) {
  if (level <= 1) return { ...baseStats };

  const levelsGained = level - 1;
  const scaledStats = {};

  for (const [stat, baseValue] of Object.entries(baseStats)) {
    if (stat === 'hp_max') continue; // Skip hp_max, we'll set it from hp

    const growthRate = STAT_GROWTH_RATE[stat] || 0.02;
    const gain = Math.ceil(baseValue * growthRate * levelsGained);
    scaledStats[stat] = baseValue + gain;
  }

  // Set hp_max equal to hp
  scaledStats.hp_max = scaledStats.hp;

  return scaledStats;
}

/**
 * Get a random Pokemon with optional level scaling
 * @param {number} level - Level for the captured Pokemon (default: 1)
 * @returns {Object} - Pokemon data with scaled stats
 */
export const getRandomPokemon = async (level = 1) => {
  const randomId = Math.floor(Math.random() * 151) + 1; //Kanto range

  const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
  const pokemon = res.data;
  const rawStats = pokemon.stats.reduce((acc, stat) => {
    acc[stat.stat.name] = stat.base_stat;
    return acc;
  }, {});

  // Base stats at level 1
  const baseStats = {
    hp: rawStats["hp"],
    hp_max: rawStats["hp"],
    attack: rawStats["attack"],
    defense: rawStats["defense"],
    special_attack: rawStats["special-attack"],
    special_defense: rawStats["special-defense"],
    speed: rawStats["speed"],
  };

  // Scale stats based on level
  const scaledStats = scaleStatsForLevel(baseStats, level);

  const pokemonData = {
    id: pokemon.id,
    name: pokemon.name,
    sprite: pokemon.sprites.front_default,
    level: level,
    stats: scaledStats,
    baseStats: baseStats, // Store original base stats for leveling calculations
    types: pokemon.types.map((t) => t.type.name),
    heldItem: null, // Field for equipped items (mega stones, held items, berries)
    isMegaEvolved: false, // Track if Pokemon is currently mega evolved
    baseName: pokemon.name, // Store original name for reverting mega evolution
  };

  // Generate moves based on Pokemon type
  pokemonData.moves = generatePokemonMoves(pokemonData);

  // Initialize XP system with the specified level
  return initializePokemonXP(pokemonData, level);
};
