// Get starter Pokemon by name from PokeAPI
import axios from "axios";
import { generatePokemonMoves } from "./moves";
import { initializePokemonXP } from "./pokemonLeveling";

// Starter Pokemon data with Pokedex IDs
const STARTER_DATA = {
  // Default starters (first stage evolutions)
  charmander: { id: 4, name: 'Charmander', icon: '🔥' },
  squirtle: { id: 7, name: 'Squirtle', icon: '💧' },
  bulbasaur: { id: 1, name: 'Bulbasaur', icon: '🌿' },

  // Unlockable starters (evolved forms)
  charizard: { id: 6, name: 'Charizard', icon: '🔥' },
  blastoise: { id: 9, name: 'Blastoise', icon: '💧' },
  venusaur: { id: 3, name: 'Venusaur', icon: '🌿' },

  // Other unlockable starters
  pikachu: { id: 25, name: 'Pikachu', icon: '⚡' },
  gengar: { id: 94, name: 'Gengar', icon: '👻' },
  dragonite: { id: 149, name: 'Dragonite', icon: '🐉' },
  tyranitar: { id: 248, name: 'Tyranitar', icon: '🪨' },
  metagross: { id: 376, name: 'Metagross', icon: '🤖' },
  garchomp: { id: 445, name: 'Garchomp', icon: '🦈' },

  // Premium starters
  lucario: { id: 448, name: 'Lucario', icon: '🥊' },
  salamence: { id: 373, name: 'Salamence', icon: '🐲' },
  mewtwo: { id: 150, name: 'Mewtwo', icon: '🧬' },
};

/**
 * Get starter info (without fetching from API)
 */
export function getStarterInfo(starterId) {
  return STARTER_DATA[starterId] || null;
}

/**
 * Get all starter info
 */
export function getAllStarterInfo() {
  return STARTER_DATA;
}

/**
 * Fetch a starter Pokemon by ID
 */
export async function fetchStarterPokemon(starterId) {
  const starterInfo = STARTER_DATA[starterId];
  if (!starterInfo) {
    console.error(`Unknown starter: ${starterId}`);
    return null;
  }

  try {
    const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${starterInfo.id}`);
    const pokemon = res.data;

    const rawStats = pokemon.stats.reduce((acc, stat) => {
      acc[stat.stat.name] = stat.base_stat;
      return acc;
    }, {});

    // Starters start at level 5 with boosted stats
    const level = 5;
    const starterBonus = 1.1; // 10% stat boost for starters

    const pokemonData = {
      id: `starter_${pokemon.id}_${Date.now()}`,
      pokedexId: pokemon.id,
      name: pokemon.name,
      baseName: pokemon.name,
      sprite: pokemon.sprites.front_default,
      level,
      stats: {
        hp: Math.floor(rawStats["hp"] * starterBonus),
        hp_max: Math.floor(rawStats["hp"] * starterBonus),
        attack: Math.floor(rawStats["attack"] * starterBonus),
        defense: Math.floor(rawStats["defense"] * starterBonus),
        special_attack: Math.floor(rawStats["special-attack"] * starterBonus),
        special_defense: Math.floor(rawStats["special-defense"] * starterBonus),
        speed: Math.floor(rawStats["speed"] * starterBonus),
      },
      types: pokemon.types.map((t) => t.type.name),
      heldItem: null,
      isMegaEvolved: false,
      isStarter: true,
    };

    // Generate moves
    pokemonData.moves = generatePokemonMoves(pokemonData);

    // Initialize XP system
    return initializePokemonXP(pokemonData);
  } catch (error) {
    console.error(`Failed to fetch starter ${starterId}:`, error);
    return null;
  }
}

/**
 * Fetch multiple starters
 */
export async function fetchStarters(starterIds) {
  const promises = starterIds.map(id => fetchStarterPokemon(id));
  const results = await Promise.all(promises);
  return results.filter(p => p !== null);
}

export default {
  getStarterInfo,
  getAllStarterInfo,
  fetchStarterPokemon,
  fetchStarters,
  STARTER_DATA
};
