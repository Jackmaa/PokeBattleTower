import React, { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { teamState } from "../recoil/atoms/team";
import { floorState } from "../recoil/atoms/floor";
import { enemyTeamState } from "../recoil/atoms/enemy";
import { generateEnemyTeam } from "../utils/generateEnemyTeam";

export default function FloorScreen() {
  const team = useRecoilValue(teamState);
  const [enemyTeam, setEnemyTeam] = useRecoilState(enemyTeamState);
  const [floor] = useRecoilState(floorState);

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

      <button onClick={() => alert("Combat coming soon...")}>Attack!</button>
    </div>
  );
}
