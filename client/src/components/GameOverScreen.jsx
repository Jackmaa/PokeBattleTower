import React from "react";
import { useResetRecoilState } from "recoil";

import { teamState } from "../recoil/atoms/team";
import { floorState } from "../recoil/atoms/floor";
import { battleState } from "../recoil/atoms/battle";
import { gameStartedState } from "../recoil/atoms/game";
import { activePokemonIndexState } from "../recoil/atoms/active";
import { rewardState } from "../recoil/atoms/reward";
import { highlightedStatState } from "../recoil/atoms/highlight";
import { battleLogState } from "../recoil/atoms/battleLog";

export default function GameOverScreen() {
  const resetTeam = useResetRecoilState(teamState);
  const resetFloor = useResetRecoilState(floorState);
  const resetBattle = useResetRecoilState(battleState);
  const resetGame = useResetRecoilState(gameStartedState);
  const resetActiveIndex = useResetRecoilState(activePokemonIndexState);

  // Si tu as d'autres atoms à resetter :
  const resetReward = useResetRecoilState(rewardState);
  const resetHighlight = useResetRecoilState(highlightedStatState);
  const resetBattleLog = useResetRecoilState(battleLogState);

  const restart = () => {
    resetTeam();
    resetFloor();
    resetBattle();
    resetGame();
    resetActiveIndex();
    resetReward();
    resetHighlight();
    resetBattleLog();
    // Ne reset pas pendingReward ici s’il est local à FloorScreen
  };

  return (
    <div className="game-over-screen">
      <h2>💀 Game Over</h2>
      <p>You were defeated in the Battle Tower.</p>
      <button onClick={restart}>🔁 Try Again</button>
    </div>
  );
}
