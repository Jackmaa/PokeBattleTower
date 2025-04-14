import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { rewardState } from "../recoil/atoms/reward";
import { teamState } from "../recoil/atoms/team";
import { floorState } from "../recoil/atoms/floor";
import { getRandomPokemon } from "../utils/getRandomPokemon";
import { battleState } from "../recoil/atoms/battle";
import { highlightedStatState } from "../recoil/atoms/highlight";

export default function RewardScreen() {
  const [reward, setRewardState] = useRecoilState(rewardState);
  const [team, setTeam] = useRecoilState(teamState);
  const [floor, setFloor] = useRecoilState(floorState);
  const [, setBattle] = useRecoilState(battleState);
  const [, setHighlighted] = useRecoilState(highlightedStatState);

  const applyReward = async (type) => {
    setRewardState(type);

    if (type === "heal") {
      const randomIndex = Math.floor(Math.random() * team.length);
      const updatedTeam = [...team];
      const healedMon = {
        ...updatedTeam[randomIndex],
        stats: {
          ...updatedTeam[randomIndex].stats,
          hp: updatedTeam[randomIndex].stats.hp + 20,
        },
      };
      updatedTeam[randomIndex] = healedMon;
      setTeam(updatedTeam);
      setHighlighted({ index: randomIndex, stat: "hp" });
      setTimeout(() => setHighlighted(null), 2000);
    }

    if (type === "catch") {
      const newMon = await getRandomPokemon();
      setTeam([...team, newMon]);
    }

    if (type === "buff") {
      const updatedTeam = [...team];
      const buffed = {
        ...updatedTeam[0],
        stats: {
          ...updatedTeam[0].stats,
          attack: updatedTeam[0].stats.attack + 10,
        },
      };
      updatedTeam[0] = buffed;
      setTeam(updatedTeam);
      setHighlighted({ index: 0, stat: "attack" });
      setTimeout(() => setHighlighted(null), 2000);
    }

    setBattle({ playerHP: null, enemyHP: null, result: null });
    setRewardState(null);
    setFloor(floor + 1);
  };

  return (
    <div className="reward-screen">
      <h3>🎉 Choose your reward:</h3>
      <div className="reward-options">
        <button onClick={() => applyReward("heal")}>
          💉 Heal a team member
        </button>
        <button onClick={() => applyReward("catch")}>
          🎁 Catch a new Pokémon
        </button>
        <button onClick={() => applyReward("buff")}>
          💪 Buff starter's attack
        </button>
      </div>
    </div>
  );
}
