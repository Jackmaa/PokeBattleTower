// Camera Controller Component
// Handles zoom, pan, and shake effects for dramatic battle moments

import { forwardRef, useImperativeHandle, useState, useCallback, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { CAMERA_EFFECTS } from '../../utils/vfxManager';

/**
 * Camera Controller wrapper component
 * Wrap battle scene content with this to enable camera effects
 */
const CameraController = forwardRef(function CameraController(
  { children, className = '', disabled = false },
  ref
) {
  const controls = useAnimation();
  const containerRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(false);

  /**
   * Apply a camera effect by name or custom config
   */
  const applyEffect = useCallback(async (effectNameOrConfig, options = {}) => {
    if (disabled || isAnimating) return;

    const effect = typeof effectNameOrConfig === 'string'
      ? CAMERA_EFFECTS[effectNameOrConfig]
      : effectNameOrConfig;

    if (!effect) return;

    setIsAnimating(true);

    try {
      // Handle shake effect
      if (effect.shake) {
        await performShake(effect.shake, controls);
      } else {
        // Handle zoom/pan effect
        await controls.start({
          scale: effect.scale,
          x: effect.x,
          y: effect.y,
          rotate: effect.rotation,
          transition: {
            duration: effect.duration || 0.3,
            ease: options.ease || 'easeOut'
          }
        });

        // Return to normal after hold time
        if (options.hold !== false) {
          await new Promise(resolve => setTimeout(resolve, (options.holdDuration || 200)));

          await controls.start({
            scale: 1,
            x: 0,
            y: 0,
            rotate: 0,
            transition: {
              duration: effect.duration || 0.3,
              ease: 'easeInOut'
            }
          });
        }
      }
    } finally {
      setIsAnimating(false);
    }
  }, [controls, disabled, isAnimating]);

  /**
   * Perform shake animation
   */
  const performShake = async (shakeConfig, animControls) => {
    const { intensity, duration } = shakeConfig;
    const iterations = Math.floor(duration * 20);
    const iterationDuration = duration / iterations;

    for (let i = 0; i < iterations; i++) {
      const progress = i / iterations;
      const dampedIntensity = intensity * (1 - progress * 0.5); // Dampen over time

      await animControls.start({
        x: (Math.random() - 0.5) * 2 * dampedIntensity,
        y: (Math.random() - 0.5) * 2 * dampedIntensity,
        transition: { duration: iterationDuration }
      });
    }

    // Return to center
    await animControls.start({
      x: 0,
      y: 0,
      transition: { duration: 0.1 }
    });
  };

  /**
   * Quick zoom to a specific element
   */
  const zoomTo = useCallback(async (targetSelector, scale = 1.2, duration = 0.4) => {
    if (disabled || isAnimating) return;
    if (!containerRef.current) return;

    const target = containerRef.current.querySelector(targetSelector);
    if (!target) return;

    setIsAnimating(true);

    try {
      const containerRect = containerRef.current.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();

      // Calculate offset to center the target
      const targetCenterX = targetRect.left + targetRect.width / 2 - containerRect.left;
      const targetCenterY = targetRect.top + targetRect.height / 2 - containerRect.top;
      const containerCenterX = containerRect.width / 2;
      const containerCenterY = containerRect.height / 2;

      const offsetX = (containerCenterX - targetCenterX) * (scale - 1);
      const offsetY = (containerCenterY - targetCenterY) * (scale - 1);

      await controls.start({
        scale,
        x: offsetX,
        y: offsetY,
        transition: { duration, ease: 'easeOut' }
      });

      // Hold briefly
      await new Promise(resolve => setTimeout(resolve, 300));

      // Return to normal
      await controls.start({
        scale: 1,
        x: 0,
        y: 0,
        transition: { duration: duration * 0.8, ease: 'easeInOut' }
      });
    } finally {
      setIsAnimating(false);
    }
  }, [controls, disabled, isAnimating]);

  /**
   * Shake the screen
   */
  const shake = useCallback(async (intensity = 10, duration = 0.3) => {
    if (disabled || isAnimating) return;

    setIsAnimating(true);
    try {
      await performShake({ intensity, duration }, controls);
    } finally {
      setIsAnimating(false);
    }
  }, [controls, disabled, isAnimating]);

  /**
   * Reset camera to default position
   */
  const reset = useCallback(async () => {
    await controls.start({
      scale: 1,
      x: 0,
      y: 0,
      rotate: 0,
      transition: { duration: 0.3 }
    });
    setIsAnimating(false);
  }, [controls]);

  // Expose methods to parent via ref
  useImperativeHandle(ref, () => ({
    applyEffect,
    zoomTo,
    shake,
    reset,
    isAnimating
  }), [applyEffect, zoomTo, shake, reset, isAnimating]);

  return (
    <motion.div
      ref={containerRef}
      className={`relative ${className}`}
      animate={controls}
      initial={{ scale: 1, x: 0, y: 0, rotate: 0 }}
      style={{ transformOrigin: 'center center' }}
    >
      {children}
    </motion.div>
  );
});

export default CameraController;

/**
 * Hook to use camera effects
 */
export function useCameraEffects(cameraRef) {
  const applyEffect = useCallback((effect, options) => {
    cameraRef.current?.applyEffect(effect, options);
  }, [cameraRef]);

  const shake = useCallback((intensity, duration) => {
    cameraRef.current?.shake(intensity, duration);
  }, [cameraRef]);

  const zoomTo = useCallback((selector, scale, duration) => {
    cameraRef.current?.zoomTo(selector, scale, duration);
  }, [cameraRef]);

  const reset = useCallback(() => {
    cameraRef.current?.reset();
  }, [cameraRef]);

  // Preset effects for common battle events
  const effects = {
    onAttack: () => applyEffect('zoomAttack'),
    onCritical: () => applyEffect('zoomCritical'),
    onFaint: () => applyEffect('zoomFaint'),
    onHit: () => shake(8, 0.2),
    onCriticalHit: () => shake(15, 0.4),
    onSuperEffective: () => {
      shake(12, 0.3);
      applyEffect('zoomAttack');
    }
  };

  return { applyEffect, shake, zoomTo, reset, effects };
}
