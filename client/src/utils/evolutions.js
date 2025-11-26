// 📁 evolutions.js
// Pokemon evolution data mapping

/**
 * Evolution mapping for Pokemon that evolve via stones
 * Format: { pokemonName: { stone_type: evolutionName } }
 */
export const STONE_EVOLUTIONS = {
  // Fire Stone
  'vulpix': { fire: 'ninetales' },
  'growlithe': { fire: 'arcanine' },
  'eevee': {
    fire: 'flareon',
    water: 'vaporeon',
    thunder: 'jolteon'
  },

  // Water Stone
  'poliwhirl': { water: 'poliwrath' },
  'shellder': { water: 'cloyster' },
  'staryu': { water: 'starmie' },

  // Thunder Stone
  'pikachu': { thunder: 'raichu' },
  'eevee': { thunder: 'jolteon' },

  // Leaf Stone
  'gloom': { leaf: 'vileplume' },
  'weepinbell': { leaf: 'victreebel' },
  'exeggcute': { leaf: 'exeggutor' },

  // Moon Stone
  'nidorina': { moon: 'nidoqueen' },
  'nidorino': { moon: 'nidoking' },
  'clefairy': { moon: 'clefable' },
  'jigglypuff': { moon: 'wigglytuff' },

  // Sun Stone
  'gloom': { sun: 'bellossom' },
  'sunkern': { sun: 'sunflora' },

  // Shiny Stone
  'togetic': { shiny: 'togekiss' },
  'roselia': { shiny: 'roserade' },

  // Dusk Stone
  'murkrow': { dusk: 'honchkrow' },
  'misdreavus': { dusk: 'mismagius' },

  // Dawn Stone
  'kirlia': { dawn: 'gallade' }, // male only in real game
  'snorunt': { dawn: 'froslass' }, // female only in real game

  // Ice Stone
  'eevee': { ice: 'glaceon' },
  'alolan-sandshrew': { ice: 'alolan-sandslash' },
};

/**
 * Evolution mapping for Pokemon that evolve via level up
 * Format: { pokemonName: { level: number, to: evolutionName } }
 */
export const LEVEL_EVOLUTIONS = {
  // Gen 1 Starters
  'bulbasaur': { level: 16, to: 'ivysaur' },
  'ivysaur': { level: 32, to: 'venusaur' },
  'charmander': { level: 16, to: 'charmeleon' },
  'charmeleon': { level: 36, to: 'charizard' },
  'squirtle': { level: 16, to: 'wartortle' },
  'wartortle': { level: 36, to: 'blastoise' },

  // Common Early Game
  'caterpie': { level: 7, to: 'metapod' },
  'metapod': { level: 10, to: 'butterfree' },
  'weedle': { level: 7, to: 'kakuna' },
  'kakuna': { level: 10, to: 'beedrill' },
  'pidgey': { level: 18, to: 'pidgeotto' },
  'pidgeotto': { level: 36, to: 'pidgeot' },
  'rattata': { level: 20, to: 'raticate' },
  'spearow': { level: 20, to: 'fearow' },
  'ekans': { level: 22, to: 'arbok' },
  'pikachu': { level: 22, to: 'raichu' }, // Custom level evo for ease
  'sandshrew': { level: 22, to: 'sandslash' },
  'nidoran-f': { level: 16, to: 'nidorina' },
  'nidoran-m': { level: 16, to: 'nidorino' },
  'clefairy': { level: 20, to: 'clefable' }, // Custom
  'vulpix': { level: 20, to: 'ninetales' }, // Custom
  'jigglypuff': { level: 20, to: 'wigglytuff' }, // Custom
  'zubat': { level: 22, to: 'golbat' },
  'oddish': { level: 21, to: 'gloom' },
  'paras': { level: 24, to: 'parasect' },
  'venonat': { level: 31, to: 'venomoth' },
  'diglett': { level: 26, to: 'dugtrio' },
  'meowth': { level: 28, to: 'persian' },
  'psyduck': { level: 33, to: 'golduck' },
  'mankey': { level: 28, to: 'primeape' },
  'growlithe': { level: 25, to: 'arcanine' }, // Custom
  'poliwag': { level: 25, to: 'poliwhirl' },
  'abra': { level: 16, to: 'kadabra' },
  'kadabra': { level: 36, to: 'alakazam' }, // Trade evo -> Level
  'machop': { level: 28, to: 'machoke' },
  'machoke': { level: 40, to: 'machamp' }, // Trade evo -> Level
  'bellsprout': { level: 21, to: 'weepinbell' },
  'tentacool': { level: 30, to: 'tentacruel' },
  'geodude': { level: 25, to: 'graveler' },
  'graveler': { level: 40, to: 'golem' }, // Trade evo -> Level
  'ponyta': { level: 40, to: 'rapidash' },
  'slowpoke': { level: 37, to: 'slowbro' },
  'magnemite': { level: 30, to: 'magneton' },
  'doduo': { level: 31, to: 'dodrio' },
  'seel': { level: 34, to: 'dewgong' },
  'grimer': { level: 38, to: 'muk' },
  'shellder': { level: 25, to: 'cloyster' }, // Custom
  'gastly': { level: 25, to: 'haunter' },
  'haunter': { level: 40, to: 'gengar' }, // Trade evo -> Level
  'onix': { level: 35, to: 'steelix' }, // Trade w/ item -> Level
  'drowzee': { level: 26, to: 'hypno' },
  'krabby': { level: 28, to: 'kingler' },
  'voltorb': { level: 30, to: 'electrode' },
  'exeggcute': { level: 25, to: 'exeggutor' }, // Custom
  'cubone': { level: 28, to: 'marowak' },
  'koffing': { level: 35, to: 'weezing' },
  'rhyhorn': { level: 42, to: 'rhydon' },
  'horsea': { level: 32, to: 'seadra' },
  'goldeen': { level: 33, to: 'seaking' },
  'staryu': { level: 25, to: 'starmie' }, // Custom
  'scyther': { level: 35, to: 'scizor' }, // Trade w/ item -> Level
  'magikarp': { level: 20, to: 'gyarados' },
  'eevee': { level: 25, to: 'sylveon' }, // Custom default
  'omanyte': { level: 40, to: 'omastar' },
  'kabuto': { level: 40, to: 'kabutops' },
  'dratini': { level: 30, to: 'dragonair' },
  'dragonair': { level: 55, to: 'dragonite' },
};

/**
 * Check if a Pokemon can evolve with a given stone
 */
export function canEvolveWithStone(pokemonName, stoneType) {
  const name = pokemonName.toLowerCase();
  return STONE_EVOLUTIONS[name] && STONE_EVOLUTIONS[name][stoneType];
}

/**
 * Check if a Pokemon can evolve by level
 */
export function checkLevelEvolution(pokemon) {
  const name = pokemon.baseName?.toLowerCase() || pokemon.name.toLowerCase();
  const evolution = LEVEL_EVOLUTIONS[name];

  console.log('[Evolution Check]', {
    pokemonName: pokemon.name,
    baseName: pokemon.baseName,
    lookupName: name,
    level: pokemon.level,
    evolutionData: evolution,
    canEvolve: evolution && pokemon.level >= evolution.level
  });

  if (evolution && pokemon.level >= evolution.level) {
    return evolution;
  }
  return null;
}

/**
 * Get evolution name for a Pokemon with a given stone
 */
export function getEvolutionName(pokemonName, stoneType) {
  const name = pokemonName.toLowerCase();
  if (canEvolveWithStone(name, stoneType)) {
    return STONE_EVOLUTIONS[name][stoneType];
  }
  return null;
}

/**
 * Fetch evolved Pokemon data from PokeAPI
 */
export async function getEvolvedPokemon(pokemonName, stoneType, originalPokemon, isLevelUp = false) {
  let evolutionName = null;
  
  if (isLevelUp) {
    const name = pokemonName.toLowerCase();
    evolutionName = LEVEL_EVOLUTIONS[name]?.to;
  } else {
    evolutionName = getEvolutionName(pokemonName, stoneType);
  }

  if (!evolutionName) {
    return null;
  }
  try {
    const axios = (await import('axios')).default;
    const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${evolutionName}`);
    const pokemon = res.data;

    const rawStats = pokemon.stats.reduce((acc, stat) => {
      acc[stat.stat.name] = stat.base_stat;
      return acc;
    }, {});

    // Calculate HP difference to maintain current HP ratio
    const hpRatio = originalPokemon.stats.hp / originalPokemon.stats.hp_max;
    const newMaxHP = rawStats["hp"];
    const newCurrentHP = Math.floor(newMaxHP * hpRatio);

    return {
      ...originalPokemon,
      id: pokemon.id,
      name: pokemon.name,
      baseName: pokemon.name, // Update base name
      sprite: pokemon.sprites.front_default,
      stats: {
        hp: Math.max(1, newCurrentHP), // Ensure at least 1 HP
        hp_max: newMaxHP,
        attack: rawStats["attack"],
        defense: rawStats["defense"],
        special_attack: rawStats["special-attack"],
        special_defense: rawStats["special-defense"],
        speed: rawStats["speed"],
      },
      types: pokemon.types.map((t) => t.type.name),
      // Keep moves from original Pokemon
      moves: originalPokemon.moves,
      // Keep held item if any
      heldItem: originalPokemon.heldItem,
      isMegaEvolved: false,
    };
  } catch (error) {
    console.error('Failed to fetch evolved Pokemon:', error);
    return null;
  }
}
