// 📁 TowerMapScreen.jsx
// Tower map screen - Route selection between floors

import { useState, useEffect } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import { motion, AnimatePresence } from 'framer-motion';
import { TowerMap } from '../components/tower';
import { Button } from '../components/ui';
import { towerMapState, currentNodeState } from '../recoil/atoms/towerMap';
import { gameViewState } from '../recoil/atoms/game';
import { showSettingsMenuState } from '../recoil/atoms/settings';
import SaveLoadUI from '../components/SaveLoadUI';
import SettingsMenu from '../components/SettingsMenu';
import LeaderboardScreen from './LeaderboardScreen';
import { useAutoSave } from '../hooks/useAutoSave';

export default function TowerMapScreen({ onNodeConfirm, onBack }) {
  const towerMap = useRecoilValue(towerMapState);
  const currentNodeId = useRecoilValue(currentNodeState);
  const [gameView, setGameView] = useRecoilState(gameViewState);
  const [showSettingsMenu, setShowSettingsMenu] = useRecoilState(showSettingsMenuState);
  const [selectedNode, setSelectedNode] = useState(null);
  const [showSaveUI, setShowSaveUI] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [saveMode, setSaveMode] = useState('load');
  const [autoSaveIndicator, setAutoSaveIndicator] = useState(false);

  // Enable auto-save
  useAutoSave(30000, true, {
    saveOnFloorChange: true,
    onAutoSave: () => {
      setAutoSaveIndicator(true);
      setTimeout(() => setAutoSaveIndicator(false), 2000);
    }
  });

  // Debug: Log available nodes when map changes
  useEffect(() => {
    console.log('[TowerMapScreen] Current node:', currentNodeId);
    const availableNodes = [];
    towerMap.forEach(floor => {
      floor.forEach(node => {
        if (node.available && !node.visited) {
          availableNodes.push(node.id);
        }
      });
    });
    console.log('[TowerMapScreen] Available nodes:', availableNodes);
  }, [towerMap, currentNodeId]);

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

          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => setShowLeaderboard(true)}
              className="bg-gradient-to-r from-yellow-600/80 to-amber-600/80 hover:from-yellow-500/80 hover:to-amber-500/80 border-2 border-yellow-400/50"
              title="Leaderboard"
            >
              🏆
            </Button>

            <Button
              variant="secondary"
              onClick={() => setShowSettingsMenu(true)}
              className="bg-gradient-to-r from-slate-600/80 to-gray-600/80 hover:from-slate-500/80 hover:to-gray-500/80 border-2 border-slate-400/50"
              title="Settings"
            >
              ⚙️
            </Button>

            <Button
              variant="secondary"
              onClick={() => {
                setSaveMode('save');
                setShowSaveUI(true);
              }}
              className="bg-gradient-to-r from-green-600/80 to-emerald-600/80 hover:from-green-500/80 hover:to-emerald-500/80 border-2 border-green-400/50"
            >
              💾
            </Button>

            <Button
              variant="secondary"
              onClick={() => {
                setSaveMode('load');
                setShowSaveUI(true);
              }}
              className="bg-gradient-to-r from-blue-600/80 to-cyan-600/80 hover:from-blue-500/80 hover:to-cyan-500/80 border-2 border-blue-400/50"
            >
              📂
            </Button>

            <Button
              variant="secondary"
              onClick={() => setGameView('equip')}
              className="bg-gradient-to-r from-purple-600/80 to-pink-600/80 hover:from-purple-500/80 hover:to-pink-500/80 border-2 border-purple-400/50"
            >
              🎒
            </Button>

            {onBack && (
              <Button variant="secondary" onClick={onBack}>
                ← Back
              </Button>
            )}
          </div>
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

        {/* Auto-save Indicator */}
        <AnimatePresence>
          {autoSaveIndicator && (
            <motion.div
              className="fixed bottom-8 right-8 px-6 py-3 bg-green-600/90 backdrop-blur-sm rounded-lg border-2 border-green-400 shadow-lg"
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
            >
              <div className="flex items-center gap-2 text-white font-bold">
                <span className="text-xl">💾</span>
                <span>Game Auto-Saved</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Save/Load UI Modal */}
      <AnimatePresence>
        {showSaveUI && (
          <SaveLoadUI
            mode={saveMode}
            onClose={() => setShowSaveUI(false)}
            onLoadComplete={(saveData) => {
              console.log('Game loaded:', saveData);
              setShowSaveUI(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* Settings Menu */}
      <AnimatePresence>
        {showSettingsMenu && <SettingsMenu />}
      </AnimatePresence>

      {/* Leaderboard */}
      <AnimatePresence>
        {showLeaderboard && (
          <LeaderboardScreen onClose={() => setShowLeaderboard(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
