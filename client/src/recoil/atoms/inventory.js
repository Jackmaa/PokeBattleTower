// 📁 inventory.js
// Player inventory and currency state

import { atom } from 'recoil';

/**
 * Player's currency (gold/money)
 */
export const currencyState = atom({
  key: 'currencyState',
  default: 1000, // Starting gold
});

/**
 * Player's inventory
 * Format: { itemId: quantity }
 * Example: { 'potion': 3, 'x_attack': 1 }
 */
export const inventoryState = atom({
  key: 'inventoryState',
  default: {},
});
