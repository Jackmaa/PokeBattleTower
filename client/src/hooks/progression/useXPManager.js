// useXPManager.js
// Hook for managing XP distribution and calculations

import { useState, useCallback } from 'react';

/**
 * Hook for managing XP distribution state and animations
 * @returns {Object} - XP state and management functions
 */
export function useXPManager() {
  const [isDistributingXP, setIsDistributingXP] = useState(false);
  const [currentXPDistribution, setCurrentXPDistribution] = useState(null);
  const [xpGainQueue, setXpGainQueue] = useState([]);

  /**
   * Start XP distribution animation
   * @param {Array} xpGains - Array of { pokemonIndex, amount } objects
   */
  const startXPDistribution = useCallback((xpGains) => {
    setCurrentXPDistribution(xpGains);
    setIsDistributingXP(true);
  }, []);

  /**
   * Complete XP distribution
   * Clears current distribution and marks as complete
   */
  const completeXPDistribution = useCallback(() => {
    setCurrentXPDistribution(null);
    setIsDistributingXP(false);
  }, []);

  /**
   * Queue XP gain for later distribution
   * @param {number} pokemonIndex - Index in player team
   * @param {number} amount - XP amount to gain
   */
  const queueXPGain = useCallback((pokemonIndex, amount) => {
    setXpGainQueue(prev => [...prev, { pokemonIndex, amount }]);
  }, []);

  /**
   * Process next XP gain in queue
   * Returns the next XP gain or null if queue is empty
   * @returns {Object|null} - Next XP gain or null
   */
  const processNextXPGain = useCallback(() => {
    if (xpGainQueue.length > 0) {
      const next = xpGainQueue[0];
      setXpGainQueue(prev => prev.slice(1));
      return next;
    }
    return null;
  }, [xpGainQueue]);

  /**
   * Clear XP gain queue
   */
  const clearXPQueue = useCallback(() => {
    setXpGainQueue([]);
  }, []);

  /**
   * Calculate XP distribution for team
   * @param {number} totalXP - Total XP to distribute
   * @param {Array} team - Player team
   * @param {Array} participantIndices - Indices of Pokemon that participated
   * @returns {Array} - Array of { pokemonIndex, amount } objects
   */
  const calculateXPDistribution = useCallback((totalXP, team, participantIndices = null) => {
    // If no specific participants, distribute to all alive Pokemon
    const recipients = participantIndices ||
      team.map((p, i) => p.stats.hp > 0 ? i : null).filter(i => i !== null);

    if (recipients.length === 0) return [];

    const xpPerPokemon = Math.floor(totalXP / recipients.length);
    return recipients.map(index => ({
      pokemonIndex: index,
      amount: xpPerPokemon,
    }));
  }, []);

  /**
   * Apply XP to Pokemon
   * @param {Object} pokemon - Pokemon object
   * @param {number} xpAmount - XP to add
   * @returns {Object} - Updated Pokemon with new XP
   */
  const applyXPToPokemon = useCallback((pokemon, xpAmount) => {
    const currentXP = pokemon.xp || 0;
    const newXP = currentXP + xpAmount;

    return {
      ...pokemon,
      xp: newXP,
    };
  }, []);

  /**
   * Check if Pokemon should level up
   * @param {Object} pokemon - Pokemon object
   * @returns {boolean} - True if Pokemon should level up
   */
  const shouldLevelUp = useCallback((pokemon) => {
    const xpNeeded = calculateXPNeeded(pokemon.level);
    return pokemon.xp >= xpNeeded;
  }, []);

  return {
    // State
    isDistributingXP,
    currentXPDistribution,
    xpGainQueue,

    // Functions
    startXPDistribution,
    completeXPDistribution,
    queueXPGain,
    processNextXPGain,
    clearXPQueue,
    calculateXPDistribution,
    applyXPToPokemon,
    shouldLevelUp,

    // Setters (for advanced use cases)
    setIsDistributingXP,
    setCurrentXPDistribution,
    setXpGainQueue,
  };
}

/**
 * Calculate XP needed for next level
 * @param {number} level - Current level
 * @returns {number} - XP needed for next level
 */
function calculateXPNeeded(level) {
  // Medium-Fast growth rate formula
  return Math.floor(Math.pow(level, 3));
}
