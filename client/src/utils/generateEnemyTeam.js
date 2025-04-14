import { getRandomPokemon } from "./getRandomPokemon";

export const generateEnemyTeam = async (count = 1) => {
  const team = [];
  for (let i = 0; i < count; i++) {
    const enemy = await getRandomPokemon();
    team.push(enemy);
  }
  return team;
};
