// Attack VFX Component
// Displays attack animations, impact particles, and screen flashes

import { useEffect, useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAttackVFX, getLightingFilter, LIGHTING_PRESETS } from '../../utils/vfxManager';

/**
 * Individual impact particle
 */
function ImpactParticle({ color, x, y, angle, speed, size, delay }) {
  const rad = (angle * Math.PI) / 180;
  const endX = x + Math.cos(rad) * speed * 50;
  const endY = y + Math.sin(rad) * speed * 50 + 30; // Add gravity

  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: x,
        top: y,
        width: size,
        height: size,
        backgroundColor: color,
        boxShadow: `0 0 ${size * 2}px ${color}`
      }}
      initial={{ opacity: 1, scale: 1 }}
      animate={{
        x: endX - x,
        y: endY - y,
        opacity: 0,
        scale: 0.3
      }}
      transition={{
        duration: 0.6,
        delay,
        ease: 'easeOut'
      }}
    />
  );
}

/**
 * Particle burst effect for attack impacts
 */
function ParticleBurst({ x, y, config, onComplete }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate particles
    const newParticles = [];
    const count = config.count || 15;
    const spread = config.spread || 360;
    const baseAngle = 270 - spread / 2; // Center around upward

    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: i,
        angle: baseAngle + (spread / count) * i + (Math.random() - 0.5) * 20,
        speed: 0.5 + Math.random() * 1.5,
        size: 4 + Math.random() * 8,
        delay: Math.random() * 0.1
      });
    }

    setParticles(newParticles);

    // Cleanup after animation
    const timer = setTimeout(() => {
      onComplete?.();
    }, 800);

    return () => clearTimeout(timer);
  }, [config, onComplete]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <ImpactParticle
          key={particle.id}
          x={x}
          y={y}
          color={config.color}
          angle={particle.angle}
          speed={particle.speed}
          size={particle.size}
          delay={particle.delay}
        />
      ))}
    </div>
  );
}

/**
 * Screen flash effect
 */
function ScreenFlash({ color, duration = 0.15, onComplete }) {
  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-50"
      style={{ backgroundColor: color }}
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 0 }}
      transition={{ duration }}
      onAnimationComplete={onComplete}
    />
  );
}

/**
 * Glow effect around target
 */
function GlowEffect({ color, intensity = 1, duration = 0.5 }) {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none rounded-lg"
      style={{
        boxShadow: `0 0 ${40 * intensity}px ${20 * intensity}px ${color}`,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 0] }}
      transition={{ duration, times: [0, 0.3, 1] }}
    />
  );
}

/**
 * Damage number popup
 */
export function DamagePopup({
  damage,
  x,
  y,
  isCritical = false,
  isHealing = false,
  effectiveness = 'normal', // 'super', 'not', 'immune', 'normal'
  onComplete
}) {
  const color = useMemo(() => {
    if (isHealing) return '#22c55e';
    if (isCritical) return '#f59e0b';
    if (effectiveness === 'super') return '#ef4444';
    if (effectiveness === 'not') return '#9ca3af';
    if (effectiveness === 'immune') return '#6b7280';
    return '#ffffff';
  }, [isHealing, isCritical, effectiveness]);

  const label = useMemo(() => {
    if (isHealing) return `+${damage}`;
    if (effectiveness === 'immune') return 'IMMUNE';
    return `-${damage}`;
  }, [damage, isHealing, effectiveness]);

  const fontSize = useMemo(() => {
    if (isCritical) return '2rem';
    if (effectiveness === 'super') return '1.75rem';
    return '1.5rem';
  }, [isCritical, effectiveness]);

  return (
    <motion.div
      className="absolute pointer-events-none font-bold z-30"
      style={{
        left: x,
        top: y,
        color,
        fontSize,
        textShadow: `0 0 10px ${color}, 0 2px 4px rgba(0,0,0,0.5)`,
        transform: 'translateX(-50%)'
      }}
      initial={{ opacity: 1, y: 0, scale: isCritical ? 1.2 : 1 }}
      animate={{
        opacity: 0,
        y: -60,
        scale: isCritical ? 1.5 : 1.1
      }}
      transition={{ duration: 1, ease: 'easeOut' }}
      onAnimationComplete={onComplete}
    >
      {label}
      {isCritical && (
        <motion.span
          className="block text-xs text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          CRITICAL!
        </motion.span>
      )}
      {effectiveness === 'super' && (
        <motion.span
          className="block text-xs text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Super Effective!
        </motion.span>
      )}
    </motion.div>
  );
}

/**
 * Main Attack VFX Controller
 */
export default function AttackVFX({
  isActive = false,
  moveType = 'normal',
  targetX = 0,
  targetY = 0,
  isCritical = false,
  effectiveness = 'normal',
  onComplete
}) {
  const [showFlash, setShowFlash] = useState(false);
  const [showBurst, setShowBurst] = useState(false);
  const [showGlow, setShowGlow] = useState(false);

  const vfx = useMemo(() => getAttackVFX(moveType), [moveType]);

  // Trigger effects when active
  useEffect(() => {
    if (!isActive) return;

    // Start flash if enabled
    if (vfx.flash || isCritical) {
      setShowFlash(true);
    }

    // Start glow
    if (vfx.glow || isCritical) {
      setShowGlow(true);
      setTimeout(() => setShowGlow(false), 500);
    }

    // Start particle burst
    setShowBurst(true);

    return () => {
      setShowFlash(false);
      setShowBurst(false);
      setShowGlow(false);
    };
  }, [isActive, vfx, isCritical]);

  const handleBurstComplete = useCallback(() => {
    setShowBurst(false);
    onComplete?.();
  }, [onComplete]);

  const burstConfig = useMemo(() => ({
    count: (vfx.particles?.count || 15) * (isCritical ? 2 : 1),
    spread: (vfx.particles?.spread || 60) * (isCritical ? 1.5 : 1),
    color: vfx.color
  }), [vfx, isCritical]);

  if (!isActive) return null;

  return (
    <>
      {/* Screen flash */}
      <AnimatePresence>
        {showFlash && (
          <ScreenFlash
            color={vfx.color}
            duration={isCritical ? 0.2 : 0.1}
            onComplete={() => setShowFlash(false)}
          />
        )}
      </AnimatePresence>

      {/* Particle burst */}
      <AnimatePresence>
        {showBurst && (
          <ParticleBurst
            x={targetX}
            y={targetY}
            config={burstConfig}
            onComplete={handleBurstComplete}
          />
        )}
      </AnimatePresence>

      {/* Glow effect */}
      <AnimatePresence>
        {showGlow && vfx.glow && (
          <motion.div
            className="absolute pointer-events-none"
            style={{
              left: targetX - 50,
              top: targetY - 50,
              width: 100,
              height: 100
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <GlowEffect
              color={vfx.glow}
              intensity={isCritical ? 1.5 : 1}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/**
 * Sprite lighting effect wrapper
 */
export function SpriteLighting({ children, effect = 'normal', className = '' }) {
  const filter = useMemo(() => getLightingFilter(effect), [effect]);

  return (
    <motion.div
      className={className}
      style={{ filter }}
      animate={{ filter }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}
