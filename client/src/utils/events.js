// 📁 events.js
// Random events system for Event nodes - Choice-based Slay the Spire style

export const EVENT_TYPES = {
  STAT_BOOST: 'stat_boost',
  RARE_CANDY: 'rare_candy',
  WILD_POKEMON: 'wild_pokemon',
  MYSTERIOUS_BERRY: 'mysterious_berry',
  HIDDEN_ITEM: 'hidden_item',
  POKEMON_EVOLUTION: 'pokemon_evolution',
  TRAINER_GIFT: 'trainer_gift',
  CURSE: 'curse',
  FORTUNE: 'fortune',
  SHRINE: 'shrine',
  ENCOUNTER: 'encounter',
  MYSTERY: 'mystery',
};

// ============================================
// NEW CHOICE-BASED EVENTS (Slay the Spire style)
// ============================================
export const CHOICE_EVENTS = [
  // Ancient Shrine
  {
    id: 'ancient_shrine',
    title: '⛩️ Ancient Shrine',
    description: 'You discover an ancient shrine dedicated to legendary Pokémon. A mystical energy fills the air.',
    icon: '⛩️',
    floorRange: [1, 20],
    choices: [
      {
        id: 'pray',
        label: 'Pray at the shrine',
        description: 'Offer your respects',
        outcomes: [
          { type: 'heal_percent', value: 0.3, weight: 50, message: 'The shrine blesses you with healing energy!' },
          { type: 'stat_boost', stat: 'random', value: 8, weight: 30, message: 'You feel empowered!' },
          { type: 'nothing', weight: 20, message: 'Nothing happens...' },
        ],
      },
      {
        id: 'offer_gold',
        label: 'Offer 50 gold',
        description: 'Make a generous offering',
        cost: { gold: 50 },
        outcomes: [
          { type: 'heal_percent', value: 0.5, weight: 35, message: 'Your offering is accepted! Great restoration!' },
          { type: 'gain_relic', tier: 'common', weight: 35, message: 'A sacred relic appears!' },
          { type: 'stat_boost_all', value: 5, weight: 30, message: 'Divine power flows through you!' },
        ],
      },
      {
        id: 'leave',
        label: 'Leave quietly',
        description: 'Better not disturb ancient powers',
        outcomes: [
          { type: 'nothing', weight: 100, message: 'You continue on your journey.' },
        ],
      },
    ],
  },

  // Healing Spring
  {
    id: 'healing_spring',
    title: '💧 Healing Spring',
    description: 'A crystal-clear spring bubbles up from the ground. The water seems to glow with restorative energy.',
    icon: '💧',
    floorRange: [1, 20],
    choices: [
      {
        id: 'drink',
        label: 'Drink from the spring',
        description: 'Restore some HP',
        outcomes: [
          { type: 'heal_percent', value: 0.25, weight: 100, message: 'Refreshing! Your team feels rejuvenated.' },
        ],
      },
      {
        id: 'bathe',
        label: 'Bathe your Pokémon',
        description: 'Full heal but risky',
        outcomes: [
          { type: 'heal_percent', value: 1.0, weight: 70, message: 'Your Pokémon are fully restored!' },
          { type: 'damage_percent', value: 0.15, weight: 30, message: 'The water was cursed! Your team takes damage.' },
        ],
      },
      {
        id: 'bottle',
        label: 'Bottle the water',
        description: 'Get a healing item',
        outcomes: [
          { type: 'gain_item', itemId: 'potion', weight: 50, message: 'You obtained a Potion!' },
          { type: 'gain_item', itemId: 'super_potion', weight: 35, message: 'You obtained a Super Potion!' },
          { type: 'gain_item', itemId: 'max_potion', weight: 15, message: 'You obtained a Max Potion!' },
        ],
      },
    ],
  },

  // Lost Trainer
  {
    id: 'lost_trainer',
    title: '🧑 Lost Trainer',
    description: 'You encounter a trainer who seems lost and distressed. They ask for your help.',
    icon: '🧑',
    floorRange: [1, 15],
    choices: [
      {
        id: 'help',
        label: 'Help them find the way',
        description: 'Be kind',
        outcomes: [
          { type: 'gain_gold', value: 40, weight: 50, message: 'They reward you with gold!' },
          { type: 'gain_item', itemId: 'random_berry', weight: 30, message: 'They give you a berry as thanks!' },
          { type: 'gain_relic', tier: 'common', weight: 20, message: 'They gift you a special item!' },
        ],
      },
      {
        id: 'rob',
        label: 'Demand their valuables',
        description: 'Risky but profitable',
        outcomes: [
          { type: 'gain_gold', value: 100, weight: 40, message: 'They reluctantly hand over their gold.' },
          { type: 'damage_percent', value: 0.2, weight: 35, message: 'They fight back! Your team is hurt.' },
          { type: 'stat_decrease', stat: 'random', value: 5, weight: 25, message: 'Karma catches up. You feel weaker.' },
        ],
      },
      {
        id: 'ignore',
        label: 'Ignore them',
        description: 'You have your own journey',
        outcomes: [
          { type: 'nothing', weight: 100, message: 'You walk past without a word.' },
        ],
      },
    ],
  },

  // Mysterious Chest
  {
    id: 'mysterious_chest',
    title: '📦 Mysterious Chest',
    description: 'An ornate chest sits in the middle of the path. It could contain treasure... or danger.',
    icon: '📦',
    floorRange: [3, 20],
    choices: [
      {
        id: 'open',
        label: 'Open the chest',
        description: 'Risk and reward',
        outcomes: [
          { type: 'gain_gold', value: 100, weight: 30, message: 'Treasure! You found gold!' },
          { type: 'gain_relic', tier: 'uncommon', weight: 20, message: 'A powerful relic was inside!' },
          { type: 'gain_item', itemId: 'random_rare', weight: 20, message: 'You found a rare item!' },
          { type: 'damage_percent', value: 0.25, weight: 20, message: 'It was a trap! Poison gas!' },
          { type: 'stat_decrease', stat: 'random', value: 10, weight: 10, message: 'A curse was placed on you!' },
        ],
      },
      {
        id: 'inspect',
        label: 'Inspect carefully first',
        description: 'Safer but less reward',
        outcomes: [
          { type: 'gain_gold', value: 50, weight: 50, message: 'You safely retrieve some gold.' },
          { type: 'gain_item', itemId: 'random_common', weight: 40, message: 'You found a useful item!' },
          { type: 'nothing', weight: 10, message: 'The chest was empty.' },
        ],
      },
      {
        id: 'leave',
        label: 'Leave it alone',
        description: 'Not worth the risk',
        outcomes: [
          { type: 'nothing', weight: 100, message: 'You decide not to take the risk.' },
        ],
      },
    ],
  },

  // Fortune Teller
  {
    id: 'fortune_teller',
    title: '🔮 Fortune Teller',
    description: 'A mysterious figure offers to read your fortune... for a price.',
    icon: '🔮',
    floorRange: [5, 20],
    choices: [
      {
        id: 'pay_small',
        label: 'Pay 30 gold for a reading',
        description: 'Learn what lies ahead',
        cost: { gold: 30 },
        outcomes: [
          { type: 'stat_boost', stat: 'random', value: 10, weight: 50, message: 'The fortune reveals hidden strength!' },
          { type: 'heal_percent', value: 0.25, weight: 30, message: 'Positive energy flows through you!' },
          { type: 'nothing', weight: 20, message: 'The reading was vague and unhelpful.' },
        ],
      },
      {
        id: 'pay_large',
        label: 'Pay 100 gold for grand reading',
        description: 'Greater rewards possible',
        cost: { gold: 100 },
        outcomes: [
          { type: 'gain_relic', tier: 'rare', weight: 35, message: 'Fate smiles upon you! A rare relic appears!' },
          { type: 'stat_boost_all', value: 8, weight: 30, message: 'Your destiny is revealed! All stats increase!' },
          { type: 'gain_gold', value: 200, weight: 25, message: 'The fortune teller rewards your faith!' },
          { type: 'damage_percent', value: 0.15, weight: 10, message: 'Dark visions! Your team is shaken.' },
        ],
      },
      {
        id: 'decline',
        label: 'Decline politely',
        description: 'Keep your gold',
        outcomes: [
          { type: 'nothing', weight: 90, message: 'The fortune teller nods mysteriously.' },
          { type: 'stat_decrease', stat: 'random', value: 3, weight: 10, message: 'You feel a slight curse...' },
        ],
      },
    ],
  },

  // Traveling Merchant
  {
    id: 'traveling_merchant',
    title: '🎒 Traveling Merchant',
    description: 'A merchant with exotic wares blocks your path. They offer unique deals.',
    icon: '🎒',
    floorRange: [1, 20],
    choices: [
      {
        id: 'buy_mystery',
        label: 'Buy mystery item (60g)',
        description: 'Could be anything',
        cost: { gold: 60 },
        outcomes: [
          { type: 'gain_item', itemId: 'random_rare', weight: 25, message: 'A rare item!' },
          { type: 'gain_item', itemId: 'random_common', weight: 45, message: 'A common item.' },
          { type: 'gain_relic', tier: 'common', weight: 25, message: 'A relic! Great deal!' },
          { type: 'nothing', weight: 5, message: 'The box was empty! You were scammed!' },
        ],
      },
      {
        id: 'trade_hp',
        label: 'Trade HP for gold',
        description: 'Lose 20% HP, gain 80 gold',
        outcomes: [
          { type: 'damage_percent', value: 0.2, weight: 100, message: 'The merchant extracts your energy...' },
          { type: 'gain_gold', value: 80, weight: 100, message: 'You receive 80 gold!' },
        ],
        multiOutcome: true,
      },
      {
        id: 'trade_stat',
        label: 'Trade stats for relic',
        description: 'Lose 10 random stat, gain relic',
        outcomes: [
          { type: 'stat_decrease', stat: 'random', value: 10, weight: 100, message: 'Your power is drained...' },
          { type: 'gain_relic', tier: 'uncommon', weight: 100, message: 'But you receive a relic!' },
        ],
        multiOutcome: true,
      },
      {
        id: 'browse',
        label: 'Just browse',
        description: 'Maybe next time',
        outcomes: [
          { type: 'nothing', weight: 100, message: 'You thank them and continue.' },
        ],
      },
    ],
  },

  // Cursed Idol
  {
    id: 'cursed_idol',
    title: '🗿 Cursed Idol',
    description: 'A sinister idol radiates dark energy. It promises power... at a cost.',
    icon: '🗿',
    floorRange: [5, 20],
    choices: [
      {
        id: 'embrace',
        label: 'Embrace the darkness',
        description: 'Gain power, lose HP',
        outcomes: [
          { type: 'damage_percent', value: 0.3, weight: 100, message: 'Dark energy sears your team!' },
          { type: 'stat_boost', stat: 'attack', value: 20, weight: 60, message: 'But your attack power surges!' },
          { type: 'stat_boost', stat: 'special_attack', value: 20, weight: 40, message: 'Your special attack increases dramatically!' },
        ],
        multiOutcome: true,
      },
      {
        id: 'destroy',
        label: 'Try to destroy it',
        description: 'End the curse',
        outcomes: [
          { type: 'gain_gold', value: 75, weight: 40, message: 'The idol shatters, releasing trapped gold!' },
          { type: 'damage_percent', value: 0.35, weight: 35, message: 'The idol explodes! Your team is hurt!' },
          { type: 'gain_relic', tier: 'uncommon', weight: 25, message: 'A purified relic emerges!' },
        ],
      },
      {
        id: 'flee',
        label: 'Run away',
        description: 'Escape the darkness',
        outcomes: [
          { type: 'nothing', weight: 80, message: 'You escape unharmed.' },
          { type: 'stat_decrease', stat: 'speed', value: 5, weight: 20, message: 'The curse slows you as you flee!' },
        ],
      },
    ],
  },

  // Legendary Aura (late game)
  {
    id: 'legendary_aura',
    title: '✨ Legendary Aura',
    description: 'You sense the presence of a legendary Pokémon nearby. Its aura empowers the area.',
    icon: '✨',
    floorRange: [10, 20],
    choices: [
      {
        id: 'absorb',
        label: 'Absorb the energy',
        description: 'Boost your team',
        outcomes: [
          { type: 'stat_boost_all', value: 10, weight: 60, message: 'Legendary power courses through your team!' },
          { type: 'heal_percent', value: 0.5, weight: 40, message: 'The aura heals your wounds!' },
        ],
      },
      {
        id: 'challenge',
        label: 'Seek the legendary',
        description: 'Very risky, huge reward',
        outcomes: [
          { type: 'gain_relic', tier: 'legendary', weight: 25, message: 'You find a legendary artifact!' },
          { type: 'damage_percent', value: 0.5, weight: 35, message: 'The legendary attacks! Heavy damage!' },
          { type: 'stat_boost_all', value: 15, weight: 25, message: 'The legendary shares its power!' },
          { type: 'nothing', weight: 15, message: 'The presence fades before you can find it.' },
        ],
      },
      {
        id: 'respect',
        label: 'Show respect and leave',
        description: 'Honor the legendary',
        outcomes: [
          { type: 'heal_percent', value: 0.2, weight: 100, message: 'Your respect is acknowledged with a blessing.' },
        ],
      },
    ],
  },

  // Ghost Encounter
  {
    id: 'ghostly_encounter',
    title: '👻 Ghostly Encounter',
    description: 'The spirit of a fallen trainer appears before you, seeking resolution.',
    icon: '👻',
    floorRange: [8, 20],
    choices: [
      {
        id: 'listen',
        label: 'Listen to their story',
        description: 'Hear them out',
        outcomes: [
          { type: 'gain_relic', tier: 'uncommon', weight: 45, message: 'Grateful, they gift you their prized possession!' },
          { type: 'stat_boost', stat: 'random', value: 12, weight: 35, message: 'Their wisdom empowers you!' },
          { type: 'heal_percent', value: 0.3, weight: 20, message: 'Peace washes over you.' },
        ],
      },
      {
        id: 'help',
        label: 'Help them move on',
        description: 'Perform a ritual',
        cost: { gold: 50 },
        outcomes: [
          { type: 'gain_relic', tier: 'rare', weight: 50, message: 'They bestow a powerful relic upon you!' },
          { type: 'stat_boost_all', value: 7, weight: 50, message: 'Their gratitude empowers your entire team!' },
        ],
      },
      {
        id: 'banish',
        label: 'Banish the spirit',
        description: 'Forcefully remove them',
        outcomes: [
          { type: 'gain_gold', value: 60, weight: 50, message: 'They drop some ectoplasmic gold.' },
          { type: 'damage_percent', value: 0.2, weight: 30, message: 'They curse you as they fade!' },
          { type: 'stat_decrease', stat: 'defense', value: 8, weight: 20, message: 'Your defenses weaken from guilt.' },
        ],
      },
    ],
  },
];

/**
 * Get a random choice-based event for the floor
 */
export function getChoiceEvent(floor) {
  const eligibleEvents = CHOICE_EVENTS.filter(event =>
    floor >= event.floorRange[0] && floor <= event.floorRange[1]
  );

  if (eligibleEvents.length === 0) {
    return CHOICE_EVENTS[0]; // Fallback to first event
  }

  return eligibleEvents[Math.floor(Math.random() * eligibleEvents.length)];
}

/**
 * Check if player can afford a choice
 */
export function canAffordChoice(choice, currency) {
  if (!choice.cost) return true;
  if (choice.cost.gold && currency < choice.cost.gold) return false;
  return true;
}

/**
 * Process a choice and return outcomes
 */
export function processChoiceOutcome(choice) {
  if (choice.multiOutcome) {
    // Return all outcomes for multi-outcome choices
    return choice.outcomes;
  }

  // Weighted random selection
  const totalWeight = choice.outcomes.reduce((sum, o) => sum + o.weight, 0);
  let roll = Math.random() * totalWeight;

  for (const outcome of choice.outcomes) {
    roll -= outcome.weight;
    if (roll <= 0) {
      return [outcome];
    }
  }

  return [choice.outcomes[choice.outcomes.length - 1]];
}

// Event definitions with outcomes
export const EVENTS = [
  // Positive Events
  {
    id: 'stat_boost_random',
    type: EVENT_TYPES.STAT_BOOST,
    title: '✨ Mysterious Aura',
    description: 'A mysterious aura surrounds your Pokémon! One of them feels significantly stronger.',
    icon: '✨',
    rarity: 'common',
    outcomes: [
      {
        type: 'stat_boost',
        stat: 'random', // Will pick random stat
        value: 15,
        message: (pokemonName, stat) => `${pokemonName}'s ${stat.toUpperCase()} increased by 15!`,
      },
    ],
  },
  {
    id: 'rare_candy',
    type: EVENT_TYPES.RARE_CANDY,
    title: '🍬 Rare Candy Discovery',
    description: 'You found a Rare Candy hidden in the tower! Your Pokémon can grow stronger.',
    icon: '🍬',
    rarity: 'uncommon',
    outcomes: [
      {
        type: 'stat_boost_all',
        value: 5,
        message: (pokemonName) => `${pokemonName} ate the Rare Candy! All stats increased by 5!`,
      },
    ],
  },
  {
    id: 'wild_friendly',
    type: EVENT_TYPES.WILD_POKEMON,
    title: '🌟 Friendly Wild Pokémon',
    description: 'A wild Pokémon appears and wants to join your team!',
    icon: '🌟',
    rarity: 'uncommon',
    outcomes: [
      {
        type: 'catch_pokemon',
        message: (pokemonName) => `${pokemonName} joined your team!`,
      },
    ],
  },
  {
    id: 'wild_aggressive',
    type: EVENT_TYPES.WILD_POKEMON,
    title: '⚠️ Aggressive Wild Pokémon',
    description: 'A wild Pokémon blocks your path! You must battle it. If you win, it might join you. If you lose, it flees with some of your items!',
    icon: '⚠️',
    rarity: 'rare',
    outcomes: [
      {
        type: 'battle_event',
        onWin: {
          type: 'catch_pokemon',
          message: (pokemonName) => `You defeated and caught ${pokemonName}!`,
        },
        onLose: {
          type: 'lose_gold',
          value: 200,
          message: () => `The wild Pokémon fled with 200 gold!`,
        },
      },
    ],
  },
  {
    id: 'mysterious_berry',
    type: EVENT_TYPES.MYSTERIOUS_BERRY,
    title: '🫐 Mysterious Berry Tree',
    description: 'You found a tree full of mysterious berries! Your team can heal themselves.',
    icon: '🫐',
    rarity: 'common',
    outcomes: [
      {
        type: 'heal_team',
        value: 50,
        message: () => `Your team ate the berries! All Pokémon restored 50 HP!`,
      },
    ],
  },
  {
    id: 'hidden_treasure',
    type: EVENT_TYPES.HIDDEN_ITEM,
    title: '💰 Hidden Treasure',
    description: 'You discovered a hidden treasure chest in the tower!',
    icon: '💰',
    rarity: 'uncommon',
    outcomes: [
      {
        type: 'gain_gold',
        value: 500,
        message: () => `You found 500 gold!`,
      },
    ],
  },
  {
    id: 'evolution_stone',
    type: EVENT_TYPES.POKEMON_EVOLUTION,
    title: '💎 Evolution Chamber',
    description: 'You entered a mystical chamber filled with evolution energy! One of your Pokémon might evolve!',
    icon: '💎',
    rarity: 'rare',
    outcomes: [
      {
        type: 'evolution',
        message: (pokemonName) => `${pokemonName} is evolving!`,
      },
    ],
  },
  {
    id: 'trainer_gift',
    type: EVENT_TYPES.TRAINER_GIFT,
    title: '🎁 Generous Trainer',
    description: 'A friendly trainer offers you a gift to help with your journey!',
    icon: '🎁',
    rarity: 'common',
    outcomes: [
      {
        type: 'gain_item',
        items: ['potion', 'super_potion', 'x_attack', 'x_defense'],
        quantity: 2,
        message: (itemName) => `You received 2 ${itemName}!`,
      },
    ],
  },
  {
    id: 'pp_restore',
    type: EVENT_TYPES.FORTUNE,
    title: '🌊 Mystical Fountain',
    description: 'Your team rests near a mystical fountain. Their energy is restored!',
    icon: '🌊',
    rarity: 'common',
    outcomes: [
      {
        type: 'restore_pp',
        value: 20,
        message: () => `All moves restored 20 PP!`,
      },
    ],
  },

  // Negative Events (Curses)
  {
    id: 'curse_weak',
    type: EVENT_TYPES.CURSE,
    title: '😈 Curse of Weakness',
    description: 'A dark curse weakens one of your Pokémon!',
    icon: '😈',
    rarity: 'uncommon',
    outcomes: [
      {
        type: 'stat_decrease',
        stat: 'random',
        value: 10,
        message: (pokemonName, stat) => `${pokemonName}'s ${stat.toUpperCase()} decreased by 10!`,
      },
    ],
  },
  {
    id: 'thief',
    type: EVENT_TYPES.CURSE,
    title: '🥷 Sneaky Thief',
    description: 'A thief appeared and stole some of your gold!',
    icon: '🥷',
    rarity: 'uncommon',
    outcomes: [
      {
        type: 'lose_gold',
        value: 300,
        message: () => `The thief stole 300 gold!`,
      },
    ],
  },

  // Mixed Events (Risk/Reward)
  {
    id: 'gamble_shrine',
    type: EVENT_TYPES.FORTUNE,
    title: '🎰 Mysterious Shrine',
    description: 'You found a mysterious shrine. Offer some gold for a blessing... or a curse?',
    icon: '🎰',
    rarity: 'rare',
    choices: [
      {
        label: 'Offer 200 Gold',
        description: 'Take the risk for potential reward',
        cost: 200,
        outcomes: [
          {
            type: 'stat_boost_all',
            value: 10,
            weight: 60,
            message: (pokemonName) => `The shrine blessed ${pokemonName}! All stats +10!`,
          },
          {
            type: 'stat_decrease',
            stat: 'random',
            value: 15,
            weight: 40,
            message: (pokemonName, stat) => `The shrine cursed ${pokemonName}! ${stat} -15!`,
          },
        ],
      },
      {
        label: 'Leave it alone',
        description: 'Play it safe',
        outcomes: [
          {
            type: 'nothing',
            message: () => 'You wisely decided to leave the shrine alone.',
          },
        ],
      },
    ],
  },
];

/**
 * Get a random event
 */
export function getRandomEvent() {
  // Filter events by rarity weights
  const commonEvents = EVENTS.filter(e => e.rarity === 'common');
  const uncommonEvents = EVENTS.filter(e => e.rarity === 'uncommon');
  const rareEvents = EVENTS.filter(e => e.rarity === 'rare');

  // Weighted selection: 60% common, 30% uncommon, 10% rare
  const roll = Math.random() * 100;

  let pool;
  if (roll < 60) {
    pool = commonEvents;
  } else if (roll < 90) {
    pool = uncommonEvents;
  } else {
    pool = rareEvents;
  }

  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Get event by ID
 */
export function getEventById(id) {
  return EVENTS.find(event => event.id === id);
}

/**
 * Apply event outcome to game state
 */
export function applyEventOutcome(outcome, team, inventory, currency) {
  const result = {
    team: [...team],
    inventory: { ...inventory },
    currency,
    message: '',
  };

  switch (outcome.type) {
    case 'stat_boost': {
      // Pick random Pokemon and random stat
      const randomIndex = Math.floor(Math.random() * team.length);
      const pokemon = result.team[randomIndex];
      const stats = ['attack', 'defense', 'special_attack', 'special_defense', 'speed'];
      const randomStat = outcome.stat === 'random'
        ? stats[Math.floor(Math.random() * stats.length)]
        : outcome.stat;

      result.team[randomIndex] = {
        ...pokemon,
        stats: {
          ...pokemon.stats,
          [randomStat]: pokemon.stats[randomStat] + outcome.value,
        },
      };
      result.message = outcome.message(pokemon.name, randomStat);
      result.highlightedPokemon = randomIndex;
      result.highlightedStat = randomStat;
      break;
    }

    case 'stat_boost_all': {
      // Boost all stats for random Pokemon
      const randomIndex = Math.floor(Math.random() * team.length);
      const pokemon = result.team[randomIndex];

      result.team[randomIndex] = {
        ...pokemon,
        stats: {
          ...pokemon.stats,
          attack: pokemon.stats.attack + outcome.value,
          defense: pokemon.stats.defense + outcome.value,
          special_attack: pokemon.stats.special_attack + outcome.value,
          special_defense: pokemon.stats.special_defense + outcome.value,
          speed: pokemon.stats.speed + outcome.value,
        },
      };
      result.message = outcome.message(pokemon.name);
      result.highlightedPokemon = randomIndex;
      result.highlightedStat = 'all';
      break;
    }

    case 'stat_decrease': {
      // Decrease stat for random Pokemon
      const randomIndex = Math.floor(Math.random() * team.length);
      const pokemon = result.team[randomIndex];
      const stats = ['attack', 'defense', 'special_attack', 'special_defense', 'speed'];
      const randomStat = outcome.stat === 'random'
        ? stats[Math.floor(Math.random() * stats.length)]
        : outcome.stat;

      result.team[randomIndex] = {
        ...pokemon,
        stats: {
          ...pokemon.stats,
          [randomStat]: Math.max(1, pokemon.stats[randomStat] - outcome.value),
        },
      };
      result.message = outcome.message(pokemon.name, randomStat);
      result.highlightedPokemon = randomIndex;
      result.highlightedStat = randomStat;
      break;
    }

    case 'heal_team': {
      result.team = team.map(pokemon => ({
        ...pokemon,
        stats: {
          ...pokemon.stats,
          hp: Math.min(pokemon.stats.hp_max, pokemon.stats.hp + outcome.value),
        },
      }));
      result.message = outcome.message();
      break;
    }

    case 'restore_pp': {
      result.team = team.map(pokemon => ({
        ...pokemon,
        moves: pokemon.moves.map(move => ({
          ...move,
          pp: Math.min(move.maxPP, move.pp + outcome.value),
        })),
      }));
      result.message = outcome.message();
      break;
    }

    case 'gain_gold': {
      result.currency = currency + outcome.value;
      result.message = outcome.message();
      break;
    }

    case 'lose_gold': {
      result.currency = Math.max(0, currency - outcome.value);
      result.message = outcome.message();
      break;
    }

    case 'gain_item': {
      const randomItem = outcome.items[Math.floor(Math.random() * outcome.items.length)];
      result.inventory = {
        ...inventory,
        [randomItem]: (inventory[randomItem] || 0) + outcome.quantity,
      };
      result.message = outcome.message(randomItem.replace('_', ' '));
      result.itemGained = randomItem;
      break;
    }

    case 'catch_pokemon': {
      result.needsNewPokemon = true;
      result.message = 'A wild Pokémon wants to join you!';
      break;
    }

    case 'battle_event': {
      result.needsBattle = true;
      result.battleOutcome = outcome;
      result.message = 'Prepare for battle!';
      break;
    }

    case 'evolution': {
      result.message = 'Evolution energy fills the chamber...';
      result.needsEvolution = true;
      break;
    }

    case 'nothing':
    default: {
      result.message = outcome.message ? outcome.message() : 'Nothing happened.';
      break;
    }
  }

  return result;
}
