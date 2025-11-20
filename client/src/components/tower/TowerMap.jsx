// 📁 TowerMap.jsx
// Tower map visualization component - Slay the Spire style

import { motion } from "framer-motion";
import { NODE_CONFIG, calculateNodePosition } from "../../utils/towerMap";
import { Card } from "../ui";

export default function TowerMap({ map, currentNodeId, onNodeSelect }) {
  if (!map || map.length === 0) {
    return null;
  }

  // Calculate SVG dimensions
  const maxColumns = Math.max(...map.map(floor => floor.length));
  const floorHeight = 120;
  const columnWidth = 150;
  const svgWidth = maxColumns * columnWidth + 100;
  const svgHeight = map.length * floorHeight + 120;

  return (
    <Card className="p-6 bg-gradient-to-b from-black/80 to-black/60 overflow-auto max-h-[80vh]">
      <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        Tower Map
      </h2>

      <div className="relative w-full overflow-x-auto">
        <svg
          width={svgWidth}
          height={svgHeight}
          className="mx-auto"
          style={{ minWidth: '800px' }}
        >
          {/* Draw connections first (so they appear behind nodes) */}
          {map.map((floor, floorIndex) =>
            floor.map(node => {
              const nodePos = calculateNodePosition(node, maxColumns, floorHeight, columnWidth);

              return node.connections.map(connectionId => {
                // Find the connected node
                const nextFloor = map[floorIndex + 1];
                if (!nextFloor) return null;

                const connectedNode = nextFloor.find(n => n.id === connectionId);
                if (!connectedNode) return null;

                const connectedPos = calculateNodePosition(connectedNode, maxColumns, floorHeight, columnWidth);

                // Determine line color based on availability
                const isActive = node.visited || node.id === currentNodeId;
                const isNextAvailable = connectedNode.available;
                const lineColor = isActive && isNextAvailable
                  ? '#60a5fa' // Blue for available paths
                  : node.visited
                  ? '#6b7280' // Gray for visited
                  : '#374151'; // Dark gray for unavailable

                const lineWidth = isActive && isNextAvailable ? 3 : 2;

                return (
                  <motion.line
                    key={`${node.id}-${connectionId}`}
                    x1={nodePos.x}
                    y1={nodePos.y}
                    x2={connectedPos.x}
                    y2={connectedPos.y}
                    stroke={lineColor}
                    strokeWidth={lineWidth}
                    strokeDasharray={!isActive ? "5,5" : "0"}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.6 }}
                    transition={{ duration: 0.5, delay: floorIndex * 0.1 }}
                  />
                );
              });
            })
          )}

          {/* Draw nodes */}
          {map.map((floor, floorIndex) =>
            floor.map((node, nodeIndex) => {
              const position = calculateNodePosition(node, maxColumns, floorHeight, columnWidth);
              const config = NODE_CONFIG[node.type];

              const isCurrent = node.id === currentNodeId;
              const isAvailable = node.available && !node.visited;
              const isVisited = node.visited;
              const isClickable = isAvailable && !isCurrent;

              return (
                <g
                  key={node.id}
                  transform={`translate(${position.x}, ${position.y})`}
                  style={{ cursor: isClickable ? 'pointer' : 'default' }}
                  onClick={() => isClickable && onNodeSelect(node)}
                >
                  {/* Node background circle */}
                  <motion.circle
                    r={isCurrent ? 35 : 30}
                    fill={
                      isCurrent
                        ? config.color
                        : isVisited
                        ? '#4b5563'
                        : isAvailable
                        ? config.color
                        : '#1f2937'
                    }
                    stroke={config.color}
                    strokeWidth={isCurrent ? 4 : 2}
                    opacity={isVisited ? 0.5 : 1}
                    initial={{ scale: 0 }}
                    animate={{
                      scale: 1,
                      boxShadow: isCurrent
                        ? `0 0 20px ${config.color}`
                        : 'none',
                    }}
                    transition={{
                      type: "spring",
                      delay: floorIndex * 0.1 + nodeIndex * 0.05,
                    }}
                    whileHover={isClickable ? { scale: 1.15 } : {}}
                  />

                  {/* Glow effect for current node */}
                  {isCurrent && (
                    <motion.circle
                      r={40}
                      fill="none"
                      stroke={config.color}
                      strokeWidth={2}
                      opacity={0.3}
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.6, 0.3],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  )}

                  {/* Available pulse animation */}
                  {isAvailable && !isCurrent && (
                    <motion.circle
                      r={35}
                      fill="none"
                      stroke={config.color}
                      strokeWidth={2}
                      animate={{
                        scale: [1, 1.3],
                        opacity: [0.5, 0],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeOut",
                      }}
                    />
                  )}

                  {/* Node icon */}
                  <text
                    fontSize={isCurrent ? "28" : "24"}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="white"
                    style={{ pointerEvents: 'none', userSelect: 'none' }}
                  >
                    {config.icon}
                  </text>

                  {/* Checkmark for visited nodes */}
                  {isVisited && !isCurrent && (
                    <text
                      x={18}
                      y={-18}
                      fontSize="16"
                      fill="#10b981"
                      style={{ pointerEvents: 'none' }}
                    >
                      ✓
                    </text>
                  )}

                  {/* Tooltip on hover */}
                  {isClickable && (
                    <motion.g
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <rect
                        x={-60}
                        y={-70}
                        width={120}
                        height={30}
                        rx={5}
                        fill="#1f2937"
                        stroke={config.color}
                        strokeWidth={2}
                      />
                      <text
                        y={-52}
                        fontSize="12"
                        textAnchor="middle"
                        fill="white"
                        fontWeight="bold"
                        style={{ pointerEvents: 'none' }}
                      >
                        {config.label}
                      </text>
                    </motion.g>
                  )}
                </g>
              );
            })
          )}
        </svg>
      </div>

      {/* Legend */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3">
        {Object.entries(NODE_CONFIG).map(([type, config]) => {
          if (type === 'start') return null; // Don't show start in legend

          return (
            <div
              key={type}
              className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/10"
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-lg"
                style={{
                  backgroundColor: config.color,
                  boxShadow: `0 0 10px ${config.color}40`,
                }}
              >
                {config.icon}
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-white">{config.label}</p>
                <p className="text-xs text-white/60">{config.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
