// pokeApi.js
// Centralized PokeAPI service with caching
import axios from 'axios';

// Cache for sprites and pokemon data
const spriteCache = new Map();
const pokemonCache = new Map();

/**
 * Fetch a single Pokemon sprite from PokeAPI
 * @param {number|string} pokemonId - Pokemon ID or name
 * @returns {Promise<string|null>} - Sprite URL or null on error
 */
export async function fetchPokemonSprite(pokemonId) {
  if (spriteCache.has(pokemonId)) {
    return spriteCache.get(pokemonId);
  }

  try {
    const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    const sprite = res.data.sprites.front_default;
    spriteCache.set(pokemonId, sprite);
    return sprite;
  } catch (err) {
    console.error(`Failed to fetch sprite for ${pokemonId}:`, err);
    return null;
  }
}

/**
 * Fetch multiple Pokemon sprites in parallel
 * @param {Array<number|string>} pokemonIds - Array of Pokemon IDs
 * @returns {Promise<Object>} - Object mapping IDs to sprite URLs
 */
export async function fetchPokemonSprites(pokemonIds) {
  const promises = pokemonIds.map(id => fetchPokemonSprite(id));
  const results = await Promise.all(promises);

  return pokemonIds.reduce((acc, id, index) => {
    acc[id] = results[index];
    return acc;
  }, {});
}

/**
 * Fetch complete Pokemon data from PokeAPI
 * @param {number|string} pokemonId - Pokemon ID or name
 * @returns {Promise<Object|null>} - Pokemon data or null on error
 */
export async function fetchPokemonData(pokemonId) {
  if (pokemonCache.has(pokemonId)) {
    return pokemonCache.get(pokemonId);
  }

  try {
    const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    pokemonCache.set(pokemonId, res.data);
    return res.data;
  } catch (err) {
    console.error(`Failed to fetch data for ${pokemonId}:`, err);
    return null;
  }
}

/**
 * Clear all caches (useful for testing or memory management)
 */
export function clearPokeApiCache() {
  spriteCache.clear();
  pokemonCache.clear();
}

/**
 * Get cache statistics
 * @returns {Object} - Cache stats
 */
export function getCacheStats() {
  return {
    spritesCached: spriteCache.size,
    pokemonCached: pokemonCache.size,
  };
}
