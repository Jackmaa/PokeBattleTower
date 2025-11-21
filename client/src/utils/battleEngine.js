// 📁 battleEngine.js
// Core battle engine for turn-based NvM combat

import { getTypeEffectiveness } from './typeChart';

/**
 * Combat participant wrapper
 * Wraps both player and enemy Pokemon with combat-specific data
 */
export function createCombatant(pokemon, isEnemy = false, index = 0) {
  return {
    id: `${isEnemy ? 'enemy' : 'player'}_${index}_${pokemon.id || Date.now()}`,
    pokemon,
    isEnemy,
    teamIndex: index,
    // Combat state
    currentHP: pokemon.stats.hp,
    maxHP: pokemon.stats.hp_max,
    // Stat stages (-6 to +6)
    statStages: {
      attack: 0,
      defense: 0,
      special_attack: 0,
      special_defense: 0,
      speed: 0,
      accuracy: 0,
      evasion: 0,
    },
    // Status effects
    status: null, // 'paralyzed', 'burned', 'poisoned', 'frozen', 'asleep'
    statusTurns: 0,
    // Volatile status (clears on switch)
    volatileStatus: [],
    // Targeting
    targetedBy: [], // IDs of enemies targeting this combatant
    currentTarget: null, // ID of current target
    // Turn tracking
    hasMoved: false,
    isProtected: false,
  };
}

/**
 * Calculate effective stat with stages
 * Stages: -6 to +6, each stage is 50% change
 */
export function getEffectiveStat(baseStat, stage) {
  const multipliers = {
    '-6': 2/8, '-5': 2/7, '-4': 2/6, '-3': 2/5, '-2': 2/4, '-1': 2/3,
    '0': 1,
    '1': 3/2, '2': 4/2, '3': 5/2, '4': 6/2, '5': 7/2, '6': 8/2,
  };
  const clampedStage = Math.max(-6, Math.min(6, stage));
  return Math.floor(baseStat * (multipliers[clampedStage.toString()] || 1));
}

/**
 * Get combatant's effective speed (with stages and status)
 */
export function getEffectiveSpeed(combatant) {
  const baseSpeed = combatant.pokemon.stats.speed;
  let speed = getEffectiveStat(baseSpeed, combatant.statStages.speed);

  // Paralysis halves speed
  if (combatant.status === 'paralyzed') {
    speed = Math.floor(speed * 0.5);
  }

  return speed;
}

/**
 * Calculate turn order for all combatants
 * Returns array sorted by effective speed (highest first)
 */
export function calculateTurnOrder(combatants, priorityMoves = {}) {
  // Filter out fainted Pokemon
  const activeCombatants = combatants.filter(c => c.currentHP > 0);

  // Sort by speed (with some randomness for ties)
  return [...activeCombatants].sort((a, b) => {
    // Check for priority moves
    const aPriority = priorityMoves[a.id] || 0;
    const bPriority = priorityMoves[b.id] || 0;

    if (aPriority !== bPriority) {
      return bPriority - aPriority; // Higher priority goes first
    }

    const aSpeed = getEffectiveSpeed(a);
    const bSpeed = getEffectiveSpeed(b);

    if (aSpeed !== bSpeed) {
      return bSpeed - aSpeed; // Higher speed goes first
    }

    // Tie breaker: favor player, then random
    if (a.isEnemy !== b.isEnemy) {
      return a.isEnemy ? 1 : -1; // Player goes first on tie
    }

    return Math.random() - 0.5; // Random for same team ties
  });
}

/**
 * Battle state manager
 */
export class BattleState {
  constructor(playerTeam, enemyTeam) {
    this.combatants = [];
    this.turnOrder = [];
    this.currentTurnIndex = 0;
    this.roundNumber = 1;
    this.battleLog = [];
    this.pendingMoves = {}; // { combatantId: { move, target } }
    this.isFinished = false;
    this.winner = null; // 'player' or 'enemy'

    // Initialize combatants
    playerTeam.forEach((pokemon, index) => {
      if (pokemon.stats.hp > 0) {
        this.combatants.push(createCombatant(pokemon, false, index));
      }
    });

    enemyTeam.forEach((pokemon, index) => {
      this.combatants.push(createCombatant(pokemon, true, index));
    });

    // Calculate initial turn order
    this.recalculateTurnOrder();
  }

  /**
   * Recalculate turn order (call when speed changes)
   */
  recalculateTurnOrder() {
    const priorityMoves = {};

    // Get priority from pending moves
    for (const [id, action] of Object.entries(this.pendingMoves)) {
      if (action.move?.priority) {
        priorityMoves[id] = action.move.priority;
      }
    }

    this.turnOrder = calculateTurnOrder(this.combatants, priorityMoves);

    // Ensure current turn index is valid
    if (this.currentTurnIndex >= this.turnOrder.length) {
      this.currentTurnIndex = 0;
      this.roundNumber++;
      this.startNewRound();
    }
  }

  /**
   * Start a new round
   */
  startNewRound() {
    // Reset per-round state
    for (const combatant of this.combatants) {
      combatant.hasMoved = false;
      combatant.isProtected = false;
    }

    // Clear pending moves
    this.pendingMoves = {};

    // Recalculate turn order for new round
    this.recalculateTurnOrder();
  }

  /**
   * Get current combatant whose turn it is
   */
  getCurrentCombatant() {
    if (this.turnOrder.length === 0) return null;
    return this.turnOrder[this.currentTurnIndex] || null;
  }

  /**
   * Get all player combatants
   */
  getPlayerCombatants() {
    return this.combatants.filter(c => !c.isEnemy && c.currentHP > 0);
  }

  /**
   * Get all enemy combatants
   */
  getEnemyCombatants() {
    return this.combatants.filter(c => c.isEnemy && c.currentHP > 0);
  }

  /**
   * Get combatant by ID
   */
  getCombatantById(id) {
    return this.combatants.find(c => c.id === id);
  }

  /**
   * Set a combatant's pending move
   */
  setPendingMove(combatantId, move, targetId) {
    this.pendingMoves[combatantId] = { move, targetId };

    // If move has priority, recalculate turn order
    if (move.priority) {
      this.recalculateTurnOrder();
    }

    // Update targeting display
    const combatant = this.getCombatantById(combatantId);
    if (combatant) {
      combatant.currentTarget = targetId;

      // Update targetedBy on target
      const target = this.getCombatantById(targetId);
      if (target && !target.targetedBy.includes(combatantId)) {
        target.targetedBy.push(combatantId);
      }
    }
  }

  /**
   * Advance to next turn
   */
  advanceTurn() {
    const current = this.getCurrentCombatant();
    if (current) {
      current.hasMoved = true;
    }

    this.currentTurnIndex++;

    // Check if round is over
    if (this.currentTurnIndex >= this.turnOrder.length) {
      this.currentTurnIndex = 0;
      this.roundNumber++;
      this.startNewRound();
    }

    // Skip fainted Pokemon
    while (this.currentTurnIndex < this.turnOrder.length) {
      const next = this.turnOrder[this.currentTurnIndex];
      if (next && next.currentHP > 0) {
        break;
      }
      this.currentTurnIndex++;
    }

    // Check win/lose conditions
    this.checkBattleEnd();
  }

  /**
   * Apply damage to a combatant
   */
  applyDamage(targetId, damage, source = null) {
    const target = this.getCombatantById(targetId);
    if (!target) return { damage: 0, fainted: false };

    const actualDamage = Math.min(damage, target.currentHP);
    target.currentHP = Math.max(0, target.currentHP - actualDamage);

    const fainted = target.currentHP <= 0;

    if (fainted) {
      // Remove from turn order
      this.turnOrder = this.turnOrder.filter(c => c.id !== targetId);
      // Clear targeting
      this.combatants.forEach(c => {
        c.targetedBy = c.targetedBy.filter(id => id !== targetId);
        if (c.currentTarget === targetId) {
          c.currentTarget = null;
        }
      });
    }

    return { damage: actualDamage, fainted };
  }

  /**
   * Apply healing to a combatant
   */
  applyHealing(targetId, amount) {
    const target = this.getCombatantById(targetId);
    if (!target || target.currentHP <= 0) return 0;

    const actualHeal = Math.min(amount, target.maxHP - target.currentHP);
    target.currentHP += actualHeal;

    return actualHeal;
  }

  /**
   * Apply stat stage change
   */
  applyStatChange(targetId, stat, stages) {
    const target = this.getCombatantById(targetId);
    if (!target) return { newStage: 0, changed: false };

    const oldStage = target.statStages[stat] || 0;
    const newStage = Math.max(-6, Math.min(6, oldStage + stages));
    target.statStages[stat] = newStage;

    // If speed changed, recalculate turn order immediately
    if (stat === 'speed') {
      this.recalculateTurnOrder();
    }

    return {
      newStage,
      changed: newStage !== oldStage,
      capped: (stages > 0 && oldStage === 6) || (stages < 0 && oldStage === -6),
    };
  }

  /**
   * Apply status effect
   */
  applyStatus(targetId, status) {
    const target = this.getCombatantById(targetId);
    if (!target || target.status) return false; // Can't stack status

    target.status = status;
    target.statusTurns = 0;

    // Paralysis affects speed immediately
    if (status === 'paralyzed') {
      this.recalculateTurnOrder();
    }

    return true;
  }

  /**
   * Check if battle has ended
   */
  checkBattleEnd() {
    const playerAlive = this.combatants.some(c => !c.isEnemy && c.currentHP > 0);
    const enemyAlive = this.combatants.some(c => c.isEnemy && c.currentHP > 0);

    if (!playerAlive) {
      this.isFinished = true;
      this.winner = 'enemy';
    } else if (!enemyAlive) {
      this.isFinished = true;
      this.winner = 'player';
    }

    return this.isFinished;
  }

  /**
   * Get battle summary for display
   */
  getSummary() {
    return {
      turnOrder: this.turnOrder.map(c => ({
        id: c.id,
        name: c.pokemon.name,
        sprite: c.pokemon.sprite,
        hp: c.currentHP,
        maxHp: c.maxHP,
        isEnemy: c.isEnemy,
        isCurrent: c === this.getCurrentCombatant(),
        targetedBy: c.targetedBy,
        currentTarget: c.currentTarget,
        status: c.status,
      })),
      currentTurnIndex: this.currentTurnIndex,
      roundNumber: this.roundNumber,
      isFinished: this.isFinished,
      winner: this.winner,
    };
  }
}

/**
 * Calculate damage for an attack
 */

export function calculateBattleDamage(attacker, defender, move, relicBonuses = null) {

  const isPlayerAttacking = !attacker.isEnemy;

  // Get base stats
  const movePower = move.power || 40;
  const isPhysical = move.category === 'physical';

  // Get attack stat (with stages)
  let attackStat = isPhysical
    ? attacker.pokemon.stats.attack
    : attacker.pokemon.stats.special_attack;
  attackStat = getEffectiveStat(attackStat, attacker.statStages[isPhysical ? 'attack' : 'special_attack']);

  // Get defense stat (with stages)
  let defenseStat = isPhysical
    ? defender.pokemon.stats.defense
    : defender.pokemon.stats.special_defense;
  defenseStat = getEffectiveStat(defenseStat, defender.statStages[isPhysical ? 'defense' : 'special_defense']);

  // Apply relic bonuses (player only)
  if (isPlayerAttacking && relicBonuses) {
    attackStat += relicBonuses.attack_bonus + relicBonuses.all_stats;
  }

  // Apply burn penalty for physical attacks
  if (attacker.status === 'burned' && isPhysical) {
    attackStat = Math.floor(attackStat * 0.5);
  }

  // Base damage formula
  const base = Math.floor((movePower * attackStat / defenseStat) * (Math.random() * 0.15 + 0.85));
  let damage = Math.max(Math.floor(base / 5), 1);

  // Type effectiveness
  
  const defenderTypes = defender.pokemon.types || [];
  let typeMultiplier = getTypeEffectiveness(move.type, defenderTypes);

  // Super effective bonus from relics
  if (isPlayerAttacking && relicBonuses && typeMultiplier > 1) {
    typeMultiplier += relicBonuses.super_effective || 0;
  }

  damage = Math.floor(damage * typeMultiplier);

  // Critical hit calculation
  let critChance = 0.0625; // 1/16 base
  if (isPlayerAttacking && relicBonuses) {
    critChance += relicBonuses.crit_chance || 0;
  }

  const isCritical = Math.random() < critChance;
  let critMultiplier = 1.5;
  if (isPlayerAttacking && relicBonuses) {
    critMultiplier += relicBonuses.crit_damage || 0;
  }

  if (isCritical) {
    damage = Math.floor(damage * critMultiplier);
  }

  // Damage resistance from relics (when defending)
  if (!isPlayerAttacking && relicBonuses && relicBonuses.resist_damage > 0) {
    damage = Math.floor(damage * (1 - relicBonuses.resist_damage));
  }

  return {
    damage,
    isCritical,
    typeMultiplier,
    moveName: move.name,
    moveType: move.type,
  };
}

export default {
  BattleState,
  createCombatant,
  calculateTurnOrder,
  calculateBattleDamage,
  getEffectiveStat,
  getEffectiveSpeed,
};
