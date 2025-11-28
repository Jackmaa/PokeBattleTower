// useBattleState.js
// Hook for managing NvM battle state
import { useState, useRef, useCallback } from 'react';
import { BattleState } from '../../utils/battleEngine';

/**
 * Hook for managing battle state in NvM combat system
 * @returns {Object} - Battle state and management functions
 */
export function useBattleState() {
  const [nvmBattle, setNvmBattle] = useState(null);
  const [turnOrderDisplay, setTurnOrderDisplay] = useState([]);
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [roundNumber, setRoundNumber] = useState(1);
  const [awaitingPlayerMove, setAwaitingPlayerMove] = useState(false);
  const [currentCombatantId, setCurrentCombatantId] = useState(null);
  const battleStateRef = useRef(null);

  /**
   * Initialize a new battle
   * @param {Array} playerTeam - Player's Pokemon team
   * @param {Array} enemyTeam - Enemy Pokemon team
   * @returns {BattleState} - The created battle state
   */
  const initializeBattle = useCallback((playerTeam, enemyTeam) => {
    const battle = new BattleState(playerTeam, enemyTeam);
    setNvmBattle(battle);
    battleStateRef.current = battle;
    setTurnOrderDisplay(battle.getSummary().turnOrder);
    setRoundNumber(1);
    setCurrentTurnIndex(0);
    setAwaitingPlayerMove(false);
    setCurrentCombatantId(null);
    return battle;
  }, []);

  /**
   * Update battle display with current battle state
   */
  const updateBattleDisplay = useCallback(() => {
    if (!nvmBattle) return;
    const summary = nvmBattle.getSummary();
    setTurnOrderDisplay(summary.turnOrder);
    setCurrentTurnIndex(summary.currentTurnIndex);
    setRoundNumber(summary.roundNumber);
  }, [nvmBattle]);

  /**
   * Reset battle state
   */
  const resetBattle = useCallback(() => {
    setNvmBattle(null);
    battleStateRef.current = null;
    setTurnOrderDisplay([]);
    setCurrentTurnIndex(0);
    setRoundNumber(1);
    setAwaitingPlayerMove(false);
    setCurrentCombatantId(null);
  }, []);

  /**
   * Get current combatant
   */
  const getCurrentCombatant = useCallback(() => {
    if (!nvmBattle) return null;
    return nvmBattle.getCurrentCombatant();
  }, [nvmBattle]);

  /**
   * Check if battle is finished
   */
  const isBattleFinished = useCallback(() => {
    if (!nvmBattle) return false;
    return nvmBattle.isFinished;
  }, [nvmBattle]);

  /**
   * Get battle winner
   */
  const getBattleWinner = useCallback(() => {
    if (!nvmBattle) return null;
    return nvmBattle.winner;
  }, [nvmBattle]);

  return {
    // State
    nvmBattle,
    turnOrderDisplay,
    currentTurnIndex,
    roundNumber,
    awaitingPlayerMove,
    currentCombatantId,
    battleStateRef,

    // Functions
    initializeBattle,
    updateBattleDisplay,
    resetBattle,
    getCurrentCombatant,
    isBattleFinished,
    getBattleWinner,

    // Setters
    setAwaitingPlayerMove,
    setCurrentCombatantId,
    setNvmBattle,
  };
}
