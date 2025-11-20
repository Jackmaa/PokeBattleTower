import { getRandomPokemon } from "./getRandomPokemon";

export const generateEnemyTeam = async (count = 1, floor = 1) => {
  const team = [];
  for (let i = 0; i < count; i++) {
    const enemy = await getRandomPokemon();
    // Add level based on floor (scales difficulty)
    enemy.level = floor;
    team.push(enemy);
  }
  return team;
};
