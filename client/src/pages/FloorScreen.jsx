import React, { useEffect } from "react";
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
  const highlight = useRecoilValue(highlightedStatState);
  const reward = useRecoilValue(rewardState);

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

    // Update team with new HP
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
      setBattle({ playerHP, enemyHP, result: "lose" });
    }
  };

  return (
    <div className="floor-screen">
      <h2>🏯 Floor {floor}</h2>

      <h4>Choose your fighter:</h4>
      <select
        onChange={(e) => setActiveIndex(parseInt(e.target.value))}
        value={activeIndex}
      >
        {team.map((poke, i) => (
          <option key={poke.id} value={i}>
            {poke.name.toUpperCase()} (HP: {poke.stats.hp})
          </option>
        ))}
      </select>

      <div className="team-section" style={{ display: "flex" }}>
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
          </div>
        ))}
      </div>

      <div className="team-section" style={{ display: "flex" }}>
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

      {!battle.result && (
        <button onClick={simulateBattle}>⚔️ Start Battle</button>
      )}

      {battle.result === "win" && !reward && <RewardScreen />}
      {battle.result === "lose" && <GameOverScreen />}
    </div>
  );
}
