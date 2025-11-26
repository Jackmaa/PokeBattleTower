import React from "react";
import { motion } from "framer-motion";

export default function HealthBar({ current, max, showText = true, animated = true, className = "" }) {
  const ratio = Math.max(0, Math.min(current / max, 1));
  const percentage = Math.floor(ratio * 100);
  const isLow = percentage <= 25;

  return (
    <div className={`w-full ${className}`}>
      <div className="relative h-4 bg-black/40 rounded-full overflow-hidden border border-white/20 shadow-inner">
        {/* Background pulse for low health */}
        <motion.div 
          className="absolute inset-0 bg-neon-danger/20"
          animate={{ opacity: isLow ? [0, 0.5, 0] : 0 }}
          transition={{ duration: 1, repeat: Infinity }}
        />
        
        <motion.div
          className={`h-full relative rounded-full ${
            isLow ? "bg-neon-danger shadow-[0_0_10px_var(--accent-danger)]" : 
            percentage < 50 ? "bg-neon-gold shadow-[0_0_10px_var(--accent-gold)]" : 
            "bg-neon-emerald shadow-[0_0_10px_var(--accent-emerald)]"
          }`}
          initial={animated ? { width: "0%" } : { width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
            {/* Shine effect */}
            <div className="absolute top-0 right-0 bottom-0 w-full bg-gradient-to-b from-white/30 to-transparent opacity-50" />
        </motion.div>
      </div>
      
      {showText && (
        <div className="text-[10px] font-mono font-bold text-white/80 mt-1 text-right drop-shadow-md tracking-wider">
          {current} / {max}
        </div>
      )}
    </div>
  );
}
