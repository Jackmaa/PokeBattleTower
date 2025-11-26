// 📁 TowerMap.jsx
// Tower map visualization component - Cosmic Theme

import { motion } from "framer-motion";
import { useState } from "react";
import { NODE_CONFIG, calculateNodePosition } from "../../utils/towerMap";
import { TERRAIN_CONFIG } from "../../utils/terrain";
import { Card } from "../ui";

export default function TowerMap({ map, currentNodeId, onNodeSelect, onNodeHover }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  if (!map || map.length === 0) {
    return null;
  }

  // Calculate SVG dimensions
  const maxColumns = Math.max(...map.map(floor => floor.length));
  const floorHeight = 120;
  const columnWidth = 150;
  const svgWidth = maxColumns * columnWidth + 100;
  const svgHeight = map.length * floorHeight + 120;

  // Parallax effect handler
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    setMousePos({
      x: (clientX - centerX) / 50,
      y: (clientY - centerY) / 50,
    });
  };

  return (
    <Card 
      className="relative p-0 bg-black overflow-hidden h-[80vh] border-2 border-purple-900/50 shadow-2xl shadow-purple-900/20"
      onMouseMove={handleMouseMove}
    >
      {/* Cosmic Background Layers */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-[#0a0a0a] to-black" />
      
      {/* Stars Layer 1 (Slow) */}
      <motion.div 
        className="absolute inset-0 opacity-50"
        style={{ 
          backgroundImage: 'radial-gradient(white 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          x: mousePos.x * -1,
          y: mousePos.y * -1
        }}
      />
      
      {/* Stars Layer 2 (Fast) */}
      <motion.div 
        className="absolute inset-0 opacity-30"
        style={{ 
          backgroundImage: 'radial-gradient(blue 1px, transparent 1px)',
          backgroundSize: '30px 30px',
          x: mousePos.x * -2,
          y: mousePos.y * -2
        }}
      />

      {/* Nebula Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 via-transparent to-blue-900/20 pointer-events-none" />

      <div className="relative z-10 w-full h-full overflow-auto custom-scrollbar">
        <h2 className="sticky top-0 z-20 text-3xl font-bold text-center py-6 bg-gradient-to-b from-black/90 to-transparent bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
          Cosmic Tower
        </h2>

        <div className="relative w-full overflow-x-auto pb-20">
          <svg
            width={svgWidth}
            height={svgHeight}
            className="mx-auto"
            style={{ minWidth: '800px' }}
          >
            {/* Draw connections first */}
            {map.map((floor, floorIndex) =>
              floor.map(node => {
                const nodePos = calculateNodePosition(node, maxColumns, floorHeight, columnWidth);

                return node.connections.map(connectionId => {
                  const nextFloor = map[floorIndex + 1];
                  if (!nextFloor) return null;

                  const connectedNode = nextFloor.find(n => n.id === connectionId);
                  if (!connectedNode) return null;

                  const connectedPos = calculateNodePosition(connectedNode, maxColumns, floorHeight, columnWidth);

                  const isActive = node.visited || node.id === currentNodeId;
                  const isNextAvailable = connectedNode.available;
                  
                  // Energy Flow Color
                  const strokeColor = isActive && isNextAvailable ? '#60a5fa' : '#374151';
                  
                  return (
                    <g key={`${node.id}-${connectionId}`}>
                      {/* Base Line */}
                      <line
                        x1={nodePos.x}
                        y1={nodePos.y}
                        x2={connectedPos.x}
                        y2={connectedPos.y}
                        stroke={strokeColor}
                        strokeWidth={isActive && isNextAvailable ? 2 : 1}
                        strokeOpacity={0.3}
                      />
                      
                      {/* Energy Flow Animation */}
                      {(isActive && isNextAvailable) && (
                        <motion.line
                          x1={nodePos.x}
                          y1={nodePos.y}
                          x2={connectedPos.x}
                          y2={connectedPos.y}
                          stroke={strokeColor}
                          strokeWidth={2}
                          strokeDasharray="10,10"
                          animate={{ strokeDashoffset: [0, -20] }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                      )}
                    </g>
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
                    onMouseEnter={() => onNodeHover && onNodeHover(node)}
                  >
                    {/* Outer Glow for Current/Available */}
                    {(isCurrent || isAvailable) && (
                      <motion.circle
                        r={isCurrent ? 45 : 35}
                        fill={config.color}
                        opacity={0.2}
                        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}

                    {/* Node Body */}
                    <circle
                      r={30}
                      fill="#0f172a"
                      stroke={config.color}
                      strokeWidth={isCurrent ? 3 : 2}
                      className="drop-shadow-lg"
                    />

                    {/* Inner Fill (Visited/Current) */}
                    {(isVisited || isCurrent) && (
                      <circle
                        r={26}
                        fill={config.color}
                        opacity={isCurrent ? 0.3 : 0.1}
                      />
                    )}

                    {/* Icon */}
                    <text
                      fontSize="24"
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="white"
                      style={{ pointerEvents: 'none', userSelect: 'none', filter: 'drop-shadow(0 0 2px black)' }}
                    >
                      {config.icon}
                    </text>

                    {/* Checkmark */}
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

                    {/* Tooltip with Scouting Info */}
                    {isClickable && (
                      <motion.g
                        initial={{ opacity: 0, y: 10 }}
                        whileHover={{ opacity: 1, y: 0 }}
                      >
                        <rect
                          x={-90}
                          y={-95}
                          width={180}
                          height={node.enemies ? 75 : 45}
                          rx={8}
                          fill="#0f172a"
                          stroke={config.color}
                          strokeWidth={1}
                          fillOpacity={0.95}
                        />
                        <text
                          y={-77}
                          fontSize="14"
                          textAnchor="middle"
                          fill="white"
                          fontWeight="bold"
                          style={{ pointerEvents: 'none' }}
                        >
                          {config.label}
                        </text>
                        
                        {/* Terrain Info */}
                        {node.terrain && (
                          <text
                            y={-60}
                            fontSize="10"
                            textAnchor="middle"
                            fill={TERRAIN_CONFIG[node.terrain]?.color || '#fff'}
                            style={{ pointerEvents: 'none' }}
                          >
                            {TERRAIN_CONFIG[node.terrain]?.icon} {TERRAIN_CONFIG[node.terrain]?.name}
                          </text>
                        )}
                        
                        {/* Enemy Info (Scouted) */}
                        {node.enemies && (
                          <>
                            <text
                              y={-42}
                              fontSize="9"
                              textAnchor="middle"
                              fill="#94a3b8"
                              style={{ pointerEvents: 'none' }}
                            >
                              {node.enemies.length} {node.enemies.length === 1 ? 'Enemy' : 'Enemies'}
                            </text>
                            <text
                              y={-30}
                              fontSize="8"
                              textAnchor="middle"
                              fill="#64748b"
                              style={{ pointerEvents: 'none' }}
                            >
                              {node.enemies.map(e => e.name).slice(0, 2).join(', ')}
                              {node.enemies.length > 2 ? '...' : ''}
                            </text>
                          </>
                        )}
                      </motion.g>
                    )}
                  </g>
                );
              })
            )}
          </svg>
        </div>

        {/* Legend */}
        <div className="sticky bottom-0 bg-black/80 backdrop-blur-md border-t border-white/10 p-4">
          <div className="flex flex-wrap justify-center gap-4">
            {Object.entries(NODE_CONFIG).map(([type, config]) => {
              if (type === 'start') return null;
              return (
                <div key={type} className="flex items-center gap-2">
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs border"
                    style={{ 
                      backgroundColor: `${config.color}20`,
                      borderColor: config.color,
                      color: config.color
                    }}
                  >
                    {config.icon}
                  </div>
                  <span className="text-xs text-gray-300 font-medium">{config.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}
