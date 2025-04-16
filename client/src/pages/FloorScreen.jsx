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
import { getTypeEffectiveness } from "../utils/typeChart";
import { generateEnemyTeam } from "../utils/generateEnemyTeam";

import PokemonCard from "../components/PokemonCard";

import { getRandomPokemon } from "../utils/getRandomPokemon";
import RewardScreen from "../components/RewardScreen";
import GameOverScreen from "../components/GameOverScreen";

export default function FloorScreen() {
  const [newMon, setNewMon] = useState(null);
  const [releaseMode, setReleaseMode] = useState(false);
  const [team, setTeam] = useRecoilState(teamState);
  const [floor, setFloor] = useRecoilState(floorState);
  const [enemyTeam, setEnemyTeam] = useRecoilState(enemyTeamState);
  const [battle, setBattle] = useRecoilState(battleState);
  const [activeIndex, setActiveIndex] = useRecoilState(activePokemonIndexState);
  const [reward, setRewardState] = useRecoilState(rewardState);
  const [highlight, setHighlighted] = useRecoilState(highlightedStatState);
  const [battleLog, setBattleLog] = useRecoilState(battleLogState);
  const [pendingReward, setPendingReward] = useState(null);
  const [isSwitching, setIsSwitching] = useState(false);
  const [isBattleInProgress, setIsBattleInProgress] = useState(false);

  useEffect(() => {
    const setupEnemy = async () => {
      const enemies = await generateEnemyTeam(1);
      setEnemyTeam(enemies);
    };
    setupEnemy();
  }, [floor]);

  const runTurnBasedBattle = async () => {
    const player = team[activeIndex];
    const enemy = enemyTeam[0];

    if (!player || !player.stats || !enemy || !enemy.stats) {
      console.warn("Invalid battle data.");
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

    const calculateDamage = (attacker, defender) => {
      const attack = attacker.stats.attack;
      const defense = defender.stats.defense;

      const base = Math.floor(attack * (Math.random() * 0.5 + 0.75));
      const reduced = Math.floor(defense * 0.5);
      const baseDamage = Math.max(base - reduced, 1);

      const attackerType = attacker.types?.[0];
      const defenderTypes = defender.types || [];

      const typeMultiplier = getTypeEffectiveness(attackerType, defenderTypes);
      const finalDamage = Math.floor(baseDamage * typeMultiplier);

      return { finalDamage, typeMultiplier };
    };

    let previousPlayerHP = player.stats.hp;
    let previousEnemyHP = enemy.stats.hp;

    while (playerHP > 0 && enemyHP > 0) {
      for (const turn of order) {
        await new Promise((resolve) => setTimeout(resolve, 700)); // délai visuel

        const { finalDamage, typeMultiplier } =
          turn === "player"
            ? calculateDamage(player, enemy)
            : calculateDamage(enemy, player);

        let logMessage = "";

        if (turn === "player") {
          enemyHP -= finalDamage;
          logMessage = `⚡ ${player.name} used Tackle! 💥 -${finalDamage} HP`;
          if (typeMultiplier > 1) logMessage += " (Super effective!)";
          else if (typeMultiplier < 1) logMessage += " (Not very effective...)";
        } else {
          playerHP -= finalDamage;
          logMessage = `💢 ${enemy.name} attacks! -${finalDamage} HP`;
          if (typeMultiplier > 1) logMessage += " (Super effective!)";
          else if (typeMultiplier < 1) logMessage += " (Not very effective...)";
        }

        setBattleLog((log) => [...log, logMessage]);

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

    const updatedTeam = [...team];
    updatedTeam[activeIndex] = {
      ...updatedTeam[activeIndex],
      stats: {
        ...updatedTeam[activeIndex].stats,
        hp: Math.max(playerHP, 0),
      },
    };
    setTeam(updatedTeam);

    const updatedEnemy = {
      ...enemy,
      stats: {
        ...enemy.stats,
        hp: Math.max(enemyHP, 0),
      },
    };
    setEnemyTeam([updatedEnemy]);

    if (playerHP <= 0) {
      const nextAlive = updatedTeam.findIndex((mon) => mon.stats.hp > 0);
      if (nextAlive !== -1) {
        setActiveIndex(nextAlive);
        setBattle({ playerHP: 0, enemyHP, result: null });
      } else {
        setBattle({ playerHP: 0, enemyHP, result: "lose" });
      }
    } else {
      setBattle({ playerHP, enemyHP, result: "win" });
    }

    setIsBattleInProgress(false);
  };

  const handleSwitch = (index) => {
    setActiveIndex(index);
    setIsSwitching(false);
  };

  const handleRewardApply = async (type, index) => {
    const updatedTeam = [...team];

    if (type === "heal") {
      updatedTeam[index] = {
        ...updatedTeam[index],
        stats: {
          ...updatedTeam[index].stats,
          hp: updatedTeam[index].stats.hp + 20,
        },
      };
      setTeam(updatedTeam);
      setHighlighted({ index, stat: "hp" });
    } else if (type === "buff") {
      updatedTeam[index] = {
        ...updatedTeam[index],
        stats: {
          ...updatedTeam[index].stats,
          attack: updatedTeam[index].stats.attack + 10,
        },
      };
      setTeam(updatedTeam);
      setHighlighted({ index, stat: "attack" });
    } else if (type === "catch") {
      const newMon = await getRandomPokemon();

      if (team.length < 6) {
        setTeam([...updatedTeam, newMon]);
        setHighlighted(null);
        setPendingReward(null);
        setRewardState(null);
        setBattle({ playerHP: null, enemyHP: null, result: null });
        setFloor(floor + 1);
      } else {
        setNewMon(newMon);
        setReleaseMode(true);
        setPendingReward(null);
      }

      return; // prevent shared code below from running
    }

    // ✅ Shared cleanup (for heal and buff)
    setTimeout(() => setHighlighted(null), 2000);
    setPendingReward(null);
    setRewardState(null);
    setBattle({ playerHP: null, enemyHP: null, result: null });
    setFloor(floor + 1);
  };

  return (
    <div className="floor-screen">
      <h2>🏯 Floor {floor}</h2>

      <div className="arena-layout">
        <div className="team-column player-team">
          <h3>🎒 Your Team</h3>
          <div className="flex">
            {team.map((poke, i) => (
              <PokemonCard
                key={poke.id}
                poke={{ ...poke, isActive: i === activeIndex }}
                highlight={highlight}
                onSwitch={() => handleSwitch(i)}
                onRewardClick={
                  pendingReward
                    ? () => handleRewardApply(pendingReward, i)
                    : null
                }
                mode="default"
              />
            ))}
          </div>
        </div>

        <div className="team-column enemy-team">
          <h3>👾 Enemy Team</h3>
          <div className="flex">
            {enemyTeam.map((poke) => (
              <PokemonCard key={poke.id} poke={{ ...poke, isEnemy: true }} />
            ))}
          </div>
        </div>
      </div>
      <div className="arena-controls">
        {!battle.result && (
          <button onClick={runTurnBasedBattle} disabled={isBattleInProgress}>
            ⚔️ Attack
          </button>
        )}
      </div>

      {battle.result === "win" && !reward && (
        <RewardScreen
          setPendingReward={setPendingReward}
          onApplyReward={handleRewardApply}
        />
      )}
      {releaseMode && newMon && (
        <div className="release-choice-panel">
          <h3>⚠️ Your team is full. Choose one Pokémon to release:</h3>
          <div className="flex">
            {team.map((poke, i) => (
              <PokemonCard
                key={poke.id}
                poke={poke}
                onRewardClick={() => {
                  const trimmedTeam = [...team];
                  trimmedTeam.splice(i, 1); // remove chosen
                  setTeam([...trimmedTeam, newMon]);

                  // Reset everything
                  setReleaseMode(false);
                  setNewMon(null);
                  setHighlighted(null);
                  setRewardState(null);
                  setBattle({ playerHP: null, enemyHP: null, result: null });
                  setFloor(floor + 1);
                }}
              />
            ))}
          </div>
          <button
            className="cancel-button"
            onClick={() => {
              setReleaseMode(false);
              setNewMon(null);
              setRewardState(null);
            }}
          >
            ❌ Cancel
          </button>
        </div>
      )}
      {battle.result === "lose" && <GameOverScreen />}

      <div className="battle-log-panel">
        <h3>📜 Battle Log</h3>
        {battleLog.slice(-5).map((msg, i) => (
          <p key={i}>{msg}</p>
        ))}
      </div>
    </div>
  );
}
