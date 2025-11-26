// 📁 moves.js
// Pokemon moves database with power, accuracy, PP, type, targeting, and priority
// Now with SKILL LEVELING system (+1 to +5 upgrades)!

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
  RECOIL: 'recoil',
  TEAM_BUFF: 'team_buff',
  FLINCH: 'flinch',
};

// ============================================
// SKILL LEVELING SYSTEM
// ============================================
export const MAX_SKILL_LEVEL = 5;

/**
 * Get the bonus stats for a move at a given level
 * Level 0 = base, Level 1-5 = upgrades
 */
export function getSkillLevelBonus(level = 0) {
  if (level <= 0) return { power: 0, accuracy: 0, effectChance: 0, pp: 0 };

  // Each level adds incremental bonuses
  return {
    power: level * 8,           // +8, +16, +24, +32, +40 power
    accuracy: level * 2,        // +2%, +4%, +6%, +8%, +10% accuracy
    effectChance: level * 5,    // +5%, +10%, +15%, +20%, +25% effect chance
    pp: level,                  // +1, +2, +3, +4, +5 PP
  };
}

/**
 * Apply skill level bonuses to a move
 * Returns a new move object with enhanced stats
 */
export function getEnhancedMove(move) {
  if (!move) return null;

  const level = move.skillLevel || 0;
  if (level <= 0) return move;

  const bonus = getSkillLevelBonus(level);

  const enhanced = {
    ...move,
    // Enhanced base stats
    power: move.power > 0 ? move.power + bonus.power : move.power,
    accuracy: Math.min(100, move.accuracy + bonus.accuracy),
    pp: move.pp + bonus.pp,
    maxPP: move.maxPP + bonus.pp,
    // Track original values for display
    _basePower: moves[move.id]?.power || move.power,
    _baseAccuracy: moves[move.id]?.accuracy || move.accuracy,
    _basePP: moves[move.id]?.pp || move.pp,
  };

  // Enhance effect chance if move has an effect
  if (enhanced.effect && enhanced.effect.chance && enhanced.effect.chance < 100) {
    enhanced.effect = {
      ...enhanced.effect,
      chance: Math.min(100, enhanced.effect.chance + bonus.effectChance),
      _baseChance: move.effect.chance,
    };
  }

  return enhanced;
}

/**
 * Level up a skill on a Pokemon
 * Returns the updated Pokemon with the leveled skill
 */
export function levelUpSkill(pokemon, moveIndex) {
  if (!pokemon.moves || !pokemon.moves[moveIndex]) return pokemon;

  const move = pokemon.moves[moveIndex];
  const currentLevel = move.skillLevel || 0;

  if (currentLevel >= MAX_SKILL_LEVEL) {
    return { success: false, pokemon, message: 'Skill already at max level!' };
  }

  const newMoves = [...pokemon.moves];
  newMoves[moveIndex] = {
    ...move,
    skillLevel: currentLevel + 1,
    // Recalculate enhanced stats
    ...getEnhancedMove({ ...move, skillLevel: currentLevel + 1 }),
  };

  return {
    success: true,
    pokemon: { ...pokemon, moves: newMoves },
    newLevel: currentLevel + 1,
    message: `${move.name} leveled up to +${currentLevel + 1}!`,
  };
}

/**
 * Get skill level display name
 */
export function getSkillLevelDisplay(level) {
  if (!level || level <= 0) return '';
  return `+${level}`;
}

/**
 * Get skill level color for UI
 */
export function getSkillLevelColor(level) {
  if (!level || level <= 0) return null;
  const colors = {
    1: '#60a5fa', // blue
    2: '#34d399', // green
    3: '#fbbf24', // yellow
    4: '#f97316', // orange
    5: '#ef4444', // red (max)
  };
  return colors[level] || colors[1];
}

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

  // ============================================
  // NEW MOVES - AOE
  // ============================================
  discharge: {
    name: "Discharge",
    type: "electric",
    power: 80,
    accuracy: 100,
    pp: 15,
    maxPP: 15,
    category: "special",
    target: TARGET_TYPES.ALL_OTHER,
    priority: 0,
    effect: { type: 'status', status: 'paralyzed', chance: 30 },
    description: "A flare of electricity strikes all surrounding Pokémon. May cause paralysis.",
  },
  sludgeWave: {
    name: "Sludge Wave",
    type: "poison",
    power: 95,
    accuracy: 100,
    pp: 10,
    maxPP: 10,
    category: "special",
    target: TARGET_TYPES.ALL_OTHER,
    priority: 0,
    effect: { type: 'status', status: 'poisoned', chance: 10 },
    description: "A sludge wave swamps the area. May poison.",
  },
  dazzlingGleam: {
    name: "Dazzling Gleam",
    type: "fairy",
    power: 80,
    accuracy: 100,
    pp: 10,
    maxPP: 10,
    category: "special",
    target: TARGET_TYPES.ALL_ENEMIES,
    priority: 0,
    description: "The user damages opposing Pokémon by emitting a powerful flash.",
  },

  // ============================================
  // NEW MOVES - SUPPORT / TEAM BUFF
  // ============================================
  lightScreen: {
    name: "Light Screen",
    type: "psychic",
    power: 0,
    accuracy: 100,
    pp: 30,
    maxPP: 30,
    category: "status",
    target: TARGET_TYPES.ALL_ALLIES,
    priority: 0,
    effect: { type: 'team_buff', buff: 'light_screen', duration: 3, reduction: 0.5 },
    description: "A wondrous wall of light is put up to reduce special damage for 3 turns.",
  },
  reflect: {
    name: "Reflect",
    type: "psychic",
    power: 0,
    accuracy: 100,
    pp: 30,
    maxPP: 30,
    category: "status",
    target: TARGET_TYPES.ALL_ALLIES,
    priority: 0,
    effect: { type: 'team_buff', buff: 'reflect', duration: 3, reduction: 0.5 },
    description: "A wondrous wall of light is put up to reduce physical damage for 3 turns.",
  },
  tailwind: {
    name: "Tailwind",
    type: "flying",
    power: 0,
    accuracy: 100,
    pp: 15,
    maxPP: 15,
    category: "status",
    target: TARGET_TYPES.ALL_ALLIES,
    priority: 0,
    effect: { type: 'team_buff', buff: 'tailwind', duration: 3, speedBoost: 2.0 },
    description: "The user whips up a turbulent whirlwind that raises the Speed of all party Pokémon for 3 turns.",
  },
  wideGuard: {
    name: "Wide Guard",
    type: "rock",
    power: 0,
    accuracy: 100,
    pp: 10,
    maxPP: 10,
    category: "status",
    target: TARGET_TYPES.ALL_ALLIES,
    priority: 3,
    effect: { type: 'team_buff', buff: 'wide_guard', duration: 1 },
    description: "The user and its allies are protected from wide-ranging attacks for one turn.",
  },

  // ============================================
  // NEW MOVES - PRIORITY
  // ============================================
  extremeSpeed: {
    name: "Extreme Speed",
    type: "normal",
    power: 80,
    accuracy: 100,
    pp: 5,
    maxPP: 5,
    category: "physical",
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 2,
    description: "The user charges at blinding speed. This move always goes first.",
  },
  fakeOut: {
    name: "Fake Out",
    type: "normal",
    power: 40,
    accuracy: 100,
    pp: 10,
    maxPP: 10,
    category: "physical",
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 3,
    effect: { type: 'flinch', chance: 100, firstTurnOnly: true },
    description: "An attack that hits first and makes the target flinch. Only works on the first turn.",
  },

  // ============================================
  // NEW MOVES - RECOIL
  // ============================================
  doubleEdge: {
    name: "Double-Edge",
    type: "normal",
    power: 120,
    accuracy: 100,
    pp: 15,
    maxPP: 15,
    category: "physical",
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    effect: { type: 'recoil', percent: 33 },
    description: "A reckless, life-risking tackle. The user also takes 1/3 of damage dealt.",
  },
  flareBlitz: {
    name: "Flare Blitz",
    type: "fire",
    power: 120,
    accuracy: 100,
    pp: 15,
    maxPP: 15,
    category: "physical",
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    effect: { type: 'recoil', percent: 33, secondaryEffect: { type: 'status', status: 'burned', chance: 10 } },
    description: "The user cloaks itself in fire and charges. The user also takes 1/3 recoil and may burn the target.",
  },
  headSmash: {
    name: "Head Smash",
    type: "rock",
    power: 150,
    accuracy: 80,
    pp: 5,
    maxPP: 5,
    category: "physical",
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    effect: { type: 'recoil', percent: 50 },
    description: "The user attacks with a hazardous full-power headbutt. The user takes half the damage dealt.",
  },
  wildCharge: {
    name: "Wild Charge",
    type: "electric",
    power: 90,
    accuracy: 100,
    pp: 15,
    maxPP: 15,
    category: "physical",
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    effect: { type: 'recoil', percent: 25 },
    description: "The user shrouds itself in electricity and smashes into the target. The user takes 1/4 recoil.",
  },
  woodHammer: {
    name: "Wood Hammer",
    type: "grass",
    power: 120,
    accuracy: 100,
    pp: 15,
    maxPP: 15,
    category: "physical",
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    effect: { type: 'recoil', percent: 33 },
    description: "The user slams its rugged body into the target. The user also takes 1/3 recoil.",
  },

  // ============================================
  // NEW MOVES - FAIRY TYPE
  // ============================================
  moonblast: {
    name: "Moonblast",
    type: "fairy",
    power: 95,
    accuracy: 100,
    pp: 15,
    maxPP: 15,
    category: "special",
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    effect: { type: 'stat_change', stat: 'special_attack', stages: -1, chance: 30 },
    description: "Borrowing the power of the moon, the user attacks. May lower Sp. Atk.",
  },
  playRough: {
    name: "Play Rough",
    type: "fairy",
    power: 90,
    accuracy: 90,
    pp: 10,
    maxPP: 10,
    category: "physical",
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    effect: { type: 'stat_change', stat: 'attack', stages: -1, chance: 10 },
    description: "The user plays rough with the target. May lower Attack.",
  },

  // ============================================
  // NEW MOVES - ADDITIONAL USEFUL MOVES
  // ============================================
  dragonPulse: {
    name: "Dragon Pulse",
    type: "dragon",
    power: 85,
    accuracy: 100,
    pp: 10,
    maxPP: 10,
    category: "special",
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    description: "The target is attacked with a shock wave generated by the user's gaping mouth.",
  },
  energyBall: {
    name: "Energy Ball",
    type: "grass",
    power: 90,
    accuracy: 100,
    pp: 10,
    maxPP: 10,
    category: "special",
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    effect: { type: 'stat_change', stat: 'special_defense', stages: -1, chance: 10 },
    description: "The user draws power from nature and fires it. May lower Sp. Def.",
  },
  aurasphere: {
    name: "Aura Sphere",
    type: "fighting",
    power: 80,
    accuracy: 100, // Never misses in games, we keep 100
    pp: 20,
    maxPP: 20,
    category: "special",
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    description: "The user lets loose a blast of aura power. This attack never misses.",
  },
  darkPulse: {
    name: "Dark Pulse",
    type: "dark",
    power: 80,
    accuracy: 100,
    pp: 15,
    maxPP: 15,
    category: "special",
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    effect: { type: 'flinch', chance: 20 },
    description: "The user releases a horrible aura imbued with dark thoughts. May cause flinching.",
  },
  scald: {
    name: "Scald",
    type: "water",
    power: 80,
    accuracy: 100,
    pp: 15,
    maxPP: 15,
    category: "special",
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    effect: { type: 'status', status: 'burned', chance: 30 },
    description: "The user shoots boiling hot water. May also burn the target.",
  },
  earthPower: {
    name: "Earth Power",
    type: "ground",
    power: 90,
    accuracy: 100,
    pp: 10,
    maxPP: 10,
    category: "special",
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    effect: { type: 'stat_change', stat: 'special_defense', stages: -1, chance: 10 },
    description: "The user makes the ground erupt with power. May lower Sp. Def.",
  },
  ironHead: {
    name: "Iron Head",
    type: "steel",
    power: 80,
    accuracy: 100,
    pp: 15,
    maxPP: 15,
    category: "physical",
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    effect: { type: 'flinch', chance: 30 },
    description: "The user slams the target with its steel-hard head. May cause flinching.",
  },
  xScissor: {
    name: "X-Scissor",
    type: "bug",
    power: 80,
    accuracy: 100,
    pp: 15,
    maxPP: 15,
    category: "physical",
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    description: "The user slashes at the target by crossing its scythes or claws as if they were scissors.",
  },
  poisonJab: {
    name: "Poison Jab",
    type: "poison",
    power: 80,
    accuracy: 100,
    pp: 20,
    maxPP: 20,
    category: "physical",
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    effect: { type: 'status', status: 'poisoned', chance: 30 },
    description: "The target is stabbed with a tentacle or arm steeped in poison. May also poison.",
  },

  // ============================================
  // OVERPOWERED / LEGENDARY MOVES
  // These are rare, powerful moves with devastating effects
  // ============================================

  // JUDGEMENT - The ultimate Normal move
  judgement: {
    name: "Judgement",
    type: "normal",
    power: 150,
    accuracy: 100,
    pp: 5,
    maxPP: 5,
    category: "special",
    target: TARGET_TYPES.ALL_ENEMIES,
    priority: 0,
    description: "Divine light judges all foes. Devastating power with perfect accuracy.",
  },

  // DOOM DESIRE - Delayed but devastating
  doomDesire: {
    name: "Doom Desire",
    type: "steel",
    power: 140,
    accuracy: 100,
    pp: 5,
    maxPP: 5,
    category: "special",
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    effect: { type: 'stat_change', stat: 'defense', stages: -2, chance: 50 },
    description: "A concentrated beam of light strikes the target, potentially shattering defenses.",
  },

  // BLUE FLARE - Reshiram's signature
  blueFlare: {
    name: "Blue Flare",
    type: "fire",
    power: 130,
    accuracy: 85,
    pp: 5,
    maxPP: 5,
    category: "special",
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    effect: { type: 'status', status: 'burned', chance: 50 },
    description: "A beautiful yet deadly blue flame. High chance to burn.",
  },

  // BOLT STRIKE - Zekrom's signature
  boltStrike: {
    name: "Bolt Strike",
    type: "electric",
    power: 130,
    accuracy: 85,
    pp: 5,
    maxPP: 5,
    category: "physical",
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    effect: { type: 'status', status: 'paralyzed', chance: 50 },
    description: "A devastating lightning strike. High chance to paralyze.",
  },

  // GLACIATE - Kyurem's signature
  glaciate: {
    name: "Glaciate",
    type: "ice",
    power: 120,
    accuracy: 95,
    pp: 8,
    maxPP: 8,
    category: "special",
    target: TARGET_TYPES.ALL_ENEMIES,
    priority: 0,
    effect: { type: 'status', status: 'frozen', chance: 30 },
    description: "Flash-freezing winds hit all foes. May freeze multiple targets.",
  },

  // V-CREATE - Victini's signature
  vCreate: {
    name: "V-Create",
    type: "fire",
    power: 180,
    accuracy: 95,
    pp: 5,
    maxPP: 5,
    category: "physical",
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    effect: { type: 'stat_change', stats: ['defense', 'special_defense', 'speed'], stages: -1, self: true },
    description: "The ultimate fire attack. Lowers user's Def, Sp.Def, and Speed.",
  },

  // ORIGIN PULSE - Kyogre's signature
  originPulse: {
    name: "Origin Pulse",
    type: "water",
    power: 110,
    accuracy: 85,
    pp: 10,
    maxPP: 10,
    category: "special",
    target: TARGET_TYPES.ALL_ENEMIES,
    priority: 0,
    description: "Attacks with myriad waves of primordial water. Hits all enemies.",
  },

  // PRECIPICE BLADES - Groudon's signature
  precipiceBlades: {
    name: "Precipice Blades",
    type: "ground",
    power: 120,
    accuracy: 85,
    pp: 10,
    maxPP: 10,
    category: "physical",
    target: TARGET_TYPES.ALL_ENEMIES,
    priority: 0,
    description: "Fearsome blades of stone attack all foes. Devastating ground attack.",
  },

  // DRAGON ASCENT - Rayquaza's signature
  dragonAscent: {
    name: "Dragon Ascent",
    type: "flying",
    power: 120,
    accuracy: 100,
    pp: 5,
    maxPP: 5,
    category: "physical",
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    effect: { type: 'stat_change', stats: ['defense', 'special_defense'], stages: -1, self: true },
    description: "Soars skyward then strikes. Slightly lowers defenses.",
  },

  // SOUL SIPHON - A dark energy drain
  soulSiphon: {
    name: "Soul Siphon",
    type: "ghost",
    power: 100,
    accuracy: 100,
    pp: 10,
    maxPP: 10,
    category: "special",
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    effect: { type: 'heal', percent: 50, drainDamage: true },
    description: "Drains the target's life force. Heals 50% of damage dealt.",
  },

  // OBLIVION WING - Yveltal's signature
  oblivionWing: {
    name: "Oblivion Wing",
    type: "flying",
    power: 80,
    accuracy: 100,
    pp: 10,
    maxPP: 10,
    category: "special",
    target: TARGET_TYPES.ALL_ENEMIES,
    priority: 0,
    effect: { type: 'heal', percent: 75, drainDamage: true },
    description: "A wave of destruction. Heals 75% of damage dealt to all targets.",
  },

  // THOUSAND ARROWS - Ground move that hits flying
  thousandArrows: {
    name: "Thousand Arrows",
    type: "ground",
    power: 90,
    accuracy: 100,
    pp: 10,
    maxPP: 10,
    category: "physical",
    target: TARGET_TYPES.ALL_ENEMIES,
    priority: 0,
    effect: { type: 'ground', hitsFlying: true },
    description: "Arrows of earth hit all foes. Can hit Flying types!",
  },

  // PHOTON GEYSER - Necrozma's signature
  photonGeyser: {
    name: "Photon Geyser",
    type: "psychic",
    power: 100,
    accuracy: 100,
    pp: 5,
    maxPP: 5,
    category: "special",
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    effect: { type: 'adaptive' }, // Uses higher attack stat
    description: "A light pillar erupts. Uses the higher attack stat.",
  },

  // ETERNABEAM - Eternatus' signature
  eternabeam: {
    name: "Eternabeam",
    type: "dragon",
    power: 160,
    accuracy: 90,
    pp: 5,
    maxPP: 5,
    category: "special",
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    description: "Infinite energy in concentrated form. Extreme power.",
  },

  // ASTRAL BARRAGE - Spectrier's signature
  astralBarrage: {
    name: "Astral Barrage",
    type: "ghost",
    power: 120,
    accuracy: 100,
    pp: 5,
    maxPP: 5,
    category: "special",
    target: TARGET_TYPES.ALL_ENEMIES,
    priority: 0,
    description: "Ghostly spirits assault all foes simultaneously.",
  },

  // INFERNO OVERDRIVE - Z-Move style fire attack
  infernoOverdrive: {
    name: "Inferno Overdrive",
    type: "fire",
    power: 200,
    accuracy: 100,
    pp: 1,
    maxPP: 1,
    category: "special",
    target: TARGET_TYPES.ALL_ENEMIES,
    priority: 0,
    effect: { type: 'status', status: 'burned', chance: 100 },
    description: "Ultimate fire attack. Burns all targets. Single use per battle.",
  },

  // HYDRO VORTEX - Z-Move style water attack
  hydroVortex: {
    name: "Hydro Vortex",
    type: "water",
    power: 200,
    accuracy: 100,
    pp: 1,
    maxPP: 1,
    category: "special",
    target: TARGET_TYPES.ALL_ENEMIES,
    priority: 0,
    description: "Creates a massive water vortex. Ultimate water attack. Single use.",
  },

  // GIGAVOLT HAVOC - Z-Move style electric
  gigavoltHavoc: {
    name: "Gigavolt Havoc",
    type: "electric",
    power: 200,
    accuracy: 100,
    pp: 1,
    maxPP: 1,
    category: "special",
    target: TARGET_TYPES.ALL_ENEMIES,
    priority: 0,
    effect: { type: 'status', status: 'paralyzed', chance: 100 },
    description: "Massive electric discharge. Paralyzes all. Single use per battle.",
  },
};

// Extended move pools for each type (includes new moves)
export const TYPE_MOVE_POOLS = {
  fire: ["ember", "flamethrower", "fireBlast", "heatWave", "flareBlitz"],
  water: ["waterGun", "surf", "hydroPump", "aquaJet", "scald", "lifeDew"],
  grass: ["vineWhip", "razorLeaf", "solarBeam", "synthesis", "energyBall", "woodHammer"],
  electric: ["thunderShock", "thunderbolt", "thunder", "thunderWave", "discharge", "wildCharge"],
  ice: ["powderSnow", "iceBeam", "blizzard", "iceShard"],
  fighting: ["karateChop", "brickBreak", "closeCombat", "machPunch", "aurasphere"],
  psychic: ["confusion", "psychic", "calmMind", "healPulse", "lightScreen", "reflect"],
  dragon: ["dragonBreath", "dragonClaw", "dracoMeteor", "dragonPulse"],
  normal: ["tackle", "scratch", "bodySlam", "hyperBeam", "quickAttack", "extremeSpeed", "doubleEdge", "fakeOut", "protect", "swordssDance"],
  ground: ["earthquake", "dig", "earthPower"],
  poison: ["poisonSting", "sludgeBomb", "toxic", "sludgeWave", "poisonJab"],
  dark: ["bite", "crunch", "suckerpunch", "darkPulse"],
  ghost: ["shadowBall", "shadowSneak"],
  steel: ["ironTail", "flashCannon", "bulletPunch", "ironHead"],
  rock: ["rockSlide", "stoneEdge", "headSmash", "wideGuard"],
  flying: ["airSlash", "bravebird", "tailwind"],
  fairy: ["dazzlingGleam", "moonblast", "playRough"],
  bug: ["xScissor"],
};

/**
 * Get a move by its ID
 * @param {string} moveId - The move ID (e.g., "flamethrower")
 * @returns {Object|null} - The move object with id, or null if not found
 */
export function getMoveById(moveId) {
  const move = moves[moveId];
  if (!move) return null;
  return {
    id: moveId,
    ...move,
  };
}

// Get moves for a Pokemon based on its type (starter set)
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
    ground: ["dig", "earthquake", "tackle", "scratch"],
    poison: ["poisonSting", "sludgeBomb", "tackle", "scratch"],
    dark: ["bite", "crunch", "tackle", "scratch"],
    ghost: ["shadowBall", "shadowSneak", "tackle", "scratch"],
    steel: ["ironTail", "flashCannon", "tackle", "scratch"],
    rock: ["rockSlide", "stoneEdge", "tackle", "scratch"],
    flying: ["airSlash", "bravebird", "tackle", "scratch"],
    fairy: ["dazzlingGleam", "moonblast", "tackle", "scratch"],
    bug: ["xScissor", "tackle", "scratch", "bodySlam"],
  };

  const moveKeys = typeMoveSets[pokemonType?.toLowerCase()] || typeMoveSets.normal;

  return moveKeys.map((key) => ({
    id: key,
    ...moves[key],
  }));
}

// Generate random moves for a Pokemon - NOW USES BOTH TYPES!
export function generatePokemonMoves(pokemon) {
  const primaryType = pokemon.types?.[0]?.toLowerCase() || "normal";
  const secondaryType = pokemon.types?.[1]?.toLowerCase() || null;

  // Get moves from primary type pool
  const primaryPool = TYPE_MOVE_POOLS[primaryType] || TYPE_MOVE_POOLS.normal;

  // Get moves from secondary type pool (if exists)
  const secondaryPool = secondaryType ? (TYPE_MOVE_POOLS[secondaryType] || []) : [];

  // Build moveset: prioritize 2-3 from primary, 1-2 from secondary (if available)
  const selectedMoveIds = [];
  const usedIds = new Set();

  // Pick 2-3 moves from primary type
  const primaryMoveCount = secondaryPool.length > 0 ? 2 : 4;
  for (const moveId of primaryPool) {
    if (selectedMoveIds.length >= primaryMoveCount) break;
    if (!usedIds.has(moveId) && moves[moveId]) {
      selectedMoveIds.push(moveId);
      usedIds.add(moveId);
    }
  }

  // Pick 1-2 moves from secondary type (for dual-type Pokemon)
  if (secondaryPool.length > 0) {
    const secondaryMoveCount = 4 - selectedMoveIds.length;
    for (const moveId of secondaryPool) {
      if (selectedMoveIds.length >= 4) break;
      if (!usedIds.has(moveId) && moves[moveId]) {
        selectedMoveIds.push(moveId);
        usedIds.add(moveId);
      }
    }
  }

  // Fill remaining slots with normal moves if needed
  if (selectedMoveIds.length < 4) {
    const normalPool = TYPE_MOVE_POOLS.normal || [];
    for (const moveId of normalPool) {
      if (selectedMoveIds.length >= 4) break;
      if (!usedIds.has(moveId) && moves[moveId]) {
        selectedMoveIds.push(moveId);
        usedIds.add(moveId);
      }
    }
  }

  // Convert to move objects with full PP
  return selectedMoveIds.map((moveId) => ({
    id: moveId,
    ...moves[moveId],
    pp: moves[moveId].maxPP,
  }));
}

/**
 * Get learnable moves for a Pokemon based on its types
 * These are moves the Pokemon can learn during a run (level-up or Move Tutor)
 * Returns moves the Pokemon doesn't already know
 */
export function getLearnableMoves(pokemon, count = 3) {
  const currentMoveIds = pokemon.moves?.map(m => m.id) || [];
  const pokemonTypes = pokemon.types?.map(t => t.toLowerCase()) || ['normal'];

  // Collect all possible moves from Pokemon's types + normal moves
  const possibleMoveKeys = new Set();

  for (const type of pokemonTypes) {
    const pool = TYPE_MOVE_POOLS[type] || [];
    pool.forEach(key => possibleMoveKeys.add(key));
  }

  // Add some universal moves that any Pokemon can learn
  const universalMoves = ['protect', 'tackle', 'bodySlam', 'quickAttack'];
  universalMoves.forEach(key => possibleMoveKeys.add(key));

  // Filter out moves the Pokemon already knows
  const learnableMoveKeys = [...possibleMoveKeys].filter(key =>
    !currentMoveIds.includes(key) && moves[key]
  );

  // Shuffle and pick random moves
  const shuffled = learnableMoveKeys.sort(() => Math.random() - 0.5);
  const selectedKeys = shuffled.slice(0, count);

  return selectedKeys.map(key => ({
    id: key,
    ...moves[key],
  }));
}

/**
 * Get a single random learnable move for level-up
 * Biased towards moves matching the Pokemon's primary type
 */
export function getRandomLearnableMove(pokemon) {
  const currentMoveIds = pokemon.moves?.map(m => m.id) || [];
  const primaryType = pokemon.types?.[0]?.toLowerCase() || 'normal';
  const secondaryType = pokemon.types?.[1]?.toLowerCase();

  // 60% chance for primary type move, 25% for secondary type (if exists), 15% for any move
  const rand = Math.random();
  let targetPool;

  if (rand < 0.6) {
    targetPool = TYPE_MOVE_POOLS[primaryType] || TYPE_MOVE_POOLS.normal;
  } else if (rand < 0.85 && secondaryType) {
    targetPool = TYPE_MOVE_POOLS[secondaryType] || TYPE_MOVE_POOLS.normal;
  } else {
    // Pick from all moves
    targetPool = Object.keys(moves);
  }

  // Filter out known moves
  const learnableMoves = targetPool.filter(key =>
    !currentMoveIds.includes(key) && moves[key]
  );

  if (learnableMoves.length === 0) return null;

  const randomKey = learnableMoves[Math.floor(Math.random() * learnableMoves.length)];
  return {
    id: randomKey,
    ...moves[randomKey],
  };
}
