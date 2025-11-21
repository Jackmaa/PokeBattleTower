// 📁 statusEffects.js
// Status effect handling for NvM combat

/**
 * Status effect definitions
 */
export const STATUS_EFFECTS = {
  PARALYZED: 'paralyzed',
  BURNED: 'burned',
  POISONED: 'poisoned',
  BADLY_POISONED: 'badly_poisoned',
  FROZEN: 'frozen',
  ASLEEP: 'asleep',
};

/**
 * Status effect display info
 */
export const STATUS_INFO = {
  paralyzed: {
    name: 'Paralyzed',
    icon: '⚡',
    color: '#fbbf24', // yellow
    description: 'Speed halved. May be unable to move.',
  },
  burned: {
    name: 'Burned',
    icon: '🔥',
    color: '#ef4444', // red
    description: 'Takes damage each turn. Physical attack halved.',
  },
  poisoned: {
    name: 'Poisoned',
    icon: '☠️',
    color: '#a855f7', // purple
    description: 'Takes damage each turn.',
  },
  badly_poisoned: {
    name: 'Badly Poisoned',
    icon: '💀',
    color: '#7c3aed', // darker purple
    description: 'Takes increasing damage each turn.',
  },
  frozen: {
    name: 'Frozen',
    icon: '❄️',
    color: '#06b6d4', // cyan
    description: 'Cannot move. May thaw out.',
  },
  asleep: {
    name: 'Asleep',
    icon: '💤',
    color: '#6366f1', // indigo
    description: 'Cannot move. Wakes up after 1-3 turns.',
  },
};

/**
 * Check if a combatant can move (status check at start of turn)
 * Returns { canMove: boolean, message: string }
 */
export function checkStatusBeforeMove(combatant) {
  const status = combatant.status;

  if (!status) {
    return { canMove: true, message: null };
  }

  switch (status) {
    case STATUS_EFFECTS.PARALYZED:
      // 25% chance to be fully paralyzed
      if (Math.random() < 0.25) {
        return {
          canMove: false,
          message: `${combatant.pokemon.name} is paralyzed and can't move!`,
        };
      }
      return { canMove: true, message: null };

    case STATUS_EFFECTS.FROZEN:
      // 20% chance to thaw each turn
      if (Math.random() < 0.20) {
        combatant.status = null;
        combatant.statusTurns = 0;
        return {
          canMove: true,
          message: `${combatant.pokemon.name} thawed out!`,
          statusCured: true,
        };
      }
      return {
        canMove: false,
        message: `${combatant.pokemon.name} is frozen solid!`,
      };

    case STATUS_EFFECTS.ASLEEP:
      // Sleep lasts 1-3 turns
      combatant.statusTurns = (combatant.statusTurns || 0) + 1;
      if (combatant.statusTurns >= 3 || (combatant.statusTurns >= 1 && Math.random() < 0.33)) {
        combatant.status = null;
        combatant.statusTurns = 0;
        return {
          canMove: true,
          message: `${combatant.pokemon.name} woke up!`,
          statusCured: true,
        };
      }
      return {
        canMove: false,
        message: `${combatant.pokemon.name} is fast asleep!`,
      };

    default:
      return { canMove: true, message: null };
  }
}

/**
 * Apply end-of-turn status damage
 * Returns { damage: number, message: string }
 */
export function applyEndOfTurnStatus(combatant) {
  const status = combatant.status;

  if (!status) {
    return { damage: 0, message: null };
  }

  switch (status) {
    case STATUS_EFFECTS.BURNED:
      // 1/16 max HP damage
      const burnDamage = Math.max(1, Math.floor(combatant.maxHP / 16));
      return {
        damage: burnDamage,
        message: `${combatant.pokemon.name} is hurt by its burn!`,
      };

    case STATUS_EFFECTS.POISONED:
      // 1/8 max HP damage
      const poisonDamage = Math.max(1, Math.floor(combatant.maxHP / 8));
      return {
        damage: poisonDamage,
        message: `${combatant.pokemon.name} is hurt by poison!`,
      };

    case STATUS_EFFECTS.BADLY_POISONED:
      // Escalating damage: 1/16, 2/16, 3/16, etc.
      combatant.statusTurns = (combatant.statusTurns || 0) + 1;
      const badPoisonDamage = Math.max(1, Math.floor(combatant.maxHP * combatant.statusTurns / 16));
      return {
        damage: badPoisonDamage,
        message: `${combatant.pokemon.name} is badly hurt by poison!`,
      };

    default:
      return { damage: 0, message: null };
  }
}

/**
 * Check if a status can be applied (type immunities, etc.)
 */
export function canApplyStatus(target, status) {
  const types = target.pokemon.types || [];

  // Already has a status
  if (target.status) {
    return { canApply: false, reason: 'Already has a status condition' };
  }

  // Type immunities
  switch (status) {
    case STATUS_EFFECTS.PARALYZED:
      if (types.includes('electric')) {
        return { canApply: false, reason: 'Electric types cannot be paralyzed' };
      }
      break;

    case STATUS_EFFECTS.BURNED:
      if (types.includes('fire')) {
        return { canApply: false, reason: 'Fire types cannot be burned' };
      }
      break;

    case STATUS_EFFECTS.POISONED:
    case STATUS_EFFECTS.BADLY_POISONED:
      if (types.includes('poison') || types.includes('steel')) {
        return { canApply: false, reason: 'Poison/Steel types cannot be poisoned' };
      }
      break;

    case STATUS_EFFECTS.FROZEN:
      if (types.includes('ice')) {
        return { canApply: false, reason: 'Ice types cannot be frozen' };
      }
      break;
  }

  return { canApply: true };
}

/**
 * Apply a status effect to a combatant
 */
export function applyStatus(combatant, status) {
  const checkResult = canApplyStatus(combatant, status);

  if (!checkResult.canApply) {
    return {
      applied: false,
      message: checkResult.reason,
    };
  }

  combatant.status = status;
  combatant.statusTurns = 0;

  const info = STATUS_INFO[status];
  return {
    applied: true,
    message: `${combatant.pokemon.name} is now ${info.name.toLowerCase()}!`,
  };
}

/**
 * Check if a move should thaw a frozen target
 */
export function checkMoveThawsTarget(move, target) {
  if (target.status !== STATUS_EFFECTS.FROZEN) {
    return false;
  }

  // Fire moves thaw the target
  if (move.type === 'fire') {
    target.status = null;
    target.statusTurns = 0;
    return true;
  }

  return false;
}

/**
 * Check if a move should wake up a sleeping target
 */
export function checkMoveWakesTarget(move, target) {
  if (target.status !== STATUS_EFFECTS.ASLEEP) {
    return false;
  }

  // Any damaging move wakes the target (except certain sleep moves)
  if (move.power > 0) {
    target.status = null;
    target.statusTurns = 0;
    return true;
  }

  return false;
}

/**
 * Get stat modifier from status
 */
export function getStatusStatModifier(status, stat) {
  switch (status) {
    case STATUS_EFFECTS.PARALYZED:
      if (stat === 'speed') return 0.5; // Speed halved
      break;

    case STATUS_EFFECTS.BURNED:
      if (stat === 'attack') return 0.5; // Physical attack halved
      break;
  }

  return 1.0;
}

export default {
  STATUS_EFFECTS,
  STATUS_INFO,
  checkStatusBeforeMove,
  applyEndOfTurnStatus,
  canApplyStatus,
  applyStatus,
  checkMoveThawsTarget,
  checkMoveWakesTarget,
  getStatusStatModifier,
};
