import { motion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * ScreenShake wrapper component
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to shake
 * @param {boolean} props.trigger - Trigger the shake effect
 * @param {'light'|'medium'|'heavy'} props.intensity - Shake intensity (legacy)
 * @param {number} props.damage - Damage value (0-200+) for progressive shake
 * @param {number} props.maxDamage - Maximum expected damage (default: 100)
 */
export default function ScreenShake({
  children,
  trigger,
  intensity = "medium",
  damage = null,
  maxDamage = 100
}) {
  const [isShaking, setIsShaking] = useState(false);

  // Calculate intensity from damage if provided
  const calculateIntensityFromDamage = () => {
    if (damage === null) return intensity;

    const damageRatio = damage / maxDamage;
    if (damageRatio < 0.3) return "light";
    if (damageRatio < 0.7) return "medium";
    return "heavy";
  };

  const intensityConfig = {
    light: { x: 5, y: 5, duration: 0.2, frequency: 4 },
    medium: { x: 10, y: 10, duration: 0.3, frequency: 6 },
    heavy: { x: 20, y: 15, duration: 0.4, frequency: 8 },
  };

  const currentIntensity = calculateIntensityFromDamage();
  const config = intensityConfig[currentIntensity];

  // Scale shake amount by damage if provided
  const shakeMultiplier = damage !== null ? Math.min(damage / (maxDamage * 0.5), 2.5) : 1;

  useEffect(() => {
    if (trigger) {
      setIsShaking(true);
      const timer = setTimeout(() => setIsShaking(false), config.duration * 1000);
      return () => clearTimeout(timer);
    }
  }, [trigger, config.duration]);

  // Generate shake pattern based on frequency
  const generateShakePattern = () => {
    const pattern = [0];
    for (let i = 0; i < config.frequency; i++) {
      pattern.push(
        (i % 2 === 0 ? -1 : 1) * config.x * shakeMultiplier * (1 - i / config.frequency)
      );
    }
    pattern.push(0);
    return pattern;
  };

  const generateVerticalShakePattern = () => {
    const pattern = [0];
    for (let i = 0; i < config.frequency; i++) {
      pattern.push(
        (i % 2 === 0 ? -1 : 1) * config.y * shakeMultiplier * (1 - i / config.frequency)
      );
    }
    pattern.push(0);
    return pattern;
  };

  return (
    <motion.div
      animate={
        isShaking
          ? {
              x: generateShakePattern(),
              y: generateVerticalShakePattern(),
            }
          : { x: 0, y: 0 }
      }
      transition={{
        duration: config.duration,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}
