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

  // Combat
  CRIT_CHANCE: 'crit_chance',
  CRIT_DAMAGE: 'crit_damage',
  SUPER_EFFECTIVE: 'super_effective',
  RESIST_DAMAGE: 'resist_damage',
  LIFESTEAL: 'lifesteal',
  FIRST_STRIKE: 'first_strike',

  // Economy
  GOLD_BONUS: 'gold_bonus',
  SHOP_DISCOUNT: 'shop_discount',
  STARTING_GOLD: 'starting_gold',

  // Healing
  POST_BATTLE_HEAL: 'post_battle_heal',
  HEAL_BOOST: 'heal_boost',
  REST_HEAL: 'rest_heal',

  // Special
  EXTRA_REWARD: 'extra_reward',
  RARE_ENEMY: 'rare_enemy',
  REVIVE_ONCE: 'revive_once',
  DOUBLE_XP: 'double_xp',
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
};

// Get all relics of a tier
export function getRelicsByTier(tier) {
  return Object.values(RELICS).filter(r => r.tier === tier);
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
    crit_chance: 0,
    crit_damage: 0,
    super_effective: 0,
    resist_damage: 0,
    lifesteal: 0,
    gold_bonus: 0,
    shop_discount: 0,
    post_battle_heal: 0,
    heal_boost: 0,
    extra_reward: 0,
    double_xp: 0,
    revive_once: false,
    rare_enemy: 0,
  };

  relics.forEach(relic => {
    const relicData = typeof relic === 'string' ? getRelicById(relic) : relic;
    if (!relicData) return;

    const effect = relicData.effect;

    // Primary effect
    if (effect.type === RELIC_EFFECTS.REVIVE_ONCE) {
      bonuses.revive_once = true;
    } else if (bonuses[effect.type] !== undefined) {
      bonuses[effect.type] += effect.value;
    }

    // Secondary effect
    if (effect.secondaryType && bonuses[effect.secondaryType] !== undefined) {
      bonuses[effect.secondaryType] += effect.secondaryValue;
    }

    // Tertiary effect
    if (effect.tertiaryType && bonuses[effect.tertiaryType] !== undefined) {
      bonuses[effect.tertiaryType] += effect.tertiaryValue;
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
  getRelicTierColor,
};
