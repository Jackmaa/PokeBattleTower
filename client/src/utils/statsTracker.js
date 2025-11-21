// 📁 statsTracker.js
// Track and persist run statistics

const STATS_KEY = 'pbt_run_stats';

/**
 * Get all run statistics from localStorage
 */
export function getAllRunStats() {
  try {
    const data = localStorage.getItem(STATS_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to load run stats:', error);
    return [];
  }
}

/**
 * Save a completed run's statistics
 */
export function saveRunStats(runData) {
  try {
    const runs = getAllRunStats();

    const newRun = {
      id: Date.now(),
      timestamp: Date.now(),
      floorsReached: runData.floor || 0,
      finalTeam: runData.team?.map(p => ({
        name: p.name,
        level: p.level || 1,
        sprite: p.sprite
      })) || [],
      battlesWon: runData.battlesWon || 0,
      goldEarned: runData.goldEarned || 0,
      itemsUsed: runData.itemsUsed || 0,
      pokemonCaught: runData.pokemonCaught || 0,
      playtime: runData.playtime || 0,
      victory: runData.victory || false,
      starter: runData.starter || 'Unknown'
    };

    runs.push(newRun);

    // Keep only last 50 runs
    const recentRuns = runs.slice(-50);

    localStorage.setItem(STATS_KEY, JSON.stringify(recentRuns));
    return newRun;
  } catch (error) {
    console.error('Failed to save run stats:', error);
    return null;
  }
}

/**
 * Get top runs sorted by floors reached
 */
export function getTopRuns(limit = 10) {
  const runs = getAllRunStats();
  return runs
    .sort((a, b) => {
      // Sort by victory first, then floors, then battles won
      if (a.victory !== b.victory) return a.victory ? -1 : 1;
      if (a.floorsReached !== b.floorsReached) return b.floorsReached - a.floorsReached;
      return b.battlesWon - a.battlesWon;
    })
    .slice(0, limit);
}

/**
 * Get runs filtered by starter
 */
export function getRunsByStarter(starterName) {
  const runs = getAllRunStats();
  return runs.filter(run =>
    run.starter.toLowerCase() === starterName.toLowerCase()
  );
}

/**
 * Get overall statistics
 */
export function getOverallStats() {
  const runs = getAllRunStats();

  if (runs.length === 0) {
    return {
      totalRuns: 0,
      victories: 0,
      totalFloorsCleared: 0,
      totalBattlesWon: 0,
      totalGoldEarned: 0,
      totalPlaytime: 0,
      bestFloor: 0,
      averageFloors: 0
    };
  }

  const victories = runs.filter(r => r.victory).length;
  const totalFloorsCleared = runs.reduce((sum, r) => sum + r.floorsReached, 0);
  const totalBattlesWon = runs.reduce((sum, r) => sum + r.battlesWon, 0);
  const totalGoldEarned = runs.reduce((sum, r) => sum + r.goldEarned, 0);
  const totalPlaytime = runs.reduce((sum, r) => sum + r.playtime, 0);
  const bestFloor = Math.max(...runs.map(r => r.floorsReached));

  return {
    totalRuns: runs.length,
    victories,
    totalFloorsCleared,
    totalBattlesWon,
    totalGoldEarned,
    totalPlaytime,
    bestFloor,
    averageFloors: (totalFloorsCleared / runs.length).toFixed(1)
  };
}

/**
 * Format playtime from milliseconds to readable string
 */
export function formatPlaytime(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
}

/**
 * Clear all run statistics
 */
export function clearRunStats() {
  localStorage.removeItem(STATS_KEY);
}
