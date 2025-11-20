import { motion } from "framer-motion";
import { useMemo } from "react";

/**
 * ParticleEffect component for battle animations
 *
 * @param {Object} props
 * @param {'fire'|'water'|'electric'|'grass'|'ice'|'normal'} props.type - Attack type
 * @param {number} props.count - Number of particles (default: 20)
 * @param {boolean} props.isActive - Whether the effect is active
 * @param {number} props.damage - Damage dealt (affects intensity)
 * @param {number} props.maxDamage - Maximum expected damage (for scaling, default: 100)
 */
export default function ParticleEffect({
  type = "normal",
  count = 20,
  isActive = false,
  damage = 50,
  maxDamage = 100
}) {
  // Calculate intensity based on damage (0.5 to 2.0 multiplier)
  const intensity = Math.min(Math.max(damage / (maxDamage * 0.5), 0.5), 2.0);
  const particleConfig = {
    fire: {
      colors: ["#ff6b35", "#f7931e", "#ffd700"],
      size: [4, 8],
      emoji: "🔥",
    },
    water: {
      colors: ["#4a90e2", "#50c5ff", "#7ec8e3"],
      size: [3, 6],
      emoji: "💧",
    },
    electric: {
      colors: ["#ffd700", "#ffeb3b", "#fff59d"],
      size: [2, 5],
      emoji: "⚡",
    },
    grass: {
      colors: ["#4caf50", "#8bc34a", "#aed581"],
      size: [4, 7],
      emoji: "🍃",
    },
    ice: {
      colors: ["#b3e5fc", "#81d4fa", "#4fc3f7"],
      size: [3, 6],
      emoji: "❄️",
    },
    normal: {
      colors: ["#9e9e9e", "#bdbdbd", "#e0e0e0"],
      size: [3, 5],
      emoji: "💥",
    },
    critical: {
      colors: ["#ff1744", "#ff5252", "#ff8a80"],
      size: [5, 10],
      emoji: "⚡",
    },
  };

  const config = particleConfig[type] || particleConfig.normal;

  // Scale particle count based on intensity
  const scaledCount = Math.floor(count * intensity);

  const particles = useMemo(
    () =>
      Array.from({ length: scaledCount }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: (Math.random() * (config.size[1] - config.size[0]) + config.size[0]) * intensity,
        color: config.colors[Math.floor(Math.random() * config.colors.length)],
        delay: Math.random() * 0.2,
        duration: (0.5 + Math.random() * 0.5) / Math.sqrt(intensity), // Faster for high damage
        velocity: 100 * intensity, // Stronger spread for high damage
      })),
    [scaledCount, config.colors, config.size, intensity]
  );

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.5 * intensity, 0],
            x: (Math.random() - 0.5) * particle.velocity,
            y: (Math.random() - 0.5) * particle.velocity,
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            ease: "easeOut",
          }}
        />
      ))}

      {/* Center emoji burst - scales with intensity */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ fontSize: `${3 * intensity}rem` }}
        initial={{ opacity: 0, scale: 0, rotate: 0 }}
        animate={{
          opacity: [0, 1, 0],
          scale: [0, 1.5 + intensity * 0.5, 0],
          rotate: [0, intensity > 1.5 ? 360 : 0, 0],
        }}
        transition={{ duration: 0.6 }}
      >
        {config.emoji}
      </motion.div>
    </div>
  );
}

/**
 * BurstEffect for critical hits
 */
export function BurstEffect({ isActive = false }) {
  const rays = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        angle: (i * 360) / 12,
      })),
    []
  );

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {rays.map((ray) => (
        <motion.div
          key={ray.id}
          className="absolute top-1/2 left-1/2 w-1 h-20 bg-gradient-to-t from-yellow-400 to-transparent origin-bottom"
          style={{
            rotate: ray.angle,
          }}
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: [0, 1, 0], scaleY: [0, 1, 0] }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}
