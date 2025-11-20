// 📁 MoveSelector.jsx
// Move selection UI for battle

import { motion } from "framer-motion";
import typeColors from "../utils/typeColors";
import { getTypeEffectiveness } from "../utils/typeChart";
import { Card } from "./ui";

export default function MoveSelector({ moves, onSelectMove, disabled = false, enemyTypes = [] }) {
  if (!moves || moves.length === 0) {
    return null;
  }

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <h3 className="text-xl font-bold mb-4 text-gaming-accent text-center">
        ⚔️ Choose Your Move
      </h3>

      <div className="grid grid-cols-2 gap-4">
        {moves.map((move, index) => {
          const typeColor = typeColors[move.type] || "#999";
          const isOutOfPP = move.pp <= 0;
          const effectiveness = enemyTypes.length > 0 ? getTypeEffectiveness(move.type, enemyTypes) : 1;

          return (
            <motion.button
              key={move.id || index}
              onClick={() => !isOutOfPP && !disabled && onSelectMove(move, index)}
              disabled={isOutOfPP || disabled}
              className={`relative p-4 rounded-lg border-2 transition-all duration-200 ${
                isOutOfPP || disabled
                  ? "opacity-50 cursor-not-allowed bg-gray-700/30"
                  : "hover:scale-105 cursor-pointer"
              }`}
              style={{
                borderColor: typeColor,
                backgroundColor: isOutOfPP
                  ? "#333"
                  : `${typeColor}20`,
              }}
              whileHover={!isOutOfPP && !disabled ? { y: -3 } : {}}
              whileTap={!isOutOfPP && !disabled ? { scale: 0.95 } : {}}
            >
              {/* Move Name */}
              <div className="text-left mb-2">
                <h4
                  className="font-bold text-lg"
                  style={{ color: typeColor }}
                >
                  {move.name}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-semibold uppercase"
                    style={{
                      backgroundColor: typeColor,
                      color: "#fff",
                    }}
                  >
                    {move.type}
                  </span>
                  <span className="text-xs text-white/70 capitalize">
                    {move.category}
                  </span>
                </div>
              </div>

              {/* Move Stats */}
              <div className="flex justify-between items-center text-sm mb-2">
                <div className="flex gap-3">
                  <span className="text-white/80">
                    💥 <span className="font-bold">{move.power}</span>
                  </span>
                  <span className="text-white/80">
                    🎯 <span className="font-bold">{move.accuracy}%</span>
                  </span>
                </div>
              </div>

              {/* PP Bar */}
              <div className="mt-2">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-white/70">PP</span>
                  <span className={`font-mono font-bold ${move.pp < move.maxPP * 0.3 ? 'text-red-400' : 'text-white'}`}>
                    {move.pp}/{move.maxPP}
                  </span>
                </div>
                <div className="w-full h-2 bg-black/30 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background:
                        move.pp === 0
                          ? "#666"
                          : move.pp < move.maxPP * 0.3
                          ? "linear-gradient(90deg, #ef4444, #dc2626)"
                          : move.pp < move.maxPP * 0.6
                          ? "linear-gradient(90deg, #f59e0b, #d97706)"
                          : "linear-gradient(90deg, #10b981, #059669)",
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(move.pp / move.maxPP) * 100}%` }}
                    transition={{ type: "spring", stiffness: 100 }}
                  />
                </div>
              </div>

              {/* Type Effectiveness Badge */}
              {effectiveness !== 1 && !isOutOfPP && (
                <div className="absolute -top-2 -right-2 z-10">
                  <motion.div
                    className={`px-2 py-1 rounded-full text-xs font-bold shadow-lg ${
                      effectiveness > 1
                        ? "bg-green-500 text-white"
                        : effectiveness === 0
                        ? "bg-gray-600 text-white"
                        : "bg-red-500 text-white"
                    }`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.1 }}
                  >
                    {effectiveness >= 2
                      ? "×2"
                      : effectiveness > 1
                      ? "×" + effectiveness
                      : effectiveness === 0
                      ? "×0"
                      : "×" + effectiveness}
                  </motion.div>
                </div>
              )}

              {/* Out of PP indicator */}
              {isOutOfPP && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-lg">
                  <span className="text-red-400 font-bold text-sm">
                    OUT OF PP
                  </span>
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {disabled && (
        <p className="text-center text-white/60 text-sm mt-4">
          Battle in progress...
        </p>
      )}
    </Card>
  );
}
