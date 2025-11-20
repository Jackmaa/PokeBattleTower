import React from "react";
import { useResetRecoilState } from "recoil";
import { motion } from "framer-motion";
import { Button, Card } from "./ui";

import { teamState } from "../recoil/atoms/team";
import { floorState } from "../recoil/atoms/floor";
import { battleState } from "../recoil/atoms/battle";
import { gameStartedState, gameViewState } from "../recoil/atoms/game";
import { activePokemonIndexState } from "../recoil/atoms/active";
import { rewardState } from "../recoil/atoms/reward";
import { highlightedStatState } from "../recoil/atoms/highlight";
import { battleLogState } from "../recoil/atoms/battleLog";
import { towerMapState, currentNodeState } from "../recoil/atoms/towerMap";
import { enemyTeamState } from "../recoil/atoms/enemy";

export default function GameOverScreen() {
  const resetTeam = useResetRecoilState(teamState);
  const resetFloor = useResetRecoilState(floorState);
  const resetBattle = useResetRecoilState(battleState);
  const resetGame = useResetRecoilState(gameStartedState);
  const resetGameView = useResetRecoilState(gameViewState);
  const resetActiveIndex = useResetRecoilState(activePokemonIndexState);
  const resetReward = useResetRecoilState(rewardState);
  const resetHighlight = useResetRecoilState(highlightedStatState);
  const resetBattleLog = useResetRecoilState(battleLogState);
  const resetTowerMap = useResetRecoilState(towerMapState);
  const resetCurrentNode = useResetRecoilState(currentNodeState);
  const resetEnemyTeam = useResetRecoilState(enemyTeamState);

  const restart = () => {
    // Reset all game states
    resetTeam();
    resetFloor();
    resetBattle();
    resetGame();
    resetGameView();
    resetActiveIndex();
    resetReward();
    resetHighlight();
    resetBattleLog();
    resetTowerMap();
    resetCurrentNode();
    resetEnemyTeam();
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="max-w-lg w-full"
        initial={{ scale: 0.5, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", duration: 0.6 }}
      >
        <Card className="p-8 border-2 border-gaming-danger/50">
          {/* Skull Animation */}
          <motion.div
            className="text-center mb-6"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="text-9xl mb-4">💀</div>
          </motion.div>

          {/* Title */}
          <motion.h2
            className="text-5xl font-bold text-center mb-4 text-gaming-danger"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Game Over
          </motion.h2>

          {/* Message */}
          <motion.p
            className="text-xl text-center text-white/80 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            You were defeated in the Battle Tower.
          </motion.p>

          {/* Restart Button */}
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Button
              variant="primary"
              size="lg"
              onClick={restart}
            >
              🔁 Try Again
            </Button>
          </motion.div>

          {/* Decorative particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-gaming-danger/30 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -100],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
