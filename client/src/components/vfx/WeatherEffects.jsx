// Weather Effects Component
// Renders weather particles and overlays during battle

import { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WEATHER_TYPES } from '../../utils/vfxManager';

/**
 * Individual weather particle
 */
function WeatherParticle({ weather, index, containerSize }) {
  const particles = weather.particles;
  if (!particles) return null;

  // Generate random starting position and properties
  const startX = useMemo(() => Math.random() * 100, []);
  const startY = useMemo(() => -10 - Math.random() * 20, []);
  const size = useMemo(
    () => particles.size.min + Math.random() * (particles.size.max - particles.size.min),
    [particles.size]
  );
  const duration = useMemo(
    () => (100 / particles.speed) * (0.8 + Math.random() * 0.4),
    [particles.speed]
  );
  const delay = useMemo(() => Math.random() * duration, [duration]);
  const opacity = useMemo(() => 0.3 + Math.random() * 0.5, []);

  // Calculate end position based on angle
  const angleRad = (particles.angle * Math.PI) / 180;
  const endX = startX + Math.sin(angleRad) * 120;
  const endY = 120;

  if (particles.shape === 'line') {
    // Rain drop style
    return (
      <motion.div
        className="absolute pointer-events-none"
        style={{
          left: `${startX}%`,
          width: 2,
          height: size,
          backgroundColor: particles.color,
          opacity: opacity,
          transform: `rotate(${particles.angle}deg)`,
          borderRadius: 1
        }}
        initial={{ top: `${startY}%`, x: 0 }}
        animate={{
          top: `${endY}%`,
          x: `${(endX - startX) * (containerSize?.width || 1000) / 100}px`
        }}
        transition={{
          duration: duration,
          delay: delay,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
    );
  }

  if (particles.shape === 'cloud') {
    // Fog cloud style
    return (
      <motion.div
        className="absolute pointer-events-none rounded-full blur-xl"
        style={{
          left: `${startX}%`,
          top: `${30 + Math.random() * 40}%`,
          width: size,
          height: size * 0.6,
          backgroundColor: particles.color
        }}
        animate={{
          x: [0, 50, 0],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{
          duration: duration * 5,
          delay: delay,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
    );
  }

  // Default circle (snow, sand, sun sparkles)
  return (
    <motion.div
      className="absolute pointer-events-none rounded-full"
      style={{
        left: `${startX}%`,
        width: size,
        height: size,
        backgroundColor: particles.color,
        opacity: opacity,
        boxShadow: weather.id === 'sun' ? `0 0 ${size}px ${particles.color}` : 'none'
      }}
      initial={{ top: `${startY}%`, x: 0, scale: weather.id === 'sun' ? 0 : 1 }}
      animate={{
        top: weather.id === 'sun' ? `${30 + Math.random() * 40}%` : `${endY}%`,
        x: weather.id === 'sun' ? 0 : `${(endX - startX) * (containerSize?.width || 1000) / 100}px`,
        scale: weather.id === 'sun' ? [0, 1, 0] : 1,
        opacity: weather.id === 'sun' ? [0, opacity, 0] : opacity
      }}
      transition={{
        duration: weather.id === 'sun' ? duration * 3 : duration,
        delay: delay,
        repeat: Infinity,
        ease: weather.id === 'sun' ? 'easeInOut' : 'linear'
      }}
    />
  );
}

/**
 * Main Weather Effects component
 */
export default function WeatherEffects({ weatherId = 'none', intensity = 1.0, className = '' }) {
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 1000, height: 600 });
  const weather = WEATHER_TYPES[weatherId] || WEATHER_TYPES.none;

  // Update container size on resize
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Generate particle indices
  const particleCount = useMemo(() => {
    if (!weather.particles) return 0;
    return Math.floor(weather.particles.count * intensity);
  }, [weather.particles, intensity]);

  const particleIndices = useMemo(
    () => Array.from({ length: particleCount }, (_, i) => i),
    [particleCount]
  );

  if (weatherId === 'none') return null;

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
    >
      {/* Weather overlay */}
      <AnimatePresence>
        {weather.overlay && (
          <motion.div
            className="absolute inset-0"
            style={{ backgroundColor: weather.overlay }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          />
        )}
      </AnimatePresence>

      {/* Weather particles */}
      {particleIndices.map((index) => (
        <WeatherParticle
          key={`${weatherId}-${index}`}
          weather={weather}
          index={index}
          containerSize={containerSize}
        />
      ))}

      {/* Weather label */}
      <AnimatePresence>
        {weatherId !== 'none' && (
          <motion.div
            className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-lg border border-white/20"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-white/80 text-sm font-medium">
              {weather.id === 'rain' && '🌧️'}
              {weather.id === 'sun' && '☀️'}
              {weather.id === 'sandstorm' && '🏜️'}
              {weather.id === 'snow' && '❄️'}
              {weather.id === 'fog' && '🌫️'}
              {' '}{weather.name}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
