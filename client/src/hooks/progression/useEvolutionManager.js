// useEvolutionManager.js
// Hook for managing Pokemon evolution state and queue

import { useState, useCallback } from 'react';

/**
 * Hook for managing evolution queue and state
 * Handles evolution modals, queuing, and processing
 * @returns {Object} - Evolution state and management functions
 */
export function useEvolutionManager() {
  const [pendingEvolution, setPendingEvolution] = useState(null);
  const [evolutionQueue, setEvolutionQueue] = useState([]);
  const [showEvolutionModal, setShowEvolutionModal] = useState(false);

  /**
   * Queue an evolution to be processed
   * @param {number} pokemonIndex - Index in player team
   * @param {Object} pokemon - Pokemon object
   * @param {Object} evolution - Evolution data
   */
  const queueEvolution = useCallback((pokemonIndex, pokemon, evolution) => {
    setEvolutionQueue(prev => [...prev, { pokemonIndex, pokemon, evolution }]);
  }, []);

  /**
   * Process next evolution in queue
   * Opens the evolution modal with the next queued evolution
   */
  const processNextEvolution = useCallback(() => {
    if (evolutionQueue.length > 0) {
      const next = evolutionQueue[0];
      setPendingEvolution(next);
      setShowEvolutionModal(true);
      setEvolutionQueue(prev => prev.slice(1));
    }
  }, [evolutionQueue]);

  /**
   * Complete current evolution
   * Closes modal and clears pending evolution
   */
  const completeEvolution = useCallback(() => {
    setPendingEvolution(null);
    setShowEvolutionModal(false);
  }, []);

  /**
   * Cancel current evolution
   * Closes modal and clears pending evolution
   */
  const cancelEvolution = useCallback(() => {
    setPendingEvolution(null);
    setShowEvolutionModal(false);
  }, []);

  /**
   * Clear all queued evolutions
   */
  const clearEvolutionQueue = useCallback(() => {
    setEvolutionQueue([]);
    setPendingEvolution(null);
    setShowEvolutionModal(false);
  }, []);

  /**
   * Check if there are pending evolutions
   */
  const hasPendingEvolutions = useCallback(() => {
    return evolutionQueue.length > 0 || pendingEvolution !== null;
  }, [evolutionQueue.length, pendingEvolution]);

  return {
    // State
    pendingEvolution,
    evolutionQueue,
    showEvolutionModal,

    // Functions
    queueEvolution,
    processNextEvolution,
    completeEvolution,
    cancelEvolution,
    clearEvolutionQueue,
    hasPendingEvolutions,

    // Setters (for advanced use cases)
    setPendingEvolution,
    setEvolutionQueue,
    setShowEvolutionModal,
  };
}
