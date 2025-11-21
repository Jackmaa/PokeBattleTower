// 📁 items.js
// Complete item system for Pokémon Battle Tower

export const ITEM_CATEGORIES = {
  MEDICINE: 'medicine',
  BATTLE_BOOSTS: 'battle_boosts',
  VITAMINS: 'vitamins',
  EVOLUTION: 'evolution',
  HELD_ITEMS: 'held_items',
  BERRIES: 'berries',
  POKEBALLS: 'pokeballs',
  MEGA_STONES: 'mega_stones',
  Z_CRYSTALS: 'z_crystals',
  MISC: 'misc',
};

export const ITEM_RARITY = {
  COMMON: 'common',
  UNCOMMON: 'uncommon',
  RARE: 'rare',
  LEGENDARY: 'legendary',
};

// Medicine - Healing items
const MEDICINE_ITEMS = [
  {
    id: 'potion',
    name: 'Potion',
    category: ITEM_CATEGORIES.MEDICINE,
    rarity: ITEM_RARITY.COMMON,
    description: 'Restores 20 HP to a single Pokémon',
    price: 200,
    icon: '🧪',
    effect: { type: 'heal', value: 20 },
    available: true, // ✅ Initially available
  },
  {
    id: 'super_potion',
    name: 'Super Potion',
    category: ITEM_CATEGORIES.MEDICINE,
    rarity: ITEM_RARITY.UNCOMMON,
    description: 'Restores 50 HP to a single Pokémon',
    price: 700,
    icon: '🧪',
    effect: { type: 'heal', value: 50 },
    available: true, // ✅ Available
  },
  {
    id: 'hyper_potion',
    name: 'Hyper Potion',
    category: ITEM_CATEGORIES.MEDICINE,
    rarity: ITEM_RARITY.UNCOMMON,
    description: 'Restores 120 HP to a single Pokémon',
    price: 1500,
    icon: '🧪',
    effect: { type: 'heal', value: 120 },
    available: true, // ✅ Available
  },
  {
    id: 'max_potion',
    name: 'Max Potion',
    category: ITEM_CATEGORIES.MEDICINE,
    rarity: ITEM_RARITY.RARE,
    description: 'Fully restores HP of a single Pokémon',
    price: 2500,
    icon: '🧪',
    effect: { type: 'heal', value: 'full' },
    available: true, // ✅ Available
  },
  {
    id: 'full_restore',
    name: 'Full Restore',
    category: ITEM_CATEGORIES.MEDICINE,
    rarity: ITEM_RARITY.RARE,
    description: 'Fully restores HP and heals all status conditions',
    price: 3000,
    icon: '💊',
    effect: { type: 'heal_full_status' },
    available: true, // ✅ Available
  },
  {
    id: 'revive',
    name: 'Revive',
    category: ITEM_CATEGORIES.MEDICINE,
    rarity: ITEM_RARITY.UNCOMMON,
    description: 'Revives a fainted Pokémon with half HP',
    price: 2000,
    icon: '💫',
    effect: { type: 'revive', value: 0.5 },
    available: true, // ✅ Available
  },
  {
    id: 'max_revive',
    name: 'Max Revive',
    category: ITEM_CATEGORIES.MEDICINE,
    rarity: ITEM_RARITY.RARE,
    description: 'Revives a fainted Pokémon with full HP',
    price: 4000,
    icon: '✨',
    effect: { type: 'revive', value: 1.0 },
    available: true, // ✅ Available
  },
  {
    id: 'elixir',
    name: 'Elixir',
    category: ITEM_CATEGORIES.MEDICINE,
    rarity: ITEM_RARITY.UNCOMMON,
    description: 'Restores 10 PP to all moves of a single Pokémon',
    price: 1500,
    icon: '💧',
    effect: { type: 'pp_restore', value: 10, target: 'all_moves' },
    available: true, // ✅ Available
  },
  {
    id: 'max_elixir',
    name: 'Max Elixir',
    category: ITEM_CATEGORIES.MEDICINE,
    rarity: ITEM_RARITY.RARE,
    description: 'Fully restores PP to all moves of a single Pokémon',
    price: 3000,
    icon: '💧',
    effect: { type: 'pp_restore', value: 'full', target: 'all_moves' },
    available: true, // ✅ Available
  },
  {
    id: 'ether',
    name: 'Ether',
    category: ITEM_CATEGORIES.MEDICINE,
    rarity: ITEM_RARITY.UNCOMMON,
    description: 'Restores 10 PP to a single move',
    price: 1200,
    icon: '💧',
    effect: { type: 'pp_restore', value: 10, target: 'single_move' },
    available: true, // ✅ Available
  },
  {
    id: 'max_ether',
    name: 'Max Ether',
    category: ITEM_CATEGORIES.MEDICINE,
    rarity: ITEM_RARITY.RARE,
    description: 'Fully restores PP to a single move',
    price: 2000,
    icon: '💧',
    effect: { type: 'pp_restore', value: 'full', target: 'single_move' },
    available: true, // ✅ Available
  },
];

// Battle Boosts - X items for temporary stat increases
const BATTLE_BOOST_ITEMS = [
  {
    id: 'x_attack',
    name: 'X Attack',
    category: ITEM_CATEGORIES.BATTLE_BOOSTS,
    rarity: ITEM_RARITY.COMMON,
    description: 'Sharply raises Attack during battle',
    price: 500,
    icon: '⚔️',
    effect: { type: 'stat_boost', stat: 'attack', stages: 2, duration: 'battle' },
    available: true, // ✅ Initially available
  },
  {
    id: 'x_defense',
    name: 'X Defense',
    category: ITEM_CATEGORIES.BATTLE_BOOSTS,
    rarity: ITEM_RARITY.COMMON,
    description: 'Sharply raises Defense during battle',
    price: 500,
    icon: '🛡️',
    effect: { type: 'stat_boost', stat: 'defense', stages: 2, duration: 'battle' },
    available: true, // ✅ Initially available
  },
  {
    id: 'x_sp_atk',
    name: 'X Sp. Atk',
    category: ITEM_CATEGORIES.BATTLE_BOOSTS,
    rarity: ITEM_RARITY.COMMON,
    description: 'Sharply raises Special Attack during battle',
    price: 500,
    icon: '✨',
    effect: { type: 'stat_boost', stat: 'special_attack', stages: 2, duration: 'battle' },
    available: true, // ✅ Available
  },
  {
    id: 'x_sp_def',
    name: 'X Sp. Def',
    category: ITEM_CATEGORIES.BATTLE_BOOSTS,
    rarity: ITEM_RARITY.COMMON,
    description: 'Sharply raises Special Defense during battle',
    price: 500,
    icon: '🔰',
    effect: { type: 'stat_boost', stat: 'special_defense', stages: 2, duration: 'battle' },
    available: true, // ✅ Available
  },
  {
    id: 'x_speed',
    name: 'X Speed',
    category: ITEM_CATEGORIES.BATTLE_BOOSTS,
    rarity: ITEM_RARITY.COMMON,
    description: 'Sharply raises Speed during battle',
    price: 500,
    icon: '💨',
    effect: { type: 'stat_boost', stat: 'speed', stages: 2, duration: 'battle' },
    available: true, // ✅ Available
  },
  {
    id: 'x_accuracy',
    name: 'X Accuracy',
    category: ITEM_CATEGORIES.BATTLE_BOOSTS,
    rarity: ITEM_RARITY.COMMON,
    description: 'Sharply raises Accuracy during battle',
    price: 500,
    icon: '🎯',
    effect: { type: 'stat_boost', stat: 'accuracy', stages: 2, duration: 'battle' },
    available: false,
  },
  {
    id: 'dire_hit',
    name: 'Dire Hit',
    category: ITEM_CATEGORIES.BATTLE_BOOSTS,
    rarity: ITEM_RARITY.UNCOMMON,
    description: 'Raises critical hit ratio during battle',
    price: 650,
    icon: '💥',
    effect: { type: 'crit_boost', stages: 2, duration: 'battle' },
    available: false,
  },
  {
    id: 'guard_spec',
    name: 'Guard Spec.',
    category: ITEM_CATEGORIES.BATTLE_BOOSTS,
    rarity: ITEM_RARITY.UNCOMMON,
    description: 'Prevents stat reduction for 5 turns',
    price: 700,
    icon: '🛡️',
    effect: { type: 'prevent_stat_drop', duration: 5 },
    available: false,
  },
];

// Vitamins - Permanent stat increases
const VITAMIN_ITEMS = [
  {
    id: 'protein',
    name: 'Protein',
    category: ITEM_CATEGORIES.VITAMINS,
    rarity: ITEM_RARITY.RARE,
    description: 'Permanently increases Attack by 10',
    price: 10000,
    icon: '💪',
    effect: { type: 'ev_boost', stat: 'attack', value: 10 },
    available: true, // ✅ Available
  },
  {
    id: 'iron',
    name: 'Iron',
    category: ITEM_CATEGORIES.VITAMINS,
    rarity: ITEM_RARITY.RARE,
    description: 'Permanently increases Defense by 10',
    price: 10000,
    icon: '🛡️',
    effect: { type: 'ev_boost', stat: 'defense', value: 10 },
    available: true, // ✅ Available
  },
  {
    id: 'calcium',
    name: 'Calcium',
    category: ITEM_CATEGORIES.VITAMINS,
    rarity: ITEM_RARITY.RARE,
    description: 'Permanently increases Special Attack by 10',
    price: 10000,
    icon: '✨',
    effect: { type: 'ev_boost', stat: 'special_attack', value: 10 },
    available: true, // ✅ Available
  },
  {
    id: 'zinc',
    name: 'Zinc',
    category: ITEM_CATEGORIES.VITAMINS,
    rarity: ITEM_RARITY.RARE,
    description: 'Permanently increases Special Defense by 10',
    price: 10000,
    icon: '🔰',
    effect: { type: 'ev_boost', stat: 'special_defense', value: 10 },
    available: true, // ✅ Available
  },
  {
    id: 'carbos',
    name: 'Carbos',
    category: ITEM_CATEGORIES.VITAMINS,
    rarity: ITEM_RARITY.RARE,
    description: 'Permanently increases Speed by 10',
    price: 10000,
    icon: '💨',
    effect: { type: 'ev_boost', stat: 'speed', value: 10 },
    available: true, // ✅ Available
  },
  {
    id: 'hp_up',
    name: 'HP Up',
    category: ITEM_CATEGORIES.VITAMINS,
    rarity: ITEM_RARITY.RARE,
    description: 'Permanently increases HP by 10',
    price: 10000,
    icon: '❤️',
    effect: { type: 'ev_boost', stat: 'hp', value: 10 },
    available: true, // ✅ Available
  },
  {
    id: 'rare_candy',
    name: 'Rare Candy',
    category: ITEM_CATEGORIES.VITAMINS,
    rarity: ITEM_RARITY.LEGENDARY,
    description: 'Raises a Pokémon\'s level by 1 (all stats +5)',
    price: 5000,
    icon: '🍬',
    effect: { type: 'level_up', value: 1 },
    available: true, // ✅ Available
  },
];

// Evolution Items
const EVOLUTION_ITEMS = [
  {
    id: 'fire_stone',
    name: 'Fire Stone',
    category: ITEM_CATEGORIES.EVOLUTION,
    rarity: ITEM_RARITY.RARE,
    description: 'Evolves certain Fire-type Pokémon (Vulpix, Growlithe, Eevee)',
    price: 3000,
    icon: '🔥',
    effect: { type: 'evolution', stone_type: 'fire' },
    available: true, // ✅ Available
  },
  {
    id: 'water_stone',
    name: 'Water Stone',
    category: ITEM_CATEGORIES.EVOLUTION,
    rarity: ITEM_RARITY.RARE,
    description: 'Evolves certain Water-type Pokémon (Poliwhirl, Shellder, Staryu, Eevee)',
    price: 3000,
    icon: '💧',
    effect: { type: 'evolution', stone_type: 'water' },
    available: true, // ✅ Available
  },
  {
    id: 'thunder_stone',
    name: 'Thunder Stone',
    category: ITEM_CATEGORIES.EVOLUTION,
    rarity: ITEM_RARITY.RARE,
    description: 'Evolves certain Electric-type Pokémon (Pikachu, Eevee)',
    price: 3000,
    icon: '⚡',
    effect: { type: 'evolution', stone_type: 'thunder' },
    available: true, // ✅ Available
  },
  {
    id: 'leaf_stone',
    name: 'Leaf Stone',
    category: ITEM_CATEGORIES.EVOLUTION,
    rarity: ITEM_RARITY.RARE,
    description: 'Evolves certain Grass-type Pokémon (Gloom, Weepinbell, Exeggcute)',
    price: 3000,
    icon: '🍃',
    effect: { type: 'evolution', stone_type: 'leaf' },
    available: true, // ✅ Available
  },
  {
    id: 'moon_stone',
    name: 'Moon Stone',
    category: ITEM_CATEGORIES.EVOLUTION,
    rarity: ITEM_RARITY.RARE,
    description: 'Evolves certain Pokémon (Nidorino, Nidorina, Clefairy, Jigglypuff)',
    price: 3000,
    icon: '🌙',
    effect: { type: 'evolution', stone_type: 'moon' },
    available: true, // ✅ Available
  },
  {
    id: 'sun_stone',
    name: 'Sun Stone',
    category: ITEM_CATEGORIES.EVOLUTION,
    rarity: ITEM_RARITY.RARE,
    description: 'Evolves certain Pokémon',
    price: 3000,
    icon: '☀️',
    effect: { type: 'evolution', stone_type: 'sun' },
    available: false,
  },
  {
    id: 'shiny_stone',
    name: 'Shiny Stone',
    category: ITEM_CATEGORIES.EVOLUTION,
    rarity: ITEM_RARITY.RARE,
    description: 'Evolves certain Pokémon',
    price: 3000,
    icon: '✨',
    effect: { type: 'evolution', stone_type: 'shiny' },
    available: false,
  },
  {
    id: 'dusk_stone',
    name: 'Dusk Stone',
    category: ITEM_CATEGORIES.EVOLUTION,
    rarity: ITEM_RARITY.RARE,
    description: 'Evolves certain Pokémon',
    price: 3000,
    icon: '🌑',
    effect: { type: 'evolution', stone_type: 'dusk' },
    available: false,
  },
  {
    id: 'dawn_stone',
    name: 'Dawn Stone',
    category: ITEM_CATEGORIES.EVOLUTION,
    rarity: ITEM_RARITY.RARE,
    description: 'Evolves certain Pokémon',
    price: 3000,
    icon: '🌅',
    effect: { type: 'evolution', stone_type: 'dawn' },
    available: false,
  },
  {
    id: 'ice_stone',
    name: 'Ice Stone',
    category: ITEM_CATEGORIES.EVOLUTION,
    rarity: ITEM_RARITY.RARE,
    description: 'Evolves certain Ice-type Pokémon',
    price: 3000,
    icon: '❄️',
    effect: { type: 'evolution', stone_type: 'ice' },
    available: false,
  },
];

// Held Items - Passive effects when held
const HELD_ITEMS = [
  {
    id: 'leftovers',
    name: 'Leftovers',
    category: ITEM_CATEGORIES.HELD_ITEMS,
    rarity: ITEM_RARITY.RARE,
    description: '[Equip] Restores 1/16 of max HP each turn (passive)',
    price: 4000,
    icon: '🍖',
    effect: { type: 'held_regen', trigger: 'end_of_turn', value: 0.0625 },
    available: true, // ✅ Available
  },
  {
    id: 'choice_band',
    name: 'Choice Band',
    category: ITEM_CATEGORIES.HELD_ITEMS,
    rarity: ITEM_RARITY.RARE,
    description: '[Equip] Boosts Attack by 50% but locks you into one move',
    price: 5000,
    icon: '🎀',
    effect: { type: 'held_choice', stat: 'attack', stat_multiplier: 1.5 },
    available: true, // ✅ Available
  },
  {
    id: 'choice_specs',
    name: 'Choice Specs',
    category: ITEM_CATEGORIES.HELD_ITEMS,
    rarity: ITEM_RARITY.RARE,
    description: '[Equip] Boosts Sp. Atk by 50% but locks you into one move',
    price: 5000,
    icon: '👓',
    effect: { type: 'held_choice', stat: 'special_attack', stat_multiplier: 1.5 },
    available: true, // ✅ Available
  },
  {
    id: 'choice_scarf',
    name: 'Choice Scarf',
    category: ITEM_CATEGORIES.HELD_ITEMS,
    rarity: ITEM_RARITY.RARE,
    description: '[Equip] Boosts Speed by 50% but locks you into one move',
    price: 5000,
    icon: '🧣',
    effect: { type: 'held_choice', stat: 'speed', stat_multiplier: 1.5 },
    available: true, // ✅ Available
  },
  {
    id: 'focus_sash',
    name: 'Focus Sash',
    category: ITEM_CATEGORIES.HELD_ITEMS,
    rarity: ITEM_RARITY.RARE,
    description: 'Survives a lethal hit with 1 HP when at full health',
    price: 4000,
    icon: '🎗️',
    effect: { type: 'held_survive', condition: 'full_hp', result_hp: 1 },
    available: false,
  },
  {
    id: 'assault_vest',
    name: 'Assault Vest',
    category: ITEM_CATEGORIES.HELD_ITEMS,
    rarity: ITEM_RARITY.RARE,
    description: 'Boosts Sp. Def by 50% but prevents status moves',
    price: 5000,
    icon: '🦺',
    effect: { type: 'held_stat_boost', stat: 'special_defense', multiplier: 1.5, restriction: 'no_status_moves' },
    available: false,
  },
  {
    id: 'life_orb',
    name: 'Life Orb',
    category: ITEM_CATEGORIES.HELD_ITEMS,
    rarity: ITEM_RARITY.RARE,
    description: 'Boosts move power by 30% but takes 10% recoil',
    price: 5000,
    icon: '🔮',
    effect: { type: 'held_damage_boost', multiplier: 1.3, recoil: 0.1 },
    available: false,
  },
];

// Berries - Consumable held items with various effects
const BERRY_ITEMS = [
  {
    id: 'oran_berry',
    name: 'Oran Berry',
    category: ITEM_CATEGORIES.BERRIES,
    rarity: ITEM_RARITY.COMMON,
    description: '[Equip] Restores 10 HP when HP drops below 50% (auto-trigger)',
    price: 300,
    icon: '🫐',
    effect: { type: 'held_conditional', trigger: 'hp_below_50%', action: 'heal', value: 10 },
    available: true, // ✅ Available
  },
  {
    id: 'sitrus_berry',
    name: 'Sitrus Berry',
    category: ITEM_CATEGORIES.BERRIES,
    rarity: ITEM_RARITY.UNCOMMON,
    description: '[Equip] Restores 25% HP when HP drops below 50% (auto-trigger)',
    price: 800,
    icon: '🍊',
    effect: { type: 'held_conditional', trigger: 'hp_below_50%', action: 'heal_percent', value: 25 },
    available: true, // ✅ Available
  },
  {
    id: 'lum_berry',
    name: 'Lum Berry',
    category: ITEM_CATEGORIES.BERRIES,
    rarity: ITEM_RARITY.UNCOMMON,
    description: '[Equip] Cures status conditions (auto-trigger when afflicted)',
    price: 1000,
    icon: '🍋',
    effect: { type: 'held_conditional', trigger: 'status_condition', action: 'cure_status' },
    available: true, // ✅ Available
  },
];

// Mega Stones - Enable Mega Evolution
const MEGA_STONE_ITEMS = [
  {
    id: 'charizardite_x',
    name: 'Charizardite X',
    category: ITEM_CATEGORIES.MEGA_STONES,
    rarity: ITEM_RARITY.LEGENDARY,
    description: 'Allows Charizard to Mega Evolve into Mega Charizard X during battle',
    price: 10000,
    icon: '💎',
    effect: {
      type: 'mega_stone',
      pokemon: 'charizard',
      mega_form: 'charizard-mega-x',
      stat_changes: {
        hp: 0,
        attack: 40,
        defense: 21,
        special_attack: 0,
        special_defense: 10,
        speed: 0,
      },
      type_change: ['fire', 'dragon'],
      ability: 'Tough Claws',
    },
    available: true, // ✅ Available for testing
  },
  {
    id: 'charizardite_y',
    name: 'Charizardite Y',
    category: ITEM_CATEGORIES.MEGA_STONES,
    rarity: ITEM_RARITY.LEGENDARY,
    description: 'Allows Charizard to Mega Evolve into Mega Charizard Y during battle',
    price: 10000,
    icon: '💎',
    effect: {
      type: 'mega_stone',
      pokemon: 'charizard',
      mega_form: 'charizard-mega-y',
      stat_changes: {
        hp: 0,
        attack: 0,
        defense: 18,
        special_attack: 50,
        special_defense: 15,
        speed: 0,
      },
      type_change: ['fire', 'flying'],
      ability: 'Drought',
    },
    available: true, // ✅ Available for testing
  },
];

// Combine all items
const ALL_ITEMS = [
  ...MEDICINE_ITEMS,
  ...BATTLE_BOOST_ITEMS,
  ...VITAMIN_ITEMS,
  ...EVOLUTION_ITEMS,
  ...HELD_ITEMS,
  ...BERRY_ITEMS,
  ...MEGA_STONE_ITEMS,
];

/**
 * Get all items
 */
export function getAllItems() {
  return ALL_ITEMS;
}

/**
 * Get only items available in shop
 */
export function getAvailableShopItems() {
  return ALL_ITEMS.filter(item => item.available);
}

/**
 * Get items by category
 */
export function getItemsByCategory(category) {
  return ALL_ITEMS.filter(item => item.category === category);
}

/**
 * Get items by rarity
 */
export function getItemsByRarity(rarity) {
  return ALL_ITEMS.filter(item => item.rarity === rarity);
}

/**
 * Get item by ID
 */
export function getItemById(id) {
  return ALL_ITEMS.find(item => item.id === id);
}

/**
 * Get category display name
 */
export function getCategoryDisplayName(category) {
  const names = {
    [ITEM_CATEGORIES.MEDICINE]: 'Medicine',
    [ITEM_CATEGORIES.BATTLE_BOOSTS]: 'Battle Boosts',
    [ITEM_CATEGORIES.VITAMINS]: 'Vitamins',
    [ITEM_CATEGORIES.EVOLUTION]: 'Evolution Items',
    [ITEM_CATEGORIES.HELD_ITEMS]: 'Held Items',
    [ITEM_CATEGORIES.BERRIES]: 'Berries',
    [ITEM_CATEGORIES.POKEBALLS]: 'Poké Balls',
    [ITEM_CATEGORIES.MEGA_STONES]: 'Mega Stones',
    [ITEM_CATEGORIES.Z_CRYSTALS]: 'Z-Crystals',
    [ITEM_CATEGORIES.MISC]: 'Miscellaneous',
  };
  return names[category] || category;
}

/**
 * Get rarity color for UI
 */
export function getRarityColor(rarity) {
  const colors = {
    [ITEM_RARITY.COMMON]: 'from-gray-600 to-gray-700',
    [ITEM_RARITY.UNCOMMON]: 'from-green-600 to-emerald-700',
    [ITEM_RARITY.RARE]: 'from-blue-600 to-indigo-700',
    [ITEM_RARITY.LEGENDARY]: 'from-purple-600 to-pink-700',
  };
  return colors[rarity] || colors[ITEM_RARITY.COMMON];
}

/**
 * Get rarity glow color for UI
 */
export function getRarityGlow(rarity) {
  const glows = {
    [ITEM_RARITY.COMMON]: 'rgba(156, 163, 175, 0.3)',
    [ITEM_RARITY.UNCOMMON]: 'rgba(16, 185, 129, 0.4)',
    [ITEM_RARITY.RARE]: 'rgba(59, 130, 246, 0.5)',
    [ITEM_RARITY.LEGENDARY]: 'rgba(168, 85, 247, 0.6)',
  };
  return glows[rarity] || glows[ITEM_RARITY.COMMON];
}
