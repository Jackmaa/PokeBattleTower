// Relics System - Slay the Spire style artifacts
// Passive bonuses that persist through the run

export const RELIC_TIERS = {
  COMMON: 'common',
  UNCOMMON: 'uncommon',
  RARE: 'rare',
  LEGENDARY: 'legendary',
};

export const RELIC_EFFECTS = {
  // Stat bonuses
  ATTACK_BONUS: 'attack_bonus',
  DEFENSE_BONUS: 'defense_bonus',
  SPEED_BONUS: 'speed_bonus',
  HP_BONUS: 'hp_bonus',
  ALL_STATS: 'all_stats',
  SPECIAL_ATTACK_BONUS: 'special_attack_bonus',
  SPECIAL_DEFENSE_BONUS: 'special_defense_bonus',

  // Combat
  CRIT_CHANCE: 'crit_chance',
  CRIT_DAMAGE: 'crit_damage',
  SUPER_EFFECTIVE: 'super_effective',
  RESIST_DAMAGE: 'resist_damage',
  LIFESTEAL: 'lifesteal',
  FIRST_STRIKE: 'first_strike',
  PHYSICAL_BONUS: 'physical_bonus',
  SPECIAL_BONUS: 'special_bonus',
  REFLECT_DAMAGE: 'reflect_damage',
  IGNORE_RESISTANCE: 'ignore_resistance',
  FOCUS_SASH: 'focus_sash', // Survive fatal hit at 1 HP once per battle

  // Economy
  GOLD_BONUS: 'gold_bonus',
  SHOP_DISCOUNT: 'shop_discount',
  STARTING_GOLD: 'starting_gold',

  // Healing
  POST_BATTLE_HEAL: 'post_battle_heal',
  HEAL_BOOST: 'heal_boost',
  REST_HEAL: 'rest_heal',
  HEAL_PER_TURN: 'heal_per_turn',

  // Special
  EXTRA_REWARD: 'extra_reward',
  RARE_ENEMY: 'rare_enemy',
  REVIVE_ONCE: 'revive_once',
  DOUBLE_XP: 'double_xp',
  XP_SHARE: 'xp_share',
  LEVEL_BOOST: 'level_boost',
  START_STAT_BOOST: 'start_stat_boost', // Boost stats at battle start
  
  // Synergy / Build Defining
  TYPE_CONVERSION: 'type_conversion', // Convert Normal moves to X type
  CONDITIONAL_DAMAGE: 'conditional_damage', // Bonus damage if condition met
};

// All relics defined
export const RELICS = {
  // ============================================
  // COMMON RELICS
  // ============================================
  lucky_coin: {
    id: 'lucky_coin',
    name: 'Lucky Coin',
    icon: '🪙',
    tier: RELIC_TIERS.COMMON,
    description: 'Gain 15% more gold from battles',
    effect: { type: RELIC_EFFECTS.GOLD_BONUS, value: 0.15 },
    flavor: 'A coin that always lands on heads.',
  },

  training_weights: {
    id: 'training_weights',
    name: 'Training Weights',
    icon: '🏋️',
    tier: RELIC_TIERS.COMMON,
    description: '+5 Attack to all Pokémon',
    effect: { type: RELIC_EFFECTS.ATTACK_BONUS, value: 5 },
    flavor: 'Heavy, but worth it.',
  },

  iron_shield: {
    id: 'iron_shield',
    name: 'Iron Shield',
    icon: '🛡️',
    tier: RELIC_TIERS.COMMON,
    description: '+5 Defense to all Pokémon',
    effect: { type: RELIC_EFFECTS.DEFENSE_BONUS, value: 5 },
    flavor: 'A shield that has seen many battles.',
  },

  running_shoes: {
    id: 'running_shoes',
    name: 'Running Shoes',
    icon: '👟',
    tier: RELIC_TIERS.COMMON,
    description: '+5 Speed to all Pokémon',
    effect: { type: RELIC_EFFECTS.SPEED_BONUS, value: 5 },
    flavor: 'These shoes were made for runnin\'.',
  },

  berry_pouch: {
    id: 'berry_pouch',
    name: 'Berry Pouch',
    icon: '🍇',
    tier: RELIC_TIERS.COMMON,
    description: 'Heal 5% HP after each battle',
    effect: { type: RELIC_EFFECTS.POST_BATTLE_HEAL, value: 0.05 },
    flavor: 'Always has a berry when you need one.',
  },

  focus_band: {
    id: 'focus_band',
    name: 'Focus Band',
    icon: '🎀',
    tier: RELIC_TIERS.COMMON,
    description: '+3% critical hit chance',
    effect: { type: RELIC_EFFECTS.CRIT_CHANCE, value: 0.03 },
    flavor: 'Helps you concentrate.',
  },

  amulet_of_vigor: {
    id: 'amulet_of_vigor',
    name: 'Amulet of Vigor',
    icon: '📿',
    tier: RELIC_TIERS.COMMON,
    description: '+10 Max HP to all Pokémon',
    effect: { type: RELIC_EFFECTS.HP_BONUS, value: 10 },
    flavor: 'Pulses with life energy.',
  },

  // ============================================
  // UNCOMMON RELICS
  // ============================================
  merchants_charm: {
    id: 'merchants_charm',
    name: "Merchant's Charm",
    icon: '💎',
    tier: RELIC_TIERS.UNCOMMON,
    description: '15% discount at shops',
    effect: { type: RELIC_EFFECTS.SHOP_DISCOUNT, value: 0.15 },
    flavor: 'The merchant always gives you a deal.',
  },

  vampiric_fang: {
    id: 'vampiric_fang',
    name: 'Vampiric Fang',
    icon: '🦷',
    tier: RELIC_TIERS.UNCOMMON,
    description: 'Heal 5% of damage dealt',
    effect: { type: RELIC_EFFECTS.LIFESTEAL, value: 0.05 },
    flavor: 'Drains the life from your foes.',
  },

  scope_lens: {
    id: 'scope_lens',
    name: 'Scope Lens',
    icon: '🔭',
    tier: RELIC_TIERS.UNCOMMON,
    description: '+8% crit chance, +25% crit damage',
    effect: { type: RELIC_EFFECTS.CRIT_CHANCE, value: 0.08, secondaryType: RELIC_EFFECTS.CRIT_DAMAGE, secondaryValue: 0.25 },
    flavor: 'See your enemies\' weaknesses.',
  },

  type_gem: {
    id: 'type_gem',
    name: 'Type Gem',
    icon: '💠',
    tier: RELIC_TIERS.UNCOMMON,
    description: '+15% super effective damage',
    effect: { type: RELIC_EFFECTS.SUPER_EFFECTIVE, value: 0.15 },
    flavor: 'Amplifies type advantages.',
  },

  thick_hide: {
    id: 'thick_hide',
    name: 'Thick Hide',
    icon: '🦏',
    tier: RELIC_TIERS.UNCOMMON,
    description: 'Take 10% less damage',
    effect: { type: RELIC_EFFECTS.RESIST_DAMAGE, value: 0.10 },
    flavor: 'Nothing gets through this.',
  },

  warriors_belt: {
    id: 'warriors_belt',
    name: "Warrior's Belt",
    icon: '🥋',
    tier: RELIC_TIERS.UNCOMMON,
    description: '+8 Attack and +8 Defense',
    effect: { type: RELIC_EFFECTS.ATTACK_BONUS, value: 8, secondaryType: RELIC_EFFECTS.DEFENSE_BONUS, secondaryValue: 8 },
    flavor: 'Worn by champions.',
  },

  healing_incense: {
    id: 'healing_incense',
    name: 'Healing Incense',
    icon: '🕯️',
    tier: RELIC_TIERS.UNCOMMON,
    description: '+30% healing effectiveness',
    effect: { type: RELIC_EFFECTS.HEAL_BOOST, value: 0.30 },
    flavor: 'Its aroma soothes all wounds.',
  },

  golden_idol: {
    id: 'golden_idol',
    name: 'Golden Idol',
    icon: '🗿',
    tier: RELIC_TIERS.UNCOMMON,
    description: '+25% gold from battles',
    effect: { type: RELIC_EFFECTS.GOLD_BONUS, value: 0.25 },
    flavor: 'Ancient treasure of immense value.',
  },

  // ============================================
  // SYNERGY RELICS (NEW)
  // ============================================
  inferno_soul: {
    id: 'inferno_soul',
    name: 'Inferno Soul',
    icon: '🔥',
    tier: RELIC_TIERS.RARE,
    description: 'Normal moves become Fire type and deal 20% more damage',
    effect: { type: RELIC_EFFECTS.TYPE_CONVERSION, from: 'normal', to: 'fire', boost: 0.20 },
    flavor: 'Your spirit burns with an intense heat.',
  },

  storm_soul: {
    id: 'storm_soul',
    name: 'Storm Soul',
    icon: '⚡',
    tier: RELIC_TIERS.RARE,
    description: 'Normal moves become Electric type and deal 20% more damage',
    effect: { type: RELIC_EFFECTS.TYPE_CONVERSION, from: 'normal', to: 'electric', boost: 0.20 },
    flavor: 'Lightning courses through your veins.',
  },

  toxic_gland: {
    id: 'toxic_gland',
    name: 'Toxic Gland',
    icon: '🤢',
    tier: RELIC_TIERS.UNCOMMON,
    description: 'Deal 30% more damage to Poisoned enemies',
    effect: { type: RELIC_EFFECTS.CONDITIONAL_DAMAGE, condition: 'status_poisoned', value: 0.30 },
    flavor: 'Reacts violently to toxins.',
  },

  executioners_axe: {
    id: 'executioners_axe',
    name: "Executioner's Axe",
    icon: '🪓',
    tier: RELIC_TIERS.RARE,
    description: 'Deal 50% more damage to enemies below 50% HP',
    effect: { type: RELIC_EFFECTS.CONDITIONAL_DAMAGE, condition: 'target_low_hp', threshold: 0.5, value: 0.50 },
    flavor: 'Mercy is not an option.',
  },

  // ============================================
  // RARE RELICS
  // ============================================
  dragon_scale: {
    id: 'dragon_scale',
    name: 'Dragon Scale',
    icon: '🐉',
    tier: RELIC_TIERS.RARE,
    description: '+10 to all stats',
    effect: { type: RELIC_EFFECTS.ALL_STATS, value: 10 },
    flavor: 'Scale of a mighty dragon.',
  },

  phoenix_feather: {
    id: 'phoenix_feather',
    name: 'Phoenix Feather',
    icon: '🪶',
    tier: RELIC_TIERS.RARE,
    description: 'Once per run: revive with 50% HP',
    effect: { type: RELIC_EFFECTS.REVIVE_ONCE, value: 0.5 },
    flavor: 'Burns bright even in death.',
  },

  crown_of_kings: {
    id: 'crown_of_kings',
    name: 'Crown of Kings',
    icon: '👑',
    tier: RELIC_TIERS.RARE,
    description: '+15% damage, +15% defense',
    effect: { type: RELIC_EFFECTS.ATTACK_BONUS, value: 15, secondaryType: RELIC_EFFECTS.DEFENSE_BONUS, secondaryValue: 15 },
    flavor: 'Worn by those destined to rule.',
  },

  ancient_tome: {
    id: 'ancient_tome',
    name: 'Ancient Tome',
    icon: '📖',
    tier: RELIC_TIERS.RARE,
    description: '+100% XP gain',
    effect: { type: RELIC_EFFECTS.DOUBLE_XP, value: 1.0 },
    flavor: 'Contains forbidden knowledge.',
  },

  blood_amulet: {
    id: 'blood_amulet',
    name: 'Blood Amulet',
    icon: '🩸',
    tier: RELIC_TIERS.RARE,
    description: 'Lifesteal 10%, heal 10% after battles',
    effect: { type: RELIC_EFFECTS.LIFESTEAL, value: 0.10, secondaryType: RELIC_EFFECTS.POST_BATTLE_HEAL, secondaryValue: 0.10 },
    flavor: 'Thirsts for battle.',
  },

  lucky_clover: {
    id: 'lucky_clover',
    name: 'Lucky Clover',
    icon: '🍀',
    tier: RELIC_TIERS.RARE,
    description: 'Extra reward chance from battles',
    effect: { type: RELIC_EFFECTS.EXTRA_REWARD, value: 0.25 },
    flavor: 'Fortune favors you.',
  },

  // ============================================
  // LEGENDARY RELICS
  // ============================================
  mewtwo_gene: {
    id: 'mewtwo_gene',
    name: 'Mewtwo Gene',
    icon: '🧬',
    tier: RELIC_TIERS.LEGENDARY,
    description: '+20 to all stats',
    effect: { type: RELIC_EFFECTS.ALL_STATS, value: 20 },
    flavor: 'The essence of the ultimate Pokémon.',
  },

  arceus_plate: {
    id: 'arceus_plate',
    name: 'Arceus Plate',
    icon: '⭐',
    tier: RELIC_TIERS.LEGENDARY,
    description: '+30% damage, +30% defense, +30% healing',
    effect: {
      type: RELIC_EFFECTS.ATTACK_BONUS,
      value: 30,
      secondaryType: RELIC_EFFECTS.DEFENSE_BONUS,
      secondaryValue: 30,
      tertiaryType: RELIC_EFFECTS.HEAL_BOOST,
      tertiaryValue: 0.3,
    },
    flavor: 'Fragment of the god of Pokémon.',
  },

  master_ball: {
    id: 'master_ball',
    name: 'Master Ball',
    icon: '🟣',
    tier: RELIC_TIERS.LEGENDARY,
    description: 'Guaranteed rare Pokémon encounters',
    effect: { type: RELIC_EFFECTS.RARE_ENEMY, value: 1.0 },
    flavor: 'The ultimate Poké Ball.',
  },

  soul_dew: {
    id: 'soul_dew',
    name: 'Soul Dew',
    icon: '💧',
    tier: RELIC_TIERS.LEGENDARY,
    description: '+50% Max HP, heal 15% after battles',
    effect: { type: RELIC_EFFECTS.HP_BONUS, value: 50, secondaryType: RELIC_EFFECTS.POST_BATTLE_HEAL, secondaryValue: 0.15 },
    flavor: 'Tear of the Eon Pokémon.',
  },

  // ============================================
  // NEW RELICS - COMBAT
  // ============================================
  razor_claw: {
    id: 'razor_claw',
    name: 'Razor Claw',
    icon: '🪝',
    tier: RELIC_TIERS.UNCOMMON,
    description: '+15% critical hit chance',
    effect: { type: RELIC_EFFECTS.CRIT_CHANCE, value: 0.15 },
    flavor: 'A sharp claw that leaves deep wounds.',
  },

  muscle_band: {
    id: 'muscle_band',
    name: 'Muscle Band',
    icon: '💪',
    tier: RELIC_TIERS.UNCOMMON,
    description: '+10% physical move damage',
    effect: { type: RELIC_EFFECTS.PHYSICAL_BONUS, value: 0.10 },
    flavor: 'Increases the power of physical moves.',
  },

  wise_glasses: {
    id: 'wise_glasses',
    name: 'Wise Glasses',
    icon: '🤓',
    tier: RELIC_TIERS.UNCOMMON,
    description: '+10% special move damage',
    effect: { type: RELIC_EFFECTS.SPECIAL_BONUS, value: 0.10 },
    flavor: 'Increases the power of special moves.',
  },

  choice_band: {
    id: 'choice_band',
    name: 'Choice Band',
    icon: '🎗️',
    tier: RELIC_TIERS.RARE,
    description: '+50% physical damage',
    effect: { type: RELIC_EFFECTS.PHYSICAL_BONUS, value: 0.50 },
    flavor: 'Boosts Attack, but limits move choice.',
  },

  choice_specs: {
    id: 'choice_specs',
    name: 'Choice Specs',
    icon: '👓',
    tier: RELIC_TIERS.RARE,
    description: '+50% special damage',
    effect: { type: RELIC_EFFECTS.SPECIAL_BONUS, value: 0.50 },
    flavor: 'Boosts Sp. Attack, but limits move choice.',
  },

  focus_sash: {
    id: 'focus_sash',
    name: 'Focus Sash',
    icon: '🎌',
    tier: RELIC_TIERS.RARE,
    description: 'Survive one fatal hit with 1 HP (once per battle)',
    effect: { type: RELIC_EFFECTS.FOCUS_SASH, value: 1 },
    flavor: 'Will hang on to a single HP if attacked at full health.',
  },

  // ============================================
  // NEW RELICS - DEFENSE
  // ============================================
  assault_vest: {
    id: 'assault_vest',
    name: 'Assault Vest',
    icon: '🦺',
    tier: RELIC_TIERS.UNCOMMON,
    description: '+25% Special Defense',
    effect: { type: RELIC_EFFECTS.SPECIAL_DEFENSE_BONUS, value: 25 },
    flavor: 'Raises Sp. Def but prevents status moves.',
  },

  rocky_helmet: {
    id: 'rocky_helmet',
    name: 'Rocky Helmet',
    icon: '⛑️',
    tier: RELIC_TIERS.UNCOMMON,
    description: 'Reflect 15% of physical damage back to attacker',
    effect: { type: RELIC_EFFECTS.REFLECT_DAMAGE, value: 0.15 },
    flavor: 'Damages attackers on contact.',
  },

  leftovers: {
    id: 'leftovers',
    name: 'Leftovers',
    icon: '🍱',
    tier: RELIC_TIERS.UNCOMMON,
    description: 'Heal 6% HP per turn in battle',
    effect: { type: RELIC_EFFECTS.HEAL_PER_TURN, value: 0.06 },
    flavor: 'Restores HP slowly during battle.',
  },

  shell_bell: {
    id: 'shell_bell',
    name: 'Shell Bell',
    icon: '🔔',
    tier: RELIC_TIERS.UNCOMMON,
    description: 'Heal 12% of damage dealt',
    effect: { type: RELIC_EFFECTS.LIFESTEAL, value: 0.12 },
    flavor: 'Heals the holder by damage inflicted.',
  },

  // ============================================
  // NEW RELICS - UTILITY
  // ============================================
  amulet_coin: {
    id: 'amulet_coin',
    name: 'Amulet Coin',
    icon: '🏅',
    tier: RELIC_TIERS.COMMON,
    description: '+50% gold from battles',
    effect: { type: RELIC_EFFECTS.GOLD_BONUS, value: 0.50 },
    flavor: 'Doubles prize money from battles.',
  },

  lucky_egg: {
    id: 'lucky_egg',
    name: 'Lucky Egg',
    icon: '🥚',
    tier: RELIC_TIERS.UNCOMMON,
    description: '+50% XP gain',
    effect: { type: RELIC_EFFECTS.DOUBLE_XP, value: 0.50 },
    flavor: 'An egg filled with happiness that boosts XP.',
  },

  soothe_bell: {
    id: 'soothe_bell',
    name: 'Soothe Bell',
    icon: '🎐',
    tier: RELIC_TIERS.COMMON,
    description: '+25% XP gain, faster leveling',
    effect: { type: RELIC_EFFECTS.DOUBLE_XP, value: 0.25, secondaryType: RELIC_EFFECTS.LEVEL_BOOST, secondaryValue: 0.10 },
    flavor: 'A bell that makes Pokemon feel at ease.',
  },

  exp_share: {
    id: 'exp_share',
    name: 'Exp. Share',
    icon: '📡',
    tier: RELIC_TIERS.RARE,
    description: 'All team members gain full XP from battles',
    effect: { type: RELIC_EFFECTS.XP_SHARE, value: 1.0 },
    flavor: 'Shares XP with all Pokemon in the party.',
  },

  // ============================================
  // NEW RELICS - LEGENDARY
  // ============================================
  orb_of_origin: {
    id: 'orb_of_origin',
    name: 'Orb of Origin',
    icon: '🔮',
    tier: RELIC_TIERS.LEGENDARY,
    description: 'Ignore type resistances (neutral minimum)',
    effect: { type: RELIC_EFFECTS.IGNORE_RESISTANCE, value: 1.0 },
    flavor: 'A mysterious orb that holds the power of creation.',
  },

  master_crown: {
    id: 'master_crown',
    name: 'Master Crown',
    icon: '🎪',
    tier: RELIC_TIERS.LEGENDARY,
    description: '+1 to all stats at the start of each battle',
    effect: { type: RELIC_EFFECTS.START_STAT_BOOST, value: 1 },
    flavor: 'Crown worn by the greatest Pokemon masters.',
  },

  griseous_orb: {
    id: 'griseous_orb',
    name: 'Griseous Orb',
    icon: '💀',
    tier: RELIC_TIERS.LEGENDARY,
    description: '+25% all damage, +25% all defenses',
    effect: {
      type: RELIC_EFFECTS.ATTACK_BONUS,
      value: 25,
      secondaryType: RELIC_EFFECTS.DEFENSE_BONUS,
      secondaryValue: 25,
    },
    flavor: 'An orb from the Distortion World.',
  },

  // ============================================
  // ACHIEVEMENT RELICS - Unlocked via achievements
  // ============================================
  iron_fist: {
    id: 'iron_fist',
    name: 'Iron Fist',
    icon: '👊',
    tier: RELIC_TIERS.UNCOMMON,
    description: '+10% physical move damage',
    effect: { type: RELIC_EFFECTS.PHYSICAL_BONUS, value: 0.10 },
    flavor: 'Awarded for reaching floor 10.',
    achievementOnly: true,
  },

  crown_of_mastery: {
    id: 'crown_of_mastery',
    name: 'Crown of Mastery',
    icon: '👑',
    tier: RELIC_TIERS.LEGENDARY,
    description: '+10 to all stats for all Pokemon',
    effect: { type: RELIC_EFFECTS.ALL_STATS, value: 10 },
    flavor: 'Only the greatest tower masters wear this crown.',
    achievementOnly: true,
  },

  golden_crown: {
    id: 'golden_crown',
    name: 'Golden Crown',
    icon: '💎',
    tier: RELIC_TIERS.RARE,
    description: '+30% gold from all sources',
    effect: { type: RELIC_EFFECTS.GOLD_BONUS, value: 0.30 },
    flavor: 'For those who truly love gold.',
    achievementOnly: true,
  },

  master_ball_charm: {
    id: 'master_ball_charm',
    name: 'Master Ball Charm',
    icon: '🟣',
    tier: RELIC_TIERS.RARE,
    description: 'Caught Pokemon gain +5 to all stats',
    effect: { type: RELIC_EFFECTS.ALL_STATS, value: 5, appliesTo: 'catch' },
    flavor: 'A charm shaped like the ultimate Poke Ball.',
    achievementOnly: true,
  },

  legendary_medal: {
    id: 'legendary_medal',
    name: 'Legendary Medal',
    icon: '🏅',
    tier: RELIC_TIERS.LEGENDARY,
    description: '+20% max HP for all Pokemon',
    effect: { type: RELIC_EFFECTS.HP_BONUS, value: 0.20 },
    flavor: 'A medal earned through countless victories.',
    achievementOnly: true,
  },

  perfect_gem: {
    id: 'perfect_gem',
    name: 'Perfect Gem',
    icon: '💠',
    tier: RELIC_TIERS.RARE,
    description: '+10% critical hit chance',
    effect: { type: RELIC_EFFECTS.CRIT_CHANCE, value: 0.10 },
    flavor: 'Flawless in every way.',
    achievementOnly: true,
  },
};

// Get all relics of a tier (excludes achievement-only relics from random pools)
export function getRelicsByTier(tier, includeAchievementOnly = false) {
  return Object.values(RELICS).filter(r =>
    r.tier === tier && (includeAchievementOnly || !r.achievementOnly)
  );
}

// Get a random relic of a tier
export function getRandomRelic(tier = RELIC_TIERS.COMMON) {
  const pool = getRelicsByTier(tier);
  if (pool.length === 0) return null;
  return { ...pool[Math.floor(Math.random() * pool.length)] };
}

// Get relic by ID
export function getRelicById(id) {
  return RELICS[id] || null;
}

// Calculate total bonuses from all relics
export function calculateRelicBonuses(relics) {
  const bonuses = {
    attack_bonus: 0,
    defense_bonus: 0,
    speed_bonus: 0,
    hp_bonus: 0,
    all_stats: 0,
    special_attack_bonus: 0,
    special_defense_bonus: 0,
    crit_chance: 0,
    crit_damage: 0,
    super_effective: 0,
    resist_damage: 0,
    lifesteal: 0,
    physical_bonus: 0,
    special_bonus: 0,
    reflect_damage: 0,
    ignore_resistance: false,
    focus_sash: false,
    gold_bonus: 0,
    shop_discount: 0,
    post_battle_heal: 0,
    heal_boost: 0,
    heal_per_turn: 0,
    extra_reward: 0,
    double_xp: 0,
    xp_share: false,
    level_boost: 0,
    start_stat_boost: 0,
    revive_once: false,
    rare_enemy: 0,
    type_conversion: [], // Array of conversion objects
    conditional_damage: [], // Array of conditional damage objects
  };

  relics.forEach(relic => {
    const relicData = typeof relic === 'string' ? getRelicById(relic) : relic;
    if (!relicData) return;

    const effect = relicData.effect;

    // Boolean effects
    const booleanEffects = [
      RELIC_EFFECTS.REVIVE_ONCE,
      RELIC_EFFECTS.FOCUS_SASH,
      RELIC_EFFECTS.IGNORE_RESISTANCE,
      RELIC_EFFECTS.XP_SHARE
    ];

    // Array effects (Synergy)
    if (effect.type === RELIC_EFFECTS.TYPE_CONVERSION) {
      bonuses.type_conversion.push(effect);
    } else if (effect.type === RELIC_EFFECTS.CONDITIONAL_DAMAGE) {
      bonuses.conditional_damage.push(effect);
    }
    // Primary effect
    else if (booleanEffects.includes(effect.type)) {
      bonuses[effect.type] = true;
    } else if (bonuses[effect.type] !== undefined) {
      bonuses[effect.type] += effect.value;
    }

    // Secondary effect
    if (effect.secondaryType) {
      if (booleanEffects.includes(effect.secondaryType)) {
        bonuses[effect.secondaryType] = true;
      } else if (bonuses[effect.secondaryType] !== undefined) {
        bonuses[effect.secondaryType] += effect.secondaryValue;
      }
    }

    // Tertiary effect
    if (effect.tertiaryType) {
      if (booleanEffects.includes(effect.tertiaryType)) {
        bonuses[effect.tertiaryType] = true;
      } else if (bonuses[effect.tertiaryType] !== undefined) {
        bonuses[effect.tertiaryType] += effect.tertiaryValue;
      }
    }
  });

  return bonuses;
}

// Apply relic stat bonuses to a team
export function applyRelicBonusesToTeam(team, relics) {
  const bonuses = calculateRelicBonuses(relics);

  return team.map(pokemon => {
    const totalAttackBonus = bonuses.attack_bonus + bonuses.all_stats;
    const totalDefenseBonus = bonuses.defense_bonus + bonuses.all_stats;
    const totalSpeedBonus = bonuses.speed_bonus + bonuses.all_stats;
    const totalHpBonus = bonuses.hp_bonus;

    return {
      ...pokemon,
      stats: {
        ...pokemon.stats,
        attack: pokemon.stats.attack + totalAttackBonus,
        defense: pokemon.stats.defense + totalDefenseBonus,
        special_attack: pokemon.stats.special_attack + totalAttackBonus,
        special_defense: pokemon.stats.special_defense + totalDefenseBonus,
        speed: pokemon.stats.speed + totalSpeedBonus,
        hp: pokemon.stats.hp + totalHpBonus,
        hp_max: pokemon.stats.hp_max + totalHpBonus,
      },
      relicBonusesApplied: true,
    };
  });
}

// Apply relic stat bonuses to a single Pokemon (for newly caught Pokemon)
export function applyRelicBonusesToPokemon(pokemon, relics) {
  if (!pokemon || !relics || relics.length === 0) return pokemon;

  const bonuses = calculateRelicBonuses(relics);

  const totalAttackBonus = bonuses.attack_bonus + bonuses.all_stats;
  const totalDefenseBonus = bonuses.defense_bonus + bonuses.all_stats;
  const totalSpeedBonus = bonuses.speed_bonus + bonuses.all_stats;
  const totalHpBonus = bonuses.hp_bonus;
  const totalSpAttackBonus = bonuses.special_attack_bonus + bonuses.all_stats;
  const totalSpDefenseBonus = bonuses.special_defense_bonus + bonuses.all_stats;

  return {
    ...pokemon,
    stats: {
      ...pokemon.stats,
      attack: pokemon.stats.attack + totalAttackBonus,
      defense: pokemon.stats.defense + totalDefenseBonus,
      special_attack: pokemon.stats.special_attack + totalSpAttackBonus,
      special_defense: pokemon.stats.special_defense + totalSpDefenseBonus,
      speed: pokemon.stats.speed + totalSpeedBonus,
      hp: pokemon.stats.hp + totalHpBonus,
      hp_max: pokemon.stats.hp_max + totalHpBonus,
    },
    relicBonusesApplied: true,
  };
}

// Get tier color
export function getRelicTierColor(tier) {
  const colors = {
    [RELIC_TIERS.COMMON]: '#9ca3af', // gray
    [RELIC_TIERS.UNCOMMON]: '#22c55e', // green
    [RELIC_TIERS.RARE]: '#3b82f6', // blue
    [RELIC_TIERS.LEGENDARY]: '#f59e0b', // gold
  };
  return colors[tier] || colors[RELIC_TIERS.COMMON];
}

export default {
  RELICS,
  RELIC_TIERS,
  RELIC_EFFECTS,
  getRelicsByTier,
  getRandomRelic,
  getRelicById,
  calculateRelicBonuses,
  applyRelicBonusesToTeam,
  applyRelicBonusesToPokemon,
  getRelicTierColor,
};
