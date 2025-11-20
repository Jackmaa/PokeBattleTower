// 📁 towerMap.js
// Tower map generation system - Slay the Spire style

export const NODE_TYPES = {
  COMBAT: 'combat',
  ELITE: 'elite',
  BOSS: 'boss',
  SHOP: 'shop',
  HEAL: 'heal',
  EVENT: 'event',
  START: 'start',
};

// Visual configuration for each node type
export const NODE_CONFIG = {
  [NODE_TYPES.COMBAT]: {
    icon: '⚔️',
    label: 'Combat',
    color: '#ef4444',
    bgColor: 'from-red-600 to-red-400',
    borderColor: 'border-red-400',
    description: 'Battle a wild Pokémon',
  },
  [NODE_TYPES.ELITE]: {
    icon: '👑',
    label: 'Elite',
    color: '#8b5cf6',
    bgColor: 'from-purple-600 to-purple-400',
    borderColor: 'border-purple-400',
    description: 'Face a powerful trainer',
  },
  [NODE_TYPES.BOSS]: {
    icon: '💀',
    label: 'Boss',
    color: '#dc2626',
    bgColor: 'from-red-700 to-red-500',
    borderColor: 'border-red-500',
    description: 'Champion battle',
  },
  [NODE_TYPES.SHOP]: {
    icon: '🏪',
    label: 'Shop',
    color: '#f59e0b',
    bgColor: 'from-amber-600 to-amber-400',
    borderColor: 'border-amber-400',
    description: 'Buy items and upgrades',
  },
  [NODE_TYPES.HEAL]: {
    icon: '💊',
    label: 'Rest',
    color: '#10b981',
    bgColor: 'from-green-600 to-green-400',
    borderColor: 'border-green-400',
    description: 'Heal your team',
  },
  [NODE_TYPES.EVENT]: {
    icon: '❓',
    label: 'Event',
    color: '#3b82f6',
    bgColor: 'from-blue-600 to-blue-400',
    borderColor: 'border-blue-400',
    description: 'Random encounter',
  },
  [NODE_TYPES.START]: {
    icon: '🏁',
    label: 'Start',
    color: '#6b7280',
    bgColor: 'from-gray-600 to-gray-400',
    borderColor: 'border-gray-400',
    description: 'Begin your journey',
  },
};

/**
 * Generate a tower map with connected nodes
 * @param {number} totalFloors - Total number of floors (default: 20)
 * @param {number} pathWidth - Number of parallel paths (default: 3-5)
 * @returns {Array} Array of floor arrays containing nodes
 */
export function generateTowerMap(totalFloors = 20, pathWidth = 4) {
  const map = [];

  // Floor 0: Start node
  map.push([
    {
      id: 'start',
      type: NODE_TYPES.START,
      floor: 0,
      column: Math.floor(pathWidth / 2),
      connections: [], // Will be filled later
    }
  ]);

  // Generate middle floors (1 to totalFloors - 2)
  for (let floor = 1; floor < totalFloors - 1; floor++) {
    const floorNodes = [];
    const nodeCount = pathWidth + Math.floor(Math.random() * 2) - 1; // Vary width slightly

    for (let col = 0; col < nodeCount; col++) {
      const nodeType = determineNodeType(floor, totalFloors);

      floorNodes.push({
        id: `floor-${floor}-col-${col}`,
        type: nodeType,
        floor,
        column: col,
        connections: [],
        visited: false,
        available: false, // Will be set based on current progress
      });
    }

    map.push(floorNodes);
  }

  // Final floor: Boss node
  map.push([
    {
      id: 'boss',
      type: NODE_TYPES.BOSS,
      floor: totalFloors - 1,
      column: Math.floor(pathWidth / 2),
      connections: [],
      visited: false,
      available: false,
    }
  ]);

  // Connect nodes between floors
  connectNodes(map);

  return map;
}

/**
 * Determine node type based on floor number and game rules
 */
function determineNodeType(floor, totalFloors) {
  // Boss at the end (handled separately)
  if (floor === totalFloors - 1) {
    return NODE_TYPES.BOSS;
  }

  // Elite battles every 5 floors (but not at boss floor)
  if (floor % 5 === 0 && floor > 0 && floor < totalFloors - 1) {
    return NODE_TYPES.ELITE;
  }

  // Rest/Shop appear more frequently in early-mid game
  const random = Math.random();

  if (floor <= 3) {
    // Early game: more heals
    if (random < 0.15) return NODE_TYPES.HEAL;
    if (random < 0.25) return NODE_TYPES.SHOP;
    if (random < 0.35) return NODE_TYPES.EVENT;
    return NODE_TYPES.COMBAT;
  } else if (floor <= 10) {
    // Mid game: balanced
    if (random < 0.1) return NODE_TYPES.HEAL;
    if (random < 0.2) return NODE_TYPES.SHOP;
    if (random < 0.35) return NODE_TYPES.EVENT;
    return NODE_TYPES.COMBAT;
  } else {
    // Late game: more combat
    if (random < 0.08) return NODE_TYPES.HEAL;
    if (random < 0.15) return NODE_TYPES.SHOP;
    if (random < 0.25) return NODE_TYPES.EVENT;
    return NODE_TYPES.COMBAT;
  }
}

/**
 * Connect nodes between adjacent floors
 * Each node connects to 1-3 nodes in the next floor
 */
function connectNodes(map) {
  for (let floorIndex = 0; floorIndex < map.length - 1; floorIndex++) {
    const currentFloor = map[floorIndex];
    const nextFloor = map[floorIndex + 1];

    currentFloor.forEach((node, nodeIndex) => {
      const connections = [];

      // Connect to same column
      if (nextFloor[nodeIndex]) {
        connections.push(nextFloor[nodeIndex].id);
      }

      // Connect to adjacent columns (left and right)
      if (nodeIndex > 0 && nextFloor[nodeIndex - 1]) {
        connections.push(nextFloor[nodeIndex - 1].id);
      }
      if (nodeIndex < nextFloor.length - 1 && nextFloor[nodeIndex + 1]) {
        connections.push(nextFloor[nodeIndex + 1].id);
      }

      // If no connections found (edge case), connect to closest node
      if (connections.length === 0 && nextFloor.length > 0) {
        connections.push(nextFloor[0].id);
      }

      node.connections = connections;
    });
  }

  // Make sure start node is available and visited (it's just a starting point)
  if (map[0] && map[0][0]) {
    map[0][0].available = true;
    map[0][0].visited = true;
  }

  // Make all floor 1 nodes available at the start
  if (map[1]) {
    map[1].forEach(node => {
      node.available = true;
    });
  }
}

/**
 * Update map availability based on current position
 * @param {Array} map - The tower map
 * @param {string} currentNodeId - Current node ID
 * @returns {Array} Updated map
 */
export function updateMapAvailability(map, currentNodeId) {
  console.log('[updateMapAvailability] Called with nodeId:', currentNodeId);

  // Deep clone the map
  const updatedMap = JSON.parse(JSON.stringify(map));

  // Find current node
  let currentNode = null;
  updatedMap.forEach(floor => {
    floor.forEach(node => {
      if (node.id === currentNodeId) {
        currentNode = node;
        node.visited = true;
        console.log('[updateMapAvailability] Found current node:', node.id, 'Type:', node.type);
        console.log('[updateMapAvailability] Current node connections:', node.connections);
      }
    });
  });

  if (!currentNode) {
    console.warn('[updateMapAvailability] Current node not found!');
    return updatedMap;
  }

  // Make connected nodes available
  const madeAvailable = [];
  updatedMap.forEach(floor => {
    floor.forEach(node => {
      if (currentNode.connections.includes(node.id)) {
        node.available = true;
        madeAvailable.push(node.id);
      }
    });
  });

  console.log('[updateMapAvailability] Made these nodes available:', madeAvailable);

  return updatedMap;
}

/**
 * Get node by ID
 */
export function getNodeById(map, nodeId) {
  for (const floor of map) {
    for (const node of floor) {
      if (node.id === nodeId) {
        return node;
      }
    }
  }
  return null;
}

/**
 * Calculate position for node rendering (SVG coordinates)
 */
export function calculateNodePosition(node, totalColumns, floorHeight = 120, columnWidth = 150) {
  const x = (node.column + 0.5) * columnWidth;
  const y = node.floor * floorHeight + 60;

  return { x, y };
}
