import axios from "axios";
import { generatePokemonMoves } from "./moves";
import {
  POKEMON_TIERS,
  ELITE_CONFIG,
  BOSS_CONFIG,
  getFloorConfig,
  getPokemonPool,
  calculateEnemyLevel,
  getStatMultiplier,
  isBossFloor,
  getBossConfig
} from "./enemyPools";
import { getDifficultyMultipliers } from "./metaProgression";

/**
 * Calculate enemy team size based on floor
 * Scales from 1-2 enemies at early floors to 3-4 at higher floors
 */
export function getEnemyCountForFloor(floor, nodeType = 'combat') {
  // Boss fights have fixed team sizes from config
  if (nodeType === 'boss') {
    return null; // Use boss config team size
  }

  // Elite fights always have 2 enemies
  if (nodeType === 'elite') {
    return 2;
  }

  // Normal combat scales with floor
  if (floor <= 2) {
    return 1; // Very early: 1 enemy
  } else if (floor <= 5) {
    return Math.random() < 0.6 ? 1 : 2; // Mostly 1, sometimes 2
  } else if (floor <= 10) {
    return Math.random() < 0.4 ? 2 : 3; // Mostly 3, sometimes 2
  } else if (floor <= 15) {
    return Math.random() < 0.5 ? 3 : 4; // 3 or 4
  } else {
    // High floors: 4-6 enemies
    const roll = Math.random();
    if (roll < 0.3) return 4;
    if (roll < 0.7) return 5;
    return 6;
  }
}

/**
 * Fetch Pokemon data from PokeAPI
 */
async function fetchPokemonById(pokemonId) {
  try {
    const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    return res.data;
  } catch (error) {
    console.error(`Failed to fetch Pokemon ${pokemonId}:`, error);
    return null;
  }
}

/**
 * Transform raw Pokemon data to game format
 */
function transformPokemonData(pokemon, level, statMultiplier = 1.0) {
  const rawStats = pokemon.stats.reduce((acc, stat) => {
    acc[stat.stat.name] = stat.base_stat;
    return acc;
  }, {});

  // Calculate scaled stats based on level and multiplier
  const levelScaling = 1 + (level - 1) * 0.02; // 2% per level

  const scaledStats = {
    hp: Math.floor(rawStats["hp"] * levelScaling * statMultiplier),
    hp_max: Math.floor(rawStats["hp"] * levelScaling * statMultiplier),
    attack: Math.floor(rawStats["attack"] * levelScaling * statMultiplier),
    defense: Math.floor(rawStats["defense"] * levelScaling * statMultiplier),
    special_attack: Math.floor(rawStats["special-attack"] * levelScaling * statMultiplier),
    special_defense: Math.floor(rawStats["special-defense"] * levelScaling * statMultiplier),
    speed: Math.floor(rawStats["speed"] * levelScaling * statMultiplier),
  };

  const pokemonData = {
    id: `enemy_${pokemon.id}_${Date.now()}`,
    pokedexId: pokemon.id,
    name: pokemon.name,
    sprite: pokemon.sprites.front_default,
    level,
    stats: scaledStats,
    types: pokemon.types.map((t) => t.type.name),
    heldItem: null,
    isMegaEvolved: false,
    baseName: pokemon.name,
    isEnemy: true
  };

  // Generate moves
  pokemonData.moves = generatePokemonMoves(pokemonData);

  return pokemonData;
}

/**
 * Pick random Pokemon from a pool
 */
function pickFromPool(pool, count = 1) {
  const picks = [];
  const poolCopy = [...pool];

  for (let i = 0; i < count && poolCopy.length > 0; i++) {
    const index = Math.floor(Math.random() * poolCopy.length);
    picks.push(poolCopy.splice(index, 1)[0]);
  }

  return picks;
}

/**
 * Generate enemy team for normal combat
 * @param {number} count - Override count (if not provided, scales with floor)
 * @param {number} floor - Current floor number
 * @param {string} nodeType - 'combat', 'elite', or 'boss'
 */
export async function generateEnemyTeam(count = null, floor = 1, nodeType = 'combat') {
  const team = [];
  const floorConfig = getFloorConfig(floor);
  const diffMultipliers = getDifficultyMultipliers();

  // Determine which generation function to use
  if (nodeType === 'boss' && isBossFloor(floor)) {
    return generateBossTeam(floor);
  }

  if (nodeType === 'elite') {
    return generateEliteTeam(floor);
  }

  // Calculate enemy count based on floor if not provided
  const enemyCount = count ?? getEnemyCountForFloor(floor, nodeType);

  // Normal combat - use floor-appropriate tier
  const pool = getPokemonPool(floorConfig.tier);
  const selectedIds = pickFromPool(pool, enemyCount);

  for (const pokemonId of selectedIds) {
    const pokemonData = await fetchPokemonById(pokemonId);
    if (!pokemonData) continue;

    const level = calculateEnemyLevel(floor, true);
    const statMultiplier = getStatMultiplier('combat') * (diffMultipliers?.enemy_hp || 1);

    const enemy = transformPokemonData(pokemonData, level, statMultiplier);
    team.push(enemy);
  }

  // Fallback if no enemies were generated
  if (team.length === 0) {
    const fallbackId = pool[Math.floor(Math.random() * pool.length)];
    const fallbackData = await fetchPokemonById(fallbackId);
    if (fallbackData) {
      team.push(transformPokemonData(fallbackData, floor * 3, 1.0));
    }
  }

  console.log(`[EnemyGen] Generated ${team.length} enemies for floor ${floor} (${nodeType}):`,
    team.map(e => `${e.name} Lv.${e.level}`).join(', '));

  return team;
}

/**
 * Generate elite enemy team
 */
export async function generateEliteTeam(floor) {
  const team = [];
  const floorConfig = getFloorConfig(floor);
  const diffMultipliers = getDifficultyMultipliers();

  // Use elite pool or upgrade to strong tier
  const pool = POKEMON_TIERS.elite.pokemon;
  const selectedIds = pickFromPool(pool, ELITE_CONFIG.teamSize);

  for (const pokemonId of selectedIds) {
    const pokemonData = await fetchPokemonById(pokemonId);
    if (!pokemonData) continue;

    const baseLevel = calculateEnemyLevel(floor, false);
    const level = baseLevel + ELITE_CONFIG.levelBonus;
    const statMultiplier = ELITE_CONFIG.statMultiplier * (diffMultipliers?.enemy_hp || 1);

    const enemy = transformPokemonData(pokemonData, level, statMultiplier);

    // Elite enemies may have held items
    if (ELITE_CONFIG.guaranteedHeldItem) {
      enemy.heldItem = getRandomHeldItem();
    }

    team.push(enemy);
  }

  console.log(`[EnemyGen] Generated ELITE team for floor ${floor}:`,
    team.map(e => `${e.name} Lv.${e.level}`).join(', '));

  return team;
}

/**
 * Generate boss team
 */
export async function generateBossTeam(floor) {
  const team = [];
  const bossConfig = getBossConfig(floor);
  const diffMultipliers = getDifficultyMultipliers();

  if (!bossConfig) {
    console.warn(`[EnemyGen] No boss config for floor ${floor}, using elite team`);
    return generateEliteTeam(floor);
  }

  // For legendary boss, pick from legendary pool
  const pool = bossConfig.isLegendary
    ? bossConfig.legendaryPool
    : bossConfig.pokemon;

  const selectedIds = pickFromPool(pool, bossConfig.teamSize);

  for (const pokemonId of selectedIds) {
    const pokemonData = await fetchPokemonById(pokemonId);
    if (!pokemonData) continue;

    const baseLevel = calculateEnemyLevel(floor, false);
    const level = baseLevel + bossConfig.levelBonus;
    const statMultiplier = bossConfig.statMultiplier * (diffMultipliers?.enemy_hp || 1);

    const enemy = transformPokemonData(pokemonData, level, statMultiplier);

    // Mark as boss
    enemy.isBoss = true;
    enemy.bossName = bossConfig.name;

    // Bosses always have held items
    enemy.heldItem = getRandomHeldItem(bossConfig.isLegendary);

    team.push(enemy);
  }

  console.log(`[EnemyGen] Generated BOSS "${bossConfig.name}" for floor ${floor}:`,
    team.map(e => `${e.name} Lv.${e.level}`).join(', '));

  return team;
}

/**
 * Get a random held item for elite/boss Pokemon
 */
function getRandomHeldItem(isLegendary = false) {
  const commonItems = [
    'sitrus_berry',
    'lum_berry',
    'leftovers',
    'choice_band',
    'choice_specs'
  ];

  const legendaryItems = [
    'life_orb',
    'choice_scarf',
    'focus_sash'
  ];

  const pool = isLegendary
    ? [...commonItems, ...legendaryItems]
    : commonItems;

  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Get expected enemy info for a floor (for UI preview)
 */
export function getFloorEnemyInfo(floor, nodeType = 'combat') {
  const floorConfig = getFloorConfig(floor);

  if (nodeType === 'boss' && isBossFloor(floor)) {
    const bossConfig = getBossConfig(floor);
    return {
      type: 'boss',
      name: bossConfig.name,
      levelRange: [
        floorConfig.levelBase + bossConfig.levelBonus - 2,
        floorConfig.levelBase + bossConfig.levelBonus + 2
      ],
      isLegendary: bossConfig.isLegendary || false,
      rewards: bossConfig.rewards
    };
  }

  if (nodeType === 'elite') {
    return {
      type: 'elite',
      name: 'Elite Trainer',
      levelRange: [
        floorConfig.levelBase + ELITE_CONFIG.levelBonus - 2,
        floorConfig.levelBase + ELITE_CONFIG.levelBonus + 2
      ],
      statBoost: `+${Math.round((ELITE_CONFIG.statMultiplier - 1) * 100)}%`
    };
  }

  return {
    type: 'combat',
    tier: floorConfig.tier,
    levelRange: [
      floorConfig.levelBase - floorConfig.levelVariance,
      floorConfig.levelBase + floorConfig.levelVariance
    ]
  };
}

// Export for backwards compatibility
export default generateEnemyTeam;
