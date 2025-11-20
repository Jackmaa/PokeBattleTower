import React from "react";
import { motion } from "framer-motion";

export default function HealthBar({ current, max, showText = true, animated = true }) {
  const ratio = Math.max(0, Math.min(current / max, 1));
  const percent = Math.floor(ratio * 100);

  // Color gradient based on health percentage
  let barColor = "#10b981"; // green (gaming-success)
  let gradientColor = "#34d399";
  if (percent <= 50) {
    barColor = "#f59e0b"; // yellow (gaming-warning)
    gradientColor = "#fbbf24";
  }
  if (percent <= 25) {
    barColor = "#ef4444"; // red (gaming-danger)
    gradientColor = "#f87171";
  }

  return (
    <div className="relative w-full">
      {/* Background container */}
      <div className="relative h-6 bg-black/40 rounded-full overflow-hidden border border-white/20">
        {/* Health bar with gradient */}
        <motion.div
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, ${barColor}, ${gradientColor})`,
            boxShadow: `0 0 10px ${barColor}`,
          }}
          initial={animated ? { width: 0 } : { width: `${percent}%` }}
          animate={{ width: `${percent}%` }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 15,
          }}
        />

        {/* Shine effect overlay */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: "linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 50%, rgba(0,0,0,0.2) 100%)",
            pointerEvents: "none",
          }}
        />

        {/* HP Text */}
        {showText && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              {current}/{max}
            </span>
          </div>
        )}
      </div>

      {/* Percentage indicator (optional) */}
      {percent <= 25 && (
        <motion.div
          className="absolute -top-1 -right-1 bg-gaming-danger text-white text-xs font-bold px-1.5 py-0.5 rounded-full"
          initial={{ scale: 0 }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          !
        </motion.div>
      )}
    </div>
  );
}
