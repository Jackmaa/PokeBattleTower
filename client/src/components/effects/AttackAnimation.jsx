import { motion, AnimatePresence } from "framer-motion";
import ParticleEffect, { BurstEffect } from "./ParticleEffect";

/**
 * AttackAnimation component for battle attacks
 *
 * @param {Object} props
 * @param {boolean} props.isActive - Whether the animation is active
 * @param {string} props.attackerType - Type of the attacking Pokemon
 * @param {boolean} props.isCritical - Whether it's a critical hit
 * @param {number} props.effectiveness - Type effectiveness multiplier
 * @param {number} props.damage - Damage dealt (affects particle intensity)
 */
export default function AttackAnimation({
  isActive,
  attackerType = "normal",
  isCritical = false,
  effectiveness = 1,
  damage = 50,
}) {
  const getParticleType = () => {
    if (isCritical) return "critical";

    // Map Pokemon types to particle effects
    const typeMap = {
      fire: "fire",
      water: "water",
      electric: "electric",
      grass: "grass",
      ice: "ice",
    };

    return typeMap[attackerType?.toLowerCase()] || "normal";
  };

  return (
    <AnimatePresence>
      {isActive && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Particle Effect */}
          <ParticleEffect
            type={getParticleType()}
            count={isCritical ? 30 : 20}
            isActive={isActive}
            damage={damage}
            maxDamage={100}
          />

          {/* Critical Burst */}
          {isCritical && <BurstEffect isActive={isActive} />}

          {/* Effectiveness Flash */}
          {effectiveness > 1 && (
            <motion.div
              className="absolute inset-0 bg-green-500/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{ duration: 0.4 }}
            />
          )}

          {effectiveness < 1 && (
            <motion.div
              className="absolute inset-0 bg-red-500/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.3, 0] }}
              transition={{ duration: 0.4 }}
            />
          )}

          {/* Impact Flash */}
          <motion.div
            className="absolute inset-0 bg-white/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.6, 0] }}
            transition={{ duration: 0.2 }}
          />
        </div>
      )}
    </AnimatePresence>
  );
}
