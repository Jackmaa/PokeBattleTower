// useBattleEffects.js
// Hook for managing battle visual effects state
import { useState } from 'react';

/**
 * Hook for managing battle VFX state
 * @returns {Object} - VFX state and setters
 */
export function useBattleEffects() {
  const [currentAttack, setCurrentAttack] = useState(null);
  const [damageDisplay, setDamageDisplay] = useState(null);
  const [screenShakeTrigger, setScreenShakeTrigger] = useState({ active: false, damage: 0 });
  const [attackingPokemon, setAttackingPokemon] = useState(null);
  const [currentWeather, setCurrentWeather] = useState('none');
  const [attackVFX, setAttackVFX] = useState({
    active: false,
    type: 'normal',
    targetX: 0,
    targetY: 0,
  });

  /**
   * Reset all effects
   */
  const resetEffects = () => {
    setCurrentAttack(null);
    setDamageDisplay(null);
    setScreenShakeTrigger({ active: false, damage: 0 });
    setAttackingPokemon(null);
    setAttackVFX({ active: false, type: 'normal', targetX: 0, targetY: 0 });
  };

  /**
   * Trigger screen shake effect
   */
  const triggerScreenShake = (damage) => {
    setScreenShakeTrigger({ active: true, damage });
    setTimeout(() => {
      setScreenShakeTrigger({ active: false, damage: 0 });
    }, 500);
  };

  /**
   * Show damage number at position
   */
  const showDamage = (damage, x, y, isCritical = false) => {
    setDamageDisplay({ damage, x, y, isCritical, id: Date.now() });
    setTimeout(() => {
      setDamageDisplay(null);
    }, 1500);
  };

  /**
   * Trigger attack VFX
   */
  const triggerAttackVFX = (type, targetX, targetY) => {
    setAttackVFX({ active: true, type, targetX, targetY });
    setTimeout(() => {
      setAttackVFX({ active: false, type: 'normal', targetX: 0, targetY: 0 });
    }, 1000);
  };

  return {
    // State
    currentAttack,
    damageDisplay,
    screenShakeTrigger,
    attackingPokemon,
    currentWeather,
    attackVFX,

    // Setters
    setCurrentAttack,
    setDamageDisplay,
    setScreenShakeTrigger,
    setAttackingPokemon,
    setCurrentWeather,
    setAttackVFX,

    // Helper functions
    resetEffects,
    triggerScreenShake,
    showDamage,
    triggerAttackVFX,
  };
}
