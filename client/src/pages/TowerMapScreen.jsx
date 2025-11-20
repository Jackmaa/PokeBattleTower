// 📁 TowerMapScreen.jsx
// Tower map screen - Route selection between floors

import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { motion } from 'framer-motion';
import { TowerMap } from '../components/tower';
import { Button } from '../components/ui';
import { towerMapState, currentNodeState } from '../recoil/atoms/towerMap';

export default function TowerMapScreen({ onNodeConfirm, onBack }) {
  const towerMap = useRecoilValue(towerMapState);
  const currentNodeId = useRecoilValue(currentNodeState);
  const [selectedNode, setSelectedNode] = useState(null);

  const handleNodeSelect = (node) => {
    setSelectedNode(node);
  };

  const handleConfirmSelection = () => {
    if (selectedNode) {
      // Call parent callback if provided
      if (onNodeConfirm) {
        onNodeConfirm(selectedNode);
      }

      setSelectedNode(null);
    }
  };

  // Debug: check if map is empty
  if (!towerMap || towerMap.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gaming-darker via-gaming-dark to-gaming-darker p-8 flex items-center justify-center">
        <div className="text-white text-2xl">
          Loading tower map...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gaming-darker via-gaming-dark to-gaming-darker p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-6 flex items-center justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Choose Your Path
            </h1>
            <p className="text-white/70">
              Select the next node to continue your journey through the tower
            </p>
          </div>

          {onBack && (
            <Button variant="secondary" onClick={onBack}>
              ← Back
            </Button>
          )}
        </motion.div>

        {/* Tower Map */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <TowerMap
            map={towerMap}
            currentNodeId={currentNodeId}
            onNodeSelect={handleNodeSelect}
          />
        </motion.div>

        {/* Selection Confirmation */}
        {selectedNode && (
          <motion.div
            className="mt-6 p-6 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-xl border-2 border-blue-400 backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
                  style={{
                    backgroundColor: selectedNode.type === 'combat' ? '#ef4444'
                      : selectedNode.type === 'elite' ? '#8b5cf6'
                      : selectedNode.type === 'boss' ? '#dc2626'
                      : selectedNode.type === 'shop' ? '#f59e0b'
                      : selectedNode.type === 'heal' ? '#10b981'
                      : '#3b82f6',
                    boxShadow: `0 0 20px ${selectedNode.type === 'combat' ? '#ef4444'
                      : selectedNode.type === 'elite' ? '#8b5cf6'
                      : selectedNode.type === 'boss' ? '#dc2626'
                      : selectedNode.type === 'shop' ? '#f59e0b'
                      : selectedNode.type === 'heal' ? '#10b981'
                      : '#3b82f6'}60`,
                  }}
                >
                  {selectedNode.type === 'combat' && '⚔️'}
                  {selectedNode.type === 'elite' && '👑'}
                  {selectedNode.type === 'boss' && '💀'}
                  {selectedNode.type === 'shop' && '🏪'}
                  {selectedNode.type === 'heal' && '💊'}
                  {selectedNode.type === 'event' && '❓'}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white capitalize">
                    {selectedNode.type} Node
                  </h3>
                  <p className="text-white/70">
                    Floor {selectedNode.floor}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={() => setSelectedNode(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleConfirmSelection}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500"
                >
                  Confirm Selection →
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Instructions */}
        {!selectedNode && (
          <motion.div
            className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-white/60 text-center">
              💡 Click on an available node (pulsing) to select your next destination
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
