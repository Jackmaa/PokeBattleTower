// 📁 StatusEffectOverlay.jsx
// Visual overlays for status conditions (poison, burn, paralysis, sleep, freeze)

import { motion } from "framer-motion";
import { useMemo } from "react";

/**
 * StatusEffectOverlay component
 * @param {Object} props
 * @param {'poison'|'burn'|'paralysis'|'sleep'|'freeze'|'confused'} props.status
 * @param {boolean} props.isActive
 */
export default function StatusEffectOverlay({ status, isActive = false }) {
  const effectConfig = useMemo(() => {
    const configs = {
      poison: {
        color: "#a855f7",
        emoji: "💜",
        particles: ["☠️", "💀", "💜"],
        background: "linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(147, 51, 234, 0.3))",
      },
      burn: {
        color: "#f97316",
        emoji: "🔥",
        particles: ["🔥", "💥", "⚡"],
        background: "linear-gradient(135deg, rgba(249, 115, 22, 0.2), rgba(234, 88, 12, 0.3))",
      },
      paralysis: {
        color: "#eab308",
        emoji: "⚡",
        particles: ["⚡", "💫", "✨"],
        background: "linear-gradient(135deg, rgba(234, 179, 8, 0.2), rgba(202, 138, 4, 0.3))",
      },
      sleep: {
        color: "#8b5cf6",
        emoji: "💤",
        particles: ["💤", "😴", "🌙"],
        background: "linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(124, 58, 237, 0.3))",
      },
      freeze: {
        color: "#06b6d4",
        emoji: "❄️",
        particles: ["❄️", "🧊", "💎"],
        background: "linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(8, 145, 178, 0.3))",
      },
      confused: {
        color: "#ec4899",
        emoji: "😵",
        particles: ["💫", "🌀", "⭐"],
        background: "linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(219, 39, 119, 0.3))",
      },
    };

    return configs[status] || configs.poison;
  }, [status]);

  const particles = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        particle: effectConfig.particles[i % effectConfig.particles.length],
        delay: Math.random() * 2,
        duration: 2 + Math.random() * 2,
      })),
    [effectConfig.particles]
  );

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
      {/* Background pulse */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: effectConfig.background,
        }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute text-2xl"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [-20, -60, -20],
            x: [0, Math.sin(particle.id) * 20, 0],
            opacity: [0, 1, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {particle.particle}
        </motion.div>
      ))}

      {/* Status icon badge */}
      <motion.div
        className="absolute -top-2 -right-2 flex items-center justify-center w-10 h-10 rounded-full shadow-lg"
        style={{
          backgroundColor: effectConfig.color,
          boxShadow: `0 0 20px ${effectConfig.color}`,
        }}
        initial={{ scale: 0, rotate: -180 }}
        animate={{
          scale: [1, 1.1, 1],
          rotate: 0,
        }}
        transition={{
          scale: {
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          },
          rotate: {
            duration: 0.5,
            ease: "backOut",
          },
        }}
      >
        <span className="text-xl">{effectConfig.emoji}</span>
      </motion.div>

      {/* Additional effect based on status */}
      {status === "paralysis" && (
        <motion.div
          className="absolute inset-0"
          animate={{
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 0.1,
            repeat: Infinity,
            repeatDelay: 2,
          }}
        >
          <div className="absolute inset-0 bg-yellow-400/30" />
        </motion.div>
      )}

      {status === "freeze" && (
        <motion.div
          className="absolute inset-0 border-4 border-cyan-400/50 rounded-lg"
          animate={{
            borderColor: ["rgba(6, 182, 212, 0.5)", "rgba(6, 182, 212, 0)", "rgba(6, 182, 212, 0.5)"],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
        />
      )}
    </div>
  );
}
