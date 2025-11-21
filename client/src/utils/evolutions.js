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
 * Check if a Pokemon can evolve with a given stone
 */
export function canEvolveWithStone(pokemonName, stoneType) {
  const name = pokemonName.toLowerCase();
  return STONE_EVOLUTIONS[name] && STONE_EVOLUTIONS[name][stoneType];
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
export async function getEvolvedPokemon(pokemonName, stoneType, originalPokemon) {
  const evolutionName = getEvolutionName(pokemonName, stoneType);
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
      baseName: pokemon.name,
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
