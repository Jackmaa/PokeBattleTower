// relicCollection.js
// Permanent relic collection system - discovery, purchase, and equipping

import { RELICS, RELIC_TIERS, getRelicById } from './relics';

// ============================================
// PRICING CONSTANTS
// ============================================

// Price to purchase relics based on tier
export const RELIC_PRICES = {
  [RELIC_TIERS.COMMON]: 200,
  [RELIC_TIERS.UNCOMMON]: 500,
  [RELIC_TIERS.RARE]: 1500,
  [RELIC_TIERS.LEGENDARY]: 5000,
};

// Sell price is 50% of purchase price
export const RELIC_SELL_MULTIPLIER = 0.5;

// Slot prices increase exponentially
// Slot 1: free (default), Slot 2: 500g, Slot 3: 1000g, Slot 4: 2000g, etc.
export const BASE_SLOT_PRICE = 500;
export const SLOT_PRICE_MULTIPLIER = 2;
export const MAX_SLOTS = 5;

// ============================================
// PRICING FUNCTIONS
// ============================================

/**
 * Get the price to buy a relic based on its tier
 */
export function getRelicBuyPrice(relicId) {
  const relic = getRelicById(relicId);
  if (!relic) return 0;
  return RELIC_PRICES[relic.tier] || RELIC_PRICES[RELIC_TIERS.COMMON];
}

/**
 * Get the price to sell a relic (50% of buy price)
 */
export function getRelicSellPrice(relicId) {
  return Math.floor(getRelicBuyPrice(relicId) * RELIC_SELL_MULTIPLIER);
}

/**
 * Get the price for the next relic slot
 * @param {number} currentSlots - Current number of slots
 * @returns {number} - Price for the next slot, or -1 if max slots reached
 */
export function getNextSlotPrice(currentSlots) {
  if (currentSlots >= MAX_SLOTS) return -1;

  // Slot 1 is free (default), so we calculate for slots 2+
  // Slot 2: 500, Slot 3: 1000, Slot 4: 2000, Slot 5: 4000
  const slotIndex = currentSlots; // 0-indexed for calculation
  return BASE_SLOT_PRICE * Math.pow(SLOT_PRICE_MULTIPLIER, slotIndex - 1);
}

// ============================================
// COLLECTION MANAGEMENT
// ============================================

/**
 * Initialize a new relic collection
 */
export function createEmptyCollection() {
  return {
    discovered: [],
    owned: [],
    equipped: [],
    slots: 1,
    slotsPurchased: 0,
  };
}

/**
 * Add a discovered relic to the collection (called when finding relics during runs)
 * @param {Object} collection - Current collection state
 * @param {string} relicId - ID of the discovered relic
 * @returns {Object} - Updated collection and whether it was a new discovery
 */
export function discoverRelic(collection, relicId) {
  if (!getRelicById(relicId)) {
    return { collection, isNew: false };
  }

  if (collection.discovered.includes(relicId)) {
    return { collection, isNew: false };
  }

  return {
    collection: {
      ...collection,
      discovered: [...collection.discovered, relicId],
    },
    isNew: true,
  };
}

/**
 * Purchase a discovered relic
 * @param {Object} collection - Current collection state
 * @param {number} gold - Current gold amount
 * @param {string} relicId - ID of the relic to buy
 * @returns {Object} - { success, collection, newGold, error }
 */
export function purchaseRelic(collection, gold, relicId) {
  // Check if relic exists
  const relic = getRelicById(relicId);
  if (!relic) {
    return { success: false, collection, newGold: gold, error: 'Relic not found' };
  }

  // Check if discovered
  if (!collection.discovered.includes(relicId)) {
    return { success: false, collection, newGold: gold, error: 'Relic not discovered yet' };
  }

  // Check if already owned
  if (collection.owned.includes(relicId)) {
    return { success: false, collection, newGold: gold, error: 'Already owned' };
  }

  // Check price
  const price = getRelicBuyPrice(relicId);
  if (gold < price) {
    return { success: false, collection, newGold: gold, error: 'Not enough gold' };
  }

  return {
    success: true,
    collection: {
      ...collection,
      owned: [...collection.owned, relicId],
    },
    newGold: gold - price,
    error: null,
  };
}

/**
 * Sell an owned relic
 * @param {Object} collection - Current collection state
 * @param {number} gold - Current gold amount
 * @param {string} relicId - ID of the relic to sell
 * @returns {Object} - { success, collection, newGold, error }
 */
export function sellRelic(collection, gold, relicId) {
  // Check if owned
  if (!collection.owned.includes(relicId)) {
    return { success: false, collection, newGold: gold, error: 'Relic not owned' };
  }

  // Remove from equipped if equipped
  const newEquipped = collection.equipped.filter(id => id !== relicId);

  // Remove from owned
  const newOwned = collection.owned.filter(id => id !== relicId);

  // Calculate sell price
  const sellPrice = getRelicSellPrice(relicId);

  return {
    success: true,
    collection: {
      ...collection,
      owned: newOwned,
      equipped: newEquipped,
    },
    newGold: gold + sellPrice,
    error: null,
  };
}

/**
 * Equip a relic (will be available at the start of next run)
 * @param {Object} collection - Current collection state
 * @param {string} relicId - ID of the relic to equip
 * @returns {Object} - { success, collection, error }
 */
export function equipRelic(collection, relicId) {
  // Check if owned
  if (!collection.owned.includes(relicId)) {
    return { success: false, collection, error: 'Relic not owned' };
  }

  // Check if already equipped
  if (collection.equipped.includes(relicId)) {
    return { success: false, collection, error: 'Already equipped' };
  }

  // Check if slots available
  if (collection.equipped.length >= collection.slots) {
    return { success: false, collection, error: 'No available slots' };
  }

  return {
    success: true,
    collection: {
      ...collection,
      equipped: [...collection.equipped, relicId],
    },
    error: null,
  };
}

/**
 * Unequip a relic
 * @param {Object} collection - Current collection state
 * @param {string} relicId - ID of the relic to unequip
 * @returns {Object} - { success, collection, error }
 */
export function unequipRelic(collection, relicId) {
  if (!collection.equipped.includes(relicId)) {
    return { success: false, collection, error: 'Relic not equipped' };
  }

  return {
    success: true,
    collection: {
      ...collection,
      equipped: collection.equipped.filter(id => id !== relicId),
    },
    error: null,
  };
}

/**
 * Purchase an additional relic slot
 * @param {Object} collection - Current collection state
 * @param {number} gold - Current gold amount
 * @returns {Object} - { success, collection, newGold, error }
 */
export function purchaseSlot(collection, gold) {
  if (collection.slots >= MAX_SLOTS) {
    return { success: false, collection, newGold: gold, error: 'Maximum slots reached' };
  }

  const price = getNextSlotPrice(collection.slots);
  if (gold < price) {
    return { success: false, collection, newGold: gold, error: 'Not enough gold' };
  }

  return {
    success: true,
    collection: {
      ...collection,
      slots: collection.slots + 1,
      slotsPurchased: collection.slotsPurchased + 1,
    },
    newGold: gold - price,
    error: null,
  };
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Get all relics available for purchase (discovered but not owned)
 */
export function getAvailableForPurchase(collection) {
  return collection.discovered
    .filter(id => !collection.owned.includes(id))
    .map(id => ({
      ...getRelicById(id),
      price: getRelicBuyPrice(id),
    }))
    .filter(r => r.id); // Filter out any null relics
}

/**
 * Get all owned relics with their equipped status
 */
export function getOwnedRelicsWithStatus(collection) {
  return collection.owned
    .map(id => ({
      ...getRelicById(id),
      isEquipped: collection.equipped.includes(id),
      sellPrice: getRelicSellPrice(id),
    }))
    .filter(r => r.id);
}

/**
 * Get the equipped relics as full relic objects
 */
export function getEquippedRelics(collection) {
  return collection.equipped
    .map(id => getRelicById(id))
    .filter(r => r);
}

/**
 * Get collection statistics
 */
export function getCollectionStats(collection) {
  const totalRelics = Object.keys(RELICS).length;
  const discoveredCount = collection.discovered.length;
  const ownedCount = collection.owned.length;
  const equippedCount = collection.equipped.length;

  return {
    totalRelics,
    discoveredCount,
    ownedCount,
    equippedCount,
    availableSlots: collection.slots - equippedCount,
    maxSlots: collection.slots,
    discoveryProgress: Math.round((discoveredCount / totalRelics) * 100),
    collectionProgress: Math.round((ownedCount / totalRelics) * 100),
  };
}

/**
 * Get relics by discovery status
 */
export function getRelicsByDiscoveryStatus(collection) {
  const allRelics = Object.values(RELICS);

  const discovered = allRelics.filter(r => collection.discovered.includes(r.id));
  const undiscovered = allRelics.filter(r => !collection.discovered.includes(r.id));
  const owned = allRelics.filter(r => collection.owned.includes(r.id));
  const unowned = discovered.filter(r => !collection.owned.includes(r.id));

  return {
    discovered,
    undiscovered,
    owned,
    unowned,
  };
}

export default {
  // Pricing
  RELIC_PRICES,
  RELIC_SELL_MULTIPLIER,
  BASE_SLOT_PRICE,
  SLOT_PRICE_MULTIPLIER,
  MAX_SLOTS,
  getRelicBuyPrice,
  getRelicSellPrice,
  getNextSlotPrice,

  // Collection management
  createEmptyCollection,
  discoverRelic,
  purchaseRelic,
  sellRelic,
  equipRelic,
  unequipRelic,
  purchaseSlot,

  // Utility
  getAvailableForPurchase,
  getOwnedRelicsWithStatus,
  getEquippedRelics,
  getCollectionStats,
  getRelicsByDiscoveryStatus,
};
