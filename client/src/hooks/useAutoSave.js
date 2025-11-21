// 📁 useAutoSave.js
// Hook for automatic game saving

import { useEffect, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { teamState } from '../recoil/atoms/team';
import { floorState } from '../recoil/atoms/floor';
import { towerMapState, currentNodeState } from '../recoil/atoms/towerMap';
import { inventoryState, currencyState } from '../recoil/atoms/inventory';
import { gameViewState } from '../recoil/atoms/game';
import { autoSave } from '../utils/saveManager';

/**
 * Hook to automatically save game state
 * @param {number} interval - Auto-save interval in milliseconds (default: 30000 = 30s)
 * @param {boolean} enabled - Whether auto-save is enabled
 * @param {Object} options - Additional options
 */
export function useAutoSave(interval = 30000, enabled = true, options = {}) {
  const team = useRecoilValue(teamState);
  const floor = useRecoilValue(floorState);
  const towerMap = useRecoilValue(towerMapState);
  const inventory = useRecoilValue(inventoryState);
  const currency = useRecoilValue(currencyState);
  const currentNode = useRecoilValue(currentNodeState);
  const gameView = useRecoilValue(gameViewState);

  const statsRef = useRef({
    floorsCleared: 0,
    battlesWon: 0,
    pokemonCaught: 0,
    itemsUsed: 0,
    goldEarned: 0,
    playtime: 0,
    sessionStart: Date.now()
  });

  const lastSaveRef = useRef(null);
  const saveIntervalRef = useRef(null);

  // Update stats
  useEffect(() => {
    statsRef.current = {
      ...statsRef.current,
      floorsCleared: floor,
      pokemonCaught: team.length,
      playtime: Date.now() - statsRef.current.sessionStart,
      ...options.stats
    };
  }, [floor, team.length, options.stats]);

  // Auto-save function
  const performAutoSave = () => {
    if (!enabled) return;

    // Don't save if team is empty (not started yet)
    if (!team || team.length === 0) {
      console.log('Auto-save skipped: no team');
      return;
    }

    const gameState = {
      team,
      floor,
      towerMap,
      inventory,
      currency,
      currentNode,
      gameView
    };

    try {
      const success = autoSave(gameState, statsRef.current);
      if (success) {
        lastSaveRef.current = Date.now();
        if (options.onAutoSave) {
          options.onAutoSave();
        }
      }
    } catch (error) {
      console.error('Auto-save failed:', error);
      if (options.onError) {
        options.onError(error);
      }
    }
  };

  // Set up auto-save interval
  useEffect(() => {
    if (!enabled) {
      if (saveIntervalRef.current) {
        clearInterval(saveIntervalRef.current);
        saveIntervalRef.current = null;
      }
      return;
    }

    // Initial save after 5 seconds
    const initialSaveTimeout = setTimeout(() => {
      performAutoSave();
    }, 5000);

    // Regular interval saves
    saveIntervalRef.current = setInterval(() => {
      performAutoSave();
    }, interval);

    return () => {
      clearTimeout(initialSaveTimeout);
      if (saveIntervalRef.current) {
        clearInterval(saveIntervalRef.current);
      }
    };
  }, [enabled, interval, team, floor, towerMap, inventory, currency, currentNode, gameView]);

  // Save on specific events if provided
  useEffect(() => {
    if (options.saveOnFloorChange && floor > 0) {
      console.log('Auto-save triggered: floor changed');
      performAutoSave();
    }
  }, [floor, options.saveOnFloorChange]);

  // Save before unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (enabled && team && team.length > 0) {
        performAutoSave();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [enabled, team]);

  // Return utility functions
  return {
    performAutoSave,
    lastSave: lastSaveRef.current,
    updateStats: (newStats) => {
      statsRef.current = { ...statsRef.current, ...newStats };
    }
  };
}

/**
 * Hook to track game statistics
 */
export function useGameStats() {
  const statsRef = useRef({
    battlesWon: 0,
    battlesLost: 0,
    totalDamageDealt: 0,
    totalDamageTaken: 0,
    criticalHits: 0,
    itemsUsed: 0,
    pokemonCaught: 0,
    goldEarned: 0,
    goldSpent: 0,
    moveUseCounts: {}
  });

  const incrementStat = (statName, amount = 1) => {
    if (statName in statsRef.current) {
      if (typeof statsRef.current[statName] === 'number') {
        statsRef.current[statName] += amount;
      }
    }
  };

  const incrementMoveUse = (moveName) => {
    if (!statsRef.current.moveUseCounts[moveName]) {
      statsRef.current.moveUseCounts[moveName] = 0;
    }
    statsRef.current.moveUseCounts[moveName]++;
  };

  const getStats = () => statsRef.current;

  const resetStats = () => {
    statsRef.current = {
      battlesWon: 0,
      battlesLost: 0,
      totalDamageDealt: 0,
      totalDamageTaken: 0,
      criticalHits: 0,
      itemsUsed: 0,
      pokemonCaught: 0,
      goldEarned: 0,
      goldSpent: 0,
      moveUseCounts: {}
    };
  };

  return {
    stats: statsRef.current,
    incrementStat,
    incrementMoveUse,
    getStats,
    resetStats
  };
}
