import axios from "axios";
import { generatePokemonMoves } from "./moves";

export const getRandomPokemon = async () => {
  const randomId = Math.floor(Math.random() * 151) + 1; //Kanto range

  const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
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
  };

  // Generate moves based on Pokemon type
  pokemonData.moves = generatePokemonMoves(pokemonData);

  return pokemonData;
};
