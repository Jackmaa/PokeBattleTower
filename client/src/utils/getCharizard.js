import axios from "axios";
import { generatePokemonMoves } from "./moves";

export const getCharizard = async () => {
  const charizardId = 6; // Charizard's ID in PokeAPI

  const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${charizardId}`);
  const pokemon = res.data;
  const rawStats = pokemon.stats.reduce((acc, stat) => {
    acc[stat.stat.name] = stat.base_stat;
    return acc;
  }, {});

  const pokemonData = {
    id: pokemon.id,
    name: pokemon.name,
    sprite: pokemon.sprites.front_default,
    level: 1, // Default level
    stats: {
      hp: rawStats["hp"],
      hp_max: rawStats["hp"],
      attack: rawStats["attack"],
      defense: rawStats["defense"],
      special_attack: rawStats["special-attack"],
      special_defense: rawStats["special-defense"],
      speed: rawStats["speed"],
    },
    types: pokemon.types.map((t) => t.type.name),
    heldItem: null, // Field for equipped items (mega stones, held items, berries)
    isMegaEvolved: false, // Track if Pokemon is currently mega evolved
    baseName: pokemon.name, // Store original name for reverting mega evolution
  };

  // Generate moves based on Pokemon type
  pokemonData.moves = generatePokemonMoves(pokemonData);

  return pokemonData;
};
