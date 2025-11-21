// 📁 SaveLoadUI.jsx
// UI for saving and loading games

import { useState, useEffect } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Card, Modal } from './ui';
import { teamState } from '../recoil/atoms/team';
import { floorState } from '../recoil/atoms/floor';
import { towerMapState, currentNodeState } from '../recoil/atoms/towerMap';
import { inventoryState, currencyState } from '../recoil/atoms/inventory';
import { gameViewState } from '../recoil/atoms/game';
import {
  getSaveSlots,
  saveGame,
  loadGame,
  deleteSave,
  getMostRecentSave,
  loadAutoSave,
  exportSave,
  getSaveSystemStats
} from '../utils/saveManager';
import { useAudio } from '../hooks/useAudio';

export default function SaveLoadUI({ mode = 'load', onClose, onLoadComplete }) {
  const [saveSlots, setSaveSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [saveStats, setSaveStats] = useState(null);
  const [error, setError] = useState(null);

  const [team, setTeam] = useRecoilState(teamState);
  const [floor, setFloor] = useRecoilState(floorState);
  const [towerMap, setTowerMap] = useRecoilState(towerMapState);
  const [inventory, setInventory] = useRecoilState(inventoryState);
  const [currency, setCurrency] = useRecoilState(currencyState);
  const [currentNode, setCurrentNode] = useRecoilState(currentNodeState);
  const setGameView = useSetRecoilState(gameViewState);

  const { playMenuSelect, playHealSound } = useAudio();

  useEffect(() => {
    loadSlots();
    setSaveStats(getSaveSystemStats());
  }, []);

  const loadSlots = () => {
    const slots = getSaveSlots();
    setSaveSlots(slots);
  };

  const handleSave = (slotId) => {
    try {
      playMenuSelect();
      const gameState = {
        team,
        floor,
        towerMap,
        inventory,
        currency,
        currentNode,
        gameView: 'map' // Always return to map on load
      };

      const stats = {
        floorsCleared: floor,
        pokemonCaught: team.length
      };

      saveGame(slotId, gameState, stats);
      loadSlots(); // Refresh display
      playHealSound();
      setError(null);

      // Show success message
      setTimeout(() => {
        if (onClose) onClose();
      }, 1000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLoad = (slotId) => {
    try {
      playMenuSelect();
      const saveData = loadGame(slotId);

      if (!saveData) {
        setError('Failed to load save data');
        return;
      }

      const { gameState } = saveData;

      // Restore all game state
      setTeam(gameState.team);
      setFloor(gameState.floor);
      setTowerMap(gameState.towerMap);
      setInventory(gameState.inventory);
      setCurrency(gameState.currency);
      setCurrentNode(gameState.currentNode);
      setGameView(gameState.gameView || 'map');

      playHealSound();
      setError(null);

      if (onLoadComplete) {
        onLoadComplete(saveData);
      }

      if (onClose) onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = (slotId) => {
    try {
      playMenuSelect();
      deleteSave(slotId);
      loadSlots();
      setConfirmDelete(null);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLoadAutoSave = () => {
    try {
      playMenuSelect();
      const autoSaveData = loadAutoSave();

      if (!autoSaveData) {
        setError('No auto-save found');
        return;
      }

      const { gameState } = autoSaveData;

      setTeam(gameState.team);
      setFloor(gameState.floor);
      setTowerMap(gameState.towerMap);
      setInventory(gameState.inventory);
      setCurrency(gameState.currency);
      setCurrentNode(gameState.currentNode);
      setGameView(gameState.gameView || 'map');

      playHealSound();
      setError(null);

      if (onLoadComplete) {
        onLoadComplete(autoSaveData);
      }

      if (onClose) onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const formatPlaytime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m`;
    } else {
      return `${seconds}s`;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        className="max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <Card className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {mode === 'save' ? '💾 Save Game' : '📂 Load Game'}
              </h2>
              {saveStats && (
                <p className="text-white/60 text-sm">
                  {saveStats.usedSlots}/{saveStats.totalSlots} slots used • {saveStats.storageUsedKB} KB
                  {saveStats.hasAutoSave && ' • Auto-save available'}
                </p>
              )}
            </div>
            <Button variant="secondary" onClick={onClose}>
              ✕ Close
            </Button>
          </div>

          {/* Error Display */}
          {error && (
            <motion.div
              className="mb-4 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-400"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              ⚠️ {error}
            </motion.div>
          )}

          {/* Auto-save button (only in load mode) */}
          {mode === 'load' && saveStats?.hasAutoSave && (
            <motion.div className="mb-4">
              <Button
                onClick={handleLoadAutoSave}
                className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500"
              >
                ⚡ Continue from Auto-Save
              </Button>
            </motion.div>
          )}

          {/* Save Slots */}
          <div className="grid gap-4">
            {saveSlots.map((slot) => (
              <motion.div
                key={slot.slotId}
                className={`relative ${selectedSlot === slot.slotId ? 'ring-2 ring-gaming-accent' : ''}`}
                whileHover={{ scale: 1.02 }}
                layout
              >
                <Card className="p-4 bg-gaming-dark/50">
                  {slot.empty ? (
                    // Empty Slot
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-lg bg-white/5 flex items-center justify-center text-3xl">
                          📭
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white/40">
                            Slot {slot.slotId} - Empty
                          </h3>
                          <p className="text-sm text-white/30">No save data</p>
                        </div>
                      </div>
                      {mode === 'save' && (
                        <Button onClick={() => handleSave(slot.slotId)}>
                          💾 Save Here
                        </Button>
                      )}
                    </div>
                  ) : (
                    // Occupied Slot
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-gaming-accent/30 to-purple-600/30 flex items-center justify-center text-3xl">
                          💾
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-xl font-bold text-white">
                              Slot {slot.slotId}
                            </h3>
                            <span className="px-2 py-1 bg-gaming-accent/20 text-gaming-accent text-xs rounded">
                              Floor {slot.preview.floor}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-white/70">
                            <div>
                              <span className="text-white/50">Team:</span> {slot.preview.teamSize}/6
                            </div>
                            <div>
                              <span className="text-white/50">Lead:</span> {slot.preview.firstPokemon}
                            </div>
                            <div>
                              <span className="text-white/50">Gold:</span> 💰 {slot.preview.currency}
                            </div>
                            <div>
                              <span className="text-white/50">Time:</span> {formatPlaytime(slot.preview.playtime)}
                            </div>
                          </div>
                          <p className="text-xs text-white/40 mt-1">
                            {formatTimestamp(slot.timestamp)}
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        {mode === 'load' ? (
                          <>
                            <Button onClick={() => handleLoad(slot.slotId)}>
                              📂 Load
                            </Button>
                            <Button
                              variant="secondary"
                              onClick={() => exportSave(slot.slotId)}
                              title="Export save to JSON"
                            >
                              📤
                            </Button>
                            <Button
                              variant="danger"
                              onClick={() => setConfirmDelete(slot.slotId)}
                            >
                              🗑️
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button onClick={() => handleSave(slot.slotId)}>
                              💾 Overwrite
                            </Button>
                            <Button
                              variant="danger"
                              onClick={() => setConfirmDelete(slot.slotId)}
                            >
                              🗑️
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Storage Info */}
          <div className="mt-6 p-4 bg-white/5 rounded-lg">
            <p className="text-sm text-white/60">
              💡 <strong>Tip:</strong> The game auto-saves every 30 seconds and before closing.
              Manual saves allow you to have multiple save points.
            </p>
          </div>
        </Card>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {confirmDelete && (
          <Modal
            isOpen={!!confirmDelete}
            onClose={() => setConfirmDelete(null)}
            title="⚠️ Delete Save?"
          >
            <p className="text-white/80 mb-6">
              Are you sure you want to delete save slot {confirmDelete}? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <Button
                variant="danger"
                onClick={() => handleDelete(confirmDelete)}
                className="flex-1"
              >
                🗑️ Delete
              </Button>
              <Button
                variant="secondary"
                onClick={() => setConfirmDelete(null)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}
