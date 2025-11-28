// useLevelUpManager.js
// Hook for managing level up choices and move learning

import { useState, useCallback } from 'react';

/**
 * Hook for managing level up state and choices
 * Handles stat upgrade choices and move learning
 * @returns {Object} - Level up state and management functions
 */
export function useLevelUpManager() {
  const [levelUpChoice, setLevelUpChoice] = useState(null);
  const [pendingMoveLearn, setPendingMoveLearn] = useState(null);
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [showMoveLearnModal, setShowMoveLearnModal] = useState(false);

  /**
   * Trigger level up choice modal
   * @param {number} pokemonIndex - Index in player team
   * @param {Object} pokemon - Pokemon object that leveled up
   * @param {Array} statOptions - Available stat upgrade options
   */
  const triggerLevelUpChoice = useCallback((pokemonIndex, pokemon, statOptions) => {
    setLevelUpChoice({
      pokemonIndex,
      pokemon,
      statOptions,
    });
    setShowLevelUpModal(true);
  }, []);

  /**
   * Complete level up choice
   * Closes modal and clears choice state
   */
  const completeLevelUpChoice = useCallback(() => {
    setLevelUpChoice(null);
    setShowLevelUpModal(false);
  }, []);

  /**
   * Cancel level up choice
   * Closes modal without applying choice
   */
  const cancelLevelUpChoice = useCallback(() => {
    setLevelUpChoice(null);
    setShowLevelUpModal(false);
  }, []);

  /**
   * Trigger move learning modal
   * @param {number} pokemonIndex - Index in player team
   * @param {Object} pokemon - Pokemon object
   * @param {Object} newMove - New move to learn
   */
  const triggerMoveLearn = useCallback((pokemonIndex, pokemon, newMove) => {
    setPendingMoveLearn({
      pokemonIndex,
      pokemon,
      newMove,
    });
    setShowMoveLearnModal(true);
  }, []);

  /**
   * Complete move learning
   * Closes modal and clears pending state
   */
  const completeMoveLearn = useCallback(() => {
    setPendingMoveLearn(null);
    setShowMoveLearnModal(false);
  }, []);

  /**
   * Cancel move learning
   * Closes modal without learning move
   */
  const cancelMoveLearn = useCallback(() => {
    setPendingMoveLearn(null);
    setShowMoveLearnModal(false);
  }, []);

  /**
   * Clear all level up state
   */
  const clearLevelUpState = useCallback(() => {
    setLevelUpChoice(null);
    setPendingMoveLearn(null);
    setShowLevelUpModal(false);
    setShowMoveLearnModal(false);
  }, []);

  /**
   * Check if there are pending level up actions
   */
  const hasPendingLevelUp = useCallback(() => {
    return levelUpChoice !== null || pendingMoveLearn !== null;
  }, [levelUpChoice, pendingMoveLearn]);

  return {
    // State
    levelUpChoice,
    pendingMoveLearn,
    showLevelUpModal,
    showMoveLearnModal,

    // Functions
    triggerLevelUpChoice,
    completeLevelUpChoice,
    cancelLevelUpChoice,
    triggerMoveLearn,
    completeMoveLearn,
    cancelMoveLearn,
    clearLevelUpState,
    hasPendingLevelUp,

    // Setters (for advanced use cases)
    setLevelUpChoice,
    setPendingMoveLearn,
    setShowLevelUpModal,
    setShowMoveLearnModal,
  };
}
