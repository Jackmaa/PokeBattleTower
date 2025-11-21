// 📁 enemyAI.js
// AI module for enemy combat decisions

import { getTypeEffectiveness } from './typeChart';
import { TARGET_TYPES } from './moves';

/**
 * AI difficulty levels
 */
export const AI_DIFFICULTY = {
  RANDOM: 'random',      // Picks moves randomly
  BASIC: 'basic',        // Prefers super effective moves
  SMART: 'smart',        // Considers type effectiveness and targeting
  ELITE: 'elite',        // Considers stat buffs, debuffs, and low HP targets
  BOSS: 'boss',          // Optimal play with prediction
};

/**
 * Calculate expected damage of a move against a target
 */
function calculateExpectedDamage(attacker, target, move) {
  if (!move.power || move.power === 0) return 0;

  const isPhysical = move.category === 'physical';
  const attackStat = isPhysical
    ? attacker.pokemon.stats.attack
    : attacker.pokemon.stats.special_attack;
  const defenseStat = isPhysical
    ? target.pokemon.stats.defense
    : target.pokemon.stats.special_defense;

  // Type effectiveness
  const targetTypes = target.pokemon.types || [];
  const typeMultiplier = getTypeEffectiveness(move.type, targetTypes);

  // Base damage estimate
  const baseDamage = Math.floor((move.power * attackStat / defenseStat) / 5);
  const expectedDamage = Math.floor(baseDamage * typeMultiplier);

  return expectedDamage;
}

/**
 * Score a move based on its effects
 */
function scoreMoveEffects(move, attacker, target, battleState) {
  let score = 0;

  if (!move.effect) return score;

  const effect = move.effect;

  // Status effects
  if (effect.type === 'status') {
    // Don't try to apply status to already-afflicted targets
    if (target.status) {
      score -= 50;
    } else {
      // Score based on status type
      switch (effect.status) {
        case 'paralyzed':
          score += 30; // Halves speed
          break;
        case 'burned':
          score += 25; // Damage over time + physical attack reduction
          break;
        case 'poisoned':
          score += 20; // Damage over time
          break;
        case 'badly_poisoned':
          score += 35; // Escalating damage
          break;
        case 'frozen':
          score += 40; // Disables target
          break;
        case 'asleep':
          score += 35; // Disables target
          break;
      }

      // Adjust by chance to apply
      const chance = effect.chance || 100;
      score = Math.floor(score * chance / 100);
    }
  }

  // Stat changes
  if (effect.type === 'stat_change') {
    const stages = effect.stages || 0;

    if (effect.self) {
      // Self stat changes (can be positive or negative)
      if (stages > 0) {
        score += stages * 15; // Buffs are good
      } else {
        score += stages * 10; // Debuff self is bad, but may be worth it for power
      }
    } else {
      // Target stat changes (debuffs)
      if (stages < 0) {
        score += Math.abs(stages) * 20;

        // Extra value for speed debuffs (affects turn order)
        if (effect.stat === 'speed') {
          score += 15;
        }
      }
    }
  }

  // Healing
  if (effect.type === 'heal') {
    const missingHp = attacker.maxHP - attacker.currentHP;
    const missingPercent = missingHp / attacker.maxHP;

    // Healing is more valuable when low HP
    if (missingPercent > 0.5) {
      score += 50;
    } else if (missingPercent > 0.25) {
      score += 30;
    } else {
      score -= 20; // Don't heal when near full
    }
  }

  // Protect
  if (effect.type === 'protect') {
    // Protect is valuable when being targeted by multiple enemies
    const targetingMe = battleState.combatants.filter(
      c => !c.isEnemy && c.currentTarget === attacker.id
    ).length;

    score += targetingMe * 20;
  }

  return score;
}

/**
 * Get valid targets for a move
 */
export function getValidTargets(move, attacker, battleState) {
  const targetType = move.target || TARGET_TYPES.SINGLE_ENEMY;
  const isEnemy = attacker.isEnemy;

  const allies = battleState.combatants.filter(c => c.isEnemy === isEnemy && c.currentHP > 0);
  const enemies = battleState.combatants.filter(c => c.isEnemy !== isEnemy && c.currentHP > 0);

  switch (targetType) {
    case TARGET_TYPES.SINGLE_ENEMY:
      return enemies;

    case TARGET_TYPES.ALL_ENEMIES:
      return enemies.length > 0 ? [enemies[0]] : []; // Return one, affects all

    case TARGET_TYPES.SINGLE_ALLY:
      return allies.filter(a => a.id !== attacker.id);

    case TARGET_TYPES.ALL_ALLIES:
      return allies.length > 0 ? [allies[0]] : []; // Return one, affects all

    case TARGET_TYPES.SELF:
      return [attacker];

    case TARGET_TYPES.RANDOM_ENEMY:
      return enemies.length > 0 ? [enemies[Math.floor(Math.random() * enemies.length)]] : [];

    case TARGET_TYPES.ALL_OTHER:
      return [...allies.filter(a => a.id !== attacker.id), ...enemies];

    default:
      return enemies;
  }
}

/**
 * Score a target based on various factors
 */
function scoreTarget(target, attacker, move, aiDifficulty) {
  let score = 0;

  // Type effectiveness
  const targetTypes = target.pokemon.types || [];
  const typeMultiplier = getTypeEffectiveness(move.type, targetTypes);

  if (typeMultiplier >= 2) score += 40;  // Super effective
  else if (typeMultiplier > 1) score += 20;
  else if (typeMultiplier === 0) score -= 100; // Immune
  else if (typeMultiplier < 1) score -= 30; // Not very effective

  // HP-based targeting (finish off low HP targets)
  const hpPercent = target.currentHP / target.maxHP;
  if (hpPercent < 0.25) score += 30; // Finish them!
  else if (hpPercent < 0.5) score += 15;

  // Can we KO?
  const expectedDamage = calculateExpectedDamage(attacker, target, move);
  if (expectedDamage >= target.currentHP) {
    score += 50; // Prioritize KOs
  }

  // Elite+ AI considers threat level
  if (aiDifficulty === AI_DIFFICULTY.ELITE || aiDifficulty === AI_DIFFICULTY.BOSS) {
    // Target high damage dealers
    const attackStat = Math.max(
      target.pokemon.stats.attack || 0,
      target.pokemon.stats.special_attack || 0
    );
    score += Math.floor(attackStat / 10);

    // Target Pokemon with stat boosts
    if (target.statStages) {
      const totalBoosts = Object.values(target.statStages).reduce((sum, s) => sum + Math.max(0, s), 0);
      score += totalBoosts * 10;
    }
  }

  // Don't waste strong moves on weak targets (boss AI)
  if (aiDifficulty === AI_DIFFICULTY.BOSS && move.power > 80) {
    if (hpPercent < 0.2 && expectedDamage > target.currentHP * 2) {
      score -= 20; // Overkill
    }
  }

  return score;
}

/**
 * Score a move-target combination
 */
function scoreMoveTargetCombo(attacker, move, target, battleState, aiDifficulty) {
  let score = 0;

  // Base damage score
  const expectedDamage = calculateExpectedDamage(attacker, target, move);
  score += expectedDamage;

  // Move power preference
  score += (move.power || 0) / 2;

  // Accuracy penalty
  if (move.accuracy < 100) {
    score = Math.floor(score * move.accuracy / 100);
  }

  // Effect scoring (for smart+ AI)
  if (aiDifficulty !== AI_DIFFICULTY.RANDOM && aiDifficulty !== AI_DIFFICULTY.BASIC) {
    score += scoreMoveEffects(move, attacker, target, battleState);
  }

  // Target scoring
  score += scoreTarget(target, attacker, move, aiDifficulty);

  // Priority bonus (for avoiding being KO'd)
  if (move.priority > 0 && attacker.currentHP / attacker.maxHP < 0.3) {
    score += 25;
  }

  return score;
}

/**
 * Main AI decision function
 * Returns { move, targetId }
 */
export function getAIDecision(attacker, battleState, aiDifficulty = AI_DIFFICULTY.BASIC) {
  const moves = attacker.pokemon.moves || [];

  // Filter moves with PP
  const availableMoves = moves.filter(m => (m.pp || m.maxPP) > 0);

  if (availableMoves.length === 0) {
    // Struggle (no moves left)
    return {
      move: {
        id: 'struggle',
        name: 'Struggle',
        power: 50,
        type: 'normal',
        category: 'physical',
        target: TARGET_TYPES.SINGLE_ENEMY,
        priority: 0,
      },
      targetId: battleState.getPlayerCombatants()[0]?.id,
    };
  }

  // Random AI - just pick randomly
  if (aiDifficulty === AI_DIFFICULTY.RANDOM) {
    const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    const validTargets = getValidTargets(randomMove, attacker, battleState);
    const randomTarget = validTargets[Math.floor(Math.random() * validTargets.length)];

    return {
      move: randomMove,
      targetId: randomTarget?.id,
    };
  }

  // Score all move-target combinations
  let bestScore = -Infinity;
  let bestMove = availableMoves[0];
  let bestTarget = null;

  for (const move of availableMoves) {
    const validTargets = getValidTargets(move, attacker, battleState);

    for (const target of validTargets) {
      const score = scoreMoveTargetCombo(attacker, move, target, battleState, aiDifficulty);

      // Add some randomness to prevent perfect play
      const randomFactor = aiDifficulty === AI_DIFFICULTY.BOSS
        ? 0.95 + Math.random() * 0.1  // 95-105% for boss
        : aiDifficulty === AI_DIFFICULTY.ELITE
          ? 0.9 + Math.random() * 0.2   // 90-110% for elite
          : 0.8 + Math.random() * 0.4;  // 80-120% for basic/smart

      const finalScore = score * randomFactor;

      if (finalScore > bestScore) {
        bestScore = finalScore;
        bestMove = move;
        bestTarget = target;
      }
    }
  }

  return {
    move: bestMove,
    targetId: bestTarget?.id,
  };
}

/**
 * Get AI difficulty for enemy type
 */
export function getAIDifficultyForEnemy(enemy, floor) {
  // Bosses use boss AI
  if (enemy.isBoss) {
    return AI_DIFFICULTY.BOSS;
  }

  // Elite enemies use elite AI
  if (enemy.isElite) {
    return AI_DIFFICULTY.ELITE;
  }

  // Scale AI with floor
  if (floor >= 15) {
    return AI_DIFFICULTY.SMART;
  } else if (floor >= 8) {
    return AI_DIFFICULTY.BASIC;
  }

  // Early floors use random/basic
  return Math.random() < 0.5 ? AI_DIFFICULTY.RANDOM : AI_DIFFICULTY.BASIC;
}

/**
 * Get targeting info for display (which player Pokemon each enemy is targeting)
 */
export function getEnemyTargetingInfo(battleState, floor) {
  const enemies = battleState.getEnemyCombatants();
  const targeting = {};

  for (const enemy of enemies) {
    const aiDifficulty = getAIDifficultyForEnemy(enemy, floor);
    const decision = getAIDecision(enemy, battleState, aiDifficulty);

    targeting[enemy.id] = {
      targetId: decision.targetId,
      move: decision.move,
    };
  }

  return targeting;
}

export default {
  getAIDecision,
  getAIDifficultyForEnemy,
  getValidTargets,
  getEnemyTargetingInfo,
  AI_DIFFICULTY,
};
