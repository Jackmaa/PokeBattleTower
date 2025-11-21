import { atom } from 'recoil';

// Track statistics during a run for end-of-run rewards
export const runStatsState = atom({
  key: 'runStatsState',
  default: {
    floorsCleared: 0,
    battlesWon: 0,
    elitesDefeated: 0,
    bossesDefeated: 0,
    legendaryDefeated: false,
    goldEarned: 0,
    itemsCollected: 0,
    damageDealt: 0,
    damageTaken: 0,
    pokemonCaptured: 0,
    healingUsed: 0,
    startTime: null,
  },
});

// Helper function to create initial run stats
export function createInitialRunStats() {
  return {
    floorsCleared: 0,
    battlesWon: 0,
    elitesDefeated: 0,
    bossesDefeated: 0,
    legendaryDefeated: false,
    goldEarned: 0,
    itemsCollected: 0,
    damageDealt: 0,
    damageTaken: 0,
    pokemonCaptured: 0,
    healingUsed: 0,
    startTime: Date.now(),
  };
}
