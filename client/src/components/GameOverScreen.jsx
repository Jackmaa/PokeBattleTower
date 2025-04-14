import React from "react";
import { useResetRecoilState } from "recoil";
import { teamState } from "../recoil/atoms/team";
import { floorState } from "../recoil/atoms/floor";
import { battleState } from "../recoil/atoms/battle";
import { gameStartedState } from "../recoil/atoms/game";

export default function GameOverScreen() {
  const resetTeam = useResetRecoilState(teamState);
  const resetFloor = useResetRecoilState(floorState);
  const resetBattle = useResetRecoilState(battleState);
  const resetGame = useResetRecoilState(gameStartedState);

  const restart = () => {
    resetTeam();
    resetFloor();
    resetBattle();
    resetGame();
  };

  return (
    <div className="game-over-screen">
      <h2>💀 Game Over</h2>
      <p>You were defeated in the Battle Tower.</p>
      <button onClick={restart}>🔁 Try Again</button>
    </div>
  );
}
