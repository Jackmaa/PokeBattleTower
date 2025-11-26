// usePokemonStateManager.js
// Custom hook for managing Pokemon state mutations

import { useCallback } from 'react';

/**
 * Hook for managing common Pokemon state mutations
 * Eliminates deep nested mutations and provides clean API for Pokemon updates
 *
 * @param {Function} setTeam - State setter for team array
 *
 * @returns {Object} - { healPokemon, damagePokemon, boostStat, decreaseStat, updatePokemonStats, healAllPokemon, damageAllPokemon, boostStatAll }
 *
 * @example
 * const { healPokemon, boostStat } = usePokemonStateManager(setTeam);
 * healPokemon(0, 50); // Heal first Pokemon by 50 HP
 * boostStat(1, 'attack', 10); // Boost second Pokemon's attack by 10
 */
export function usePokemonStateManager(setTeam) {

  // Heal a single Pokemon by amount
  const healPokemon = useCallback((pokemonIndex, amount) => {
    setTeam(prev => prev.map((poke, i) =>
      i === pokemonIndex
        ? {
            ...poke,
            stats: {
              ...poke.stats,
              hp: Math.min(poke.stats.hp_max, poke.stats.hp + amount)
            }
          }
        : poke
    ));
  }, [setTeam]);

  // Heal a Pokemon by percentage of max HP
  const healPokemonPercent = useCallback((pokemonIndex, percent) => {
    setTeam(prev => prev.map((poke, i) =>
      i === pokemonIndex
        ? {
            ...poke,
            stats: {
              ...poke.stats,
              hp: Math.min(
                poke.stats.hp_max,
                poke.stats.hp + Math.floor(poke.stats.hp_max * percent)
              )
            }
          }
        : poke
    ));
  }, [setTeam]);

  // Heal all Pokemon by percentage
  const healAllPokemon = useCallback((percent) => {
    setTeam(prev => prev.map(poke => ({
      ...poke,
      stats: {
        ...poke.stats,
        hp: Math.min(
          poke.stats.hp_max,
          poke.stats.hp + Math.floor(poke.stats.hp_max * percent)
        ),
      },
    })));
  }, [setTeam]);

  // Damage a single Pokemon by amount
  const damagePokemon = useCallback((pokemonIndex, amount) => {
    setTeam(prev => prev.map((poke, i) =>
      i === pokemonIndex
        ? {
            ...poke,
            stats: {
              ...poke.stats,
              hp: Math.max(1, poke.stats.hp - amount)
            }
          }
        : poke
    ));
  }, [setTeam]);

  // Damage a Pokemon by percentage of max HP
  const damagePokemonPercent = useCallback((pokemonIndex, percent) => {
    setTeam(prev => prev.map((poke, i) =>
      i === pokemonIndex
        ? {
            ...poke,
            stats: {
              ...poke.stats,
              hp: Math.max(1, poke.stats.hp - Math.floor(poke.stats.hp_max * percent))
            }
          }
        : poke
    ));
  }, [setTeam]);

  // Damage all Pokemon by percentage
  const damageAllPokemon = useCallback((percent) => {
    setTeam(prev => prev.map(poke => ({
      ...poke,
      stats: {
        ...poke.stats,
        hp: Math.max(1, poke.stats.hp - Math.floor(poke.stats.hp_max * percent)),
      },
    })));
  }, [setTeam]);

  // Boost a single stat for a Pokemon
  const boostStat = useCallback((pokemonIndex, stat, amount) => {
    setTeam(prev => prev.map((poke, i) =>
      i === pokemonIndex
        ? {
            ...poke,
            stats: {
              ...poke.stats,
              [stat]: poke.stats[stat] + amount
            }
          }
        : poke
    ));
  }, [setTeam]);

  // Boost all stats for a Pokemon
  const boostAllStats = useCallback((pokemonIndex, amount) => {
    setTeam(prev => prev.map((poke, i) =>
      i === pokemonIndex
        ? {
            ...poke,
            stats: {
              ...poke.stats,
              attack: poke.stats.attack + amount,
              defense: poke.stats.defense + amount,
              special_attack: poke.stats.special_attack + amount,
              special_defense: poke.stats.special_defense + amount,
              speed: poke.stats.speed + amount,
            }
          }
        : poke
    ));
  }, [setTeam]);

  // Decrease a single stat for a Pokemon
  const decreaseStat = useCallback((pokemonIndex, stat, amount) => {
    setTeam(prev => prev.map((poke, i) =>
      i === pokemonIndex
        ? {
            ...poke,
            stats: {
              ...poke.stats,
              [stat]: Math.max(1, poke.stats[stat] - amount)
            }
          }
        : poke
    ));
  }, [setTeam]);

  // Update multiple stats for a Pokemon at once
  const updatePokemonStats = useCallback((pokemonIndex, statUpdates) => {
    setTeam(prev => prev.map((poke, i) =>
      i === pokemonIndex
        ? { ...poke, stats: { ...poke.stats, ...statUpdates } }
        : poke
    ));
  }, [setTeam]);

  // Update entire Pokemon object (for complex updates like evolution)
  const updatePokemon = useCallback((pokemonIndex, pokemonUpdates) => {
    setTeam(prev => prev.map((poke, i) =>
      i === pokemonIndex
        ? { ...poke, ...pokemonUpdates }
        : poke
    ));
  }, [setTeam]);

  // Fully heal a Pokemon
  const fullyHealPokemon = useCallback((pokemonIndex) => {
    setTeam(prev => prev.map((poke, i) =>
      i === pokemonIndex
        ? {
            ...poke,
            stats: {
              ...poke.stats,
              hp: poke.stats.hp_max
            }
          }
        : poke
    ));
  }, [setTeam]);

  // Fully heal all Pokemon
  const fullyHealAllPokemon = useCallback(() => {
    setTeam(prev => prev.map(poke => ({
      ...poke,
      stats: {
        ...poke.stats,
        hp: poke.stats.hp_max,
      },
    })));
  }, [setTeam]);

  return {
    // Single Pokemon HP management
    healPokemon,
    healPokemonPercent,
    damagePokemon,
    damagePokemonPercent,
    fullyHealPokemon,

    // All Pokemon HP management
    healAllPokemon,
    damageAllPokemon,
    fullyHealAllPokemon,

    // Stat modifications
    boostStat,
    boostAllStats,
    decreaseStat,

    // General updates
    updatePokemonStats,
    updatePokemon,
  };
}
