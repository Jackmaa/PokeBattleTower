// 📁 moves.js
// Pokemon moves database with power, accuracy, PP, type, targeting, and priority

// Move target types
export const TARGET_TYPES = {
  SINGLE_ENEMY: 'single_enemy',      // Select one enemy
  ALL_ENEMIES: 'all_enemies',        // Hits all enemies
  SINGLE_ALLY: 'single_ally',        // Select one ally
  ALL_ALLIES: 'all_allies',          // Affects all allies
  SELF: 'self',                      // Only affects user
  RANDOM_ENEMY: 'random_enemy',      // Random enemy target
  ALL_OTHER: 'all_other',            // All except user
};

// Move effect types
export const EFFECT_TYPES = {
  DAMAGE: 'damage',
  STATUS: 'status',
  STAT_CHANGE: 'stat_change',
  HEAL: 'heal',
  PROTECT: 'protect',
};

export const moves = {
  // ============================================
  // NORMAL TYPE MOVES
  // ============================================
  tackle: {
    name: "Tackle",
    type: "normal",
    power: 40,
    accuracy: 100,
    pp: 35,
    maxPP: 35,
    category: "physical",
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    description: "A physical attack in which the user charges and slams into the target.",
  },
  scratch: {
    name: "Scratch",
    type: "normal",
    power: 40,
    accuracy: 100,
    pp: 35,
    maxPP: 35,
    category: "physical",
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    description: "Hard, pointed, sharp claws rake the target to inflict damage.",
  },
  bodySlam: {
    name: "Body Slam",
    type: "normal",
    power: 85,
    accuracy: 100,
    pp: 15,
    maxPP: 15,
    category: "physical",
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    effect: { type: 'status', status: 'paralyzed', chance: 30 },
    description: "The user drops onto the target with its full body weight. May paralyze.",
  },
  hyperBeam: {
    name: "Hyper Beam",
    type: "normal",
    power: 150,
    accuracy: 90,
    pp: 5,
    maxPP: 5,
    category: "special",
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    description: "The target is attacked with a powerful beam.",
  },
  // Priority move
  quickAttack: {
    name: "Quick Attack",
    type: "normal",
    power: 40,
    accuracy: 100,
    pp: 30,
    maxPP: 30,
    category: "physical",
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 1, // Goes first
    description: "The user lunges at the target at a speed that makes it almost invisible. Always goes first.",
  },
  // Buff move
  swordssDance: {
    name: "Swords Dance",
    type: "normal",
    power: 0,
    accuracy: 100,
    pp: 20,
    maxPP: 20,
    category: "status",
    target: TARGET_TYPES.SELF,
    priority: 0,
    effect: { type: 'stat_change', stat: 'attack', stages: 2 },
    description: "A frenetic dance that sharply raises Attack.",
  },
  // Debuff move
  growl: {
    name: "Growl",
    type: "normal",
    power: 0,
    accuracy: 100,
    pp: 40,
    maxPP: 40,
    category: "status",
    target: TARGET_TYPES.ALL_ENEMIES,
    priority: 0,
    effect: { type: 'stat_change', stat: 'attack', stages: -1 },
    description: "Growls cutely to lower all enemies' Attack.",
  },
  // Protect move
  protect: {
    name: "Protect",
    type: "normal",
    power: 0,
    accuracy: 100,
    pp: 10,
    maxPP: 10,
    category: "status",
    target: TARGET_TYPES.SELF,
    priority: 4, // Very high priority
    effect: { type: 'protect' },
    description: "Completely protects from all attacks for one turn.",
  },

  // ============================================
  // FIRE TYPE MOVES
  // ============================================
  ember: {
    name: "Ember",
    type: "fire",
    power: 40,
    accuracy: 100,
    pp: 25,
    maxPP: 25,
    category: "special",
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    effect: { type: 'status', status: 'burned', chance: 10 },
    description: "The target is attacked with small flames. May cause burn.",
  },
  flamethrower: {
    name: "Flamethrower",
    type: "fire",
    power: 90,
    accuracy: 100,
    pp: 15,
    maxPP: 15,
    category: "special",
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    effect: { type: 'status', status: 'burned', chance: 10 },
    description: "The target is scorched with an intense blast of fire.",
  },
  fireBlast: {
    name: "Fire Blast",
    type: "fire",
    power: 110,
    accuracy: 85,
    pp: 5,
    maxPP: 5,
    category: "special",
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    effect: { type: 'status', status: 'burned', chance: 30 },
    description: "The target is attacked with an intense blast of all-consuming fire.",
  },
  heatWave: {
    name: "Heat Wave",
    type: "fire",
    power: 95,
    accuracy: 90,
    pp: 10,
    maxPP: 10,
    category: "special",
    target: TARGET_TYPES.ALL_ENEMIES, // AOE
    priority: 0,
    effect: { type: 'status', status: 'burned', chance: 10 },
    description: "A scorching blast of heat hits all enemies.",
  },

  // ============================================
  // WATER TYPE MOVES
  // ============================================
  waterGun: {
    name: "Water Gun",
    type: "water",
    power: 40,
    accuracy: 100,
    pp: 25,
    maxPP: 25,
    category: "special",
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    description: "The target is blasted with a forceful shot of water.",
  },
  surf: {
    name: "Surf",
    type: "water",
    power: 90,
    accuracy: 100,
    pp: 15,
    maxPP: 15,
    category: "special",
    target: TARGET_TYPES.ALL_ENEMIES, // AOE
    priority: 0,
    description: "A giant wave swamps all enemies.",
  },
  hydroPump: {
    name: "Hydro Pump",
    type: "water",
    power: 110,
    accuracy: 80,
    pp: 5,
    maxPP: 5,
    category: "special",
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    description: "The target is blasted by a huge volume of water launched under great pressure.",
  },
  aquaJet: {
    name: "Aqua Jet",
    type: "water",
    power: 40,
    accuracy: 100,
    pp: 20,
    maxPP: 20,
    category: "physical",
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 1, // Priority move
    description: "The user lunges at the target at blinding speed. Always goes first.",
  },

  // ============================================
  // GRASS TYPE MOVES
  // ============================================
  vineWhip: {
    name: "Vine Whip",
    type: "grass",
    power: 45,
    accuracy: 100,
    pp: 25,
    maxPP: 25,
    category: "physical",
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    description: "The target is struck with slender, whiplike vines.",
  },
  razorLeaf: {
    name: "Razor Leaf",
    type: "grass",
    power: 55,
    accuracy: 95,
    pp: 25,
    maxPP: 25,
    category: "physical",
    target: TARGET_TYPES.ALL_ENEMIES, // AOE
    priority: 0,
    description: "Sharp-edged leaves slash all opposing Pokémon.",
  },
  solarBeam: {
    name: "Solar Beam",
    type: "grass",
    power: 120,
    accuracy: 100,
    pp: 10,
    maxPP: 10,
    category: "special",
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    description: "A powerful beam of condensed sunlight.",
  },
  synthesis: {
    name: "Synthesis",
    type: "grass",
    power: 0,
    accuracy: 100,
    pp: 5,
    maxPP: 5,
    category: "status",
    target: TARGET_TYPES.SELF,
    priority: 0,
    effect: { type: 'heal', percent: 50 },
    description: "Restores up to half of the user's maximum HP.",
  },

  // ============================================
  // ELECTRIC TYPE MOVES
  // ============================================
  thunderShock: {
    name: "Thunder Shock",
    type: "electric",
    power: 40,
    accuracy: 100,
    pp: 30,
    maxPP: 30,
    category: "special",
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    effect: { type: 'status', status: 'paralyzed', chance: 10 },
    description: "A jolt of electricity crashes down on the target.",
  },
  thunderbolt: {
    name: "Thunderbolt",
    type: "electric",
    power: 90,
    accuracy: 100,
    pp: 15,
    maxPP: 15,
    category: "special",
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    effect: { type: 'status', status: 'paralyzed', chance: 10 },
    description: "A strong electric blast crashes down on the target.",
  },
  thunder: {
    name: "Thunder",
    type: "electric",
    power: 110,
    accuracy: 70,
    pp: 10,
    maxPP: 10,
    category: "special",
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    effect: { type: 'status', status: 'paralyzed', chance: 30 },
    description: "A wicked thunderbolt is dropped on the target.",
  },
  thunderWave: {
    name: "Thunder Wave",
    type: "electric",
    power: 0,
    accuracy: 90,
    pp: 20,
    maxPP: 20,
    category: "status",
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    effect: { type: 'status', status: 'paralyzed', chance: 100 },
    description: "A weak electric charge paralyzes the target.",
  },
  agility: {
    name: "Agility",
    type: "psychic",
    power: 0,
    accuracy: 100,
    pp: 30,
    maxPP: 30,
    category: "status",
    target: TARGET_TYPES.SELF,
    priority: 0,
    effect: { type: 'stat_change', stat: 'speed', stages: 2 },
    description: "Relaxes the body to sharply raise Speed.",
  },

  // ============================================
  // ICE TYPE MOVES
  // ============================================
  powderSnow: {
    name: "Powder Snow",
    type: "ice",
    power: 40,
    accuracy: 100,
    pp: 25,
    maxPP: 25,
    category: "special",
    target: TARGET_TYPES.ALL_ENEMIES, // AOE
    priority: 0,
    effect: { type: 'status', status: 'frozen', chance: 10 },
    description: "A chilling gust of powdery snow hits all enemies.",
  },
  iceBeam: {
    name: "Ice Beam",
    type: "ice",
    power: 90,
    accuracy: 100,
    pp: 10,
    maxPP: 10,
    category: "special",
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    effect: { type: 'status', status: 'frozen', chance: 10 },
    description: "The target is struck with an icy-cold beam of energy.",
  },
  blizzard: {
    name: "Blizzard",
    type: "ice",
    power: 110,
    accuracy: 70,
    pp: 5,
    maxPP: 5,
    category: "special",
    target: TARGET_TYPES.ALL_ENEMIES, // AOE
    priority: 0,
    effect: { type: 'status', status: 'frozen', chance: 10 },
    description: "A howling blizzard strikes all opposing Pokémon.",
  },
  iceShard: {
    name: "Ice Shard",
    type: "ice",
    power: 40,
    accuracy: 100,
    pp: 30,
    maxPP: 30,
    category: "physical",
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 1, // Priority move
    description: "The user flash-freezes chunks of ice and hurls them. Always goes first.",
  },

  // ============================================
  // FIGHTING TYPE MOVES
  // ============================================
  karateChop: {
    name: "Karate Chop",
    type: "fighting",
    power: 50,
    accuracy: 100,
    pp: 25,
    maxPP: 25,
    category: "physical",
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    description: "The target is attacked with a sharp chop.",
  },
  brickBreak: {
    name: "Brick Break",
    type: "fighting",
    power: 75,
    accuracy: 100,
    pp: 15,
    maxPP: 15,
    category: "physical",
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    description: "The user attacks with a swift chop.",
  },
  closeCombat: {
    name: "Close Combat",
    type: "fighting",
    power: 120,
    accuracy: 100,
    pp: 5,
    maxPP: 5,
    category: "physical",
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    effect: { type: 'stat_change', stat: 'defense', stages: -1, self: true },
    description: "The user fights at close range. Lowers the user's Defense.",
  },
  machPunch: {
    name: "Mach Punch",
    type: "fighting",
    power: 40,
    accuracy: 100,
    pp: 30,
    maxPP: 30,
    category: "physical",
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 1, // Priority move
    description: "The user throws a punch at blinding speed. Always goes first.",
  },

  // ============================================
  // PSYCHIC TYPE MOVES
  // ============================================
  confusion: {
    name: "Confusion",
    type: "psychic",
    power: 50,
    accuracy: 100,
    pp: 25,
    maxPP: 25,
    category: "special",
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    description: "The target is hit by a weak telekinetic force.",
  },
  psychic: {
    name: "Psychic",
    type: "psychic",
    power: 90,
    accuracy: 100,
    pp: 10,
    maxPP: 10,
    category: "special",
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    effect: { type: 'stat_change', stat: 'special_defense', stages: -1, chance: 10 },
    description: "The target is hit by a strong telekinetic force. May lower Sp. Def.",
  },
  calmMind: {
    name: "Calm Mind",
    type: "psychic",
    power: 0,
    accuracy: 100,
    pp: 20,
    maxPP: 20,
    category: "status",
    target: TARGET_TYPES.SELF,
    priority: 0,
    effect: { type: 'stat_change', stats: ['special_attack', 'special_defense'], stages: 1 },
    description: "Raises Sp. Atk and Sp. Def by focusing the mind.",
  },

  // ============================================
  // DRAGON TYPE MOVES
  // ============================================
  dragonBreath: {
    name: "Dragon Breath",
    type: "dragon",
    power: 60,
    accuracy: 100,
    pp: 20,
    maxPP: 20,
    category: "special",
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    effect: { type: 'status', status: 'paralyzed', chance: 30 },
    description: "The user exhales a mighty gust that may paralyze.",
  },
  dragonClaw: {
    name: "Dragon Claw",
    type: "dragon",
    power: 80,
    accuracy: 100,
    pp: 15,
    maxPP: 15,
    category: "physical",
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    description: "The user slashes the target with huge, sharp claws.",
  },
  dracoMeteor: {
    name: "Draco Meteor",
    type: "dragon",
    power: 130,
    accuracy: 90,
    pp: 5,
    maxPP: 5,
    category: "special",
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    effect: { type: 'stat_change', stat: 'special_attack', stages: -2, self: true },
    description: "Comets are summoned. Harshly lowers the user's Sp. Atk.",
  },

  // ============================================
  // GROUND TYPE MOVES
  // ============================================
  earthquake: {
    name: "Earthquake",
    type: "ground",
    power: 100,
    accuracy: 100,
    pp: 10,
    maxPP: 10,
    category: "physical",
    target: TARGET_TYPES.ALL_OTHER, // Hits all except user
    priority: 0,
    description: "A powerful quake that hits all other Pokémon.",
  },
  dig: {
    name: "Dig",
    type: "ground",
    power: 80,
    accuracy: 100,
    pp: 10,
    maxPP: 10,
    category: "physical",
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    description: "The user burrows, then attacks on the next turn.",
  },

  // ============================================
  // POISON TYPE MOVES
  // ============================================
  poisonSting: {
    name: "Poison Sting",
    type: "poison",
    power: 15,
    accuracy: 100,
    pp: 35,
    maxPP: 35,
    category: "physical",
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    effect: { type: 'status', status: 'poisoned', chance: 30 },
    description: "A toxic attack that may poison the target.",
  },
  sludgeBomb: {
    name: "Sludge Bomb",
    type: "poison",
    power: 90,
    accuracy: 100,
    pp: 10,
    maxPP: 10,
    category: "special",
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    effect: { type: 'status', status: 'poisoned', chance: 30 },
    description: "The user hurls unsanitary sludge at the target. May poison.",
  },
  toxic: {
    name: "Toxic",
    type: "poison",
    power: 0,
    accuracy: 90,
    pp: 10,
    maxPP: 10,
    category: "status",
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    effect: { type: 'status', status: 'badly_poisoned', chance: 100 },
    description: "Badly poisons the target. Damage worsens each turn.",
  },

  // ============================================
  // DARK TYPE MOVES
  // ============================================
  bite: {
    name: "Bite",
    type: "dark",
    power: 60,
    accuracy: 100,
    pp: 25,
    maxPP: 25,
    category: "physical",
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    description: "The target is bitten with viciously sharp fangs.",
  },
  crunch: {
    name: "Crunch",
    type: "dark",
    power: 80,
    accuracy: 100,
    pp: 15,
    maxPP: 15,
    category: "physical",
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    effect: { type: 'stat_change', stat: 'defense', stages: -1, chance: 20 },
    description: "The user crunches with sharp fangs. May lower Defense.",
  },
  suckerpunch: {
    name: "Sucker Punch",
    type: "dark",
    power: 70,
    accuracy: 100,
    pp: 5,
    maxPP: 5,
    category: "physical",
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 1, // Priority move
    description: "A priority attack that only works if the target is about to attack.",
  },

  // ============================================
  // GHOST TYPE MOVES
  // ============================================
  shadowBall: {
    name: "Shadow Ball",
    type: "ghost",
    power: 80,
    accuracy: 100,
    pp: 15,
    maxPP: 15,
    category: "special",
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    effect: { type: 'stat_change', stat: 'special_defense', stages: -1, chance: 20 },
    description: "A shadowy blob is hurled. May lower Sp. Def.",
  },
  shadowSneak: {
    name: "Shadow Sneak",
    type: "ghost",
    power: 40,
    accuracy: 100,
    pp: 30,
    maxPP: 30,
    category: "physical",
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 1, // Priority move
    description: "The user extends its shadow to strike first.",
  },

  // ============================================
  // STEEL TYPE MOVES
  // ============================================
  ironTail: {
    name: "Iron Tail",
    type: "steel",
    power: 100,
    accuracy: 75,
    pp: 15,
    maxPP: 15,
    category: "physical",
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    effect: { type: 'stat_change', stat: 'defense', stages: -1, chance: 30 },
    description: "The target is slammed with a steel-hard tail. May lower Defense.",
  },
  flashCannon: {
    name: "Flash Cannon",
    type: "steel",
    power: 80,
    accuracy: 100,
    pp: 10,
    maxPP: 10,
    category: "special",
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    effect: { type: 'stat_change', stat: 'special_defense', stages: -1, chance: 10 },
    description: "The user gathers light energy and fires. May lower Sp. Def.",
  },
  bulletPunch: {
    name: "Bullet Punch",
    type: "steel",
    power: 40,
    accuracy: 100,
    pp: 30,
    maxPP: 30,
    category: "physical",
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 1, // Priority move
    description: "The user strikes with a tough punch. Always goes first.",
  },

  // ============================================
  // ROCK TYPE MOVES
  // ============================================
  rockSlide: {
    name: "Rock Slide",
    type: "rock",
    power: 75,
    accuracy: 90,
    pp: 10,
    maxPP: 10,
    category: "physical",
    target: TARGET_TYPES.ALL_ENEMIES, // AOE
    priority: 0,
    description: "Large boulders are hurled at all opposing Pokémon.",
  },
  stoneEdge: {
    name: "Stone Edge",
    type: "rock",
    power: 100,
    accuracy: 80,
    pp: 5,
    maxPP: 5,
    category: "physical",
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    description: "The user stabs with sharpened stones. High critical-hit ratio.",
  },

  // ============================================
  // FLYING TYPE MOVES
  // ============================================
  airSlash: {
    name: "Air Slash",
    type: "flying",
    power: 75,
    accuracy: 95,
    pp: 15,
    maxPP: 15,
    category: "special",
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    description: "The user attacks with a blade of air that slices the target.",
  },
  bravebird: {
    name: "Brave Bird",
    type: "flying",
    power: 120,
    accuracy: 100,
    pp: 15,
    maxPP: 15,
    category: "physical",
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    effect: { type: 'recoil', percent: 33 },
    description: "A reckless, life-risking tackle. User takes recoil damage.",
  },

  // ============================================
  // HEALING MOVES
  // ============================================
  recover: {
    name: "Recover",
    type: "normal",
    power: 0,
    accuracy: 100,
    pp: 10,
    maxPP: 10,
    category: "status",
    target: TARGET_TYPES.SELF,
    priority: 0,
    effect: { type: 'heal', percent: 50 },
    description: "Restores up to half of the user's maximum HP.",
  },
  healPulse: {
    name: "Heal Pulse",
    type: "psychic",
    power: 0,
    accuracy: 100,
    pp: 10,
    maxPP: 10,
    category: "status",
    target: TARGET_TYPES.SINGLE_ALLY,
    priority: 0,
    effect: { type: 'heal', percent: 50, target: 'ally' },
    description: "Restores up to half of an ally's maximum HP.",
  },
  lifeDew: {
    name: "Life Dew",
    type: "water",
    power: 0,
    accuracy: 100,
    pp: 10,
    maxPP: 10,
    category: "status",
    target: TARGET_TYPES.ALL_ALLIES,
    priority: 0,
    effect: { type: 'heal', percent: 25 },
    description: "Scatters water to restore HP for all allies.",
  },
};

// Get moves for a Pokemon based on its type
export function getMovesByType(pokemonType) {
  const typeMoveSets = {
    fire: ["ember", "flamethrower", "tackle", "bodySlam"],
    water: ["waterGun", "surf", "tackle", "bodySlam"],
    grass: ["vineWhip", "razorLeaf", "tackle", "bodySlam"],
    electric: ["thunderShock", "thunderbolt", "tackle", "scratch"],
    ice: ["powderSnow", "iceBeam", "tackle", "scratch"],
    fighting: ["karateChop", "brickBreak", "tackle", "bodySlam"],
    psychic: ["confusion", "psychic", "tackle", "scratch"],
    dragon: ["dragonBreath", "dragonClaw", "tackle", "scratch"],
    normal: ["tackle", "scratch", "bodySlam", "hyperBeam"],
  };

  const moveKeys = typeMoveSets[pokemonType?.toLowerCase()] || typeMoveSets.normal;

  return moveKeys.map((key) => ({
    id: key,
    ...moves[key],
  }));
}

// Generate random moves for a Pokemon
export function generatePokemonMoves(pokemon) {
  const primaryType = pokemon.types?.[0]?.toLowerCase() || "normal";
  const availableMoves = getMovesByType(primaryType);

  // Select 4 moves (or all if less than 4 available)
  const selectedMoves = availableMoves.slice(0, 4);

  return selectedMoves.map((move) => ({
    ...move,
    pp: move.maxPP, // Start with full PP
  }));
}
