// 📁 terrain.js
// Terrain system definitions

export const TERRAIN_TYPES = {
  NORMAL: 'normal',
  GRASSY: 'grassy',
  ELECTRIC: 'electric',
  MISTY: 'misty',
  PSYCHIC: 'psychic',
  VOLCANIC: 'volcanic',
  AQUATIC: 'aquatic',
  SANDSTORM: 'sandstorm',
  HAIL: 'hail',
};

export const TERRAIN_CONFIG = {
  [TERRAIN_TYPES.NORMAL]: {
    name: 'Normal Terrain',
    description: 'No special effects.',
    color: '#9ca3af', // gray-400
    icon: '🏞️',
    bonuses: {},
  },
  [TERRAIN_TYPES.GRASSY]: {
    name: 'Grassy Terrain',
    description: 'Grass and Bug moves deal 50% more damage.',
    color: '#4ade80', // green-400
    icon: '🌿',
    bonuses: {
      types: ['grass', 'bug'],
      damage_multiplier: 1.5,
    },
  },
  [TERRAIN_TYPES.ELECTRIC]: {
    name: 'Electric Terrain',
    description: 'Electric moves deal 50% more damage.',
    color: '#facc15', // yellow-400
    icon: '⚡',
    bonuses: {
      types: ['electric'],
      damage_multiplier: 1.5,
    },
  },
  [TERRAIN_TYPES.MISTY]: {
    name: 'Misty Terrain',
    description: 'Fairy and Ice moves deal 50% more damage.',
    color: '#f472b6', // pink-400
    icon: '🌫️',
    bonuses: {
      types: ['fairy', 'ice'],
      damage_multiplier: 1.5,
    },
  },
  [TERRAIN_TYPES.PSYCHIC]: {
    name: 'Psychic Terrain',
    description: 'Psychic and Ghost moves deal 50% more damage.',
    color: '#a855f7', // purple-500
    icon: '🔮',
    bonuses: {
      types: ['psychic', 'ghost'],
      damage_multiplier: 1.5,
    },
  },
  [TERRAIN_TYPES.VOLCANIC]: {
    name: 'Volcanic Terrain',
    description: 'Fire and Rock moves deal 50% more damage.',
    color: '#ef4444', // red-500
    icon: '🌋',
    bonuses: {
      types: ['fire', 'rock'],
      damage_multiplier: 1.5,
    },
  },
  [TERRAIN_TYPES.AQUATIC]: {
    name: 'Aquatic Terrain',
    description: 'Water and Ice moves deal 50% more damage.',
    color: '#3b82f6', // blue-500
    icon: '🌊',
    bonuses: {
      types: ['water', 'ice'],
      damage_multiplier: 1.5,
    },
  },
  [TERRAIN_TYPES.SANDSTORM]: {
    name: 'Sandstorm',
    description: 'Ground, Rock, and Steel moves deal 50% more damage.',
    color: '#d97706', // amber-600
    icon: '🌪️',
    bonuses: {
      types: ['ground', 'rock', 'steel'],
      damage_multiplier: 1.5,
    },
  },
  [TERRAIN_TYPES.HAIL]: {
    name: 'Hailstorm',
    description: 'Ice moves deal 50% more damage.',
    color: '#06b6d4', // cyan-500
    icon: '❄️',
    bonuses: {
      types: ['ice'],
      damage_multiplier: 1.5,
    },
  },
};

export function getTerrainBonus(terrainType, moveType) {
  const config = TERRAIN_CONFIG[terrainType];
  if (!config || !config.bonuses || !config.bonuses.types) return 1;

  if (config.bonuses.types.includes(moveType)) {
    return config.bonuses.damage_multiplier || 1;
  }

  return 1;
}
