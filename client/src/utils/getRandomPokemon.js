import axios from "axios";

export const getRandomPokemon = async () => {
  const randomId = Math.floor(Math.random() * 151) + 1; //Kanto range

  const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
  const pokemon = res.data;
  return {
    id: pokemon.id,
    name: pokemon.name,
    sprite: pokemon.sprites.front_default,
    stats: pokemon.stats.reduce((acc, stat) => {
      acc[stat.stat.name] = stat.base_stat;
      return acc;
    }, {}),
    moves: pokemon.moves.slice(0, 4).map((m) => m.move.name),
  };
};
