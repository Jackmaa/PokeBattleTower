// 📁 statusEffects.js
// Status effect handling for NvM combat with STACKABLE effects
// NOW SUPPORTS MULTIPLE DIFFERENT STATUS EFFECTS AT ONCE!

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
 * Stackable status effects - these can be stacked up to MAX_STACKS
 */
export const STACKABLE_STATUSES = ['burned', 'poisoned', 'frozen'];
export const MAX_STATUS_STACKS = 5;

/**
 * Helper to get all active statuses from a combatant
 * Supports both old format (single status string) and new format (statuses object)
 */
export function getActiveStatuses(combatant) {
  // New format: statuses object { burned: 2, poisoned: 1, ... }
  if (combatant.statuses && typeof combatant.statuses === 'object') {
    return Object.entries(combatant.statuses)
      .filter(([_, stacks]) => stacks > 0)
      .map(([status, stacks]) => ({ status, stacks }));
  }

  // Old format: single status string with statusStacks
  if (combatant.status) {
    return [{ status: combatant.status, stacks: combatant.statusStacks || 1 }];
  }

  return [];
}

/**
 * Helper to check if combatant has a specific status
 */
export function hasStatus(combatant, statusType) {
  if (combatant.statuses && typeof combatant.statuses === 'object') {
    return (combatant.statuses[statusType] || 0) > 0;
  }
  return combatant.status === statusType;
}

/**
 * Helper to get stacks of a specific status
 */
export function getStatusStacks(combatant, statusType) {
  if (combatant.statuses && typeof combatant.statuses === 'object') {
    return combatant.statuses[statusType] || 0;
  }
  return combatant.status === statusType ? (combatant.statusStacks || 1) : 0;
}

/**
 * Initialize statuses object on combatant if needed
 */
export function initializeStatuses(combatant) {
  if (!combatant.statuses) {
    combatant.statuses = {};
    // Migrate old format if present
    if (combatant.status) {
      combatant.statuses[combatant.status] = combatant.statusStacks || 1;
    }
  }
  if (!combatant.statusTurnsMap) {
    combatant.statusTurnsMap = {};
  }
  return combatant;
}

/**
 * Status effect display info
 */
export const STATUS_INFO = {
  paralyzed: {
    name: 'Paralyzed',
    icon: '⚡',
    color: '#fbbf24', // yellow
    description: 'Speed halved. May be unable to move.',
    stackable: false,
  },
  burned: {
    name: 'Burned',
    icon: '🔥',
    color: '#ef4444', // red
    description: 'Takes damage each turn. Physical attack reduced. Stackable up to 5x!',
    stackable: true,
  },
  poisoned: {
    name: 'Poisoned',
    icon: '☠️',
    color: '#a855f7', // purple
    description: 'Takes damage each turn. Stackable up to 5x!',
    stackable: true,
  },
  badly_poisoned: {
    name: 'Badly Poisoned',
    icon: '💀',
    color: '#7c3aed', // darker purple
    description: 'Takes increasing damage each turn.',
    stackable: false,
  },
  frozen: {
    name: 'Frozen',
    icon: '❄️',
    color: '#06b6d4', // cyan
    description: 'Speed reduced. Higher stacks = slower. At 5 stacks: frozen solid!',
    stackable: true,
  },
  asleep: {
    name: 'Asleep',
    icon: '💤',
    color: '#6366f1', // indigo
    description: 'Cannot move. Wakes up after 1-3 turns.',
    stackable: false,
  },
};

/**
 * Check if a combatant can move (status check at start of turn)
 * Returns { canMove: boolean, message: string, messages: string[] }
 * Now supports MULTIPLE status effects!
 */
export function checkStatusBeforeMove(combatant) {
  initializeStatuses(combatant);

  const activeStatuses = getActiveStatuses(combatant);
  if (activeStatuses.length === 0) {
    return { canMove: true, message: null, messages: [] };
  }

  const messages = [];
  let canMove = true;

  // Check each active status
  for (const { status, stacks } of activeStatuses) {
    switch (status) {
      case STATUS_EFFECTS.PARALYZED:
        // 25% chance to be fully paralyzed
        if (Math.random() < 0.25) {
          canMove = false;
          messages.push(`${combatant.pokemon.name} is paralyzed and can't move!`);
        }
        break;

      case STATUS_EFFECTS.FROZEN:
        // Stackable freeze: at 5 stacks, completely frozen
        if (stacks >= MAX_STATUS_STACKS) {
          canMove = false;
          if (Math.random() < 0.20) {
            combatant.statuses[status] = stacks - 1;
            messages.push(`${combatant.pokemon.name} is thawing slightly... (${stacks - 1} stacks)`);
          } else {
            messages.push(`${combatant.pokemon.name} is frozen solid!`);
          }
        } else {
          // Partial freeze: chance to skip based on stacks
          const skipChance = stacks * 0.15;
          if (Math.random() < skipChance) {
            canMove = false;
            messages.push(`${combatant.pokemon.name} is hindered by the cold! (${stacks} stacks)`);
          } else if (Math.random() < 0.25) {
            // Chance to reduce stacks when moving
            combatant.statuses[status] = Math.max(0, stacks - 1);
            if (combatant.statuses[status] === 0) {
              delete combatant.statuses[status];
              messages.push(`${combatant.pokemon.name} shook off the freeze!`);
            }
          }
        }
        break;

      case STATUS_EFFECTS.ASLEEP:
        // Sleep lasts 1-3 turns
        combatant.statusTurnsMap[status] = (combatant.statusTurnsMap[status] || 0) + 1;
        if (combatant.statusTurnsMap[status] >= 3 || (combatant.statusTurnsMap[status] >= 1 && Math.random() < 0.33)) {
          delete combatant.statuses[status];
          delete combatant.statusTurnsMap[status];
          messages.push(`${combatant.pokemon.name} woke up!`);
        } else {
          canMove = false;
          messages.push(`${combatant.pokemon.name} is fast asleep!`);
        }
        break;
    }
  }

  // Sync legacy status field for backwards compatibility
  const remaining = getActiveStatuses(combatant);
  combatant.status = remaining.length > 0 ? remaining[0].status : null;
  combatant.statusStacks = remaining.length > 0 ? remaining[0].stacks : 0;

  return {
    canMove,
    message: messages[0] || null,
    messages,
  };
}

/**
 * Apply end-of-turn status damage
 * Returns { damage: number, message: string, messages: string[], damages: object }
 * Now supports MULTIPLE status effects!
 */
export function applyEndOfTurnStatus(combatant) {
  initializeStatuses(combatant);

  const activeStatuses = getActiveStatuses(combatant);
  if (activeStatuses.length === 0) {
    return { damage: 0, message: null, messages: [], damages: {} };
  }

  let totalDamage = 0;
  const messages = [];
  const damages = {};

  for (const { status, stacks } of activeStatuses) {
    let damage = 0;
    let message = null;

    switch (status) {
      case STATUS_EFFECTS.BURNED:
        // Base: 1/16 max HP damage, MULTIPLIED by stacks
        damage = Math.max(1, Math.floor(combatant.maxHP * stacks / 16));
        message = stacks > 1
          ? `${combatant.pokemon.name} is scorched by intense flames! (${stacks}x burn)`
          : `${combatant.pokemon.name} is hurt by its burn!`;
        break;

      case STATUS_EFFECTS.POISONED:
        // Base: 1/8 max HP damage, MULTIPLIED by stacks
        damage = Math.max(1, Math.floor(combatant.maxHP * stacks / 8));
        message = stacks > 1
          ? `${combatant.pokemon.name} is ravaged by deadly toxins! (${stacks}x poison)`
          : `${combatant.pokemon.name} is hurt by poison!`;
        break;

      case STATUS_EFFECTS.BADLY_POISONED:
        // Escalating damage
        combatant.statusTurnsMap[status] = (combatant.statusTurnsMap[status] || 0) + 1;
        damage = Math.max(1, Math.floor(combatant.maxHP * combatant.statusTurnsMap[status] / 16));
        message = `${combatant.pokemon.name} is badly hurt by poison!`;
        break;

      case STATUS_EFFECTS.FROZEN:
        // Frozen deals chip damage at high stacks
        if (stacks >= 3) {
          damage = Math.max(1, Math.floor(combatant.maxHP * (stacks - 2) / 32));
          message = `${combatant.pokemon.name} is suffering from frostbite! (${stacks} stacks)`;
        }
        break;
    }

    if (damage > 0) {
      totalDamage += damage;
      damages[status] = damage;
    }
    if (message) {
      messages.push(message);
    }
  }

  return {
    damage: totalDamage,
    message: messages[0] || null,
    messages,
    damages,
  };
}

/**
 * Check if a status can be applied (type immunities, etc.)
 * Now allows MULTIPLE different statuses!
 */
export function canApplyStatus(target, status) {
  initializeStatuses(target);

  const types = target.pokemon.types || [];
  const isStackable = STACKABLE_STATUSES.includes(status);
  const currentStacks = target.statuses[status] || 0;

  // For stackable statuses, check if we can add more stacks
  if (isStackable && currentStacks > 0) {
    if (currentStacks >= MAX_STATUS_STACKS) {
      return { canApply: false, reason: 'Status already at maximum stacks', atMaxStacks: true };
    }
    // Can add more stacks
    return { canApply: true, isStacking: true, currentStacks };
  }

  // For non-stackable statuses, check if already has THIS specific status
  if (!isStackable && currentStacks > 0) {
    return { canApply: false, reason: `Already has ${status}` };
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
 * Supports STACKING and MULTIPLE different statuses!
 */
export function applyStatus(combatant, status) {
  initializeStatuses(combatant);

  const checkResult = canApplyStatus(combatant, status);

  if (!checkResult.canApply) {
    return {
      applied: false,
      message: checkResult.reason,
      atMaxStacks: checkResult.atMaxStacks || false,
    };
  }

  const info = STATUS_INFO[status];
  const isStackable = STACKABLE_STATUSES.includes(status);

  // If stacking an existing status
  if (checkResult.isStacking) {
    const newStacks = (combatant.statuses[status] || 1) + 1;
    combatant.statuses[status] = newStacks;

    // Sync legacy fields
    combatant.status = status;
    combatant.statusStacks = newStacks;

    return {
      applied: true,
      stacked: true,
      newStacks,
      message: `${combatant.pokemon.name}'s ${info.name.toLowerCase()} intensifies! (${newStacks} stacks)`,
    };
  }

  // Applying fresh status
  combatant.statuses[status] = isStackable ? 1 : 1;
  combatant.statusTurnsMap[status] = 0;

  // Sync legacy fields for backwards compatibility
  const activeStatuses = getActiveStatuses(combatant);
  combatant.status = activeStatuses[0]?.status || status;
  combatant.statusStacks = activeStatuses[0]?.stacks || 1;
  combatant.statusTurns = 0;

  // Count total active statuses for message
  const totalStatuses = activeStatuses.length;

  return {
    applied: true,
    stacked: false,
    newStacks: isStackable ? 1 : undefined,
    totalStatuses,
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
 * Now accounts for stacks on burn and freeze!
 */
export function getStatusStatModifier(status, stat, stacks = 1) {
  switch (status) {
    case STATUS_EFFECTS.PARALYZED:
      if (stat === 'speed') return 0.5; // Speed halved
      break;

    case STATUS_EFFECTS.BURNED:
      if (stat === 'attack') {
        // Each stack reduces attack further: 1=0.85, 2=0.70, 3=0.55, 4=0.40, 5=0.25
        return Math.max(0.25, 1 - (stacks * 0.15));
      }
      break;

    case STATUS_EFFECTS.FROZEN:
      if (stat === 'speed') {
        // Each stack reduces speed: 1=0.9, 2=0.8, 3=0.7, 4=0.6, 5=0.5
        return Math.max(0.5, 1 - (stacks * 0.1));
      }
      break;
  }

  return 1.0;
}

export default {
  STATUS_EFFECTS,
  STATUS_INFO,
  STACKABLE_STATUSES,
  MAX_STATUS_STACKS,
  getActiveStatuses,
  hasStatus,
  getStatusStacks,
  initializeStatuses,
  checkStatusBeforeMove,
  applyEndOfTurnStatus,
  canApplyStatus,
  applyStatus,
  checkMoveThawsTarget,
  checkMoveWakesTarget,
  getStatusStatModifier,
};
