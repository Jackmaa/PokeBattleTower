// 📁 TypeEffectivenessIndicator.jsx
// Shows type matchup effectiveness before attacking

import { motion, AnimatePresence } from "framer-motion";
import { getTypeEffectiveness } from "../utils/typeChart";
import typeColors from "../utils/typeColors";

export default function TypeEffectivenessIndicator({
  attackerMove,
  defenderTypes,
  position = "center"
}) {
  if (!attackerMove || !defenderTypes) return null;

  const effectiveness = getTypeEffectiveness(attackerMove.type, defenderTypes);

  // Don't show if neutral
  if (effectiveness === 1) return null;

  const isEffective = effectiveness > 1;
  const moveTypeColor = typeColors[attackerMove.type] || "#999";

  const getEffectivenessText = () => {
    if (effectiveness >= 2) return "Super Effective!";
    if (effectiveness > 1) return "Effective";
    if (effectiveness === 0) return "No Effect";
    if (effectiveness <= 0.5) return "Not Very Effective";
    return "Resisted";
  };

  const getEffectivenessEmoji = () => {
    if (effectiveness >= 2) return "💥";
    if (effectiveness > 1) return "✨";
    if (effectiveness === 0) return "🚫";
    return "💧";
  };

  return (
    <motion.div
      className={`absolute ${
        position === "center" ? "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" :
        position === "top" ? "top-4 left-1/2 -translate-x-1/2" :
        "bottom-4 left-1/2 -translate-x-1/2"
      } z-50 pointer-events-none`}
      initial={{ opacity: 0, scale: 0.5, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.5, y: -20 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div
        className="glass-card px-6 py-3 rounded-xl border-2 shadow-lg"
        style={{
          borderColor: isEffective ? "#10b981" : "#ef4444",
          background: isEffective
            ? "linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.3))"
            : "linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.3))",
        }}
      >
        <div className="flex items-center gap-3">
          <motion.span
            className="text-3xl"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              repeatDelay: 0.5,
            }}
          >
            {getEffectivenessEmoji()}
          </motion.span>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-xs px-2 py-0.5 rounded-full font-semibold uppercase"
                style={{
                  backgroundColor: moveTypeColor,
                  color: "#fff",
                }}
              >
                {attackerMove.type}
              </span>
              <span className="text-lg">→</span>
              <div className="flex gap-1">
                {defenderTypes.map((type, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2 py-0.5 rounded-full font-semibold uppercase"
                    style={{
                      backgroundColor: typeColors[type] || "#999",
                      color: "#fff",
                    }}
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>

            <p
              className={`text-sm font-bold ${
                isEffective ? "text-green-300" : "text-red-300"
              }`}
            >
              {getEffectivenessText()} (×{effectiveness})
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
