// VFX Manager - Advanced visual effects system
// Handles weather, lighting, camera effects, and particles

/**
 * Weather types available in battles
 */
export const WEATHER_TYPES = {
  none: {
    id: 'none',
    name: 'Clear',
    particles: null,
    overlay: null,
    lightModifier: 1.0
  },
  rain: {
    id: 'rain',
    name: 'Rain',
    particles: {
      count: 100,
      speed: 15,
      angle: 15,
      color: '#6eb5ff',
      shape: 'line',
      size: { min: 10, max: 20 }
    },
    overlay: 'rgba(100, 150, 200, 0.15)',
    lightModifier: 0.7,
    affectedTypes: ['water', 'electric'],
    boostTypes: ['water'],
    weakenTypes: ['fire']
  },
  sun: {
    id: 'sun',
    name: 'Harsh Sunlight',
    particles: {
      count: 30,
      speed: 0.5,
      angle: 0,
      color: '#fff7cc',
      shape: 'circle',
      size: { min: 2, max: 5 }
    },
    overlay: 'rgba(255, 200, 100, 0.1)',
    lightModifier: 1.4,
    affectedTypes: ['fire', 'grass'],
    boostTypes: ['fire'],
    weakenTypes: ['water']
  },
  sandstorm: {
    id: 'sandstorm',
    name: 'Sandstorm',
    particles: {
      count: 80,
      speed: 8,
      angle: -30,
      color: '#d4a574',
      shape: 'circle',
      size: { min: 2, max: 6 }
    },
    overlay: 'rgba(180, 140, 80, 0.2)',
    lightModifier: 0.8,
    affectedTypes: ['rock', 'ground', 'steel'],
    damageTypes: ['normal', 'fighting', 'poison', 'flying', 'bug', 'ghost', 'fire', 'water', 'grass', 'electric', 'psychic', 'ice', 'dragon', 'dark', 'fairy']
  },
  snow: {
    id: 'snow',
    name: 'Snow',
    particles: {
      count: 60,
      speed: 3,
      angle: 10,
      color: '#ffffff',
      shape: 'circle',
      size: { min: 3, max: 8 }
    },
    overlay: 'rgba(200, 220, 255, 0.15)',
    lightModifier: 0.9,
    affectedTypes: ['ice'],
    boostTypes: ['ice']
  },
  fog: {
    id: 'fog',
    name: 'Fog',
    particles: {
      count: 20,
      speed: 0.3,
      angle: 0,
      color: 'rgba(200, 200, 200, 0.5)',
      shape: 'cloud',
      size: { min: 50, max: 100 }
    },
    overlay: 'rgba(180, 180, 180, 0.3)',
    lightModifier: 0.6,
    affectedTypes: [],
    accuracyModifier: 0.6
  }
};

/**
 * Camera effect presets
 */
export const CAMERA_EFFECTS = {
  none: {
    scale: 1,
    x: 0,
    y: 0,
    rotation: 0,
    duration: 0
  },
  zoomAttack: {
    scale: 1.1,
    x: 0,
    y: 0,
    rotation: 0,
    duration: 0.3
  },
  zoomCritical: {
    scale: 1.25,
    x: 0,
    y: -10,
    rotation: 0,
    duration: 0.4
  },
  zoomFaint: {
    scale: 0.95,
    x: 0,
    y: 5,
    rotation: 0,
    duration: 0.6
  },
  shakeLight: {
    scale: 1,
    x: 0,
    y: 0,
    rotation: 0,
    shake: { intensity: 5, duration: 0.2 }
  },
  shakeMedium: {
    scale: 1,
    x: 0,
    y: 0,
    rotation: 0,
    shake: { intensity: 10, duration: 0.3 }
  },
  shakeHeavy: {
    scale: 1,
    x: 0,
    y: 0,
    rotation: 0,
    shake: { intensity: 20, duration: 0.5 }
  },
  panToEnemy: {
    scale: 1.05,
    x: 100,
    y: 0,
    rotation: 0,
    duration: 0.4
  },
  panToPlayer: {
    scale: 1.05,
    x: -100,
    y: 0,
    rotation: 0,
    duration: 0.4
  }
};

/**
 * Lighting presets for sprites
 */
export const LIGHTING_PRESETS = {
  normal: {
    brightness: 1,
    contrast: 1,
    saturate: 1,
    hueRotate: 0,
    dropShadow: null
  },
  highlighted: {
    brightness: 1.2,
    contrast: 1.1,
    saturate: 1.2,
    hueRotate: 0,
    dropShadow: '0 0 20px rgba(255, 255, 255, 0.5)'
  },
  damaged: {
    brightness: 1.5,
    contrast: 1,
    saturate: 0.5,
    hueRotate: -20,
    dropShadow: '0 0 10px rgba(255, 0, 0, 0.7)'
  },
  poisoned: {
    brightness: 0.9,
    contrast: 1,
    saturate: 0.8,
    hueRotate: 270,
    dropShadow: '0 0 15px rgba(150, 0, 200, 0.5)'
  },
  paralyzed: {
    brightness: 1.1,
    contrast: 1,
    saturate: 1.2,
    hueRotate: 60,
    dropShadow: '0 0 15px rgba(255, 255, 0, 0.5)'
  },
  burned: {
    brightness: 1,
    contrast: 1.1,
    saturate: 1.3,
    hueRotate: -30,
    dropShadow: '0 0 15px rgba(255, 100, 0, 0.6)'
  },
  frozen: {
    brightness: 1.2,
    contrast: 0.9,
    saturate: 0.6,
    hueRotate: 180,
    dropShadow: '0 0 20px rgba(100, 200, 255, 0.7)'
  },
  sleeping: {
    brightness: 0.7,
    contrast: 0.9,
    saturate: 0.5,
    hueRotate: 0,
    dropShadow: null
  },
  superEffective: {
    brightness: 1.3,
    contrast: 1.2,
    saturate: 1.5,
    hueRotate: 0,
    dropShadow: '0 0 30px rgba(255, 200, 0, 0.8)'
  },
  notEffective: {
    brightness: 0.8,
    contrast: 0.9,
    saturate: 0.7,
    hueRotate: 0,
    dropShadow: null
  }
};

/**
 * Generate CSS filter string from lighting preset
 */
export function getLightingFilter(preset) {
  const lighting = LIGHTING_PRESETS[preset] || LIGHTING_PRESETS.normal;
  const filters = [];

  if (lighting.brightness !== 1) {
    filters.push(`brightness(${lighting.brightness})`);
  }
  if (lighting.contrast !== 1) {
    filters.push(`contrast(${lighting.contrast})`);
  }
  if (lighting.saturate !== 1) {
    filters.push(`saturate(${lighting.saturate})`);
  }
  if (lighting.hueRotate !== 0) {
    filters.push(`hue-rotate(${lighting.hueRotate}deg)`);
  }
  if (lighting.dropShadow) {
    filters.push(`drop-shadow(${lighting.dropShadow})`);
  }

  return filters.length > 0 ? filters.join(' ') : 'none';
}

/**
 * Get weather based on Pokemon type or floor
 */
export function getWeatherForContext(context) {
  // Floor-based weather
  if (context.floor) {
    const floor = context.floor;
    if (floor >= 18) return WEATHER_TYPES.fog;
    if (floor >= 15) return WEATHER_TYPES.snow;
    if (floor >= 12) return WEATHER_TYPES.sandstorm;
    if (floor >= 8) return WEATHER_TYPES.rain;
    if (floor >= 5) return WEATHER_TYPES.sun;
  }

  // Type-based weather (for themed battles)
  if (context.enemyType) {
    switch (context.enemyType) {
      case 'water':
        return WEATHER_TYPES.rain;
      case 'fire':
        return WEATHER_TYPES.sun;
      case 'rock':
      case 'ground':
        return WEATHER_TYPES.sandstorm;
      case 'ice':
        return WEATHER_TYPES.snow;
      case 'ghost':
      case 'dark':
        return WEATHER_TYPES.fog;
      default:
        return WEATHER_TYPES.none;
    }
  }

  return WEATHER_TYPES.none;
}

/**
 * Calculate damage modifier based on weather
 */
export function getWeatherDamageModifier(weather, moveType) {
  if (!weather || weather.id === 'none') return 1;

  if (weather.boostTypes && weather.boostTypes.includes(moveType)) {
    return 1.5;
  }
  if (weather.weakenTypes && weather.weakenTypes.includes(moveType)) {
    return 0.5;
  }

  return 1;
}

/**
 * Generate particle configuration for weather
 */
export function getWeatherParticleConfig(weather) {
  if (!weather || !weather.particles) return null;

  const p = weather.particles;
  return {
    particles: {
      number: { value: p.count },
      color: { value: p.color },
      shape: { type: p.shape === 'line' ? 'line' : 'circle' },
      size: {
        value: p.size.max,
        random: true,
        anim: { enable: false }
      },
      move: {
        enable: true,
        speed: p.speed,
        direction: p.angle > 0 ? 'bottom-right' : p.angle < 0 ? 'bottom-left' : 'bottom',
        straight: p.shape === 'line',
        outModes: { default: 'out' }
      },
      opacity: {
        value: 0.6,
        random: true
      }
    },
    interactivity: {
      events: {
        onHover: { enable: false },
        onClick: { enable: false }
      }
    }
  };
}

/**
 * Attack VFX configurations by type
 */
export const ATTACK_VFX = {
  normal: {
    color: '#a8a878',
    particles: { count: 10, spread: 45 },
    flash: false,
    shake: 'light'
  },
  fire: {
    color: '#f08030',
    particles: { count: 25, spread: 60 },
    flash: true,
    shake: 'medium',
    glow: 'rgba(255, 100, 0, 0.5)'
  },
  water: {
    color: '#6890f0',
    particles: { count: 20, spread: 50 },
    flash: false,
    shake: 'light',
    glow: 'rgba(100, 150, 255, 0.4)'
  },
  electric: {
    color: '#f8d030',
    particles: { count: 15, spread: 90 },
    flash: true,
    shake: 'medium',
    glow: 'rgba(255, 255, 0, 0.6)'
  },
  grass: {
    color: '#78c850',
    particles: { count: 15, spread: 45 },
    flash: false,
    shake: 'light',
    glow: 'rgba(100, 200, 50, 0.4)'
  },
  ice: {
    color: '#98d8d8',
    particles: { count: 20, spread: 40 },
    flash: true,
    shake: 'light',
    glow: 'rgba(150, 220, 255, 0.5)'
  },
  fighting: {
    color: '#c03028',
    particles: { count: 12, spread: 30 },
    flash: true,
    shake: 'heavy',
    glow: 'rgba(200, 50, 50, 0.5)'
  },
  poison: {
    color: '#a040a0',
    particles: { count: 18, spread: 60 },
    flash: false,
    shake: 'light',
    glow: 'rgba(160, 60, 160, 0.4)'
  },
  ground: {
    color: '#e0c068',
    particles: { count: 15, spread: 45 },
    flash: false,
    shake: 'heavy'
  },
  flying: {
    color: '#a890f0',
    particles: { count: 12, spread: 70 },
    flash: false,
    shake: 'light'
  },
  psychic: {
    color: '#f85888',
    particles: { count: 20, spread: 80 },
    flash: true,
    shake: 'medium',
    glow: 'rgba(255, 100, 150, 0.5)'
  },
  bug: {
    color: '#a8b820',
    particles: { count: 10, spread: 40 },
    flash: false,
    shake: 'light'
  },
  rock: {
    color: '#b8a038',
    particles: { count: 8, spread: 30 },
    flash: false,
    shake: 'heavy'
  },
  ghost: {
    color: '#705898',
    particles: { count: 15, spread: 90 },
    flash: true,
    shake: 'medium',
    glow: 'rgba(100, 50, 150, 0.6)'
  },
  dragon: {
    color: '#7038f8',
    particles: { count: 25, spread: 60 },
    flash: true,
    shake: 'heavy',
    glow: 'rgba(120, 60, 255, 0.6)'
  },
  dark: {
    color: '#705848',
    particles: { count: 15, spread: 50 },
    flash: true,
    shake: 'medium',
    glow: 'rgba(50, 40, 40, 0.7)'
  },
  steel: {
    color: '#b8b8d0',
    particles: { count: 10, spread: 35 },
    flash: true,
    shake: 'medium'
  },
  fairy: {
    color: '#ee99ac',
    particles: { count: 20, spread: 70 },
    flash: false,
    shake: 'light',
    glow: 'rgba(255, 150, 200, 0.5)'
  }
};

/**
 * Get attack VFX config for a move type
 */
export function getAttackVFX(moveType) {
  return ATTACK_VFX[moveType?.toLowerCase()] || ATTACK_VFX.normal;
}

/**
 * Create screen flash effect styles
 */
export function getFlashStyle(color, intensity = 0.3) {
  return {
    position: 'fixed',
    inset: 0,
    backgroundColor: color,
    opacity: intensity,
    pointerEvents: 'none',
    zIndex: 100
  };
}

/**
 * Particle burst configuration for impacts
 */
export function getImpactBurstConfig(type, isCritical = false) {
  const vfx = getAttackVFX(type);
  const multiplier = isCritical ? 2 : 1;

  return {
    count: vfx.particles.count * multiplier,
    spread: vfx.particles.spread * (isCritical ? 1.5 : 1),
    color: vfx.color,
    speed: isCritical ? 15 : 10,
    decay: 0.95,
    gravity: 0.5
  };
}
