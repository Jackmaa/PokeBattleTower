// 📁 TurnOrderDisplay.jsx
// Displays turn order based on speed

import { motion } from "framer-motion";
import { Card } from "./ui";

export default function TurnOrderDisplay({ playerPokemon, enemyPokemon, isVisible = true }) {
  if (!isVisible || !playerPokemon || !enemyPokemon) return null;

  const playerSpeed = playerPokemon.stats?.speed || 0;
  const enemySpeed = enemyPokemon.stats?.speed || 0;

  const isPlayerFirst = playerSpeed >= enemySpeed;
  const speedDifference = Math.abs(playerSpeed - enemySpeed);

  return (
    <motion.div
      className="mb-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className="p-4">
        <div className="flex items-center justify-center gap-4">
          {/* First Pokemon */}
          <motion.div
            className="flex items-center gap-2"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {isPlayerFirst ? (
              <>
                <img
                  src={playerPokemon.sprite}
                  alt={playerPokemon.name}
                  className="w-12 h-12 object-contain"
                />
                <div className="text-left">
                  <p className="font-bold text-sm capitalize">{playerPokemon.name}</p>
                  <p className="text-xs text-gaming-success">⚡ {playerSpeed}</p>
                </div>
              </>
            ) : (
              <>
                <img
                  src={enemyPokemon.sprite}
                  alt={enemyPokemon.name}
                  className="w-12 h-12 object-contain"
                />
                <div className="text-left">
                  <p className="font-bold text-sm capitalize">{enemyPokemon.name}</p>
                  <p className="text-xs text-gaming-danger">⚡ {enemySpeed}</p>
                </div>
              </>
            )}
          </motion.div>

          {/* Arrow and indicator */}
          <motion.div
            className="flex flex-col items-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
          >
            <motion.div
              className="text-2xl"
              animate={{
                x: [0, 5, 0],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              →
            </motion.div>
            <p className="text-xs text-white/70 mt-1">
              {speedDifference === 0 ? "Tie!" : `+${speedDifference}`}
            </p>
          </motion.div>

          {/* Second Pokemon */}
          <motion.div
            className="flex items-center gap-2"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {!isPlayerFirst ? (
              <>
                <div className="text-left">
                  <p className="font-bold text-sm capitalize">{playerPokemon.name}</p>
                  <p className="text-xs text-gaming-success">⚡ {playerSpeed}</p>
                </div>
                <img
                  src={playerPokemon.sprite}
                  alt={playerPokemon.name}
                  className="w-12 h-12 object-contain"
                />
              </>
            ) : (
              <>
                <div className="text-left">
                  <p className="font-bold text-sm capitalize">{enemyPokemon.name}</p>
                  <p className="text-xs text-gaming-danger">⚡ {enemySpeed}</p>
                </div>
                <img
                  src={enemyPokemon.sprite}
                  alt={enemyPokemon.name}
                  className="w-12 h-12 object-contain"
                />
              </>
            )}
          </motion.div>
        </div>

        <motion.p
          className="text-center text-xs text-white/60 mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {isPlayerFirst ? "Your Pokémon attacks first!" : "Enemy attacks first!"}
        </motion.p>
      </Card>
    </motion.div>
  );
}
