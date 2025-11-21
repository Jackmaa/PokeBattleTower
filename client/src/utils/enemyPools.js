// Enemy Pools - Defines Pokemon available at each floor tier
// Organized by base stat total (BST) and thematic appropriateness

/**
 * Pokemon pools organized by tier
 * Each tier has a BST range and list of Pokemon IDs
 */
export const POKEMON_TIERS = {
  // Tier 1: Weak Pokemon (BST ~250-350) - Floors 1-4
  weak: {
    bstRange: [250, 350],
    pokemon: [
      10, 11, 13, 14, // Caterpie, Metapod, Weedle, Kakuna
      16, 19, 21, 29, // Pidgey, Rattata, Spearow, Nidoran-F
      32, 41, 43, 46, // Nidoran-M, Zubat, Oddish, Paras
      48, 50, 52, 54, // Venonat, Diglett, Meowth, Psyduck
      60, 63, 66, 69, // Poliwag, Abra, Machop, Bellsprout
      72, 74, 81, 84, // Tentacool, Geodude, Magnemite, Doduo
      86, 90, 92, 96, // Seel, Shellder, Gastly, Drowzee
      98, 100, 102, 109, // Krabby, Voltorb, Exeggcute, Koffing
      116, 118, 120, 129, // Horsea, Goldeen, Staryu, Magikarp
      133, 138, 140, 147 // Eevee, Omanyte, Kabuto, Dratini
    ]
  },

  // Tier 2: Common Pokemon (BST ~350-420) - Floors 5-8
  common: {
    bstRange: [350, 420],
    pokemon: [
      12, 15, 17, 20, // Butterfree, Beedrill, Pidgeotto, Raticate
      22, 24, 25, 27, // Fearow, Arbok, Pikachu, Sandshrew
      28, 30, 33, 35, // Sandslash, Nidorina, Nidorino, Clefairy
      36, 37, 39, 42, // Clefable, Vulpix, Jigglypuff, Golbat
      44, 47, 49, 51, // Gloom, Parasect, Venomoth, Dugtrio
      53, 55, 56, 61, // Persian, Golduck, Mankey, Poliwhirl
      64, 67, 70, 73, // Kadabra, Machoke, Weepinbell, Tentacruel
      75, 77, 79, 82, // Graveler, Ponyta, Slowpoke, Magneton
      85, 87, 88, 91, // Dodrio, Dewgong, Grimer, Cloyster
      93, 97, 99, 101, // Haunter, Hypno, Kingler, Electrode
      104, 105, 108, 110, // Cubone, Marowak, Lickitung, Weezing
      111, 114, 117, 119, // Rhyhorn, Tangela, Seadra, Seaking
      121, 123, 124, 125, // Starmie, Scyther, Jynx, Electabuzz
      126, 127, 128, 132, // Magmar, Pinsir, Tauros, Ditto
      137, 139, 141, 148 // Porygon, Omastar, Kabutops, Dragonair
    ]
  },

  // Tier 3: Strong Pokemon (BST ~420-500) - Floors 9-14
  strong: {
    bstRange: [420, 500],
    pokemon: [
      3, 6, 9, 18, // Venusaur, Charizard, Blastoise, Pidgeot
      26, 31, 34, 38, // Raichu, Nidoqueen, Nidoking, Ninetales
      40, 45, 57, 59, // Wigglytuff, Vileplume, Primeape, Arcanine
      62, 65, 68, 71, // Poliwrath, Alakazam, Machamp, Victreebel
      76, 78, 80, 83, // Golem, Rapidash, Slowbro, Farfetch'd
      89, 94, 95, 103, // Muk, Gengar, Onix, Exeggutor
      106, 107, 112, 113, // Hitmonlee, Hitmonchan, Rhydon, Chansey
      115, 122, 130, 131, // Kangaskhan, Mr. Mime, Gyarados, Lapras
      134, 135, 136, 142, // Vaporeon, Jolteon, Flareon, Aerodactyl
      143 // Snorlax
    ]
  },

  // Tier 4: Elite Pokemon (BST ~500-580) - Elite Battles
  elite: {
    bstRange: [500, 580],
    pokemon: [
      6, 9, 3, // Charizard, Blastoise, Venusaur (starters)
      65, 68, 94, // Alakazam, Machamp, Gengar
      130, 131, 143, // Gyarados, Lapras, Snorlax
      149 // Dragonite
    ]
  },

  // Tier 5: Legendary Pokemon (BST 580+) - Boss Battles Only
  legendary: {
    bstRange: [580, 999],
    pokemon: [
      144, 145, 146, // Articuno, Zapdos, Moltres
      150, 151 // Mewtwo, Mew
    ]
  }
};

/**
 * Floor configuration - defines what tier of Pokemon appears at each floor
 */
export const FLOOR_CONFIG = {
  // Floors 1-4: Weak Pokemon only
  1: { tier: 'weak', levelBase: 5, levelVariance: 2 },
  2: { tier: 'weak', levelBase: 7, levelVariance: 2 },
  3: { tier: 'weak', levelBase: 10, levelVariance: 3 },
  4: { tier: 'weak', levelBase: 13, levelVariance: 3 },

  // Floors 5-8: Common Pokemon
  5: { tier: 'common', levelBase: 16, levelVariance: 3 },
  6: { tier: 'common', levelBase: 19, levelVariance: 3 },
  7: { tier: 'common', levelBase: 22, levelVariance: 4 },
  8: { tier: 'common', levelBase: 25, levelVariance: 4 },

  // Floors 9-14: Strong Pokemon
  9: { tier: 'strong', levelBase: 28, levelVariance: 4 },
  10: { tier: 'strong', levelBase: 32, levelVariance: 5 },
  11: { tier: 'strong', levelBase: 36, levelVariance: 5 },
  12: { tier: 'strong', levelBase: 40, levelVariance: 5 },
  13: { tier: 'strong', levelBase: 44, levelVariance: 5 },
  14: { tier: 'strong', levelBase: 48, levelVariance: 5 },

  // Floors 15-19: Strong + some Elite
  15: { tier: 'strong', levelBase: 52, levelVariance: 5 },
  16: { tier: 'strong', levelBase: 55, levelVariance: 5 },
  17: { tier: 'strong', levelBase: 58, levelVariance: 5 },
  18: { tier: 'strong', levelBase: 62, levelVariance: 5 },
  19: { tier: 'strong', levelBase: 65, levelVariance: 5 },

  // Floor 20: Final floor
  20: { tier: 'elite', levelBase: 70, levelVariance: 5 }
};

/**
 * Elite battle configuration
 */
export const ELITE_CONFIG = {
  // Elite battles use stronger Pokemon with bonuses
  tierOverride: 'elite',
  levelBonus: 5,
  statMultiplier: 1.15, // 15% stat boost
  guaranteedHeldItem: true,
  teamSize: 1
};

/**
 * Boss configuration by floor
 */
export const BOSS_CONFIG = {
  // Floor 5 Mini-Boss
  5: {
    name: "Gym Leader",
    pokemon: [26, 38, 59], // Raichu, Ninetales, Arcanine
    levelBonus: 8,
    statMultiplier: 1.2,
    teamSize: 1,
    rewards: { gold: 200, xpMultiplier: 2 }
  },

  // Floor 10 Boss
  10: {
    name: "Elite Trainer",
    pokemon: [65, 68, 94, 130], // Alakazam, Machamp, Gengar, Gyarados
    levelBonus: 10,
    statMultiplier: 1.25,
    teamSize: 1,
    rewards: { gold: 400, xpMultiplier: 2.5 }
  },

  // Floor 15 Boss
  15: {
    name: "Champion",
    pokemon: [149, 143, 131, 142], // Dragonite, Snorlax, Lapras, Aerodactyl
    levelBonus: 12,
    statMultiplier: 1.3,
    teamSize: 1,
    rewards: { gold: 600, xpMultiplier: 3 }
  },

  // Floor 20 Final Boss - Legendary
  20: {
    name: "Tower Master",
    pokemon: [150], // Mewtwo only
    legendaryPool: [144, 145, 146, 150, 151], // Bird trio + Mew/Mewtwo
    levelBonus: 15,
    statMultiplier: 1.4,
    teamSize: 1,
    isLegendary: true,
    rewards: { gold: 1000, xpMultiplier: 5, victoryBonus: true }
  }
};

/**
 * Get floor configuration
 */
export function getFloorConfig(floor) {
  // Clamp floor to valid range
  const clampedFloor = Math.min(Math.max(floor, 1), 20);
  return FLOOR_CONFIG[clampedFloor] || FLOOR_CONFIG[1];
}

/**
 * Get Pokemon pool for a tier
 */
export function getPokemonPool(tier) {
  return POKEMON_TIERS[tier]?.pokemon || POKEMON_TIERS.weak.pokemon;
}

/**
 * Get boss config for a floor (if it's a boss floor)
 */
export function getBossConfig(floor) {
  return BOSS_CONFIG[floor] || null;
}

/**
 * Check if floor is a boss floor
 */
export function isBossFloor(floor) {
  return floor in BOSS_CONFIG;
}

/**
 * Calculate enemy level for floor
 */
export function calculateEnemyLevel(floor, variance = true) {
  const config = getFloorConfig(floor);
  let level = config.levelBase;

  if (variance) {
    const varianceAmount = Math.floor(Math.random() * config.levelVariance * 2) - config.levelVariance;
    level += varianceAmount;
  }

  return Math.max(1, Math.min(100, level));
}

/**
 * Get stat multiplier based on difficulty and node type
 */
export function getStatMultiplier(nodeType, difficulty = 'normal') {
  const baseMultipliers = {
    combat: 1.0,
    elite: 1.15,
    boss: 1.3
  };

  const difficultyMultipliers = {
    easy: 0.8,
    normal: 1.0,
    hard: 1.2,
    extreme: 1.5
  };

  return (baseMultipliers[nodeType] || 1.0) * (difficultyMultipliers[difficulty] || 1.0);
}
