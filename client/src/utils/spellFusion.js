// spellFusion.js
// Spell Fusion System - Combine two moves to create powerful hybrid moves!

import { moves, TARGET_TYPES, EFFECT_TYPES } from './moves';

/**
 * Fusion recipes - specific combinations that create unique moves
 * Format: { move1Id_move2Id: resultMoveId }
 */
export const FUSION_RECIPES = {
  // Fire + Water = Steam Burst
  'flamethrower_surf': 'steamBurst',
  'ember_waterGun': 'steamBurst',
  'fireBlast_hydroPump': 'volcanicTsunami',

  // Fire + Ice = Thermal Shock
  'flamethrower_iceBeam': 'thermalShock',
  'ember_powderSnow': 'thermalShock',
  'fireBlast_blizzard': 'absoluteZero',

  // Electric + Water = Electro Storm
  'thunderbolt_surf': 'electroStorm',
  'thunder_hydroPump': 'tempestWrath',
  'thunderShock_waterGun': 'electroStorm',

  // Grass + Poison = Toxic Bloom
  'solarBeam_sludgeBomb': 'toxicBloom',
  'razorLeaf_poisonSting': 'venomSpore',
  'energyBall_toxic': 'plagueFlower',

  // Psychic + Ghost = Phantom Mind
  'psychic_shadowBall': 'phantomMind',
  'confusion_shadowSneak': 'phantomMind',

  // Dragon + Fire = Infernal Dragon
  'dragonBreath_flamethrower': 'infernalDragon',
  'dracoMeteor_fireBlast': 'apocalypseFlare',

  // Ice + Electric = Frozen Thunder
  'iceBeam_thunderbolt': 'frozenThunder',
  'blizzard_thunder': 'arcticStorm',

  // Fighting + Steel = Iron Fist
  'closeCombat_ironHead': 'titanFist',
  'brickBreak_bulletPunch': 'steelBreaker',

  // Dark + Psychic = Void Mind
  'darkPulse_psychic': 'voidMind',
  'crunch_confusion': 'mindShatter',

  // Fairy + Dragon = Celestial Strike
  'moonblast_dragonPulse': 'celestialStrike',
  'dazzlingGleam_dragonBreath': 'starfall',

  // ========================================
  // SAME-TYPE FUSIONS - For easier access!
  // ========================================

  // Fire same-type
  'ember_flamethrower': 'infernoBlast',
  'flamethrower_fireBlast': 'solarFlare',
  'ember_fireBlast': 'blazingInferno',

  // Water same-type
  'waterGun_surf': 'tidalWave',
  'surf_hydroPump': 'oceansWrath',
  'waterGun_hydroPump': 'tsunamiCrash',

  // Electric same-type
  'thunderShock_thunderbolt': 'lightningSurge',
  'thunderbolt_thunder': 'zeusFury',
  'thunderShock_thunder': 'stormBolt',

  // Grass same-type
  'razorLeaf_energyBall': 'naturesFury',
  'energyBall_solarBeam': 'gaiaCannon',
  'vineWhip_solarBeam': 'worldTree',

  // Ice same-type
  'powderSnow_iceBeam': 'glacialBurst',
  'iceBeam_blizzard': 'absoluteFreeze',
  'powderSnow_blizzard': 'frostbiteStorm',

  // Psychic same-type
  'confusion_psychic': 'mindCrush',
  'psychic_calmMind': 'psionicStorm',

  // Dragon same-type
  'dragonBreath_dragonPulse': 'dragonForce',
  'dragonPulse_dracoMeteor': 'cosmicDragon',
  'dragonBreath_dracoMeteor': 'draconicAnnihilation',

  // Dark same-type
  'bite_crunch': 'abyssalFang',
  'crunch_darkPulse': 'shadowRequiem',
  'bite_darkPulse': 'voidBite',

  // Fighting same-type
  'machPunch_closeCombat': 'ultimateStrike',
  'brickBreak_closeCombat': 'shatteringBlow',
  'karateChop_brickBreak': 'martialFury',

  // Ghost same-type
  'shadowSneak_shadowBall': 'phantomBlast',

  // Poison same-type
  'poisonSting_sludgeBomb': 'venomStorm',
  'sludgeBomb_toxic': 'plagueCloud',

  // Ground same-type
  'dig_earthquake': 'tectonicRupture',

  // Steel same-type
  'bulletPunch_ironHead': 'meteoricSteel',
  'ironHead_flashCannon': 'chromeBurst',

  // Flying same-type
  'airSlash_bravebird': 'hurricaneStrike',

  // Rock same-type
  'rockSlide_stoneEdge': 'avalancheCrush',
};

/**
 * Fused move definitions - powerful hybrid moves created through fusion
 */
export const FUSED_MOVES = {
  // Fire + Water Fusions
  steamBurst: {
    name: 'Steam Burst',
    type: 'water', // Primary type
    secondaryType: 'fire',
    power: 100,
    accuracy: 95,
    pp: 10,
    maxPP: 10,
    category: 'special',
    target: TARGET_TYPES.ALL_ENEMIES,
    priority: 0,
    effect: { type: 'status', status: 'burned', chance: 30 },
    description: 'A scalding burst of superheated steam. May burn all targets.',
    isFused: true,
    fusionSource: ['flamethrower', 'surf'],
  },
  volcanicTsunami: {
    name: 'Volcanic Tsunami',
    type: 'water',
    secondaryType: 'fire',
    power: 140,
    accuracy: 85,
    pp: 5,
    maxPP: 5,
    category: 'special',
    target: TARGET_TYPES.ALL_ENEMIES,
    priority: 0,
    effect: { type: 'status', status: 'burned', chance: 50 },
    description: 'A devastating wave of molten water crashes down on all enemies.',
    isFused: true,
    fusionSource: ['fireBlast', 'hydroPump'],
  },

  // Fire + Ice Fusions
  thermalShock: {
    name: 'Thermal Shock',
    type: 'ice',
    secondaryType: 'fire',
    power: 110,
    accuracy: 90,
    pp: 8,
    maxPP: 8,
    category: 'special',
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    effect: { type: 'stat_change', stat: 'defense', stages: -2, chance: 40 },
    description: 'Extreme temperature change shatters defenses. May sharply lower Defense.',
    isFused: true,
    fusionSource: ['flamethrower', 'iceBeam'],
  },
  absoluteZero: {
    name: 'Absolute Zero',
    type: 'ice',
    secondaryType: 'fire',
    power: 150,
    accuracy: 70,
    pp: 3,
    maxPP: 3,
    category: 'special',
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    effect: { type: 'status', status: 'frozen', chance: 100 },
    description: 'Flash-freezes the target instantly. Always freezes if it hits.',
    isFused: true,
    fusionSource: ['fireBlast', 'blizzard'],
  },

  // Electric + Water Fusions
  electroStorm: {
    name: 'Electro Storm',
    type: 'electric',
    secondaryType: 'water',
    power: 105,
    accuracy: 95,
    pp: 10,
    maxPP: 10,
    category: 'special',
    target: TARGET_TYPES.ALL_ENEMIES,
    priority: 0,
    effect: { type: 'status', status: 'paralyzed', chance: 40 },
    description: 'An electrified deluge strikes all foes. May paralyze.',
    isFused: true,
    fusionSource: ['thunderbolt', 'surf'],
  },
  tempestWrath: {
    name: 'Tempest Wrath',
    type: 'electric',
    secondaryType: 'water',
    power: 145,
    accuracy: 75,
    pp: 5,
    maxPP: 5,
    category: 'special',
    target: TARGET_TYPES.ALL_ENEMIES,
    priority: 0,
    effect: { type: 'status', status: 'paralyzed', chance: 60 },
    description: 'A cataclysmic storm of lightning and water devastates everything.',
    isFused: true,
    fusionSource: ['thunder', 'hydroPump'],
  },

  // Grass + Poison Fusions
  toxicBloom: {
    name: 'Toxic Bloom',
    type: 'grass',
    secondaryType: 'poison',
    power: 120,
    accuracy: 90,
    pp: 8,
    maxPP: 8,
    category: 'special',
    target: TARGET_TYPES.ALL_ENEMIES,
    priority: 0,
    effect: { type: 'status', status: 'badly_poisoned', chance: 50 },
    description: 'Deadly spores bloom and spread toxic poison to all foes.',
    isFused: true,
    fusionSource: ['solarBeam', 'sludgeBomb'],
  },
  venomSpore: {
    name: 'Venom Spore',
    type: 'poison',
    secondaryType: 'grass',
    power: 65,
    accuracy: 100,
    pp: 15,
    maxPP: 15,
    category: 'special',
    target: TARGET_TYPES.ALL_ENEMIES,
    priority: 0,
    effect: { type: 'status', status: 'poisoned', chance: 100 },
    description: 'Releases venomous spores that poison all enemies.',
    isFused: true,
    fusionSource: ['razorLeaf', 'poisonSting'],
  },
  plagueFlower: {
    name: 'Plague Flower',
    type: 'poison',
    secondaryType: 'grass',
    power: 100,
    accuracy: 85,
    pp: 5,
    maxPP: 5,
    category: 'special',
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    effect: { type: 'status', status: 'badly_poisoned', chance: 100 },
    description: 'A cursed flower blooms inside the target. Always badly poisons.',
    isFused: true,
    fusionSource: ['energyBall', 'toxic'],
  },

  // Psychic + Ghost Fusions
  phantomMind: {
    name: 'Phantom Mind',
    type: 'psychic',
    secondaryType: 'ghost',
    power: 110,
    accuracy: 100,
    pp: 10,
    maxPP: 10,
    category: 'special',
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    effect: { type: 'stat_change', stat: 'special_defense', stages: -2, chance: 30 },
    description: 'An otherworldly psychic assault that pierces the mind.',
    isFused: true,
    fusionSource: ['psychic', 'shadowBall'],
  },

  // Dragon + Fire Fusions
  infernalDragon: {
    name: 'Infernal Dragon',
    type: 'dragon',
    secondaryType: 'fire',
    power: 115,
    accuracy: 95,
    pp: 8,
    maxPP: 8,
    category: 'special',
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    effect: { type: 'status', status: 'burned', chance: 40 },
    description: 'Unleashes the fury of an ancient fire dragon.',
    isFused: true,
    fusionSource: ['dragonBreath', 'flamethrower'],
  },
  apocalypseFlare: {
    name: 'Apocalypse Flare',
    type: 'dragon',
    secondaryType: 'fire',
    power: 160,
    accuracy: 75,
    pp: 3,
    maxPP: 3,
    category: 'special',
    target: TARGET_TYPES.ALL_ENEMIES,
    priority: 0,
    effect: { type: 'stat_change', stat: 'special_attack', stages: -2, self: true },
    description: 'The ultimate dragon fire. Harshly lowers user\'s Sp.Atk.',
    isFused: true,
    fusionSource: ['dracoMeteor', 'fireBlast'],
  },

  // Ice + Electric Fusions
  frozenThunder: {
    name: 'Frozen Thunder',
    type: 'electric',
    secondaryType: 'ice',
    power: 110,
    accuracy: 90,
    pp: 8,
    maxPP: 8,
    category: 'special',
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    effect: { type: 'status', status: 'paralyzed', chance: 30 },
    description: 'Lightning encased in ice strikes with freezing force.',
    isFused: true,
    fusionSource: ['iceBeam', 'thunderbolt'],
  },
  arcticStorm: {
    name: 'Arctic Storm',
    type: 'ice',
    secondaryType: 'electric',
    power: 140,
    accuracy: 70,
    pp: 5,
    maxPP: 5,
    category: 'special',
    target: TARGET_TYPES.ALL_ENEMIES,
    priority: 0,
    effect: { type: 'status', status: 'frozen', chance: 20 },
    description: 'A devastating blizzard charged with lightning.',
    isFused: true,
    fusionSource: ['blizzard', 'thunder'],
  },

  // Fighting + Steel Fusions
  titanFist: {
    name: 'Titan Fist',
    type: 'steel',
    secondaryType: 'fighting',
    power: 130,
    accuracy: 90,
    pp: 5,
    maxPP: 5,
    category: 'physical',
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    effect: { type: 'stat_change', stat: 'defense', stages: -1, self: true },
    description: 'A devastating steel-enhanced punch. Slightly lowers user\'s Defense.',
    isFused: true,
    fusionSource: ['closeCombat', 'ironHead'],
  },
  steelBreaker: {
    name: 'Steel Breaker',
    type: 'fighting',
    secondaryType: 'steel',
    power: 90,
    accuracy: 100,
    pp: 10,
    maxPP: 10,
    category: 'physical',
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 1, // Priority move!
    effect: { type: 'stat_change', stat: 'defense', stages: -1, chance: 30 },
    description: 'A lightning-fast steel punch. Always goes first.',
    isFused: true,
    fusionSource: ['brickBreak', 'bulletPunch'],
  },

  // Dark + Psychic Fusions
  voidMind: {
    name: 'Void Mind',
    type: 'dark',
    secondaryType: 'psychic',
    power: 115,
    accuracy: 95,
    pp: 8,
    maxPP: 8,
    category: 'special',
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    effect: { type: 'flinch', chance: 30 },
    description: 'An attack from the void between thoughts. May cause flinching.',
    isFused: true,
    fusionSource: ['darkPulse', 'psychic'],
  },
  mindShatter: {
    name: 'Mind Shatter',
    type: 'psychic',
    secondaryType: 'dark',
    power: 85,
    accuracy: 100,
    pp: 15,
    maxPP: 15,
    category: 'physical',
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    effect: { type: 'stat_change', stat: 'special_defense', stages: -1, chance: 50 },
    description: 'A vicious psychic bite that damages the mind.',
    isFused: true,
    fusionSource: ['crunch', 'confusion'],
  },

  // Fairy + Dragon Fusions
  celestialStrike: {
    name: 'Celestial Strike',
    type: 'fairy',
    secondaryType: 'dragon',
    power: 120,
    accuracy: 95,
    pp: 8,
    maxPP: 8,
    category: 'special',
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    effect: { type: 'stat_change', stat: 'special_attack', stages: -1, chance: 40 },
    description: 'A divine dragon blast of celestial energy.',
    isFused: true,
    fusionSource: ['moonblast', 'dragonPulse'],
  },
  starfall: {
    name: 'Starfall',
    type: 'fairy',
    secondaryType: 'dragon',
    power: 95,
    accuracy: 100,
    pp: 10,
    maxPP: 10,
    category: 'special',
    target: TARGET_TYPES.ALL_ENEMIES,
    priority: 0,
    description: 'Meteors of pure starlight rain down on all foes.',
    isFused: true,
    fusionSource: ['dazzlingGleam', 'dragonBreath'],
  },

  // ========================================
  // SAME-TYPE FUSIONS
  // ========================================

  // Fire same-type fusions
  infernoBlast: {
    name: 'Inferno Blast',
    type: 'fire',
    power: 90,
    accuracy: 95,
    pp: 10,
    maxPP: 10,
    category: 'special',
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    effect: { type: 'status', status: 'burned', chance: 40 },
    description: 'A concentrated blast of searing flames. High burn chance.',
    isFused: true,
    fusionSource: ['ember', 'flamethrower'],
  },
  solarFlare: {
    name: 'Solar Flare',
    type: 'fire',
    power: 130,
    accuracy: 85,
    pp: 5,
    maxPP: 5,
    category: 'special',
    target: TARGET_TYPES.ALL_ENEMIES,
    priority: 0,
    effect: { type: 'status', status: 'burned', chance: 50 },
    description: 'A miniature sun explodes, scorching all enemies.',
    isFused: true,
    fusionSource: ['flamethrower', 'fireBlast'],
  },
  blazingInferno: {
    name: 'Blazing Inferno',
    type: 'fire',
    power: 110,
    accuracy: 90,
    pp: 8,
    maxPP: 8,
    category: 'special',
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    effect: { type: 'status', status: 'burned', chance: 60 },
    description: 'An unstoppable firestorm engulfs the target.',
    isFused: true,
    fusionSource: ['ember', 'fireBlast'],
  },

  // Water same-type fusions
  tidalWave: {
    name: 'Tidal Wave',
    type: 'water',
    power: 90,
    accuracy: 95,
    pp: 10,
    maxPP: 10,
    category: 'special',
    target: TARGET_TYPES.ALL_ENEMIES,
    priority: 0,
    description: 'A massive wave crashes over all enemies.',
    isFused: true,
    fusionSource: ['waterGun', 'surf'],
  },
  oceansWrath: {
    name: "Ocean's Wrath",
    type: 'water',
    power: 130,
    accuracy: 85,
    pp: 5,
    maxPP: 5,
    category: 'special',
    target: TARGET_TYPES.ALL_ENEMIES,
    priority: 0,
    effect: { type: 'stat_change', stat: 'speed', stages: -1, chance: 30 },
    description: 'The fury of the ocean unleashed upon all foes.',
    isFused: true,
    fusionSource: ['surf', 'hydroPump'],
  },
  tsunamiCrash: {
    name: 'Tsunami Crash',
    type: 'water',
    power: 110,
    accuracy: 90,
    pp: 8,
    maxPP: 8,
    category: 'special',
    target: TARGET_TYPES.ALL_ENEMIES,
    priority: 0,
    description: 'A devastating tsunami engulfs all enemies.',
    isFused: true,
    fusionSource: ['waterGun', 'hydroPump'],
  },

  // Electric same-type fusions
  lightningSurge: {
    name: 'Lightning Surge',
    type: 'electric',
    power: 90,
    accuracy: 95,
    pp: 10,
    maxPP: 10,
    category: 'special',
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    effect: { type: 'status', status: 'paralyzed', chance: 30 },
    description: 'A surge of electricity jolts the target.',
    isFused: true,
    fusionSource: ['thunderShock', 'thunderbolt'],
  },
  zeusFury: {
    name: "Zeus's Fury",
    type: 'electric',
    power: 130,
    accuracy: 75,
    pp: 5,
    maxPP: 5,
    category: 'special',
    target: TARGET_TYPES.ALL_ENEMIES,
    priority: 0,
    effect: { type: 'status', status: 'paralyzed', chance: 40 },
    description: 'Divine lightning strikes down all enemies.',
    isFused: true,
    fusionSource: ['thunderbolt', 'thunder'],
  },
  stormBolt: {
    name: 'Storm Bolt',
    type: 'electric',
    power: 110,
    accuracy: 85,
    pp: 8,
    maxPP: 8,
    category: 'special',
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    effect: { type: 'status', status: 'paralyzed', chance: 50 },
    description: 'A bolt charged with storm energy.',
    isFused: true,
    fusionSource: ['thunderShock', 'thunder'],
  },

  // Grass same-type fusions
  naturesFury: {
    name: "Nature's Fury",
    type: 'grass',
    power: 90,
    accuracy: 95,
    pp: 10,
    maxPP: 10,
    category: 'special',
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    description: 'The wrath of nature strikes the target.',
    isFused: true,
    fusionSource: ['razorLeaf', 'energyBall'],
  },
  gaiaCannon: {
    name: 'Gaia Cannon',
    type: 'grass',
    power: 130,
    accuracy: 85,
    pp: 5,
    maxPP: 5,
    category: 'special',
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    effect: { type: 'stat_change', stat: 'special_defense', stages: -1, chance: 30 },
    description: 'A concentrated beam of pure nature energy.',
    isFused: true,
    fusionSource: ['energyBall', 'solarBeam'],
  },
  worldTree: {
    name: 'World Tree',
    type: 'grass',
    power: 110,
    accuracy: 90,
    pp: 8,
    maxPP: 8,
    category: 'special',
    target: TARGET_TYPES.ALL_ENEMIES,
    priority: 0,
    effect: { type: 'heal', percent: 20 },
    description: 'Summons the power of Yggdrasil. Heals user.',
    isFused: true,
    fusionSource: ['vineWhip', 'solarBeam'],
  },

  // Ice same-type fusions
  glacialBurst: {
    name: 'Glacial Burst',
    type: 'ice',
    power: 90,
    accuracy: 95,
    pp: 10,
    maxPP: 10,
    category: 'special',
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    effect: { type: 'status', status: 'frozen', chance: 20 },
    description: 'A burst of freezing energy.',
    isFused: true,
    fusionSource: ['powderSnow', 'iceBeam'],
  },
  absoluteFreeze: {
    name: 'Absolute Freeze',
    type: 'ice',
    power: 130,
    accuracy: 80,
    pp: 5,
    maxPP: 5,
    category: 'special',
    target: TARGET_TYPES.ALL_ENEMIES,
    priority: 0,
    effect: { type: 'status', status: 'frozen', chance: 30 },
    description: 'Temperature drops to absolute zero.',
    isFused: true,
    fusionSource: ['iceBeam', 'blizzard'],
  },
  frostbiteStorm: {
    name: 'Frostbite Storm',
    type: 'ice',
    power: 110,
    accuracy: 85,
    pp: 8,
    maxPP: 8,
    category: 'special',
    target: TARGET_TYPES.ALL_ENEMIES,
    priority: 0,
    effect: { type: 'status', status: 'frozen', chance: 25 },
    description: 'A deadly storm of ice and snow.',
    isFused: true,
    fusionSource: ['powderSnow', 'blizzard'],
  },

  // Psychic same-type fusions
  mindCrush: {
    name: 'Mind Crush',
    type: 'psychic',
    power: 95,
    accuracy: 95,
    pp: 10,
    maxPP: 10,
    category: 'special',
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    effect: { type: 'stat_change', stat: 'special_defense', stages: -1, chance: 40 },
    description: 'Crushes the target\'s mind and defenses.',
    isFused: true,
    fusionSource: ['confusion', 'psychic'],
  },
  psionicStorm: {
    name: 'Psionic Storm',
    type: 'psychic',
    power: 120,
    accuracy: 90,
    pp: 5,
    maxPP: 5,
    category: 'special',
    target: TARGET_TYPES.ALL_ENEMIES,
    priority: 0,
    effect: { type: 'stat_change', stat: 'special_attack', stages: 1, self: true },
    description: 'A storm of pure psychic energy. Boosts Sp.Atk.',
    isFused: true,
    fusionSource: ['psychic', 'calmMind'],
  },

  // Dragon same-type fusions
  dragonForce: {
    name: 'Dragon Force',
    type: 'dragon',
    power: 100,
    accuracy: 95,
    pp: 10,
    maxPP: 10,
    category: 'special',
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    description: 'Concentrated draconic power.',
    isFused: true,
    fusionSource: ['dragonBreath', 'dragonPulse'],
  },
  cosmicDragon: {
    name: 'Cosmic Dragon',
    type: 'dragon',
    power: 145,
    accuracy: 80,
    pp: 5,
    maxPP: 5,
    category: 'special',
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    effect: { type: 'stat_change', stat: 'special_attack', stages: -2, self: true },
    description: 'Summons the power of cosmic dragons. Lowers own Sp.Atk.',
    isFused: true,
    fusionSource: ['dragonPulse', 'dracoMeteor'],
  },
  draconicAnnihilation: {
    name: 'Draconic Annihilation',
    type: 'dragon',
    power: 160,
    accuracy: 70,
    pp: 3,
    maxPP: 3,
    category: 'special',
    target: TARGET_TYPES.ALL_ENEMIES,
    priority: 0,
    effect: { type: 'stat_change', stat: 'special_attack', stages: -2, self: true },
    description: 'Ultimate dragon attack. Devastates all but exhausts the user.',
    isFused: true,
    fusionSource: ['dragonBreath', 'dracoMeteor'],
  },

  // Dark same-type fusions
  abyssalFang: {
    name: 'Abyssal Fang',
    type: 'dark',
    power: 90,
    accuracy: 100,
    pp: 10,
    maxPP: 10,
    category: 'physical',
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    effect: { type: 'stat_change', stat: 'defense', stages: -1, chance: 30 },
    description: 'Fangs infused with void energy tear into the target.',
    isFused: true,
    fusionSource: ['bite', 'crunch'],
  },
  shadowRequiem: {
    name: 'Shadow Requiem',
    type: 'dark',
    power: 115,
    accuracy: 90,
    pp: 8,
    maxPP: 8,
    category: 'special',
    target: TARGET_TYPES.ALL_ENEMIES,
    priority: 0,
    description: 'A song of darkness damages all enemies.',
    isFused: true,
    fusionSource: ['crunch', 'darkPulse'],
  },
  voidBite: {
    name: 'Void Bite',
    type: 'dark',
    power: 100,
    accuracy: 95,
    pp: 10,
    maxPP: 10,
    category: 'physical',
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    effect: { type: 'heal', percent: 25, drainDamage: true },
    description: 'A bite that drains life force. Heals 25% of damage.',
    isFused: true,
    fusionSource: ['bite', 'darkPulse'],
  },

  // Fighting same-type fusions
  ultimateStrike: {
    name: 'Ultimate Strike',
    type: 'fighting',
    power: 120,
    accuracy: 90,
    pp: 5,
    maxPP: 5,
    category: 'physical',
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 1,
    description: 'A lightning-fast finishing blow.',
    isFused: true,
    fusionSource: ['machPunch', 'closeCombat'],
  },
  shatteringBlow: {
    name: 'Shattering Blow',
    type: 'fighting',
    power: 130,
    accuracy: 85,
    pp: 5,
    maxPP: 5,
    category: 'physical',
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    effect: { type: 'stat_change', stat: 'defense', stages: -1, self: true },
    description: 'A devastating blow that shatters defenses.',
    isFused: true,
    fusionSource: ['brickBreak', 'closeCombat'],
  },
  martialFury: {
    name: 'Martial Fury',
    type: 'fighting',
    power: 95,
    accuracy: 100,
    pp: 10,
    maxPP: 10,
    category: 'physical',
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    effect: { type: 'stat_change', stat: 'attack', stages: 1, self: true, chance: 30 },
    description: 'A flurry of martial arts strikes. May boost Attack.',
    isFused: true,
    fusionSource: ['karateChop', 'brickBreak'],
  },

  // Ghost same-type fusion
  phantomBlast: {
    name: 'Phantom Blast',
    type: 'ghost',
    power: 100,
    accuracy: 95,
    pp: 10,
    maxPP: 10,
    category: 'special',
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 1,
    description: 'A quick ghostly blast from the shadows.',
    isFused: true,
    fusionSource: ['shadowSneak', 'shadowBall'],
  },

  // Poison same-type fusions
  venomStorm: {
    name: 'Venom Storm',
    type: 'poison',
    power: 90,
    accuracy: 95,
    pp: 10,
    maxPP: 10,
    category: 'special',
    target: TARGET_TYPES.ALL_ENEMIES,
    priority: 0,
    effect: { type: 'status', status: 'poisoned', chance: 40 },
    description: 'A storm of toxic venom.',
    isFused: true,
    fusionSource: ['poisonSting', 'sludgeBomb'],
  },
  plagueCloud: {
    name: 'Plague Cloud',
    type: 'poison',
    power: 110,
    accuracy: 85,
    pp: 8,
    maxPP: 8,
    category: 'special',
    target: TARGET_TYPES.ALL_ENEMIES,
    priority: 0,
    effect: { type: 'status', status: 'badly_poisoned', chance: 50 },
    description: 'A deadly cloud of plague. High chance to badly poison.',
    isFused: true,
    fusionSource: ['sludgeBomb', 'toxic'],
  },

  // Ground same-type fusion
  tectonicRupture: {
    name: 'Tectonic Rupture',
    type: 'ground',
    power: 130,
    accuracy: 85,
    pp: 5,
    maxPP: 5,
    category: 'physical',
    target: TARGET_TYPES.ALL_ENEMIES,
    priority: 0,
    description: 'The earth itself ruptures under all enemies.',
    isFused: true,
    fusionSource: ['dig', 'earthquake'],
  },

  // Steel same-type fusions
  meteoricSteel: {
    name: 'Meteoric Steel',
    type: 'steel',
    power: 100,
    accuracy: 95,
    pp: 10,
    maxPP: 10,
    category: 'physical',
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 1,
    description: 'A steel punch at meteoric speed.',
    isFused: true,
    fusionSource: ['bulletPunch', 'ironHead'],
  },
  chromeBurst: {
    name: 'Chrome Burst',
    type: 'steel',
    power: 115,
    accuracy: 90,
    pp: 8,
    maxPP: 8,
    category: 'special',
    target: TARGET_TYPES.ALL_ENEMIES,
    priority: 0,
    effect: { type: 'stat_change', stat: 'defense', stages: -1, chance: 20 },
    description: 'An explosion of chrome energy.',
    isFused: true,
    fusionSource: ['ironHead', 'flashCannon'],
  },

  // Flying same-type fusion
  hurricaneStrike: {
    name: 'Hurricane Strike',
    type: 'flying',
    power: 120,
    accuracy: 85,
    pp: 8,
    maxPP: 8,
    category: 'physical',
    target: TARGET_TYPES.SINGLE_ENEMY,
    priority: 0,
    effect: { type: 'recoil', percent: 20 },
    description: 'A devastating aerial attack. User takes recoil.',
    isFused: true,
    fusionSource: ['airSlash', 'bravebird'],
  },

  // Rock same-type fusion
  avalancheCrush: {
    name: 'Avalanche Crush',
    type: 'rock',
    power: 130,
    accuracy: 80,
    pp: 5,
    maxPP: 5,
    category: 'physical',
    target: TARGET_TYPES.ALL_ENEMIES,
    priority: 0,
    description: 'Massive boulders crush all enemies.',
    isFused: true,
    fusionSource: ['rockSlide', 'stoneEdge'],
  },
};

/**
 * Check if two moves can be fused
 */
export function canFuseMoves(move1Id, move2Id) {
  const key1 = `${move1Id}_${move2Id}`;
  const key2 = `${move2Id}_${move1Id}`;

  return FUSION_RECIPES[key1] || FUSION_RECIPES[key2] || null;
}

/**
 * Generate a procedural fusion move from two source moves
 */
export function generateProceduralFusion(move1, move2) {
  // Generate Name
  const name1 = move1.name;
  const name2 = move2.name;
  
  // Simple name combination logic
  // Take first half of name1 and second half of name2
  const part1 = name1.substring(0, Math.ceil(name1.length / 2));
  const part2 = name2.substring(Math.floor(name2.length / 2));
  let fusedName = part1 + part2;
  
  // Clean up name (remove double spaces, capitalize)
  fusedName = fusedName.replace(/\s+/g, '');
  fusedName = fusedName.charAt(0).toUpperCase() + fusedName.slice(1);
  
  // Add "Blast", "Strike", "Wave" if name is too short
  if (fusedName.length < 6) {
    const suffixes = ['Blast', 'Strike', 'Wave', 'Force', 'Storm'];
    fusedName += suffixes[Math.floor(Math.random() * suffixes.length)];
  }

  // Determine Types
  const type = move1.type;
  const secondaryType = move2.type !== move1.type ? move2.type : null;

  // Calculate Stats (Average + 20% bonus)
  const power = Math.floor(((move1.power || 40) + (move2.power || 40)) / 2 * 1.2);
  const accuracy = Math.floor(((move1.accuracy || 100) + (move2.accuracy || 100)) / 2);
  const pp = Math.floor(((move1.maxPP || 15) + (move2.maxPP || 15)) / 2);

  // Determine Category (Physical/Special)
  // If both are same, keep it. If mixed, default to Move 1's category
  const category = move1.category === move2.category ? move1.category : move1.category;

  // Determine Target
  // If either is AOE, result is AOE (upgrade!)
  const isAOE = move1.target === TARGET_TYPES.ALL_ENEMIES || move2.target === TARGET_TYPES.ALL_ENEMIES;
  const target = isAOE ? TARGET_TYPES.ALL_ENEMIES : move1.target;

  // Combine Effects
  // Primary effect from Move 1, chance increased by 10%
  let effect = null;
  if (move1.effect) {
    effect = { ...move1.effect };
    if (effect.chance) {
      effect.chance = Math.min(100, effect.chance + 10);
    }
  } else if (move2.effect) {
    effect = { ...move2.effect };
    if (effect.chance) {
      effect.chance = Math.min(100, effect.chance + 10);
    }
  }

  return {
    id: `procedural_${move1.id}_${move2.id}_${Date.now()}`,
    name: fusedName,
    type,
    secondaryType,
    power,
    accuracy,
    pp,
    maxPP: pp,
    category,
    target,
    priority: Math.max(move1.priority || 0, move2.priority || 0),
    effect,
    description: `A fused move combining ${move1.name} and ${move2.name}.`,
    isFused: true,
    fusionSource: [move1.id, move2.id],
    isProcedural: true,
  };
}

/**
 * Get the fused move result from two moves
 * Checks for recipe first, then falls back to procedural generation
 */
export function getFusedMove(move1, move2) {
  if (!move1 || !move2) return null;

  // Check for recipe
  const recipeId = canFuseMoves(move1.id, move2.id);
  if (recipeId) {
    const fusedMove = FUSED_MOVES[recipeId];
    if (fusedMove) {
      return {
        id: recipeId,
        ...fusedMove,
        pp: fusedMove.maxPP,
      };
    }
  }

  // Fallback to procedural generation
  return generateProceduralFusion(move1, move2);
}

/**
 * Perform spell fusion on a Pokemon
 * Combines two moves into a fused move
 */
export function performSpellFusion(pokemon, moveIndex1, moveIndex2) {
  if (!pokemon.moves || moveIndex1 === moveIndex2) {
    return { success: false, message: 'Invalid move selection' };
  }

  const move1 = pokemon.moves[moveIndex1];
  const move2 = pokemon.moves[moveIndex2];

  if (!move1 || !move2) {
    return { success: false, message: 'Moves not found' };
  }

  // Check if already a fused move
  if (move1.isFused || move2.isFused) {
    return { success: false, message: 'Cannot fuse already-fused moves' };
  }

  // Get fused move (Recipe or Procedural)
  const fusedMove = getFusedMove(move1, move2);
  
  if (!fusedMove) {
    return {
      success: false,
      message: 'Fusion failed',
    };
  }

  // Create new moves array with fused move replacing the first one
  // and removing the second one
  const newMoves = pokemon.moves.filter((_, i) => i !== moveIndex1 && i !== moveIndex2);
  newMoves.push(fusedMove);

  return {
    success: true,
    pokemon: { ...pokemon, moves: newMoves },
    fusedMove,
    consumedMoves: [move1, move2],
    message: `${move1.name} + ${move2.name} = ${fusedMove.name}!`,
  };
}

/**
 * Get all possible fusions for a Pokemon's current moveset
 * NOW RETURNS ALL COMBINATIONS (Procedural support)
 */
export function getPossibleFusions(pokemon) {
  if (!pokemon.moves || pokemon.moves.length < 2) return [];

  const possibleFusions = [];

  for (let i = 0; i < pokemon.moves.length; i++) {
    for (let j = i + 1; j < pokemon.moves.length; j++) {
      const move1 = pokemon.moves[i];
      const move2 = pokemon.moves[j];

      // Skip if either is already fused
      if (move1.isFused || move2.isFused) continue;

      // Always possible now!
      // Check if recipe exists for highlighting/preview
      const recipeId = canFuseMoves(move1.id, move2.id);
      let resultMove;
      
      if (recipeId) {
        resultMove = { id: recipeId, ...FUSED_MOVES[recipeId] };
      } else {
        // Preview procedural fusion
        resultMove = generateProceduralFusion(move1, move2);
      }

      possibleFusions.push({
        move1Index: i,
        move2Index: j,
        move1,
        move2,
        result: resultMove,
        isRecipe: !!recipeId
      });
    }
  }

  return possibleFusions;
}

/**
 * Check if a Pokemon has any possible fusions
 */
export function hasPossibleFusions(pokemon) {
  return getPossibleFusions(pokemon).length > 0;
}

export default {
  FUSION_RECIPES,
  FUSED_MOVES,
  canFuseMoves,
  getFusedMove,
  performSpellFusion,
  getPossibleFusions,
  hasPossibleFusions,
  generateProceduralFusion,
};
