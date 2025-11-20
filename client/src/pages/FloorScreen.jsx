// 📁 FloorScreen.jsx
import React, { useEffect, useState } from "react";
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
import { currencyState } from "../recoil/atoms/inventory";
import { getNodeById } from "../utils/towerMap";
import { getTypeEffectiveness } from "../utils/typeChart";
import { generateEnemyTeam } from "../utils/generateEnemyTeam";

import PokemonCard from "../components/PokemonCard";
import { Button, Card } from "../components/ui";
import { motion, AnimatePresence } from "framer-motion";
import { FloorCounter, TowerMap } from "../components/tower";
import { AttackAnimation, DamagePopup, ScreenShake } from "../components/effects";

import { getRandomPokemon } from "../utils/getRandomPokemon";
import RewardScreen from "../components/RewardScreen";
import GameOverScreen from "../components/GameOverScreen";
import AudioControls from "../components/AudioControls";
import MoveSelector from "../components/MoveSelector";
import TurnOrderDisplay from "../components/TurnOrderDisplay";
import { useAudio } from "../hooks/useAudio";

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
  const [pendingReward, setPendingReward] = useState(null);
  const [rewardApplied, setRewardApplied] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const [isBattleInProgress, setIsBattleInProgress] = useState(false);

  // Battle effects state
  const [currentAttack, setCurrentAttack] = useState(null);
  const [damageDisplay, setDamageDisplay] = useState(null);
  const [screenShakeTrigger, setScreenShakeTrigger] = useState({ active: false, damage: 0 });
  const [selectedMove, setSelectedMove] = useState(null);
  const [attackingPokemon, setAttackingPokemon] = useState(null);
  const [showMoveModal, setShowMoveModal] = useState(false);

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

  useEffect(() => {
    const setupEnemy = async () => {
      const enemies = await generateEnemyTeam(1, floor);
      setEnemyTeam(enemies);
    };
    setupEnemy();

    // Play dynamic music based on floor
    playMusicForFloor(floor);
  }, [floor, playMusicForFloor]);

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

    const calculateDamage = (attacker, defender, move) => {
      // Use move power instead of fixed attack stat
      const movePower = move.power || 40;
      const attack = move.category === "special" ? attacker.stats.special_attack : attacker.stats.attack;
      const defense = move.category === "special" ? defender.stats.special_defense : defender.stats.defense;

      const base = Math.floor((movePower * attack / defense) * (Math.random() * 0.15 + 0.85));
      const baseDamage = Math.max(Math.floor(base / 5), 1);

      const moveType = move.type;
      const defenderTypes = defender.types || [];

      const typeMultiplier = getTypeEffectiveness(moveType, defenderTypes);
      const finalDamage = Math.floor(baseDamage * typeMultiplier);

      return { finalDamage, typeMultiplier, moveName: move.name, moveType };
    };

    let previousPlayerHP = player.stats.hp;
    let previousEnemyHP = enemy.stats.hp;

    while (playerHP > 0 && enemyHP > 0) {
      for (const turn of order) {
        await new Promise((resolve) => setTimeout(resolve, 700)); // délai visuel

        const currentMove = turn === "player" ? playerMove : enemyMove;
        const { finalDamage, typeMultiplier, moveName, moveType } =
          turn === "player"
            ? calculateDamage(player, enemy, currentMove)
            : calculateDamage(enemy, player, currentMove);

        // Check for critical hit (10% chance)
        const isCritical = Math.random() > 0.9;
        const actualDamage = isCritical ? Math.floor(finalDamage * 1.5) : finalDamage;

        let logMessage = "";
        const attacker = turn === "player" ? player : enemy;

        if (turn === "player") {
          enemyHP -= actualDamage;
          logMessage = `⚡ ${player.name} used ${moveName}! 💥 -${actualDamage} HP`;
          if (isCritical) logMessage += " (Critical Hit!)";
          if (typeMultiplier > 1) logMessage += " (Super effective!)";
          else if (typeMultiplier < 1) logMessage += " (Not very effective...)";
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
          const updatedEnemy = {
            ...enemy,
            stats: {
              ...enemy.stats,
              hp_prev: previousEnemyHP,
              hp: Math.max(enemyHP, 0),
            },
          };
          setEnemyTeam([updatedEnemy]);
        } else {
          const updatedTeam = [...team];
          updatedTeam[activeIndex] = {
            ...updatedTeam[activeIndex],
            stats: {
              ...updatedTeam[activeIndex].stats,
              hp_prev: previousPlayerHP,
              hp: Math.max(playerHP, 0),
            },
          };
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
    setTeam(updatedTeam);

    // Decrement enemy PP
    const enemyMoveIndex = enemy.moves.findIndex(m => m.id === enemyMove.id);
    const updatedEnemy = {
      ...enemy,
      moves: enemy.moves.map((m, idx) =>
        idx === enemyMoveIndex ? { ...m, pp: Math.max(m.pp - 1, 0) } : m
      ),
      stats: {
        ...enemy.stats,
        hp: Math.max(enemyHP, 0),
      },
    };
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

      // Award gold based on floor level
      const goldReward = 50 + (floor * 10);
      console.log(`[FloorScreen] Victory! Awarding ${goldReward} gold`);
      setCurrency(prev => prev + goldReward);
    }

    setIsBattleInProgress(false);
  };

  const handleSwitch = (index) => {
    playSwitchSound();
    setActiveIndex(index);
    setIsSwitching(false);
  };

  const handleMoveSelect = (move, moveIndex) => {
    if (move.pp <= 0 || isBattleInProgress) return;

    playMenuSelect();
    setSelectedMove(move);
    setShowMoveModal(false); // Close modal after selecting
    runTurnBasedBattle(move);
  };

  const handleOpenAttackModal = () => {
    if (!isBattleInProgress && team[activeIndex]?.stats.hp > 0) {
      playMenuSelect();
      setShowMoveModal(true);
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
      const newMon = await getRandomPokemon();
      console.log(`[CATCH] Current team size: ${team.length}, newMon:`, newMon.name);

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
          </div>

          <div className="flex flex-col gap-3">
            {/* Attack Button */}
            {!battle.result && team[activeIndex] && enemyTeam[0] && (
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

                {/* Turn Order - Right */}
                {!battle.result && team[activeIndex] && enemyTeam[0] && !isBattleInProgress ? (
                  <TurnOrderDisplay
                    playerPokemon={team[activeIndex]}
                    enemyPokemon={enemyTeam[0]}
                    isVisible={!battle.result}
                  />
                ) : (
                  <div className="glass-card p-3 border-2 border-white/10 flex items-center justify-center">
                    <p className="text-white/40 italic text-xs">Turn order will appear here</p>
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
                        onSwitch={() => handleSwitch(i)}
                        onRewardClick={
                          pendingReward
                            ? () => handleRewardApply(pendingReward.type, i, pendingReward.data)
                            : null
                        }
                        mode="default"
                        isAttacking={attackingPokemon === i}
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
                  moves={team[activeIndex].moves}
                  onSelectMove={handleMoveSelect}
                  disabled={isBattleInProgress}
                  enemyTypes={enemyTeam[0].types || []}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reward Screen */}
      <AnimatePresence>
        {battle.result === "win" && !reward && !pendingReward && !rewardApplied && (
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
                        setBattle({ playerHP: null, enemyHP: null, result: null });
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
