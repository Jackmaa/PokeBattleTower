import React, { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { teamState } from "../recoil/atoms/team";
import { floorState } from "../recoil/atoms/floor";
import { enemyTeamState } from "../recoil/atoms/enemy";
import { generateEnemyTeam } from "../utils/generateEnemyTeam";
import { battleState } from "../recoil/atoms/battle";

export default function FloorScreen() {
  const team = useRecoilValue(teamState);
  const [enemyTeam, setEnemyTeam] = useRecoilState(enemyTeamState);
  const [floor] = useRecoilState(floorState);
  const [battle, setBattle] = useRecoilState(battleState);

  const simulateBattle = () => {
    const player = team[0];
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

    if (playerHP > 0) {
      setBattle({ playerHP, enemyHP, result: "win" });
    } else {
      setBattle({ playerHP, enemyHP, result: "lose" });
    }
  };

  useEffect(() => {
    const setupEnemy = async () => {
      const enemies = await generateEnemyTeam(1); // scale later with floor
      setEnemyTeam(enemies);
    };
    setupEnemy();
  }, [floor]);

  return (
    <div className="floor-screen">
      <h2>🏯 Floor {floor}</h2>

      <div className="team-section">
        <h3>Your Team</h3>
        {team.map((poke) => (
          <div key={poke.id} className="pokemon-card">
            <img src={poke.sprite} alt={poke.name} />
            <h4>{poke.name}</h4>
            <p>HP: {poke.stats.hp}</p>
          </div>
        ))}
      </div>

      <div className="team-section">
        <h3>Enemy Team</h3>
        {enemyTeam.map((poke) => (
          <div key={poke.id} className="pokemon-card enemy">
            <img src={poke.sprite} alt={poke.name} />
            <h4>{poke.name}</h4>
            <span>HP: {poke.stats.hp}</span>
          </div>
        ))}
      </div>

      <button onClick={simulateBattle}>Start Battle</button>
      {battle.result && (
        <div className="battle-result">
          {battle.result === "win" ? (
            <p>✅ You won the battle! Proceed to next floor.</p>
          ) : (
            <p>❌ You lost! Game over.</p>
          )}
        </div>
      )}
    </div>
  );
}
