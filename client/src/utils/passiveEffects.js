// 📁 passiveEffects.js
// Passive effects system for held items and berries

import { getItemById } from './items';

/**
 * Process end-of-turn passive effects for a Pokémon
 * @param {Object} pokemon - The Pokémon to process
 * @param {Array} team - The full team for context
 * @param {number} pokemonIndex - Index in the team
 * @returns {Object} - { pokemon: updated pokemon, message: effect message, consumed: was item consumed }
 */
export function processEndOfTurnEffects(pokemon, team, pokemonIndex) {
  if (!pokemon.heldItem) {
    return { pokemon, message: null, consumed: false };
  }

  const item = getItemById(pokemon.heldItem);
  if (!item) {
    return { pokemon, message: null, consumed: false };
  }

  const effect = item.effect;
  let updatedPokemon = { ...pokemon };
  let message = null;
  let consumed = false;

  // Leftovers: Restore 1/16 of max HP at end of turn
  if (effect.type === 'held_regen' && effect.trigger === 'end_of_turn') {
    if (pokemon.stats.hp > 0 && pokemon.stats.hp < pokemon.stats.hp_max) {
      const healAmount = Math.max(1, Math.floor(pokemon.stats.hp_max / 16));
      const newHP = Math.min(pokemon.stats.hp + healAmount, pokemon.stats.hp_max);
      const actualHeal = newHP - pokemon.stats.hp;

      if (actualHeal > 0) {
        updatedPokemon = {
          ...pokemon,
          stats: {
            ...pokemon.stats,
            hp: newHP
          }
        };
        message = `${pokemon.name}'s ${item.name} restored ${actualHeal} HP!`;
      }
    }
  }

  return { pokemon: updatedPokemon, message, consumed };
}

/**
 * Check HP threshold effects (berries that trigger on low HP)
 * @param {Object} pokemon - The Pokémon to check
 * @returns {Object} - { pokemon: updated pokemon, message: effect message, consumed: was item consumed }
 */
export function checkHPThresholdEffects(pokemon) {
  if (!pokemon.heldItem) {
    return { pokemon, message: null, consumed: false };
  }

  const item = getItemById(pokemon.heldItem);
  if (!item) {
    return { pokemon, message: null, consumed: false };
  }

  const effect = item.effect;
  let updatedPokemon = { ...pokemon };
  let message = null;
  let consumed = false;

  // Berry effects that trigger on low HP
  if (effect.type === 'held_conditional' && effect.trigger === 'hp_below_50%') {
    const hpPercent = (pokemon.stats.hp / pokemon.stats.hp_max) * 100;

    if (hpPercent < 50 && hpPercent > 0) {
      if (effect.action === 'heal') {
        const healAmount = effect.value;
        const newHP = Math.min(pokemon.stats.hp + healAmount, pokemon.stats.hp_max);
        const actualHeal = newHP - pokemon.stats.hp;

        if (actualHeal > 0) {
          updatedPokemon = {
            ...pokemon,
            stats: {
              ...pokemon.stats,
              hp: newHP
            },
            heldItem: null // Berry is consumed
          };
          message = `${pokemon.name}'s ${item.name} activated and restored ${actualHeal} HP!`;
          consumed = true;
        }
      } else if (effect.action === 'heal_percent') {
        const healAmount = Math.floor(pokemon.stats.hp_max * (effect.value / 100));
        const newHP = Math.min(pokemon.stats.hp + healAmount, pokemon.stats.hp_max);
        const actualHeal = newHP - pokemon.stats.hp;

        if (actualHeal > 0) {
          updatedPokemon = {
            ...pokemon,
            stats: {
              ...pokemon.stats,
              hp: newHP
            },
            heldItem: null // Berry is consumed
          };
          message = `${pokemon.name}'s ${item.name} activated and restored ${actualHeal} HP!`;
          consumed = true;
        }
      }
    }
  }

  return { pokemon: updatedPokemon, message, consumed };
}

/**
 * Check status condition effects (berries that cure status)
 * @param {Object} pokemon - The Pokémon to check
 * @returns {Object} - { pokemon: updated pokemon, message: effect message, consumed: was item consumed }
 */
export function checkStatusEffects(pokemon) {
  if (!pokemon.heldItem) {
    return { pokemon, message: null, consumed: false };
  }

  const item = getItemById(pokemon.heldItem);
  if (!item) {
    return { pokemon, message: null, consumed: false };
  }

  const effect = item.effect;
  let updatedPokemon = { ...pokemon };
  let message = null;
  let consumed = false;

  // Lum Berry: Cure any status condition
  if (effect.type === 'held_conditional' && effect.trigger === 'status_condition') {
    if (pokemon.status && pokemon.status !== 'healthy') {
      updatedPokemon = {
        ...pokemon,
        status: 'healthy',
        heldItem: null // Berry is consumed
      };
      message = `${pokemon.name}'s ${item.name} cured its status condition!`;
      consumed = true;
    }
  }

  return { pokemon: updatedPokemon, message, consumed };
}

/**
 * Apply choice item effects (boost stat but lock move)
 * @param {Object} pokemon - The Pokémon with choice item
 * @param {string} selectedMove - The move being used
 * @returns {Object} - { pokemon: updated pokemon with stat boost, lockedMove: move to lock to, message: effect message }
 */
export function applyChoiceItemEffect(pokemon, selectedMove) {
  if (!pokemon.heldItem) {
    return { pokemon, lockedMove: null, message: null };
  }

  const item = getItemById(pokemon.heldItem);
  if (!item || item.effect.type !== 'held_choice') {
    return { pokemon, lockedMove: null, message: null };
  }

  const effect = item.effect;
  let updatedPokemon = { ...pokemon };
  let message = null;

  // Apply stat boost
  const statMultiplier = effect.stat_multiplier || 1.5;
  const statToBoost = effect.stat;

  if (statToBoost === 'attack') {
    updatedPokemon = {
      ...pokemon,
      stats: {
        ...pokemon.stats,
        attack: Math.floor(pokemon.stats.attack * statMultiplier)
      },
      _choiceItemApplied: true // Track that boost was applied
    };
    message = `${pokemon.name}'s ${item.name} boosted its Attack!`;
  } else if (statToBoost === 'special_attack') {
    updatedPokemon = {
      ...pokemon,
      stats: {
        ...pokemon.stats,
        special_attack: Math.floor(pokemon.stats.special_attack * statMultiplier)
      },
      _choiceItemApplied: true
    };
    message = `${pokemon.name}'s ${item.name} boosted its Special Attack!`;
  } else if (statToBoost === 'speed') {
    updatedPokemon = {
      ...pokemon,
      stats: {
        ...pokemon.stats,
        speed: Math.floor(pokemon.stats.speed * statMultiplier)
      },
      _choiceItemApplied: true
    };
    message = `${pokemon.name}'s ${item.name} boosted its Speed!`;
  }

  return {
    pokemon: updatedPokemon,
    lockedMove: selectedMove, // Lock to this move
    message
  };
}

/**
 * Remove choice item boosts (when switching out)
 * @param {Object} pokemon - The Pokémon with choice item
 * @returns {Object} - Updated pokemon with original stats
 */
export function removeChoiceItemBoosts(pokemon) {
  if (!pokemon.heldItem || !pokemon._choiceItemApplied) {
    return pokemon;
  }

  const item = getItemById(pokemon.heldItem);
  if (!item || item.effect.type !== 'held_choice') {
    return pokemon;
  }

  const effect = item.effect;
  const statMultiplier = effect.stat_multiplier || 1.5;
  const statToBoost = effect.stat;

  let updatedPokemon = { ...pokemon };

  // Remove boost by dividing
  if (statToBoost === 'attack') {
    updatedPokemon = {
      ...pokemon,
      stats: {
        ...pokemon.stats,
        attack: Math.floor(pokemon.stats.attack / statMultiplier)
      },
      _choiceItemApplied: false
    };
  } else if (statToBoost === 'special_attack') {
    updatedPokemon = {
      ...pokemon,
      stats: {
        ...pokemon.stats,
        special_attack: Math.floor(pokemon.stats.special_attack / statMultiplier)
      },
      _choiceItemApplied: false
    };
  } else if (statToBoost === 'speed') {
    updatedPokemon = {
      ...pokemon,
      stats: {
        ...pokemon.stats,
        speed: Math.floor(pokemon.stats.speed / statMultiplier)
      },
      _choiceItemApplied: false
    };
  }

  return updatedPokemon;
}

/**
 * Process all passive effects for a Pokémon after taking damage
 * @param {Object} pokemon - The Pokémon to process
 * @param {Array} team - The full team
 * @param {number} pokemonIndex - Index in team
 * @returns {Object} - { pokemon: updated pokemon, messages: array of effect messages, consumed: was item consumed }
 */
export function processPostDamageEffects(pokemon, team, pokemonIndex) {
  const messages = [];
  let updatedPokemon = { ...pokemon };
  let itemConsumed = false;

  // Check HP threshold effects (berries)
  const hpResult = checkHPThresholdEffects(updatedPokemon);
  if (hpResult.message) {
    messages.push(hpResult.message);
    updatedPokemon = hpResult.pokemon;
    if (hpResult.consumed) {
      itemConsumed = true;
    }
  }

  return { pokemon: updatedPokemon, messages, consumed: itemConsumed };
}

/**
 * Get passive effect description for display
 * @param {string} itemId - The item ID
 * @returns {string} - Description of passive effect
 */
export function getPassiveEffectDescription(itemId) {
  const item = getItemById(itemId);
  if (!item) return null;

  const effect = item.effect;

  switch (effect.type) {
    case 'held_regen':
      return `Restores 1/16 HP each turn`;

    case 'held_choice':
      return `+50% ${effect.stat.replace('_', ' ')} but locks move`;

    case 'held_conditional':
      if (effect.trigger === 'hp_below_50%') {
        if (effect.action === 'heal') {
          return `Restores ${effect.value} HP when HP < 50%`;
        } else if (effect.action === 'heal_percent') {
          return `Restores ${effect.value}% HP when HP < 50%`;
        }
      } else if (effect.trigger === 'status_condition') {
        return `Cures status conditions`;
      }
      break;

    default:
      return null;
  }

  return null;
}

/**
 * Check if a Pokémon has an active passive effect
 * @param {Object} pokemon - The Pokémon to check
 * @returns {boolean} - Whether the Pokémon has a passive effect
 */
export function hasPassiveEffect(pokemon) {
  if (!pokemon.heldItem) return false;

  const item = getItemById(pokemon.heldItem);
  if (!item) return false;

  const passiveTypes = ['held_regen', 'held_choice', 'held_conditional'];
  return passiveTypes.includes(item.effect.type);
}
