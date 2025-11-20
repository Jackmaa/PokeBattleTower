import { motion, AnimatePresence } from "framer-motion";

/**
 * DamagePopup component for showing damage numbers
 *
 * @param {Object} props
 * @param {number} props.damage - Damage amount
 * @param {boolean} props.isCritical - Whether it's a critical hit
 * @param {number} props.effectiveness - Type effectiveness multiplier
 * @param {boolean} props.isActive - Whether to show the popup
 * @param {Object} props.position - Position {x, y} or 'center'
 */
export default function DamagePopup({
  damage,
  isCritical = false,
  effectiveness = 1,
  isActive = false,
  position = "center",
}) {
  const getEffectivenessText = () => {
    if (effectiveness > 1) return "Super Effective!";
    if (effectiveness < 1) return "Not very effective...";
    return "";
  };

  const damageColor = isCritical
    ? "text-gaming-warning"
    : effectiveness > 1
    ? "text-gaming-success"
    : effectiveness < 1
    ? "text-white/60"
    : "text-white";

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className={`absolute pointer-events-none ${
            position === "center" ? "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" : ""
          }`}
          style={
            position !== "center"
              ? {
                  left: position.x,
                  top: position.y,
                }
              : {}
          }
          initial={{ opacity: 0, y: 0, scale: isCritical ? 0.5 : 0.8 }}
          animate={{
            opacity: [0, 1, 1, 0],
            y: [-20, -80],
            scale: isCritical ? [0.5, 2, 1.5, 1] : [0.8, 1.5, 1.2, 1],
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <div className="flex flex-col items-center">
            {/* Damage Number */}
            <motion.div
              className={`text-6xl font-bold ${damageColor}`}
              style={{
                textShadow: isCritical
                  ? "0 0 20px rgba(245, 158, 11, 0.8), 0 4px 8px rgba(0, 0, 0, 0.8)"
                  : "0 2px 8px rgba(0, 0, 0, 0.8)",
                WebkitTextStroke: isCritical ? "2px rgba(255, 255, 255, 0.3)" : "none",
              }}
            >
              {isCritical && "⚡ "}
              {damage}
              {isCritical && " ⚡"}
            </motion.div>

            {/* Critical Text */}
            {isCritical && (
              <motion.div
                className="text-2xl font-bold text-gaming-warning mt-2"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: [0, 1.2, 1] }}
                transition={{ delay: 0.1 }}
                style={{
                  textShadow: "0 0 10px rgba(245, 158, 11, 0.8)",
                }}
              >
                CRITICAL HIT!
              </motion.div>
            )}

            {/* Effectiveness Text */}
            {getEffectivenessText() && (
              <motion.div
                className={`text-lg font-semibold mt-1 ${
                  effectiveness > 1 ? "text-gaming-success" : "text-white/60"
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                style={{
                  textShadow: "0 2px 4px rgba(0, 0, 0, 0.8)",
                }}
              >
                {getEffectivenessText()}
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
