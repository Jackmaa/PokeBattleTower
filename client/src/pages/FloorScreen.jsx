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

import { generateEnemyTeam } from "../utils/generateEnemyTeam";

import RewardScreen from "../components/RewardScreen";
import GameOverScreen from "../components/GameOverScreen";
import HealthBar from "../components/HealthBar";

export default function FloorScreen() {
  const [team, setTeam] = useRecoilState(teamState);
  const [floor, setFloor] = useRecoilState(floorState);
  const [enemyTeam, setEnemyTeam] = useRecoilState(enemyTeamState);
  const [battle, setBattle] = useRecoilState(battleState);
  const [activeIndex, setActiveIndex] = useRecoilState(activePokemonIndexState);
  const reward = useRecoilValue(rewardState);
  const highlight = useRecoilValue(highlightedStatState);
  const [battleLog, setBattleLog] = useRecoilState(battleLogState);

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
    setBattleLog([]);

    const calculateDamage = (attacker, defender) => {
      const attack = attacker.stats.attack;
      const defense = defender.stats.defense;

      const base = Math.floor(attack * (Math.random() * 0.5 + 0.75)); // entre 75% et 125% de ATK
      const reduced = Math.floor(defense * 0.5); // DEF réduit à 50%

      return Math.max(base - reduced, 1); // dégâts minimum : 1
    };
    while (playerHP > 0 && enemyHP > 0) {
      for (const turn of order) {
        await new Promise((resolve) => setTimeout(resolve, 700)); // délai visuel

        const dmg =
          turn === "player"
            ? calculateDamage(player, enemy)
            : calculateDamage(enemy, player);

        if (turn === "player") {
          enemyHP -= dmg;
          setBattleLog((log) => [
            ...log,
            `⚡ ${player.name} used Tackle! 💥 -${dmg} HP`,
          ]);

          const updatedEnemy = {
            ...enemy,
            stats: {
              ...enemy.stats,
              hp: Math.max(enemyHP, 0),
            },
          };
          setEnemyTeam([updatedEnemy]);
        } else {
          playerHP -= dmg;
          setBattleLog((log) => [
            ...log,
            `💢 ${enemy.name} attacks! -${dmg} HP`,
          ]);

          const updatedTeam = [...team];
          updatedTeam[activeIndex] = {
            ...updatedTeam[activeIndex],
            stats: {
              ...updatedTeam[activeIndex].stats,
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

  return (
    <div className="floor-screen">
      <h2>🏯 Floor {floor}</h2>

      <div className="team-section">
        <h3>Your Team</h3>
        {team.map((poke, i) => (
          <div key={poke.id} className="pokemon-card">
            <img src={poke.sprite} alt={poke.name} />
            <h4>{poke.name}</h4>
            <HealthBar current={poke.stats.hp} max={poke.stats.hp_max ?? 100} />
            <p
              className={
                highlight?.index === i && highlight?.stat === "attack"
                  ? "highlight"
                  : ""
              }
            >
              ATK: {poke.stats.attack}
            </p>
            <p>DEF: {poke.stats.defense}</p>
            <p>SPD: {poke.stats.speed}</p>
            <p>SPA: {poke.stats.special_attack}</p>
            <p>SPD: {poke.stats.special_defense}</p>
            {i === activeIndex && <strong>🟢 Active</strong>}
          </div>
        ))}
      </div>

      <div className="team-section">
        <h3>Enemy Team</h3>
        {enemyTeam.map((poke) => (
          <div key={poke.id} className="pokemon-card enemy">
            <img src={poke.sprite} alt={poke.name} />
            <h4>{poke.name}</h4>
            <HealthBar current={poke.stats.hp} max={poke.stats.hp_max ?? 100} />
            <p>ATK: {poke.stats.attack}</p>
            <p>DEF: {poke.stats.defense}</p>
            <p>SPD: {poke.stats.speed}</p>
            <p>SPA: {poke.stats.special_attack}</p>
            <p>SPD: {poke.stats.special_defense}</p>
          </div>
        ))}
      </div>

      {!battle.result && !isSwitching && (
        <div className="action-buttons">
          <button onClick={runTurnBasedBattle} disabled={isBattleInProgress}>
            ⚔️ Attack
          </button>
          <button
            onClick={() => setIsSwitching(true)}
            disabled={isBattleInProgress}
          >
            🔄 Switch Pokémon
          </button>
        </div>
      )}

      {isSwitching && (
        <div className="switch-menu">
          <h4>Choose a new active Pokémon:</h4>
          <div className="switch-options">
            {team.map((poke, i) => (
              <button
                key={poke.id}
                disabled={poke.stats.hp <= 0 || i === activeIndex}
                onClick={() => handleSwitch(i)}
              >
                {poke.name.toUpperCase()} (HP: {poke.stats.hp})
              </button>
            ))}
          </div>
        </div>
      )}

      {battle.result === "win" && !reward && <RewardScreen />}
      {battle.result === "lose" && <GameOverScreen />}

      <div className="battle-log">
        <h3>📜 Battle Log</h3>
        {battleLog.slice(-5).map((msg, i) => (
          <p key={i}>{msg}</p>
        ))}
      </div>
    </div>
  );
}
