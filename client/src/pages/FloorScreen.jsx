// 📁 FloorScreen.jsx
// NvM Turn-based combat system
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

import { teamState } from "../recoil/atoms/team";
import { floorState } from "../recoil/atoms/floor";
import { enemyTeamState } from "../recoil/atoms/enemy";
import { battleState } from "../recoil/atoms/battle";
import { rewardState } from "../recoil/atoms/reward";
import { activePokemonIndexState } from "../recoil/atoms/active";
import { highlightedStatState } from "../recoil/atoms/highlight";
import { battleLogState } from "../recoil/atoms/battleLog";
import { currentNodeState, towerMapState } from "../recoil/atoms/towerMap";
import { currencyState, inventoryState } from "../recoil/atoms/inventory";
import { relicsState } from "../recoil/atoms/relics";
import { getNodeById } from "../utils/towerMap";
import { getTypeEffectiveness } from "../utils/typeChart";
import { generateEnemyTeam } from "../utils/generateEnemyTeam";
import { getItemById } from "../utils/items";
import { calculateRelicBonuses, getRandomRelic, RELIC_TIERS } from "../utils/relics";
import { trackStat } from "../utils/metaProgression";
import { canEvolveWithStone, getEvolvedPokemon } from "../utils/evolutions";
import {
  processEndOfTurnEffects,
  processPostDamageEffects,
  checkStatusEffects,
  hasPassiveEffect
} from "../utils/passiveEffects";

// NvM Combat imports
import { BattleState, calculateBattleDamage, createCombatant } from "../utils/battleEngine";
import { getAIDecision, getAIDifficultyForEnemy, getValidTargets } from "../utils/enemyAI";
import { TARGET_TYPES } from "../utils/moves";
import {
  checkStatusBeforeMove,
  applyEndOfTurnStatus,
  applyStatus,
  STATUS_INFO
} from "../utils/statusEffects";
import { distributeXPToTeam, getLevelDisplayInfo } from "../utils/pokemonLeveling";

import PokemonCard from "../components/PokemonCard";
import PassiveEffectIndicator, { CompactPassiveIndicator } from "../components/PassiveEffectIndicator";
import { Button, Card } from "../components/ui";
import { motion, AnimatePresence } from "framer-motion";
import { FloorCounter, TowerMap } from "../components/tower";
import { AttackAnimation, DamagePopup, ScreenShake } from "../components/effects";
import { WeatherEffects, CameraController, AttackVFX, SpriteLighting } from "../components/vfx";
import { getWeatherForContext, WEATHER_TYPES } from "../utils/vfxManager";

import { getRandomPokemon } from "../utils/getRandomPokemon";
import { calculateCaptureLevel } from "../utils/rewards";
import RewardScreen from "../components/RewardScreen";
import GameOverScreen from "../components/GameOverScreen";
import XPGainScreen from "../components/XPGainScreen";
import AudioControls from "../components/AudioControls";
import MoveSelector from "../components/MoveSelector";
import TurnOrderDisplay from "../components/TurnOrderDisplay";
import TargetSelector from "../components/TargetSelector";
import InventoryPanel from "../components/InventoryPanel";
import RelicsPanel from "../components/RelicsPanel";
import MoveLearningModal from "../components/MoveLearningModal";
import { useAudio } from "../hooks/useAudio";
import { discoverRelic } from "../utils/metaProgression";

export default function FloorScreen({ onFloorComplete }) {
  const [newMon, setNewMon] = useState(null);
  const [releaseMode, setReleaseMode] = useState(false);
  const [team, setTeam] = useRecoilState(teamState);
  const [floor, setFloor] = useRecoilState(floorState);
  const currentNodeId = useRecoilValue(currentNodeState);
  const towerMap = useRecoilValue(towerMapState);
  const [enemyTeam, setEnemyTeam] = useRecoilState(enemyTeamState);
  const [battle, setBattle] = useRecoilState(battleState);
  const [activeIndex, setActiveIndex] = useRecoilState(activePokemonIndexState);
  const [reward, setRewardState] = useRecoilState(rewardState);
  const [highlight, setHighlighted] = useRecoilState(highlightedStatState);
  const [battleLog, setBattleLog] = useRecoilState(battleLogState);
  const [currency, setCurrency] = useRecoilState(currencyState);
  const [inventory, setInventory] = useRecoilState(inventoryState);
  const [relics, setRelics] = useRecoilState(relicsState);
  const [pendingReward, setPendingReward] = useState(null);
  const [rewardApplied, setRewardApplied] = useState(false);
  const [xpGainResult, setXpGainResult] = useState(null); // Store XP result to show XP screen before rewards
  const [teamBeforeXP, setTeamBeforeXP] = useState(null); // Store team state before XP for comparison
  const [pendingMoveLearn, setPendingMoveLearn] = useState(null); // { pokemon, newMove, pokemonIndex }
  const [moveLearningQueue, setMoveLearningQueue] = useState([]); // Queue of pending move learns
  const [isSwitching, setIsSwitching] = useState(false);
  const [isBattleInProgress, setIsBattleInProgress] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [hasMegaEvolved, setHasMegaEvolved] = useState(false);

  // NvM Battle State
  const [nvmBattle, setNvmBattle] = useState(null); // BattleState instance
  const [turnOrderDisplay, setTurnOrderDisplay] = useState([]); // For UI
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [roundNumber, setRoundNumber] = useState(1);
  const [awaitingPlayerMove, setAwaitingPlayerMove] = useState(false);
  const [currentCombatantId, setCurrentCombatantId] = useState(null);
  const [selectedMove, setSelectedMove] = useState(null);
  const [showTargetSelector, setShowTargetSelector] = useState(false);
  const [selectedTargetId, setSelectedTargetId] = useState(null);
  const [enemyTargeting, setEnemyTargeting] = useState({}); // { enemyId: targetPlayerId }
  const battleStateRef = useRef(null); // For accessing battle state in async functions
  const handleBattleEndRef = useRef(null); // Ref to avoid circular dependency
  const lastSetupNodeIdRef = useRef(null); // Track which node we've already setup to prevent double generation

  // Battle effects state
  const [currentAttack, setCurrentAttack] = useState(null);
  const [damageDisplay, setDamageDisplay] = useState(null);
  const [screenShakeTrigger, setScreenShakeTrigger] = useState({ active: false, damage: 0 });
  const [attackingPokemon, setAttackingPokemon] = useState(null);
  const [showMoveModal, setShowMoveModal] = useState(false);

  // VFX state
  const [currentWeather, setCurrentWeather] = useState('none');
  const [attackVFX, setAttackVFX] = useState({ active: false, type: 'normal', targetX: 0, targetY: 0 });
  const cameraRef = React.useRef(null);

  // Audio hook
  const {
    playAttackSound,
    playHitSound,
    playFaintSound,
    playSwitchSound,
    playVictorySound,
    playDefeatSound,
    playHealSound,
    playCatchSound,
    playLevelUpSound,
    playMenuSelect,
    playMusicForFloor,
  } = useAudio();

  // Synchronize floor with current node
  useEffect(() => {
    const currentNode = getNodeById(towerMap, currentNodeId);
    if (currentNode && currentNode.floor !== floor) {
      setFloor(currentNode.floor);
    }
  }, [currentNodeId, towerMap]);

  // Set weather based on floor and enemy type
  useEffect(() => {
    if (enemyTeam.length > 0) {
      const enemyType = enemyTeam[0]?.types?.[0];
      const weather = getWeatherForContext({ floor, enemyType });
      setCurrentWeather(weather.id);
    }
  }, [floor, enemyTeam]);

  useEffect(() => {
    const setupBattle = async () => {
      // Get the current node to determine battle type
      const currentNode = getNodeById(towerMap, currentNodeId);
      if (!currentNode) return; // Wait for valid node

      // Prevent double generation when towerMap changes but nodeId is the same
      if (lastSetupNodeIdRef.current === currentNodeId) {
        console.log(`[FloorScreen] Skipping setup - already setup for node ${currentNodeId}`);
        return;
      }
      lastSetupNodeIdRef.current = currentNodeId;

      const nodeType = currentNode.type || 'combat';
      const nodeFloor = currentNode.floor; // Use node's floor directly, not state

      // Generate enemies based on node type (scaling count with floor)
      const enemies = await generateEnemyTeam(null, nodeFloor, nodeType);
      setEnemyTeam(enemies);

      console.log(`[FloorScreen] Setup NvM battle for floor ${nodeFloor}, node type: ${nodeType}, enemies: ${enemies.length}`);

      // Initialize NvM Battle State
      if (team.length > 0 && enemies.length > 0) {
        const battleInstance = new BattleState(team, enemies);
        setNvmBattle(battleInstance);
        battleStateRef.current = battleInstance;

        // Update turn order display
        const summary = battleInstance.getSummary();
        setTurnOrderDisplay(summary.turnOrder);
        setCurrentTurnIndex(summary.currentTurnIndex);
        setRoundNumber(summary.roundNumber);

        // Calculate initial enemy targeting for display
        const targeting = {};
        for (const combatant of battleInstance.getEnemyCombatants()) {
          const aiDifficulty = getAIDifficultyForEnemy(combatant.pokemon, nodeFloor);
          const decision = getAIDecision(combatant, battleInstance, aiDifficulty);
          targeting[combatant.id] = decision.targetId;
        }
        setEnemyTargeting(targeting);

        // Check if first turn is player's
        const firstCombatant = battleInstance.getCurrentCombatant();
        if (firstCombatant && !firstCombatant.isEnemy) {
          setAwaitingPlayerMove(true);
          setCurrentCombatantId(firstCombatant.id);
        } else if (firstCombatant && firstCombatant.isEnemy) {
          // Add delay before enemy's first turn so player can see the battlefield
          setBattleLog(prev => [...prev, `⚡ ${firstCombatant.pokemon.name} is faster! Preparing to attack...`]);
          setTimeout(() => {
            setIsBattleInProgress(true);
            processEnemyTurn(battleInstance, firstCombatant);
          }, 1500); // 1.5 second delay to let player see the setup
        }
      }

      // Play dynamic music based on floor
      playMusicForFloor(nodeFloor);
    };
    setupBattle();

    // Reset mega evolution state at start of each battle
    setHasMegaEvolved(false);
    setBattleLog([]);
  }, [currentNodeId, towerMap, playMusicForFloor]);

  const runTurnBasedBattle = async (playerMove) => {
    const player = team[activeIndex];
    const enemy = enemyTeam[0];

    if (!player || !player.stats || !enemy || !enemy.stats) {
      console.warn("Invalid battle data.");
      return;
    }

    if (!playerMove || playerMove.pp <= 0) {
      console.warn("Invalid or out of PP move selected.");
      return;
    }

    let playerHP = player.stats.hp;
    let enemyHP = enemy.stats.hp;
    const startingPlayerHP = playerHP; // Track for perfect battle achievement
    const order =
      player.stats.speed >= enemy.stats.speed
        ? ["player", "enemy"]
        : ["enemy", "player"];

    setIsBattleInProgress(true);
    setBattleLog([]); // Reset battle log at the start

    // Choose a random move for the enemy
    const availableEnemyMoves = enemy.moves.filter(m => m.pp > 0);
    const enemyMove = availableEnemyMoves.length > 0
      ? availableEnemyMoves[Math.floor(Math.random() * availableEnemyMoves.length)]
      : enemy.moves[0]; // Fallback to first move even if out of PP

    const calculateDamage = (attacker, defender, move, isPlayer = false) => {
      // Get relic bonuses (only apply to player)
      const relicBonuses = isPlayer ? calculateRelicBonuses(relics) : null;

      // Use move power instead of fixed attack stat
      const movePower = move.power || 40;
      let attack = move.category === "special" ? attacker.stats.special_attack : attacker.stats.attack;
      let defense = move.category === "special" ? defender.stats.special_defense : defender.stats.defense;

      // Apply relic attack bonus to player
      if (isPlayer && relicBonuses) {
        const attackBonus = relicBonuses.attack_bonus + relicBonuses.all_stats;
        attack += attackBonus;
      }

      const base = Math.floor((movePower * attack / defense) * (Math.random() * 0.15 + 0.85));
      let baseDamage = Math.max(Math.floor(base / 5), 1);

      const moveType = move.type;
      const defenderTypes = defender.types || [];

      let typeMultiplier = getTypeEffectiveness(moveType, defenderTypes);

      // Apply super effective bonus from relics
      if (isPlayer && relicBonuses && typeMultiplier > 1) {
        typeMultiplier += relicBonuses.super_effective;
      }

      let finalDamage = Math.floor(baseDamage * typeMultiplier);

      // Apply resist damage reduction if enemy is attacking player
      if (!isPlayer && relicBonuses) {
        const resistReduction = 1 - relicBonuses.resist_damage;
        finalDamage = Math.floor(finalDamage * resistReduction);
      }

      return { finalDamage, typeMultiplier, moveName: move.name, moveType, relicBonuses };
    };

    let previousPlayerHP = player.stats.hp;
    let previousEnemyHP = enemy.stats.hp;

    while (playerHP > 0 && enemyHP > 0) {
      for (const turn of order) {
        await new Promise((resolve) => setTimeout(resolve, 700)); // délai visuel

        const currentMove = turn === "player" ? playerMove : enemyMove;
        const { finalDamage, typeMultiplier, moveName, moveType, relicBonuses } =
          turn === "player"
            ? calculateDamage(player, enemy, currentMove, true)
            : calculateDamage(enemy, player, currentMove, false);

        // Check for critical hit (10% base + relic bonus)
        const critChance = 0.1 + (turn === "player" && relicBonuses ? relicBonuses.crit_chance : 0);
        const isCritical = Math.random() < critChance;
        const critMultiplier = 1.5 + (turn === "player" && relicBonuses ? relicBonuses.crit_damage : 0);
        const actualDamage = isCritical ? Math.floor(finalDamage * critMultiplier) : finalDamage;

        let logMessage = "";
        const attacker = turn === "player" ? player : enemy;

        if (turn === "player") {
          enemyHP -= actualDamage;
          logMessage = `⚡ ${player.name} used ${moveName}! 💥 -${actualDamage} HP`;
          if (isCritical) logMessage += " (Critical Hit!)";
          if (typeMultiplier > 1) logMessage += " (Super effective!)";
          else if (typeMultiplier < 1) logMessage += " (Not very effective...)";

          // Apply lifesteal from relics
          if (relicBonuses && relicBonuses.lifesteal > 0) {
            const lifestealAmount = Math.floor(actualDamage * relicBonuses.lifesteal);
            if (lifestealAmount > 0) {
              playerHP = Math.min(playerHP + lifestealAmount, player.stats.hp_max);
              logMessage += ` 🩸 +${lifestealAmount} HP`;
            }
          }
        } else {
          playerHP -= actualDamage;
          logMessage = `💢 ${enemy.name} used ${moveName}! -${actualDamage} HP`;
          if (isCritical) logMessage += " (Critical Hit!)";
          if (typeMultiplier > 1) logMessage += " (Super effective!)";
          else if (typeMultiplier < 1) logMessage += " (Not very effective...)";
        }

        setBattleLog((log) => [...log, logMessage]);

        // Set attacking Pokemon for animation
        setAttackingPokemon(turn === "player" ? activeIndex : "enemy");

        // Play attack sound (based on move type, not Pokemon type)
        playAttackSound(moveType);

        // Trigger visual effects with damage
        setCurrentAttack({
          attackerType: moveType,
          isCritical,
          effectiveness: typeMultiplier,
          damage: actualDamage,
        });

        setDamageDisplay({
          damage: actualDamage,
          isCritical,
          effectiveness: typeMultiplier,
        });

        // Play hit sound and trigger screen shake with damage-based intensity
        setTimeout(() => {
          playHitSound(isCritical, typeMultiplier);
        }, 300);

        // Always trigger screen shake, intensity based on damage
        setScreenShakeTrigger({ active: true, damage: actualDamage });
        setTimeout(() => setScreenShakeTrigger({ active: false, damage: 0 }), 400);

        // Clear effects after animation
        setTimeout(() => {
          setCurrentAttack(null);
          setDamageDisplay(null);
          setAttackingPokemon(null);
        }, 1200);

        // Update HP
        if (turn === "player") {
          let updatedEnemy = {
            ...enemy,
            stats: {
              ...enemy.stats,
              hp_prev: previousEnemyHP,
              hp: Math.max(enemyHP, 0),
            },
          };

          // Check passive effects after enemy takes damage (berries, etc.)
          if (updatedEnemy.stats.hp > 0) {
            const passiveResult = processPostDamageEffects(updatedEnemy, [updatedEnemy], 0);
            if (passiveResult.messages.length > 0) {
              setBattleLog(prev => [...prev, ...passiveResult.messages]);
            }
            updatedEnemy = passiveResult.pokemon;
            enemyHP = updatedEnemy.stats.hp; // Update HP in case berry healed
          }

          setEnemyTeam([updatedEnemy]);
        } else {
          const updatedTeam = [...team];
          let updatedPlayer = {
            ...updatedTeam[activeIndex],
            stats: {
              ...updatedTeam[activeIndex].stats,
              hp_prev: previousPlayerHP,
              hp: Math.max(playerHP, 0),
            },
          };

          // Check passive effects after player takes damage (berries, etc.)
          if (updatedPlayer.stats.hp > 0) {
            const passiveResult = processPostDamageEffects(updatedPlayer, updatedTeam, activeIndex);
            if (passiveResult.messages.length > 0) {
              setBattleLog(prev => [...prev, ...passiveResult.messages]);
            }
            updatedPlayer = passiveResult.pokemon;
            playerHP = updatedPlayer.stats.hp; // Update HP in case berry healed
          }

          updatedTeam[activeIndex] = updatedPlayer;
          setTeam(updatedTeam);
        }

        await new Promise((resolve) => setTimeout(resolve, 300)); // pour que l'UI ait le temps de flusher

        if (enemyHP <= 0 || playerHP <= 0) break;
      }
    }

    // Decrement PP for used moves
    const updatedTeam = [...team];
    const playerMoveIndex = updatedTeam[activeIndex].moves.findIndex(m => m.id === playerMove.id);
    if (playerMoveIndex !== -1) {
      updatedTeam[activeIndex] = {
        ...updatedTeam[activeIndex],
        moves: updatedTeam[activeIndex].moves.map((m, idx) =>
          idx === playerMoveIndex ? { ...m, pp: Math.max(m.pp - 1, 0) } : m
        ),
        stats: {
          ...updatedTeam[activeIndex].stats,
          hp: Math.max(playerHP, 0),
        },
      };
    } else {
      updatedTeam[activeIndex] = {
        ...updatedTeam[activeIndex],
        stats: {
          ...updatedTeam[activeIndex].stats,
          hp: Math.max(playerHP, 0),
        },
      };
    }

    // Process end-of-turn effects (Leftovers, etc.) for player
    if (updatedTeam[activeIndex].stats.hp > 0 && playerHP > 0) {
      const endTurnResult = processEndOfTurnEffects(updatedTeam[activeIndex], updatedTeam, activeIndex);
      if (endTurnResult.message) {
        setBattleLog(prev => [...prev, endTurnResult.message]);
      }
      updatedTeam[activeIndex] = endTurnResult.pokemon;
      playerHP = endTurnResult.pokemon.stats.hp;
    }

    setTeam(updatedTeam);

    // Decrement enemy PP
    const enemyMoveIndex = enemy.moves.findIndex(m => m.id === enemyMove.id);
    let updatedEnemy = {
      ...enemy,
      moves: enemy.moves.map((m, idx) =>
        idx === enemyMoveIndex ? { ...m, pp: Math.max(m.pp - 1, 0) } : m
      ),
      stats: {
        ...enemy.stats,
        hp: Math.max(enemyHP, 0),
      },
    };

    // Process end-of-turn effects (Leftovers, etc.) for enemy
    if (updatedEnemy.stats.hp > 0 && enemyHP > 0) {
      const endTurnResult = processEndOfTurnEffects(updatedEnemy, [updatedEnemy], 0);
      if (endTurnResult.message) {
        setBattleLog(prev => [...prev, endTurnResult.message]);
      }
      updatedEnemy = endTurnResult.pokemon;
      enemyHP = endTurnResult.pokemon.stats.hp;
    }

    setEnemyTeam([updatedEnemy]);

    if (playerHP <= 0) {
      playFaintSound();
      const nextAlive = updatedTeam.findIndex((mon) => mon.stats.hp > 0);
      if (nextAlive !== -1) {
        setActiveIndex(nextAlive);
        playSwitchSound();
        setBattle({ playerHP: 0, enemyHP, result: null });
      } else {
        playDefeatSound();
        setBattle({ playerHP: 0, enemyHP, result: "lose" });
      }
    } else {
      playFaintSound();
      playVictorySound();
      setBattle({ playerHP, enemyHP, result: "win" });

      // Track battle won for achievements
      trackStat('totalBattlesWon', 1);

      // Check for perfect battle (no damage taken)
      if (playerHP >= startingPlayerHP) {
        trackStat('perfectBattles', 1);
        setBattleLog(prev => [...prev, `✨ Perfect Battle! No damage taken!`]);
      }

      // Get relic bonuses for victory rewards
      const victoryRelicBonuses = calculateRelicBonuses(relics);

      // Award gold based on floor level + relic bonus
      const baseGoldReward = 50 + (floor * 10);
      const goldMultiplier = 1 + victoryRelicBonuses.gold_bonus;
      const goldReward = Math.floor(baseGoldReward * goldMultiplier);
      console.log(`[FloorScreen] Victory! Awarding ${goldReward} gold (${victoryRelicBonuses.gold_bonus * 100}% bonus from relics)`);
      setCurrency(prev => prev + goldReward);

      // Apply post-battle healing from relics to entire team
      if (victoryRelicBonuses.post_battle_heal > 0) {
        const healPercent = victoryRelicBonuses.post_battle_heal;
        setTeam(prevTeam => prevTeam.map(poke => {
          if (poke.stats.hp > 0) {
            const healAmount = Math.floor(poke.stats.hp_max * healPercent);
            return {
              ...poke,
              stats: {
                ...poke.stats,
                hp: Math.min(poke.stats.hp + healAmount, poke.stats.hp_max),
              },
            };
          }
          return poke;
        }));
        setBattleLog(prev => [...prev, `🌿 Relics heal team for ${Math.round(healPercent * 100)}% HP!`]);
      }
    }

    setIsBattleInProgress(false);
  };

  // ============================================
  // NvM COMBAT FUNCTIONS
  // ============================================

  /**
   * Update the UI display from battle state
   */
  const updateBattleDisplay = useCallback((battleInstance) => {
    if (!battleInstance) return;

    const summary = battleInstance.getSummary();
    setTurnOrderDisplay(summary.turnOrder);
    setCurrentTurnIndex(summary.currentTurnIndex);
    setRoundNumber(summary.roundNumber);

    // Sync team HP with Recoil state - use functional update to avoid stale closure
    const playerCombatants = battleInstance.combatants.filter(c => !c.isEnemy);
    setTeam(prevTeam => {
      return prevTeam.map((poke, index) => {
        const combatant = playerCombatants.find(c => c.teamIndex === index);
        if (combatant) {
          // Only update if HP actually changed
          if (poke.stats.hp !== combatant.currentHP) {
            return {
              ...poke,
              stats: {
                ...poke.stats,
                hp_prev: poke.stats.hp,
                hp: combatant.currentHP,
              },
            };
          }
        }
        return poke;
      });
    });

    // Sync enemy team HP - use combatant data directly to avoid stale closure
    const enemyCombatants = battleInstance.getEnemyCombatants();
    // Get all enemy combatants including fainted ones for proper index matching
    const allEnemyCombatants = battleInstance.combatants.filter(c => c.isEnemy);
    setEnemyTeam(prev => {
      // If we have no previous state, rebuild from combatants
      if (!prev || prev.length === 0) {
        return allEnemyCombatants.map(c => ({
          ...c.pokemon,
          stats: {
            ...c.pokemon.stats,
            hp: c.currentHP,
          },
        }));
      }
      // Update HP while keeping existing data - match by teamIndex
      return prev.map((poke, index) => {
        const combatant = allEnemyCombatants.find(c => c.teamIndex === index);
        if (combatant && poke.stats.hp !== combatant.currentHP) {
          return {
            ...poke,
            stats: {
              ...poke.stats,
              hp_prev: poke.stats.hp,
              hp: combatant.currentHP,
            },
          };
        }
        return poke;
      });
    });
  }, [setTeam, setEnemyTeam]);

  /**
   * Execute a single attack (used by both player and enemy)
   */
  const executeAttack = useCallback(async (battleInstance, attacker, move, targetId) => {
    const relicBonuses = !attacker.isEnemy ? calculateRelicBonuses(relics) : null;
    const target = battleInstance.getCombatantById(targetId);

    if (!target || target.currentHP <= 0) {
      console.log(`[Combat] Target ${targetId} is invalid or fainted`);
      return { success: false };
    }

    // Calculate damage
    const damageResult = calculateBattleDamage(attacker, target, move, relicBonuses);

    // Play attack sound
    playAttackSound(move.type);

    // Show attack animation
    setCurrentAttack({
      attackerType: move.type,
      isCritical: damageResult.isCritical,
      effectiveness: damageResult.typeMultiplier,
      damage: damageResult.damage,
    });

    setDamageDisplay({
      damage: damageResult.damage,
      isCritical: damageResult.isCritical,
      effectiveness: damageResult.typeMultiplier,
    });

    // Screen shake
    setScreenShakeTrigger({ active: true, damage: damageResult.damage });
    setTimeout(() => setScreenShakeTrigger({ active: false, damage: 0 }), 400);

    // Apply damage
    const { damage: actualDamage, fainted } = battleInstance.applyDamage(targetId, damageResult.damage);

    // Build log message
    let logMessage = `${attacker.isEnemy ? '👾' : '⚡'} ${attacker.pokemon.name} used ${move.name}! 💥 -${actualDamage} HP`;
    if (damageResult.isCritical) logMessage += " (Critical Hit!)";
    if (damageResult.typeMultiplier > 1) logMessage += " (Super effective!)";
    else if (damageResult.typeMultiplier < 1 && damageResult.typeMultiplier > 0) logMessage += " (Not very effective...)";
    else if (damageResult.typeMultiplier === 0) logMessage += " (No effect!)";

    // Lifesteal for player
    if (!attacker.isEnemy && relicBonuses?.lifesteal > 0) {
      const lifestealAmount = Math.floor(actualDamage * relicBonuses.lifesteal);
      if (lifestealAmount > 0) {
        battleInstance.applyHealing(attacker.id, lifestealAmount);
        logMessage += ` 🩸 +${lifestealAmount} HP`;
      }
    }

    setBattleLog(prev => [...prev, logMessage]);

    // Apply move effects (status, stat changes, recoil, flinch, team buffs)
    if (move.effect) {
      const effect = move.effect;

      // RECOIL DAMAGE - Apply to attacker
      if (effect.type === 'recoil' && actualDamage > 0) {
        const recoilDamage = Math.floor(actualDamage * (effect.percent / 100));
        if (recoilDamage > 0) {
          battleInstance.applyDamage(attacker.id, recoilDamage);
          setBattleLog(prev => [...prev, `💔 ${attacker.pokemon.name} took ${recoilDamage} recoil damage!`]);

          // Check if attacker fainted from recoil
          if (attacker.currentHP <= 0) {
            playFaintSound();
            setBattleLog(prev => [...prev, `💀 ${attacker.pokemon.name} fainted from recoil!`]);
          }
        }

        // Apply secondary effect if recoil move has one (e.g., Flare Blitz burn)
        if (effect.secondaryEffect && target.currentHP > 0) {
          const secondary = effect.secondaryEffect;
          if (secondary.type === 'status' && Math.random() * 100 < (secondary.chance || 100)) {
            const statusResult = applyStatus(target, secondary.status);
            if (statusResult.applied) {
              setBattleLog(prev => [...prev, statusResult.message]);
            }
          }
        }
      }

      // FLINCH - Mark target as unable to move this turn (if they haven't moved yet)
      if (effect.type === 'flinch' && target.currentHP > 0) {
        // Check for firstTurnOnly restriction (Fake Out)
        const isFirstTurn = battleInstance.roundNumber === 1;
        if (!effect.firstTurnOnly || isFirstTurn) {
          if (Math.random() * 100 < (effect.chance || 100)) {
            // Add flinch to volatile status
            if (!target.volatileStatus.includes('flinch')) {
              target.volatileStatus.push('flinch');
              setBattleLog(prev => [...prev, `😵 ${target.pokemon.name} flinched!`]);
            }
          }
        }
      }

      // TEAM BUFF - Apply buff to all allies
      if (effect.type === 'team_buff') {
        const allies = attacker.isEnemy
          ? battleInstance.getEnemyCombatants()
          : battleInstance.getPlayerCombatants();

        // Store team buff in battle state (we'll need to track this)
        if (!battleInstance.teamBuffs) {
          battleInstance.teamBuffs = { player: {}, enemy: {} };
        }
        const buffSide = attacker.isEnemy ? 'enemy' : 'player';
        battleInstance.teamBuffs[buffSide][effect.buff] = {
          duration: effect.duration,
          reduction: effect.reduction,
          speedBoost: effect.speedBoost,
        };

        const buffNames = {
          'light_screen': 'Light Screen',
          'reflect': 'Reflect',
          'tailwind': 'Tailwind',
          'wide_guard': 'Wide Guard',
        };
        setBattleLog(prev => [...prev, `🛡️ ${buffNames[effect.buff] || effect.buff} was set up for the team!`]);
      }

      // STATUS EFFECT - Apply to target
      if (effect.type === 'status' && target.currentHP > 0 && Math.random() * 100 < (effect.chance || 100)) {
        const statusResult = applyStatus(target, effect.status);
        if (statusResult.applied) {
          setBattleLog(prev => [...prev, statusResult.message]);
        }
      }

      // STAT CHANGE - Apply to self or target
      if (effect.type === 'stat_change' && (target.currentHP > 0 || effect.self)) {
        // Only apply if chance check passes (or no chance specified = guaranteed)
        if (!effect.chance || Math.random() * 100 < effect.chance) {
          const targetForStat = effect.self ? attacker : target;
          const stats = effect.stats || [effect.stat];
          for (const stat of stats) {
            const result = battleInstance.applyStatChange(targetForStat.id, stat, effect.stages);
            if (result.changed) {
              const direction = effect.stages > 0 ? 'rose' : 'fell';
              const intensity = Math.abs(effect.stages) > 1 ? 'sharply ' : '';
              setBattleLog(prev => [...prev, `📊 ${targetForStat.pokemon.name}'s ${stat.replace('_', ' ')} ${intensity}${direction}!`]);
            }
          }
        }
      }
    }

    // Hit sound after delay
    setTimeout(() => {
      playHitSound(damageResult.isCritical, damageResult.typeMultiplier);
    }, 300);

    // Clear effects after animation
    await new Promise(resolve => setTimeout(resolve, 800));
    setCurrentAttack(null);
    setDamageDisplay(null);

    // Check if target fainted
    if (fainted) {
      playFaintSound();
      setBattleLog(prev => [...prev, `💀 ${target.pokemon.name} fainted!`]);
    }

    return { success: true, damage: actualDamage, fainted };
  }, [relics, playAttackSound, playHitSound, playFaintSound]);

  /**
   * Process enemy AI turn
   */
  const processEnemyTurn = useCallback(async (battleInstance, combatant) => {
    if (!battleInstance || !combatant) return;

    // Check status before move
    const statusCheck = checkStatusBeforeMove(combatant);
    if (!statusCheck.canMove) {
      setBattleLog(prev => [...prev, statusCheck.message]);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Advance turn
      battleInstance.advanceTurn();
      updateBattleDisplay(battleInstance);

      // Check battle end
      if (battleInstance.isFinished) {
        handleBattleEnd(battleInstance);
        return;
      }

      // Process next turn
      processNextTurn(battleInstance);
      return;
    }

    // Get AI decision
    const aiDifficulty = getAIDifficultyForEnemy(combatant.pokemon, floor);
    const decision = getAIDecision(combatant, battleInstance, aiDifficulty);

    setBattleLog(prev => [...prev, `👾 ${combatant.pokemon.name} is attacking...`]);
    await new Promise(resolve => setTimeout(resolve, 500));

    // Execute attack
    const targets = decision.move.target === TARGET_TYPES.ALL_ENEMIES
      ? battleInstance.getPlayerCombatants()
      : [battleInstance.getCombatantById(decision.targetId)].filter(Boolean);

    for (const target of targets) {
      if (target && target.currentHP > 0) {
        await executeAttack(battleInstance, combatant, decision.move, target.id);
      }
    }

    // Apply end of turn status damage
    const endTurnStatus = applyEndOfTurnStatus(combatant);
    if (endTurnStatus.damage > 0) {
      battleInstance.applyDamage(combatant.id, endTurnStatus.damage);
      setBattleLog(prev => [...prev, endTurnStatus.message]);
    }

    // Advance turn
    battleInstance.advanceTurn();
    updateBattleDisplay(battleInstance);

    // Check battle end
    if (battleInstance.isFinished) {
      handleBattleEnd(battleInstance);
      return;
    }

    // Process next turn
    await new Promise(resolve => setTimeout(resolve, 300));
    processNextTurn(battleInstance);
  }, [floor, executeAttack, updateBattleDisplay]);

  /**
   * Process player turn (after target selection)
   */
  const processPlayerTurn = useCallback(async (battleInstance, combatant, move, targetId) => {
    if (!battleInstance || !combatant || !move) return;

    setIsBattleInProgress(true);
    setAwaitingPlayerMove(false);
    setShowTargetSelector(false);
    setShowMoveModal(false);

    // Check status before move
    const statusCheck = checkStatusBeforeMove(combatant);
    if (!statusCheck.canMove) {
      setBattleLog(prev => [...prev, statusCheck.message]);
      await new Promise(resolve => setTimeout(resolve, 1000));

      battleInstance.advanceTurn();
      updateBattleDisplay(battleInstance);

      if (battleInstance.isFinished) {
        handleBattleEnd(battleInstance);
        return;
      }

      processNextTurn(battleInstance);
      return;
    }

    // Execute attack (AOE or single target)
    const isAOE = move.target === TARGET_TYPES.ALL_ENEMIES;
    const targets = isAOE
      ? battleInstance.getEnemyCombatants()
      : [battleInstance.getCombatantById(targetId)].filter(Boolean);

    for (const target of targets) {
      if (target && target.currentHP > 0) {
        await executeAttack(battleInstance, combatant, move, target.id);

        // Check if battle ended mid-AOE
        if (battleInstance.isFinished) break;
      }
    }

    // Decrement PP (update team state for player Pokemon)
    if (!combatant.isEnemy) {
      setTeam(prevTeam => {
        return prevTeam.map((p, idx) => {
          if (idx === combatant.teamIndex) {
            const newMoves = p.moves.map(m =>
              m.id === move.id ? { ...m, pp: Math.max(0, (m.pp || m.pp_max || 10) - 1) } : m
            );
            return { ...p, moves: newMoves };
          }
          return p;
        });
      });
    }

    // Apply end of turn status damage
    const endTurnStatus = applyEndOfTurnStatus(combatant);
    if (endTurnStatus.damage > 0) {
      battleInstance.applyDamage(combatant.id, endTurnStatus.damage);
      setBattleLog(prev => [...prev, endTurnStatus.message]);
    }

    // Advance turn
    battleInstance.advanceTurn();
    updateBattleDisplay(battleInstance);

    // Check battle end
    if (battleInstance.isFinished) {
      handleBattleEnd(battleInstance);
      return;
    }

    // Process next turn
    await new Promise(resolve => setTimeout(resolve, 300));
    processNextTurn(battleInstance);
  }, [executeAttack, updateBattleDisplay]);

  /**
   * Process the next turn in sequence
   */
  const processNextTurn = useCallback((battleInstance) => {
    if (!battleInstance || battleInstance.isFinished) return;

    const currentCombatant = battleInstance.getCurrentCombatant();
    if (!currentCombatant) {
      // All turns done, check if battle continues
      if (!battleInstance.isFinished) {
        battleInstance.recalculateTurnOrder();
        processNextTurn(battleInstance);
      }
      return;
    }

    // Skip fainted combatants - they may have died since turn order was calculated
    if (currentCombatant.currentHP <= 0) {
      battleInstance.advanceTurn();
      updateBattleDisplay(battleInstance);

      // Check if battle ended after skipping fainted Pokemon
      if (battleInstance.isFinished) {
        // Use ref to call handleBattleEnd without circular dependency
        if (handleBattleEndRef.current) {
          handleBattleEndRef.current(battleInstance);
        }
        return;
      }

      // Continue to next turn
      processNextTurn(battleInstance);
      return;
    }

    setCurrentCombatantId(currentCombatant.id);

    if (currentCombatant.isEnemy) {
      // Enemy turn - process automatically
      setIsBattleInProgress(true);
      setAwaitingPlayerMove(false);
      processEnemyTurn(battleInstance, currentCombatant);
    } else {
      // Player turn - wait for input
      setIsBattleInProgress(false);
      setAwaitingPlayerMove(true);
      setBattleLog(prev => [...prev, `🎮 ${currentCombatant.pokemon.name}'s turn!`]);
    }
  }, [processEnemyTurn, updateBattleDisplay]);

  /**
   * Handle battle end (win/lose)
   */
  const handleBattleEnd = useCallback((battleInstance) => {
    setIsBattleInProgress(false);
    setAwaitingPlayerMove(false);

    // Sync HP from battle instance to team state
    // This is crucial - the battle modifies combatant HP but team state needs to be updated
    const syncedTeam = team.map((pokemon, index) => {
      const combatant = battleInstance.combatants.find(
        c => !c.isEnemy && c.teamIndex === index
      );
      if (combatant) {
        return {
          ...pokemon,
          stats: {
            ...pokemon.stats,
            hp: Math.max(0, combatant.currentHP),
          },
        };
      }
      return pokemon;
    });

    // Update team with synced HP
    setTeam(syncedTeam);

    if (battleInstance.winner === 'player') {
      playVictorySound();
      setBattle({ playerHP: 1, enemyHP: 0, result: "win" });

      // Track stats
      trackStat('totalBattlesWon', 1);

      // Award gold
      const victoryRelicBonuses = calculateRelicBonuses(relics);
      const baseGoldReward = 50 + (floor * 10) * enemyTeam.length;
      const goldMultiplier = 1 + victoryRelicBonuses.gold_bonus;
      const goldReward = Math.floor(baseGoldReward * goldMultiplier);
      setCurrency(prev => prev + goldReward);
      setBattleLog(prev => [...prev, `🏆 Victory! Earned ${goldReward} gold!`]);

      // Distribute XP to team (equal split) - Store result for XP screen
      // Use syncedTeam for XP distribution so HP values are correct
      const xpResult = distributeXPToTeam(syncedTeam, enemyTeam, floor, 'equal');
      setBattleLog(prev => [...prev, `⭐ Team earned ${xpResult.totalXP} XP! (${xpResult.xpPerPokemon} each)`]);

      // Store XP result and current team for XP gain screen (don't apply yet)
      setTeamBeforeXP([...syncedTeam]); // Snapshot of team before XP with correct HP
      setXpGainResult({
        ...xpResult,
        relicHealPercent: victoryRelicBonuses.post_battle_heal, // Store for later application
      });
    } else {
      playDefeatSound();
      setBattle({ playerHP: 0, enemyHP: 1, result: "lose" });
      setBattleLog(prev => [...prev, `💀 Your team was defeated...`]);
    }
  }, [relics, floor, team, enemyTeam, playVictorySound, playDefeatSound, playLevelUpSound, setCurrency, setTeam]);

  // Keep ref updated for use in processNextTurn (avoids circular dependency)
  handleBattleEndRef.current = handleBattleEnd;

  // ============================================
  // NvM MOVE SELECTION HANDLERS
  // ============================================

  /**
   * Handle move selection from MoveSelector
   */
  const handleNvmMoveSelect = useCallback((move, moveIndex) => {
    if (move.pp <= 0 || isBattleInProgress || !awaitingPlayerMove) return;

    playMenuSelect();
    setSelectedMove(move);
    setShowMoveModal(false);

    // Check if move needs target selection
    const targetType = move.target || TARGET_TYPES.SINGLE_ENEMY;

    if (targetType === TARGET_TYPES.SELF) {
      // Self-targeting moves don't need selector
      const battleInstance = battleStateRef.current;
      const combatant = battleInstance?.getCurrentCombatant();
      if (combatant) {
        processPlayerTurn(battleInstance, combatant, move, combatant.id);
      }
    } else if (targetType === TARGET_TYPES.ALL_ENEMIES || targetType === TARGET_TYPES.ALL_ALLIES) {
      // AOE moves don't need specific target
      const battleInstance = battleStateRef.current;
      const combatant = battleInstance?.getCurrentCombatant();
      if (combatant) {
        const targets = targetType === TARGET_TYPES.ALL_ENEMIES
          ? battleInstance.getEnemyCombatants()
          : battleInstance.getPlayerCombatants().filter(c => c.id !== combatant.id);
        processPlayerTurn(battleInstance, combatant, move, targets[0]?.id);
      }
    } else {
      // Single target - show target selector
      setShowTargetSelector(true);
    }
  }, [isBattleInProgress, awaitingPlayerMove, playMenuSelect, processPlayerTurn]);

  /**
   * Handle target selection
   */
  const handleTargetConfirm = useCallback((targetId) => {
    const battleInstance = battleStateRef.current;
    const combatant = battleInstance?.getCurrentCombatant();
    const move = selectedMove;

    if (combatant && move) {
      setShowTargetSelector(false);
      setSelectedTargetId(null);
      processPlayerTurn(battleInstance, combatant, move, targetId);
    }
  }, [selectedMove, processPlayerTurn]);

  // ============================================
  // LEGACY HANDLERS (for compatibility)
  // ============================================

  const handleSwitch = (index) => {
    playSwitchSound();
    setActiveIndex(index);
    setIsSwitching(false);
  };

  const handleMoveSelect = (move, moveIndex) => {
    // Use NvM system if battle is active
    if (nvmBattle && awaitingPlayerMove) {
      handleNvmMoveSelect(move, moveIndex);
      return;
    }

    // Legacy fallback
    if (move.pp <= 0 || isBattleInProgress) return;
    playMenuSelect();
    setSelectedMove(move);
    setShowMoveModal(false);
    runTurnBasedBattle(move);
  };

  const handleOpenAttackModal = () => {
    if (!isBattleInProgress && team[activeIndex]?.stats.hp > 0) {
      playMenuSelect();
      setShowMoveModal(true);
    }
  };

  const handleItemUse = (item) => {
    if (isBattleInProgress || !battle || battle.result) return;

    playMenuSelect();
    setSelectedItem(item);
    setShowInventory(false);
  };

  const handleMegaEvolve = async () => {
    const activePokemon = team[activeIndex];
    if (!activePokemon || !activePokemon.heldItem || hasMegaEvolved || isBattleInProgress) {
      return;
    }

    const heldItem = getItemById(activePokemon.heldItem);
    if (!heldItem || heldItem.effect.type !== 'mega_stone') {
      return;
    }

    // Check if this mega stone matches this Pokemon
    const pokemonBaseName = activePokemon.baseName || activePokemon.name.toLowerCase();
    if (!pokemonBaseName.includes(heldItem.effect.pokemon)) {
      setBattleLog(prev => [...prev, `❌ ${heldItem.name} cannot be used with ${activePokemon.name}!`]);
      return;
    }

    playLevelUpSound();
    setHasMegaEvolved(true);

    // Track mega evolution for achievements
    trackStat('totalMegaEvolutions', 1);

    // Fetch mega evolution sprite from PokeAPI
    let megaSprite = activePokemon.sprite;
    try {
      const axios = (await import('axios')).default;
      const megaForm = heldItem.effect.mega_form; // e.g., "charizard-mega-x"
      const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${megaForm}`);
      megaSprite = res.data.sprites.front_default;
    } catch (error) {
      console.warn('Failed to fetch mega sprite, using default:', error);
    }

    const updatedTeam = [...team];
    const statChanges = heldItem.effect.stat_changes;

    // Apply mega evolution
    updatedTeam[activeIndex] = {
      ...activePokemon,
      name: activePokemon.name + ' (Mega)',
      sprite: megaSprite, // Update sprite to mega form
      isMegaEvolved: true,
      types: heldItem.effect.type_change || activePokemon.types,
      stats: {
        ...activePokemon.stats,
        attack: activePokemon.stats.attack + statChanges.attack,
        defense: activePokemon.stats.defense + statChanges.defense,
        special_attack: activePokemon.stats.special_attack + statChanges.special_attack,
        special_defense: activePokemon.stats.special_defense + statChanges.special_defense,
        speed: activePokemon.stats.speed + statChanges.speed,
      },
    };

    setTeam(updatedTeam);
    setBattleLog(prev => [...prev, `✨💎 ${activePokemon.name} MEGA EVOLVED! Power surges through your Pokemon!`]);

    // Sync with battle instance if battle is active
    const battleInstance = battleStateRef.current;
    if (battleInstance && !battleInstance.isFinished) {
      const megaPokemon = updatedTeam[activeIndex];
      const combatant = battleInstance.combatants.find(
        c => !c.isEnemy && c.teamIndex === activeIndex
      );
      if (combatant) {
        combatant.pokemon = { ...combatant.pokemon, ...megaPokemon };
        updateBattleDisplay(battleInstance);
      }
    }

    // Visual effects
    setHighlighted({ index: activeIndex, stat: 'all' });
    setTimeout(() => setHighlighted(null), 3000);
  };

  const handleItemApply = async (pokemonIndex) => {
    if (!selectedItem || pokemonIndex === undefined) return;

    const updatedTeam = [...team];
    const pokemon = updatedTeam[pokemonIndex];
    const item = selectedItem;

    // Validate item usage based on effect type
    if (item.effect.type === 'heal' && pokemon.stats.hp >= pokemon.stats.hp_max) {
      setBattleLog(prev => [...prev, `❌ ${pokemon.name} already has full HP!`]);
      setSelectedItem(null);
      return;
    }

    if (item.effect.type === 'revive' && pokemon.stats.hp > 0) {
      setBattleLog(prev => [...prev, `❌ ${pokemon.name} is not fainted!`]);
      setSelectedItem(null);
      return;
    }

    if (item.effect.type === 'pp_restore' && pokemon.moves.every(m => m.pp >= m.maxPP)) {
      setBattleLog(prev => [...prev, `❌ ${pokemon.name}'s moves already have full PP!`]);
      setSelectedItem(null);
      return;
    }

    if (item.effect.type === 'evolution') {
      const stoneType = item.effect.stone_type;
      if (!canEvolveWithStone(pokemon.name, stoneType)) {
        setBattleLog(prev => [...prev, `❌ ${item.name} won't work on ${pokemon.name}!`]);
        setSelectedItem(null);
        return;
      }
    }

    // === HEALING ITEMS ===
    if (item.effect.type === 'revive' && pokemon.stats.hp === 0) {
      // Revive Pokemon
      playHealSound();
      const revivePercent = item.effect.value || 0.5;
      updatedTeam[pokemonIndex] = {
        ...pokemon,
        stats: {
          ...pokemon.stats,
          hp: Math.floor(pokemon.stats.hp_max * revivePercent),
        },
      };
      setBattleLog(prev => [...prev, `✨ ${item.name} used on ${pokemon.name}! Revived with ${Math.floor(pokemon.stats.hp_max * revivePercent)} HP`]);
      setHighlighted({ index: pokemonIndex, stat: 'hp' });
    }
    else if (item.effect.type === 'heal' || item.effect.type === 'heal_full_status') {
      // Heal Pokemon
      playHealSound();
      const healAmount = item.effect.value === 'full'
        ? pokemon.stats.hp_max
        : (item.effect.value || 20);
      const previousHP = pokemon.stats.hp;
      const newHP = Math.min(pokemon.stats.hp + healAmount, pokemon.stats.hp_max);
      const actualHeal = newHP - previousHP;

      updatedTeam[pokemonIndex] = {
        ...pokemon,
        stats: {
          ...pokemon.stats,
          hp: newHP,
        },
      };
      setBattleLog(prev => [...prev, `💊 ${item.name} used on ${pokemon.name}! Restored ${actualHeal} HP`]);
      setHighlighted({ index: pokemonIndex, stat: 'hp' });
    }

    // === PP RESTORE ITEMS ===
    else if (item.effect.type === 'pp_restore') {
      playHealSound();
      const restoreValue = item.effect.value;
      const target = item.effect.target; // 'all_moves' or 'single_move'

      if (target === 'all_moves') {
        // Restore PP to all moves
        updatedTeam[pokemonIndex] = {
          ...pokemon,
          moves: pokemon.moves.map(move => ({
            ...move,
            pp: restoreValue === 'full'
              ? move.maxPP
              : Math.min(move.pp + restoreValue, move.maxPP),
          })),
        };
        setBattleLog(prev => [...prev, `💧 ${item.name} used on ${pokemon.name}! All moves restored ${restoreValue === 'full' ? 'full' : restoreValue} PP`]);
      } else {
        // For single_move, we'll restore the first move with less than max PP
        const moveToRestore = pokemon.moves.findIndex(m => m.pp < m.maxPP);
        if (moveToRestore !== -1) {
          updatedTeam[pokemonIndex] = {
            ...pokemon,
            moves: pokemon.moves.map((move, idx) =>
              idx === moveToRestore
                ? {
                    ...move,
                    pp: restoreValue === 'full'
                      ? move.maxPP
                      : Math.min(move.pp + restoreValue, move.maxPP)
                  }
                : move
            ),
          };
          setBattleLog(prev => [...prev, `💧 ${item.name} used on ${pokemon.name}! ${pokemon.moves[moveToRestore].name} restored ${restoreValue === 'full' ? 'full' : restoreValue} PP`]);
        }
      }
      setHighlighted({ index: pokemonIndex, stat: 'pp' });
    }

    // === STAT BOOST ITEMS (X Attack, X Defense, etc.) ===
    else if (item.effect.type === 'stat_boost') {
      playLevelUpSound();
      const stat = item.effect.stat;
      const stages = item.effect.stages || 2;
      const multiplier = 1 + (stages * 0.5); // Each stage = +50% to stat

      const newStats = { ...pokemon.stats };

      if (stat === 'attack') {
        newStats.attack = Math.floor(pokemon.stats.attack * multiplier);
      } else if (stat === 'defense') {
        newStats.defense = Math.floor(pokemon.stats.defense * multiplier);
      } else if (stat === 'special_attack') {
        newStats.special_attack = Math.floor(pokemon.stats.special_attack * multiplier);
      } else if (stat === 'special_defense') {
        newStats.special_defense = Math.floor(pokemon.stats.special_defense * multiplier);
      } else if (stat === 'speed') {
        newStats.speed = Math.floor(pokemon.stats.speed * multiplier);
      }

      updatedTeam[pokemonIndex] = {
        ...pokemon,
        stats: newStats,
      };

      const statDisplayName = stat.replace('_', ' ').toUpperCase();
      setBattleLog(prev => [...prev, `📈 ${item.name} used on ${pokemon.name}! ${statDisplayName} sharply rose!`]);
      setHighlighted({ index: pokemonIndex, stat });
    }

    // === VITAMINS (Permanent EV boosts) ===
    else if (item.effect.type === 'ev_boost') {
      playLevelUpSound();
      const stat = item.effect.stat;
      const value = item.effect.value || 10;

      const newStats = { ...pokemon.stats };

      if (stat === 'hp') {
        newStats.hp_max = pokemon.stats.hp_max + value;
        newStats.hp = pokemon.stats.hp + value; // Also increase current HP
      } else if (stat === 'attack') {
        newStats.attack = pokemon.stats.attack + value;
      } else if (stat === 'defense') {
        newStats.defense = pokemon.stats.defense + value;
      } else if (stat === 'special_attack') {
        newStats.special_attack = pokemon.stats.special_attack + value;
      } else if (stat === 'special_defense') {
        newStats.special_defense = pokemon.stats.special_defense + value;
      } else if (stat === 'speed') {
        newStats.speed = pokemon.stats.speed + value;
      }

      updatedTeam[pokemonIndex] = {
        ...pokemon,
        stats: newStats,
      };

      const statDisplayName = stat.toUpperCase();
      setBattleLog(prev => [...prev, `💪 ${item.name} used on ${pokemon.name}! ${statDisplayName} permanently increased by ${value}!`]);
      setHighlighted({ index: pokemonIndex, stat });
    }

    // === RARE CANDY (Level up) ===
    else if (item.effect.type === 'level_up') {
      playLevelUpSound();
      const levelIncrease = item.effect.value || 1;

      // Increase all stats by a small amount (simulating level up)
      const statIncrease = 5 * levelIncrease;
      updatedTeam[pokemonIndex] = {
        ...pokemon,
        level: (pokemon.level || 1) + levelIncrease,
        stats: {
          ...pokemon.stats,
          hp_max: pokemon.stats.hp_max + statIncrease,
          hp: pokemon.stats.hp + statIncrease,
          attack: pokemon.stats.attack + statIncrease,
          defense: pokemon.stats.defense + statIncrease,
          special_attack: pokemon.stats.special_attack + statIncrease,
          special_defense: pokemon.stats.special_defense + statIncrease,
          speed: pokemon.stats.speed + statIncrease,
        },
      };
      setBattleLog(prev => [...prev, `🍬 ${item.name} used on ${pokemon.name}! Leveled up! All stats increased!`]);
      setHighlighted({ index: pokemonIndex, stat: 'all' });
    }

    // === EVOLUTION STONES ===
    else if (item.effect.type === 'evolution') {
      playLevelUpSound();
      const stoneType = item.effect.stone_type;

      setBattleLog(prev => [...prev, `✨ ${item.name} used on ${pokemon.name}! What? ${pokemon.name} is evolving!`]);

      // Fetch evolved form
      const evolvedPokemon = await getEvolvedPokemon(pokemon.name, stoneType, pokemon);

      if (evolvedPokemon) {
        updatedTeam[pokemonIndex] = evolvedPokemon;
        setBattleLog(prev => [...prev, `🎉 Congratulations! ${pokemon.name} evolved into ${evolvedPokemon.name}!`]);
        setHighlighted({ index: pokemonIndex, stat: 'all' });
      } else {
        setBattleLog(prev => [...prev, `❌ Evolution failed! Something went wrong.`]);
        setSelectedItem(null);
        return;
      }
    }

    // Consume item from inventory
    setInventory(prev => ({
      ...prev,
      [item.id]: Math.max((prev[item.id] || 0) - 1, 0),
    }));

    setTeam(updatedTeam);

    // Sync HP/stats with battle instance if battle is active
    // This is crucial - items modify team state but battleInstance has its own HP tracking
    const battleInstance = battleStateRef.current;
    if (battleInstance && !battleInstance.isFinished) {
      const updatedPokemon = updatedTeam[pokemonIndex];
      const combatant = battleInstance.combatants.find(
        c => !c.isEnemy && c.teamIndex === pokemonIndex
      );
      if (combatant) {
        // Sync HP
        combatant.currentHP = updatedPokemon.stats.hp;
        combatant.maxHP = updatedPokemon.stats.hp_max;
        // Sync other stats if they changed (e.g., from Rare Candy)
        combatant.pokemon = { ...combatant.pokemon, ...updatedPokemon };
        // Update display
        updateBattleDisplay(battleInstance);
      }
    }

    setTimeout(() => setHighlighted(null), 3000);
    setSelectedItem(null);
  };

  /**
   * Handle XP gain screen completion - apply XP and check for pending move learns
   */
  const handleXPGainComplete = () => {
    if (!xpGainResult) return;

    // Play level up sound if there were level ups
    if (xpGainResult.levelUps?.length > 0) {
      playLevelUpSound();
      for (const levelUp of xpGainResult.levelUps) {
        setBattleLog(prev => [...prev,
          `🎉 ${levelUp.name} leveled up! Lv.${levelUp.oldLevel} → Lv.${levelUp.newLevel}`
        ]);
      }
    }

    // Apply XP to team
    let updatedTeam = xpGainResult.updatedTeam;

    // Apply post-battle healing from relics
    if (xpGainResult.relicHealPercent > 0) {
      const healPercent = xpGainResult.relicHealPercent;
      updatedTeam = updatedTeam.map(poke => ({
        ...poke,
        stats: {
          ...poke.stats,
          hp: poke.stats.hp > 0
            ? Math.min(poke.stats.hp + Math.floor(poke.stats.hp_max * healPercent), poke.stats.hp_max)
            : 0,
        },
      }));
      setBattleLog(prev => [...prev, `🌿 Relics heal team for ${Math.round(healPercent * 100)}% HP!`]);
    }

    // Update team state
    setTeam(updatedTeam);

    // Check for pending move learns
    if (xpGainResult.pendingMoveLearn && xpGainResult.pendingMoveLearn.length > 0) {
      // Build queue of move learns with pokemon data from updated team
      // Structure: { pokemonIndex, pokemon, newMove }
      const queue = xpGainResult.pendingMoveLearn.map(pending => {
        // Get the latest pokemon data from updated team
        const pokemon = updatedTeam[pending.pokemonIndex];
        return {
          pokemon,
          newMove: pending.newMove,
          pokemonIndex: pending.pokemonIndex
        };
      }).filter(item => item.pokemon && item.newMove);

      if (queue.length > 0) {
        setMoveLearningQueue(queue.slice(1)); // Rest of queue
        setPendingMoveLearn(queue[0]); // First one to learn
        setXpGainResult(null);
        setTeamBeforeXP(null);
        return; // Don't proceed to rewards yet
      }
    }

    // Clear XP gain screen state to proceed to rewards
    setXpGainResult(null);
    setTeamBeforeXP(null);
  };

  /**
   * Handle learning a new move - replace old move with new one
   */
  const handleLearnMove = (pokemon, newMove, moveIndex, oldMove) => {
    // Update the pokemon's moves in team
    const updatedTeam = team.map((poke, idx) => {
      if (idx === pendingMoveLearn.pokemonIndex) {
        const updatedMoves = [...poke.moves];
        updatedMoves[moveIndex] = {
          ...newMove,
          pp: newMove.maxPP,
        };
        return { ...poke, moves: updatedMoves };
      }
      return poke;
    });

    setTeam(updatedTeam);
    setBattleLog(prev => [...prev, `📚 ${pokemon.name} learned ${newMove.name}! (forgot ${oldMove.name})`]);

    // Process next in queue or clear
    processNextMoveLearn();
  };

  /**
   * Handle declining to learn a move
   */
  const handleDeclineMoveLearn = () => {
    if (pendingMoveLearn) {
      setBattleLog(prev => [...prev, `${pendingMoveLearn.pokemon.name} did not learn ${pendingMoveLearn.newMove.name}.`]);
    }
    processNextMoveLearn();
  };

  /**
   * Process the next move learn in queue or proceed to rewards
   */
  const processNextMoveLearn = () => {
    if (moveLearningQueue.length > 0) {
      // Get next pokemon from queue
      const [next, ...rest] = moveLearningQueue;
      // Update pokemon reference from current team state
      const pokemonIndex = team.findIndex(p => p.name === next.pokemon.name);
      const pokemon = team[pokemonIndex];
      setPendingMoveLearn({ ...next, pokemon, pokemonIndex });
      setMoveLearningQueue(rest);
    } else {
      // All done, proceed to rewards
      setPendingMoveLearn(null);
      setMoveLearningQueue([]);
    }
  };

  const handleRewardApply = async (type, index, rewardData = null) => {
    const updatedTeam = [...team];

    if (type === "heal") {
      playHealSound();
      const healAmount = rewardData?.value || 20;
      updatedTeam[index] = {
        ...updatedTeam[index],
        stats: {
          ...updatedTeam[index].stats,
          hp: healAmount === 999
            ? updatedTeam[index].stats.hp_max
            : Math.min(updatedTeam[index].stats.hp + healAmount, updatedTeam[index].stats.hp_max),
        },
      };
      setTeam(updatedTeam);
      setHighlighted({ index, stat: "hp" });
    } else if (type === "buff") {
      playLevelUpSound();
      const stat = rewardData?.stat || 'attack';
      const buffValue = rewardData?.value || 10;

      if (stat === 'all') {
        // Buff all stats
        updatedTeam[index] = {
          ...updatedTeam[index],
          stats: {
            ...updatedTeam[index].stats,
            attack: updatedTeam[index].stats.attack + buffValue,
            defense: updatedTeam[index].stats.defense + buffValue,
            special_attack: updatedTeam[index].stats.special_attack + buffValue,
            special_defense: updatedTeam[index].stats.special_defense + buffValue,
            speed: updatedTeam[index].stats.speed + buffValue,
          },
        };
      } else {
        // Buff specific stat
        updatedTeam[index] = {
          ...updatedTeam[index],
          stats: {
            ...updatedTeam[index].stats,
            [stat]: updatedTeam[index].stats[stat] + buffValue,
          },
        };
      }
      setTeam(updatedTeam);
      setHighlighted({ index, stat });
    } else if (type === "revive") {
      playHealSound();
      const revivePercent = rewardData?.value || 0.5;
      updatedTeam[index] = {
        ...updatedTeam[index],
        stats: {
          ...updatedTeam[index].stats,
          hp: Math.floor(updatedTeam[index].stats.hp_max * revivePercent),
        },
      };
      setTeam(updatedTeam);
      setHighlighted({ index, stat: "hp" });
    } else if (type === "teamHeal") {
      playHealSound();
      const healAmount = rewardData?.value || 30;
      const healedTeam = updatedTeam.map(mon => ({
        ...mon,
        stats: {
          ...mon.stats,
          hp: Math.min(mon.stats.hp + healAmount, mon.stats.hp_max),
        },
      }));
      setTeam(healedTeam);
      setHighlighted(null);
      setPendingReward(null);
      setRewardApplied(true);
      return;
    } else if (type === "ppRestore") {
      playHealSound();
      const ppAmount = rewardData?.value || 10;
      updatedTeam[index] = {
        ...updatedTeam[index],
        moves: updatedTeam[index].moves.map(move => ({
          ...move,
          pp: Math.min(move.pp + ppAmount, move.maxPP),
        })),
      };
      setTeam(updatedTeam);
      setHighlighted({ index, stat: "pp" });
    } else if (type === "catch") {
      // Calculate capture level based on floor and ball type bonus
      const levelBonus = rewardData?.levelBonus || 0;
      const captureLevel = calculateCaptureLevel(floor, levelBonus);
      console.log(`[CATCH] Floor: ${floor}, Level bonus: ${levelBonus}, Capture level: ${captureLevel}`);

      const newMon = await getRandomPokemon(captureLevel);
      console.log(`[CATCH] Current team size: ${team.length}, newMon: ${newMon.name} Lv.${newMon.level}`);

      if (team.length < 6) {
        const newTeam = [...team, newMon];
        console.log(`[CATCH] Adding to team. New size: ${newTeam.length}`);

        // Safety check: ensure team never exceeds 6
        if (newTeam.length <= 6) {
          playCatchSound();
          setTeam(newTeam);
          setHighlighted(null);
          setPendingReward(null);
          setRewardApplied(true);
          setBattleLog(prev => [...prev, `🎉 Caught ${newMon.name} (Lv.${newMon.level})!`]);
        } else {
          console.error(`[CATCH] Team size would exceed 6! (would be ${newTeam.length}). Opening release mode.`);
          setNewMon(newMon);
          setReleaseMode(true);
          setPendingReward(null);
        }
      } else {
        console.log(`[CATCH] Team full (${team.length}/6). Opening release mode.`);
        setNewMon(newMon);
        setReleaseMode(true);
        setPendingReward(null);
      }

      return; // prevent shared code below from running
    } else if (type === "relic") {
      // Get a random relic of the specified tier
      const relicTierMap = {
        common: RELIC_TIERS.COMMON,
        uncommon: RELIC_TIERS.UNCOMMON,
        rare: RELIC_TIERS.RARE,
        legendary: RELIC_TIERS.LEGENDARY,
      };
      const tier = relicTierMap[rewardData?.relicTier] || RELIC_TIERS.COMMON;
      const relic = getRandomRelic(tier);

      if (relic) {
        playLevelUpSound();
        setRelics(prev => [...prev, relic]);
        setBattleLog(prev => [...prev, `🎁 Obtained ${relic.name}!`]);

        // Persist relic discovery to localStorage
        discoverRelic(relic.id);
      }

      setPendingReward(null);
      setRewardApplied(true);
      return;
    }

    // ✅ Shared cleanup (for heal and buff)
    setTimeout(() => setHighlighted(null), 2000);
    setPendingReward(null);
    setRewardApplied(true);
  };

  return (
    <ScreenShake
      trigger={screenShakeTrigger.active}
      damage={screenShakeTrigger.damage}
      maxDamage={100}
    >
      <div className="h-screen flex overflow-hidden">
        {/* Weather Effects - behind everything */}
        <WeatherEffects
          weatherId={currentWeather}
          intensity={floor >= 15 ? 1.5 : 1.0}
          className="z-0"
        />

        {/* Battle Effects Overlay */}
        <div className="fixed inset-0 pointer-events-none z-40">
          <AttackAnimation
            isActive={!!currentAttack}
            attackerType={currentAttack?.attackerType}
            isCritical={currentAttack?.isCritical}
            effectiveness={currentAttack?.effectiveness}
            damage={currentAttack?.damage || 50}
          />
          <DamagePopup
            damage={damageDisplay?.damage}
            isCritical={damageDisplay?.isCritical}
            effectiveness={damageDisplay?.effectiveness}
            isActive={!!damageDisplay}
            position="center"
          />
          {/* Attack VFX particles */}
          <AttackVFX
            isActive={attackVFX.active}
            moveType={attackVFX.type}
            targetX={attackVFX.targetX}
            targetY={attackVFX.targetY}
            isCritical={attackVFX.isCritical}
            effectiveness={attackVFX.effectiveness}
            onComplete={() => setAttackVFX(prev => ({ ...prev, active: false }))}
          />
        </div>

        {/* LEFT SIDEBAR - Fixed */}
        <motion.div
          className="w-64 flex-shrink-0 bg-gradient-to-b from-black/60 to-black/40 backdrop-blur-md border-r border-white/10 p-4 flex flex-col gap-4 justify-between"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex flex-col gap-4">
            {/* Floor Counter */}
            <div className="flex-shrink-0">
              <FloorCounter floor={floor} showProgress={true} maxFloors={20} />
            </div>

            {/* Relics Panel */}
            <div className="flex-shrink-0">
              <RelicsPanel compact={false} disableTooltip={true} />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {/* Mega Evolution Button */}
            {!battle.result && team[activeIndex] && enemyTeam[0] && !hasMegaEvolved && team[activeIndex].heldItem && getItemById(team[activeIndex].heldItem)?.effect?.type === 'mega_stone' && (
              <motion.button
                className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white w-full py-3 text-lg font-bold flex items-center justify-center gap-2 rounded-lg shadow-lg border-2 border-pink-400/50"
                onClick={handleMegaEvolve}
                disabled={isBattleInProgress}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(236, 72, 153, 0.5)',
                    '0 0 30px rgba(168, 85, 247, 0.8)',
                    '0 0 20px rgba(236, 72, 153, 0.5)',
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                💎 Mega Evolve!
              </motion.button>
            )}

            {/* Attack Button - NvM Combat */}
            {!battle.result && nvmBattle && awaitingPlayerMove && (
              <motion.button
                className="btn-primary w-full py-3 text-lg font-bold flex items-center justify-center gap-2"
                onClick={handleOpenAttackModal}
                disabled={isBattleInProgress}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  boxShadow: [
                    '0 0 10px rgba(59, 130, 246, 0.5)',
                    '0 0 20px rgba(59, 130, 246, 0.8)',
                    '0 0 10px rgba(59, 130, 246, 0.5)',
                  ],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                ⚔️ Attack! ({nvmBattle.getCurrentCombatant()?.pokemon?.name})
              </motion.button>
            )}

            {/* Legacy Attack Button (fallback) */}
            {!battle.result && !nvmBattle && team[activeIndex] && enemyTeam[0] && (
              <motion.button
                className="btn-primary w-full py-3 text-lg font-bold flex items-center justify-center gap-2"
                onClick={handleOpenAttackModal}
                disabled={isBattleInProgress}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ⚔️ Attack!
              </motion.button>
            )}

            {/* Items Button */}
            {!battle.result && team[activeIndex] && enemyTeam[0] && (
              <motion.button
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white w-full py-3 text-lg font-bold flex items-center justify-center gap-2 rounded-lg shadow-lg border-2 border-purple-400/50"
                onClick={() => {
                  playMenuSelect();
                  setShowInventory(true);
                }}
                disabled={isBattleInProgress}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🎒 Items
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Audio Controls - Keep original position (fixed bottom-right) */}
        <AudioControls />

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 overflow-auto px-4 py-3">
          <div className="flex flex-col gap-2 h-full">

            {/* Enemy Team Section */}
            <motion.div
              className="flex-shrink-0"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="glass-card p-3 border-2 border-red-500/50 bg-gradient-to-b from-red-900/20 to-transparent">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-red-400 flex items-center gap-2">
                    <span className="text-2xl">👾</span>
                    Enemy Team
                  </h3>
                  {enemyTeam[0] && (
                    <div className="text-sm text-white/60">
                      Lv. {enemyTeam[0].level || floor}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                  {enemyTeam.map((poke, i) => (
                    <motion.div
                      key={poke.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                    >
                      <PokemonCard
                        poke={{ ...poke, isEnemy: true }}
                        isAttacking={attackingPokemon === "enemy"}
                        mode={nvmBattle ? "nvm_combat" : "default"}
                        isCurrentTurn={nvmBattle?.currentTurn?.isEnemy && nvmBattle?.currentTurn?.teamIndex === i}
                        enemyIntent={enemyTargeting[poke.id] ? {
                          moveName: enemyTargeting[poke.id].move?.name,
                          targetName: enemyTargeting[poke.id].target?.pokemon?.name
                        } : null}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Battle Log + Turn Order Row */}
            <motion.div
              className="flex-shrink-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                {/* Battle Log - Left */}
                <div className="glass-card p-3 bg-black/40 border-2 border-green-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-bold text-green-400 flex items-center gap-1">
                      📜 Battle Log
                      {battleLog.length > 0 && (
                        <span className="text-xs px-1.5 py-0.5 bg-green-500/20 rounded-full">
                          {battleLog.length}
                        </span>
                      )}
                    </h3>
                  </div>

                  <div className="space-y-1 h-16 overflow-y-auto pr-2 custom-scrollbar">
                    <AnimatePresence mode="popLayout">
                      {battleLog.slice(-2).map((msg, i) => (
                        <motion.div
                          key={`log-${battleLog.length - 2 + i}`}
                          className="p-1.5 rounded bg-black/30 border border-green-500/10"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <p className="text-xs text-green-400/90 font-mono leading-tight">
                            {msg}
                          </p>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {battleLog.length === 0 && (
                      <p className="text-center text-white/30 text-xs py-4 italic">
                        Waiting for battle...
                      </p>
                    )}
                  </div>
                </div>

                {/* Turn Order - Right (NvM Combat) */}
                {nvmBattle && turnOrderDisplay.length > 0 && !battle.result ? (
                  <TurnOrderDisplay
                    turnOrder={turnOrderDisplay}
                    currentTurnIndex={currentTurnIndex}
                    roundNumber={roundNumber}
                    isVisible={!battle.result}
                    onCombatantClick={(combatant) => {
                      // Show targeting info on click
                      if (combatant.isEnemy && awaitingPlayerMove && selectedMove) {
                        setSelectedTargetId(combatant.id);
                      }
                    }}
                    compact={false}
                  />
                ) : (
                  <div className="glass-card p-3 border-2 border-white/10 flex items-center justify-center">
                    <p className="text-white/40 italic text-xs">
                      {nvmBattle ? 'Preparing battle...' : 'Turn order will appear here'}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Player Team Section */}
            <motion.div
              className="flex-shrink-0"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="glass-card p-3 border-2 border-blue-500/50 bg-gradient-to-t from-blue-900/20 to-transparent">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-blue-400 flex items-center gap-1">
                    <span className="text-lg">🎒</span>
                    Your Team
                  </h3>
                  <div className="text-xs text-white/60">
                    {team.filter(p => p.stats.hp > 0).length}/{team.length} Active
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                  {team.map((poke, i) => (
                    <motion.div
                      key={poke.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={
                        pendingReward
                          ? {
                              opacity: 1,
                              scale: [1, 1.05, 1],
                              boxShadow: [
                                "0 0 0px rgba(99,102,241,0)",
                                "0 0 20px rgba(99,102,241,0.8)",
                                "0 0 0px rgba(99,102,241,0)",
                              ],
                            }
                          : { opacity: 1, scale: 1 }
                      }
                      transition={
                        pendingReward
                          ? {
                              duration: 1.5,
                              repeat: Infinity,
                              delay: 0.3 + i * 0.1,
                            }
                          : { delay: 0.3 + i * 0.1 }
                      }
                    >
                      <PokemonCard
                        poke={{ ...poke, isActive: i === activeIndex }}
                        highlight={highlight}
                        onSwitch={nvmBattle ? null : () => handleSwitch(i)}
                        onRewardClick={
                          pendingReward
                            ? () => handleRewardApply(pendingReward.type, i, pendingReward.data)
                            : null
                        }
                        mode={nvmBattle ? "nvm_combat" : "default"}
                        isAttacking={attackingPokemon === i}
                        isCurrentTurn={nvmBattle && !nvmBattle.currentTurn?.isEnemy && nvmBattle.currentTurn?.teamIndex === i}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ATTACK MODAL */}
      <AnimatePresence>
        {showMoveModal && !battle.result && team[activeIndex]?.moves && enemyTeam[0] && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowMoveModal(false)}
          >
            <motion.div
              className="max-w-2xl w-full"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="glass-card p-6 border-2 border-gaming-accent">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gaming-accent">
                    Choose Your Attack
                  </h2>
                  <button
                    className="text-white/60 hover:text-white text-2xl"
                    onClick={() => setShowMoveModal(false)}
                  >
                    ✕
                  </button>
                </div>

                <MoveSelector
                  moves={nvmBattle?.getCurrentCombatant()?.pokemon?.moves || team[activeIndex]?.moves || []}
                  onSelectMove={handleMoveSelect}
                  disabled={isBattleInProgress}
                  enemyTypes={enemyTeam[0]?.types || []}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TARGET SELECTOR MODAL (NvM Combat) */}
      <AnimatePresence>
        {showTargetSelector && selectedMove && nvmBattle && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setShowTargetSelector(false);
              setSelectedMove(null);
            }}
          >
            <motion.div
              className="max-w-xl w-full"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <TargetSelector
                move={selectedMove}
                attacker={nvmBattle.getCurrentCombatant()}
                validTargets={
                  selectedMove.target === TARGET_TYPES.SINGLE_ALLY
                    ? nvmBattle.getPlayerCombatants().filter(c => c.id !== nvmBattle.getCurrentCombatant()?.id)
                    : nvmBattle.getEnemyCombatants()
                }
                selectedTargetId={selectedTargetId}
                onSelectTarget={(id) => setSelectedTargetId(id)}
                onConfirm={handleTargetConfirm}
                onCancel={() => {
                  setShowTargetSelector(false);
                  setSelectedMove(null);
                  setSelectedTargetId(null);
                }}
                battleState={nvmBattle}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* INVENTORY MODAL */}
      <AnimatePresence>
        {showInventory && !battle.result && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowInventory(false)}
          >
            <motion.div
              className="max-w-2xl w-full"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="glass-card p-6 border-2 border-purple-500">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-purple-400">
                    Choose an Item
                  </h2>
                  <button
                    className="text-white/60 hover:text-white text-2xl"
                    onClick={() => setShowInventory(false)}
                  >
                    ✕
                  </button>
                </div>

                <InventoryPanel
                  onUseItem={handleItemUse}
                  disabled={isBattleInProgress}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ITEM TARGET SELECTION */}
      <AnimatePresence>
        {selectedItem && !battle.result && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="max-w-4xl w-full"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
            >
              <div className="glass-card p-6 border-2 border-gaming-warning">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{selectedItem.icon}</span>
                    <div>
                      <h2 className="text-2xl font-bold text-gaming-warning">
                        {selectedItem.name}
                      </h2>
                      <p className="text-white/70 text-sm">{selectedItem.description}</p>
                    </div>
                  </div>
                  <button
                    className="text-white/60 hover:text-white text-2xl"
                    onClick={() => setSelectedItem(null)}
                  >
                    ✕
                  </button>
                </div>

                <p className="text-center text-white/80 mb-4 text-lg">
                  👆 Select a Pokémon to use this item on
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {team.map((poke, i) => (
                    <motion.div
                      key={poke.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <PokemonCard
                        poke={poke}
                        onRewardClick={() => handleItemApply(i)}
                        mode="default"
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* XP Gain Screen - Shows before rewards */}
      <AnimatePresence>
        {battle.result === "win" && xpGainResult && teamBeforeXP && (
          <XPGainScreen
            xpResult={xpGainResult}
            originalTeam={teamBeforeXP}
            onComplete={handleXPGainComplete}
          />
        )}
      </AnimatePresence>

      {/* Move Learning Modal - Shows after XP screen if pokemon want to learn moves */}
      <MoveLearningModal
        isOpen={!!pendingMoveLearn}
        onClose={handleDeclineMoveLearn}
        pokemon={pendingMoveLearn?.pokemon}
        newMove={pendingMoveLearn?.newMove}
        onLearnMove={handleLearnMove}
        onDecline={handleDeclineMoveLearn}
        source="level-up"
      />

      {/* Reward Screen - Shows after XP screen and move learning */}
      <AnimatePresence>
        {battle.result === "win" && !xpGainResult && !pendingMoveLearn && !reward && !pendingReward && !rewardApplied && (
          <RewardScreen
            setPendingReward={setPendingReward}
            onApplyReward={handleRewardApply}
          />
        )}
      </AnimatePresence>

      {/* Pending Reward Indicator */}
      <AnimatePresence>
        {pendingReward && (
          <motion.div
            className="fixed top-8 left-1/2 -translate-x-1/2 z-40"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="p-4 border-2 border-gaming-warning">
              <div className="flex items-center gap-3">
                <motion.div
                  className="text-4xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                  }}
                >
                  {pendingReward.data?.icon || "💊"}
                </motion.div>
                <div>
                  <p className="text-lg font-bold text-gaming-warning">
                    {pendingReward.data?.title || pendingReward.type} Selected
                  </p>
                  <p className="text-sm text-white/80">
                    👆 Click on a Pokémon to apply
                  </p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setPendingReward(null)}
                >
                  ✕
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Release Mode Modal */}
      <AnimatePresence>
        {releaseMode && newMon && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="glass-card p-6 max-w-4xl w-full"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <h3 className="text-2xl font-bold mb-6 text-gaming-warning text-center">
                ⚠️ Your team is full. Choose one Pokémon to release:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {team.map((poke, i) => (
                  <PokemonCard
                    key={poke.id}
                    poke={poke}
                    onRewardClick={() => {
                      console.log(`[RELEASE] Releasing Pokemon at index ${i}. Current team size: ${team.length}`);
                      const trimmedTeam = [...team];
                      trimmedTeam.splice(i, 1);
                      const updatedTeam = [...trimmedTeam, newMon];
                      console.log(`[RELEASE] After release + add. New team size: ${updatedTeam.length}`);

                      // Safety check: ensure team never exceeds 6
                      if (updatedTeam.length <= 6) {
                        playCatchSound();
                        setTeam(updatedTeam);
                        setReleaseMode(false);
                        setNewMon(null);
                        setHighlighted(null);
                        setRewardState(null);
                        // Don't reset battle.result here - keep "win" so Continue button shows
                        setRewardApplied(true);
                      } else {
                        console.error(`[RELEASE] Team size would exceed 6! (would be ${updatedTeam.length}). Aborting.`);
                      }
                    }}
                  />
                ))}
              </div>
              <div className="flex justify-center">
                <Button
                  variant="danger"
                  onClick={() => {
                    setReleaseMode(false);
                    setNewMon(null);
                    setRewardState(null);
                  }}
                >
                  ❌ Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Over Screen */}
      <AnimatePresence>
        {battle.result === "lose" && <GameOverScreen />}
      </AnimatePresence>

      {/* Continue Button after reward applied */}
      <AnimatePresence>
        {battle.result === "win" && rewardApplied && !releaseMode && (
          <motion.div
            className="fixed bottom-8 right-8 z-50"
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <Button
              onClick={() => {
                // Reset battle state before returning to map
                setRewardState(null);
                setBattle({ playerHP: null, enemyHP: null, result: null });
                setRewardApplied(false);

                if (onFloorComplete) {
                  onFloorComplete();
                }
              }}
              className="btn-primary px-8 py-4 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-2xl"
            >
              Continue to Map →
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </ScreenShake>
  );
}
