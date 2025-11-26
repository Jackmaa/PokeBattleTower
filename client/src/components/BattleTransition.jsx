// BattleTransition.jsx
// Epic transition effect when entering battle from the map

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Battle transition types based on enemy type
 */
const TRANSITION_TYPES = {
  combat: {
    color1: '#3b82f6', // blue
    color2: '#1e40af',
    icon: '!',
    text: 'WILD ENCOUNTER',
  },
  elite: {
    color1: '#f59e0b', // amber
    color2: '#b45309',
    icon: '!!',
    text: 'ELITE TRAINER',
  },
  boss: {
    color1: '#dc2626', // red
    color2: '#7f1d1d',
    icon: '!!!',
    text: 'BOSS BATTLE',
  },
};

/**
 * BattleTransition Component
 * Creates an epic screen wipe / zoom effect when transitioning to battle
 */
export default function BattleTransition({
  isActive,
  battleType = 'combat',
  enemySprites = [],
  onComplete
}) {
  const [phase, setPhase] = useState(0);
  const config = TRANSITION_TYPES[battleType] || TRANSITION_TYPES.combat;

  useEffect(() => {
    if (!isActive) {
      setPhase(0);
      return;
    }

    // Phase 1: Flash & zoom in (0-400ms)
    setPhase(1);

    // Phase 2: Diagonal wipe (400-800ms)
    const phase2Timer = setTimeout(() => setPhase(2), 400);

    // Phase 3: Enemy reveal (800-1400ms)
    const phase3Timer = setTimeout(() => setPhase(3), 800);

    // Phase 4: Text flash (1400-1800ms)
    const phase4Timer = setTimeout(() => setPhase(4), 1400);

    // Complete (1800ms)
    const completeTimer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 1800);

    return () => {
      clearTimeout(phase2Timer);
      clearTimeout(phase3Timer);
      clearTimeout(phase4Timer);
      clearTimeout(completeTimer);
    };
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] overflow-hidden pointer-events-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Phase 1: Initial flash */}
        {phase >= 1 && (
          <motion.div
            className="absolute inset-0"
            initial={{ backgroundColor: 'white', opacity: 1 }}
            animate={{
              backgroundColor: 'black',
              opacity: phase >= 2 ? 0 : 1,
            }}
            transition={{ duration: 0.3 }}
          />
        )}

        {/* Phase 2: Diagonal wipe bars */}
        {phase >= 2 && (
          <>
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`bar-${i}`}
                className="absolute h-[25vh]"
                style={{
                  width: '200%',
                  left: '-50%',
                  top: `${i * 12.5}%`,
                  background: i % 2 === 0
                    ? `linear-gradient(45deg, ${config.color1}, ${config.color2})`
                    : `linear-gradient(-45deg, ${config.color2}, ${config.color1})`,
                  transformOrigin: 'center',
                }}
                initial={{
                  scaleX: 0,
                  skewY: i % 2 === 0 ? 5 : -5,
                }}
                animate={{
                  scaleX: phase >= 3 ? 0 : 1,
                  skewY: i % 2 === 0 ? 5 : -5,
                }}
                transition={{
                  duration: 0.3,
                  delay: i * 0.03,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </>
        )}

        {/* Phase 3: Battle type icon flash */}
        {phase >= 3 && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            style={{ backgroundColor: 'rgba(0,0,0,0.9)' }}
          >
            {/* Radial burst effect */}
            <motion.div
              className="absolute"
              style={{
                width: '200vmax',
                height: '200vmax',
                background: `radial-gradient(circle, ${config.color1}40 0%, transparent 50%)`,
              }}
              initial={{ scale: 0, rotate: 0 }}
              animate={{ scale: 1.5, rotate: 45 }}
              transition={{ duration: 0.6 }}
            />

            {/* Enemy sprites */}
            <div className="absolute flex gap-4 top-[20%]">
              {enemySprites.map((sprite, i) => (
                <motion.div
                  key={i}
                  className="relative"
                  initial={{
                    y: -100,
                    opacity: 0,
                    scale: 0.5,
                  }}
                  animate={{
                    y: 0,
                    opacity: 1,
                    scale: battleType === 'boss' ? 1.5 : 1,
                  }}
                  transition={{
                    delay: i * 0.1,
                    type: 'spring',
                    stiffness: 200,
                  }}
                >
                  <img
                    src={sprite}
                    alt="Enemy"
                    className="w-24 h-24 object-contain pixelated drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]"
                  />
                  {/* Glow effect */}
                  <div
                    className="absolute inset-0 rounded-full blur-xl -z-10"
                    style={{ backgroundColor: `${config.color1}60` }}
                  />
                </motion.div>
              ))}
            </div>

            {/* Exclamation marks */}
            <motion.div
              className="text-9xl font-black"
              style={{
                color: config.color1,
                textShadow: `0 0 30px ${config.color1}, 0 0 60px ${config.color1}`,
              }}
              initial={{ scale: 5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 15,
              }}
            >
              {config.icon}
            </motion.div>
          </motion.div>
        )}

        {/* Phase 4: Battle text */}
        {phase >= 4 && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
          >
            <motion.div
              className="relative z-10"
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              <h1
                className="text-5xl md:text-7xl font-black tracking-widest"
                style={{
                  color: 'white',
                  textShadow: `
                    0 0 20px ${config.color1},
                    0 0 40px ${config.color1},
                    0 0 80px ${config.color2},
                    4px 4px 0 ${config.color2}
                  `,
                }}
              >
                {config.text}
              </h1>

              {/* Animated underline */}
              <motion.div
                className="h-2 mt-2 rounded-full"
                style={{ background: `linear-gradient(90deg, ${config.color1}, ${config.color2})` }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              />
            </motion.div>
          </motion.div>
        )}

        {/* Screen edge vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            boxShadow: `inset 0 0 150px 50px rgba(0,0,0,0.8)`,
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * useBattleTransition hook
 * Manages the battle transition state
 */
export function useBattleTransition() {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionConfig, setTransitionConfig] = useState({
    battleType: 'combat',
    enemySprites: [],
  });

  const startTransition = (battleType, enemySprites = []) => {
    setTransitionConfig({ battleType, enemySprites });
    setIsTransitioning(true);
  };

  const endTransition = () => {
    setIsTransitioning(false);
  };

  return {
    isTransitioning,
    transitionConfig,
    startTransition,
    endTransition,
  };
}
