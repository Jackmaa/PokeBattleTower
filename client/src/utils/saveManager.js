// 📁 saveManager.js
// LocalStorage save system with compression and validation

const SAVE_PREFIX = 'pbt_save_';
const MAX_SAVE_SLOTS = 3;
const SAVE_VERSION = '2.0.0';

/**
 * Save structure:
 * {
 *   version: string,
 *   timestamp: number,
 *   slotName: string,
 *   gameState: {
 *     team: Array,
 *     floor: number,
 *     towerMap: Object,
 *     inventory: Object,
 *     currency: number,
 *     currentNode: string,
 *     gameView: string,
 *     metaProgress: Object
 *   },
 *   stats: {
 *     floorsCleared: number,
 *     battlesWon: number,
 *     pokemonCaught: number,
 *     itemsUsed: number,
 *     goldEarned: number,
 *     playtime: number (milliseconds)
 *   }
 * }
 */

/**
 * Compress data using simple RLE for strings
 * For production, consider using lz-string library
 */
function compressData(data) {
  try {
    return btoa(JSON.stringify(data));
  } catch (error) {
    console.error('Failed to compress data:', error);
    return null;
  }
}

/**
 * Decompress data
 */
function decompressData(compressed) {
  try {
    return JSON.parse(atob(compressed));
  } catch (error) {
    console.error('Failed to decompress data:', error);
    return null;
  }
}

/**
 * Validate save data structure
 */
function validateSaveData(data) {
  if (!data || typeof data !== 'object') return false;

  const requiredFields = ['version', 'timestamp', 'gameState'];
  for (const field of requiredFields) {
    if (!(field in data)) {
      console.warn(`Save data missing required field: ${field}`);
      return false;
    }
  }

  const requiredGameState = ['team', 'floor', 'inventory', 'currency'];
  for (const field of requiredGameState) {
    if (!(field in data.gameState)) {
      console.warn(`Game state missing required field: ${field}`);
      return false;
    }
  }

  return true;
}

/**
 * Get all save slots
 */
export function getSaveSlots() {
  const slots = [];

  for (let i = 1; i <= MAX_SAVE_SLOTS; i++) {
    const key = `${SAVE_PREFIX}slot_${i}`;
    const compressed = localStorage.getItem(key);

    if (compressed) {
      const data = decompressData(compressed);
      if (data && validateSaveData(data)) {
        slots.push({
          slotId: i,
          ...data,
          // Add preview data
          preview: {
            floor: data.gameState.floor,
            teamSize: data.gameState.team?.length || 0,
            firstPokemon: data.gameState.team?.[0]?.name || 'Unknown',
            currency: data.gameState.currency || 0,
            timestamp: data.timestamp,
            playtime: data.stats?.playtime || 0
          }
        });
      } else {
        // Invalid save data, clear it
        localStorage.removeItem(key);
        slots.push({ slotId: i, empty: true });
      }
    } else {
      slots.push({ slotId: i, empty: true });
    }
  }

  return slots;
}

/**
 * Save game to a specific slot
 */
export function saveGame(slotId, gameState, stats = {}, slotName = null) {
  if (slotId < 1 || slotId > MAX_SAVE_SLOTS) {
    throw new Error(`Invalid slot ID: ${slotId}. Must be between 1 and ${MAX_SAVE_SLOTS}`);
  }

  const saveData = {
    version: SAVE_VERSION,
    timestamp: Date.now(),
    slotName: slotName || `Save ${slotId}`,
    gameState,
    stats: {
      floorsCleared: stats.floorsCleared || gameState.floor || 0,
      battlesWon: stats.battlesWon || 0,
      pokemonCaught: stats.pokemonCaught || gameState.team?.length || 0,
      itemsUsed: stats.itemsUsed || 0,
      goldEarned: stats.goldEarned || 0,
      playtime: stats.playtime || 0
    }
  };

  const compressed = compressData(saveData);
  if (!compressed) {
    throw new Error('Failed to compress save data');
  }

  try {
    const key = `${SAVE_PREFIX}slot_${slotId}`;
    localStorage.setItem(key, compressed);
    console.log(`Game saved to slot ${slotId}`);
    return true;
  } catch (error) {
    console.error('Failed to save game:', error);
    // Check if it's a quota exceeded error
    if (error.name === 'QuotaExceededError') {
      throw new Error('Storage quota exceeded. Please delete some saves.');
    }
    throw error;
  }
}

/**
 * Load game from a specific slot
 */
export function loadGame(slotId) {
  if (slotId < 1 || slotId > MAX_SAVE_SLOTS) {
    throw new Error(`Invalid slot ID: ${slotId}`);
  }

  const key = `${SAVE_PREFIX}slot_${slotId}`;
  const compressed = localStorage.getItem(key);

  if (!compressed) {
    return null;
  }

  const data = decompressData(compressed);
  if (!data || !validateSaveData(data)) {
    console.error(`Invalid save data in slot ${slotId}`);
    return null;
  }

  // Version migration if needed
  if (data.version !== SAVE_VERSION) {
    console.warn(`Save version mismatch: ${data.version} vs ${SAVE_VERSION}`);
    // Perform migration if needed in the future
  }

  console.log(`Game loaded from slot ${slotId}`);
  return data;
}

/**
 * Delete a save slot
 */
export function deleteSave(slotId) {
  if (slotId < 1 || slotId > MAX_SAVE_SLOTS) {
    throw new Error(`Invalid slot ID: ${slotId}`);
  }

  const key = `${SAVE_PREFIX}slot_${slotId}`;
  localStorage.removeItem(key);
  console.log(`Save slot ${slotId} deleted`);
  return true;
}

/**
 * Get the most recent save
 */
export function getMostRecentSave() {
  const slots = getSaveSlots();
  const validSlots = slots.filter(slot => !slot.empty);

  if (validSlots.length === 0) {
    return null;
  }

  // Sort by timestamp descending
  validSlots.sort((a, b) => b.timestamp - a.timestamp);
  return validSlots[0];
}

/**
 * Check if any saves exist
 */
export function hasSaves() {
  const slots = getSaveSlots();
  return slots.some(slot => !slot.empty);
}

/**
 * Auto-save to a dedicated auto-save slot
 */
export function autoSave(gameState, stats) {
  const AUTO_SAVE_SLOT = 0; // Slot 0 is reserved for auto-save
  const key = `${SAVE_PREFIX}autosave`;

  const saveData = {
    version: SAVE_VERSION,
    timestamp: Date.now(),
    slotName: 'Auto Save',
    gameState,
    stats,
    isAutoSave: true
  };

  const compressed = compressData(saveData);
  if (compressed) {
    try {
      localStorage.setItem(key, compressed);
      console.log('Auto-saved successfully');
      return true;
    } catch (error) {
      console.error('Auto-save failed:', error);
      return false;
    }
  }
  return false;
}

/**
 * Load auto-save
 */
export function loadAutoSave() {
  const key = `${SAVE_PREFIX}autosave`;
  const compressed = localStorage.getItem(key);

  if (!compressed) {
    return null;
  }

  const data = decompressData(compressed);
  if (!data || !validateSaveData(data)) {
    localStorage.removeItem(key);
    return null;
  }

  return data;
}

/**
 * Clear all saves (use with caution!)
 */
export function clearAllSaves() {
  for (let i = 1; i <= MAX_SAVE_SLOTS; i++) {
    deleteSave(i);
  }
  localStorage.removeItem(`${SAVE_PREFIX}autosave`);
  console.log('All saves cleared');
}

/**
 * Export save data as JSON for backup
 */
export function exportSave(slotId) {
  const data = loadGame(slotId);
  if (!data) {
    throw new Error(`No save found in slot ${slotId}`);
  }

  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `pbt_save_slot${slotId}_${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  console.log(`Save exported from slot ${slotId}`);
}

/**
 * Import save data from JSON
 */
export function importSave(slotId, jsonString) {
  try {
    const data = JSON.parse(jsonString);

    if (!validateSaveData(data)) {
      throw new Error('Invalid save data format');
    }

    // Update timestamp to current
    data.timestamp = Date.now();

    const compressed = compressData(data);
    if (!compressed) {
      throw new Error('Failed to compress imported data');
    }

    const key = `${SAVE_PREFIX}slot_${slotId}`;
    localStorage.setItem(key, compressed);

    console.log(`Save imported to slot ${slotId}`);
    return true;
  } catch (error) {
    console.error('Failed to import save:', error);
    throw error;
  }
}

/**
 * Get save system stats
 */
export function getSaveSystemStats() {
  const slots = getSaveSlots();
  const usedSlots = slots.filter(s => !s.empty).length;

  // Estimate storage usage
  let totalSize = 0;
  for (let i = 1; i <= MAX_SAVE_SLOTS; i++) {
    const key = `${SAVE_PREFIX}slot_${i}`;
    const data = localStorage.getItem(key);
    if (data) {
      totalSize += data.length;
    }
  }

  return {
    usedSlots,
    totalSlots: MAX_SAVE_SLOTS,
    storageUsed: totalSize,
    storageUsedKB: (totalSize / 1024).toFixed(2),
    hasAutoSave: !!loadAutoSave()
  };
}
