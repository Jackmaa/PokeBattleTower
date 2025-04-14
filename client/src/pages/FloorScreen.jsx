import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

import { teamState } from "../recoil/atoms/team";
import { floorState } from "../recoil/atoms/floor";
import { enemyTeamState } from "../recoil/atoms/enemy";
import { battleState } from "../recoil/atoms/battle";
import { rewardState } from "../recoil/atoms/reward";
import { activePokemonIndexState } from "../recoil/atoms/active";
import { highlightedStatState } from "../recoil/atoms/highlight";

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

  const [isSwitching, setIsSwitching] = useState(false);

  useEffect(() => {
    const setupEnemy = async () => {
      const enemies = await generateEnemyTeam(1);
      setEnemyTeam(enemies);
    };
    setupEnemy();
  }, [floor]);

  const simulateBattle = () => {
    const player = team[activeIndex];
    const enemy = enemyTeam[0];

    let playerHP = player.stats.hp;
    let enemyHP = enemy.stats.hp;

    const playerSpeed = player.stats.speed;
    const enemySpeed = enemy.stats.speed;
    if (!player || !player.stats) {
      console.warn("Invalid active Pokémon");
      return;
    }
    const turnOrder =
      playerSpeed >= enemySpeed ? ["player", "enemy"] : ["enemy", "player"];

    while (playerHP > 0 && enemyHP > 0) {
      for (const turn of turnOrder) {
        const dmg = Math.floor(Math.random() * 10) + 5;
        if (turn === "player") {
          enemyHP -= dmg;
          if (enemyHP <= 0) break;
        } else {
          playerHP -= dmg;
          if (playerHP <= 0) break;
        }
      }
    }

    if (playerHP > 0) {
      const updatedTeam = [...team];
      const updatedMon = {
        ...updatedTeam[activeIndex],
        stats: {
          ...updatedTeam[activeIndex].stats,
          hp: playerHP,
        },
      };
      updatedTeam[activeIndex] = updatedMon;
      setTeam(updatedTeam);
      setBattle({ playerHP, enemyHP, result: "win" });
    } else {
      // Active Pokémon is KO, try to auto-switch
      const updatedTeam = [...team];
      updatedTeam[activeIndex] = {
        ...updatedTeam[activeIndex],
        stats: {
          ...updatedTeam[activeIndex].stats,
          hp: 0,
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

      // Find next available Pokémon with HP > 0
      const nextAlive = updatedTeam.findIndex((mon) => mon.stats.hp > 0);

      if (nextAlive !== -1) {
        setActiveIndex(nextAlive);
        setBattle({ playerHP: 0, enemyHP, result: null }); // Reset battle result (can re-attack)
      } else {
        setBattle({ playerHP: 0, enemyHP, result: "lose" });
      }
    }
  };

  // Optional: Enemy free attack after switch
  const simulateEnemyTurn = () => {
    const player = team[activeIndex];
    const enemy = enemyTeam[0];
    let playerHP = player.stats.hp;

    const dmg = Math.floor(Math.random() * 10) + 5;
    playerHP -= dmg;

    const updatedTeam = [...team];
    updatedTeam[activeIndex] = {
      ...player,
      stats: {
        ...player.stats,
        hp: Math.max(playerHP, 0),
      },
    };
    setTeam(updatedTeam);

    if (playerHP <= 0) {
      setBattle({ ...battle, result: "lose" });
    }
  };

  const handleSwitch = (index) => {
    setActiveIndex(index);
    setIsSwitching(false);

    // simulateEnemyTurn(); // <- Uncomment to apply "turn lost on switch"
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
          <button onClick={simulateBattle}>⚔️ Attack</button>
          <button onClick={() => setIsSwitching(true)}>
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
    </div>
  );
}
