// LevelUpChoiceModal.jsx
// Modal that appears on level up, offering choice between:
// 1. Learn a new move
// 2. Upgrade an existing move
// 3. Fuse two moves (if compatible)

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Button } from './ui';
import { MAX_SKILL_LEVEL, getSkillLevelBonus, levelUpSkill, getSkillLevelDisplay, TARGET_TYPES } from '../utils/moves';
import { getPossibleFusions, performSpellFusion, FUSED_MOVES } from '../utils/spellFusion';
import { useMoveDisplay } from '../hooks/ui/useMoveDisplay';
import typeColors from '../utils/typeColors';

// Check if move is AOE
const isAOEMove = (target) => {
  return target === TARGET_TYPES.ALL_ENEMIES ||
         target === TARGET_TYPES.ALL_ALLIES ||
         target === TARGET_TYPES.ALL_OTHER;
};

// Status effect configuration for badges
const STATUS_CONFIG = {
  poisoned: { emoji: '☠️', color: 'rgba(168, 85, 247, 0.5)', border: 'rgba(168, 85, 247, 0.7)', text: '#d8b4fe' },
  badly_poisoned: { emoji: '☠️', color: 'rgba(147, 51, 234, 0.5)', border: 'rgba(147, 51, 234, 0.7)', text: '#c084fc' },
  paralyzed: { emoji: '⚡', color: 'rgba(234, 179, 8, 0.5)', border: 'rgba(234, 179, 8, 0.7)', text: '#fde047' },
  burned: { emoji: '🔥', color: 'rgba(249, 115, 22, 0.5)', border: 'rgba(249, 115, 22, 0.7)', text: '#fdba74' },
  frozen: { emoji: '❄️', color: 'rgba(6, 182, 212, 0.5)', border: 'rgba(6, 182, 212, 0.7)', text: '#67e8f9' },
};

/**
 * Compact move display for selection
 */
function MoveOption({ move, isSelected, onClick, showUpgradeInfo = false }) {
  const { typeColor, badges, skillLevel, isMaxLevel } = useMoveDisplay(move, {
    showEnhancedInfo: false,
    showSkillLevel: true,
    showFused: true,
    showPP: false,
  });

  return (
    <motion.button
      onClick={onClick}
      className={`w-full p-3 rounded-lg text-left transition-all ${
        isSelected
          ? 'ring-2 ring-blue-500 bg-blue-500/20'
          : 'bg-white/5 hover:bg-white/10'
      }`}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="px-2 py-0.5 rounded text-xs font-bold uppercase"
            style={{ backgroundColor: typeColor, color: 'white' }}
          >
            {move.type}
          </span>
          <span className="font-bold text-white">{move.name}</span>
          {badges.map((badge, index) => (
            <span
              key={`${badge.type}-${index}`}
              className="text-xs px-1 py-0.5 rounded font-bold"
              style={{ backgroundColor: badge.color, color: badge.text }}
            >
              {badge.label}
            </span>
          ))}
        </div>
        <div className="text-xs text-white/50">
          {move.power || '-'} / {move.accuracy}%
        </div>
      </div>

      {showUpgradeInfo && !isMaxLevel && (
        <div className="mt-2 text-xs text-green-400">
          +8 Power, +2% Acc, +1 PP, +5% Effect
        </div>
      )}
      {showUpgradeInfo && isMaxLevel && (
        <div className="mt-2 text-xs text-yellow-400">
          Already at MAX level!
        </div>
      )}
    </motion.button>
  );
}

/**
 * New move preview card
 */
function NewMoveCard({ move }) {
  const typeColor = typeColors[move.type] || '#888';

  return (
    <div
      className="p-4 rounded-lg border-2"
      style={{ borderColor: typeColor, backgroundColor: `${typeColor}20` }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span
          className="px-2 py-1 rounded text-sm font-bold uppercase"
          style={{ backgroundColor: typeColor, color: 'white' }}
        >
          {move.type}
        </span>
        <h4 className="font-bold text-lg text-white">{move.name}</h4>
        <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded">NEW!</span>
      </div>

      <div className="flex gap-4 text-sm mb-2">
        <span className="text-white/80">Power: <b>{move.power || '-'}</b></span>
        <span className="text-white/80">Acc: <b>{move.accuracy}%</b></span>
        <span className="text-white/80">PP: <b>{move.maxPP}</b></span>
      </div>

      <div className="flex gap-1.5 mb-2 flex-wrap">
        {isAOEMove(move.target) && (
          <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-orange-500/30 text-orange-300">AOE</span>
        )}
        {move.effect?.status && STATUS_CONFIG[move.effect.status] && (
          <span
            className="px-1.5 py-0.5 text-[10px] font-bold rounded"
            style={{ backgroundColor: STATUS_CONFIG[move.effect.status].color }}
          >
            {STATUS_CONFIG[move.effect.status].emoji} {move.effect.chance || 100}%
          </span>
        )}
      </div>

      <p className="text-xs text-white/60">{move.description}</p>
    </div>
  );
}

/**
 * Fusion preview
 */
function FusionPreview({ fusion }) {
  const result = fusion.result;
  const color = typeColors[result.type] || '#888';

  return (
    <div className="p-3 rounded-lg border-2 border-purple-500/50 bg-purple-900/20">
      <div className="text-sm text-purple-300 mb-2">
        {fusion.move1.name} + {fusion.move2.name} =
      </div>
      <div className="flex items-center gap-2">
        <span
          className="px-2 py-0.5 rounded text-xs font-bold uppercase"
          style={{ backgroundColor: color, color: 'white' }}
        >
          {result.type}
        </span>
        <span className="font-bold text-white">{result.name}</span>
        <span className="text-xs px-1 py-0.5 rounded font-bold bg-purple-500/30 text-purple-300">FUSED</span>
      </div>
      <div className="text-xs text-white/50 mt-1">
        Power: {result.power} | Acc: {result.accuracy}% | {result.description?.slice(0, 60)}...
      </div>
    </div>
  );
}

/**
 * Main Level Up Choice Modal
 */
export default function LevelUpChoiceModal({
  isOpen,
  onClose,
  pokemon,
  newMove, // The new move that can be learned (may be null)
  onLearnMove, // (pokemon, newMove, replaceIndex) => void
  onUpgradeMove, // (pokemon, moveIndex, newLevel) => void
  onFuseMove, // (pokemon, fusedMove) => void
  onSkip, // () => void
}) {
  const [selectedAction, setSelectedAction] = useState(null); // 'learn', 'upgrade', 'fuse'
  const [selectedMoveIndex, setSelectedMoveIndex] = useState(null);
  const [selectedFusion, setSelectedFusion] = useState(null);

  // Calculate possible fusions
  const possibleFusions = useMemo(() => {
    if (!pokemon) return [];
    return getPossibleFusions(pokemon);
  }, [pokemon]);

  // Check which moves can be upgraded (not at max level)
  const upgradableMoves = useMemo(() => {
    if (!pokemon?.moves) return [];
    return pokemon.moves
      .map((move, index) => ({ move, index }))
      .filter(({ move }) => (move.skillLevel || 0) < MAX_SKILL_LEVEL);
  }, [pokemon]);

  if (!isOpen || !pokemon) return null;

  const handleConfirm = () => {
    if (selectedAction === 'learn' && newMove && selectedMoveIndex !== null) {
      onLearnMove(pokemon, newMove, selectedMoveIndex);
    } else if (selectedAction === 'upgrade' && selectedMoveIndex !== null) {
      const result = levelUpSkill(pokemon, selectedMoveIndex);
      if (result.success) {
        onUpgradeMove(result.pokemon, selectedMoveIndex, result.newLevel);
      }
    } else if (selectedAction === 'fuse' && selectedFusion) {
      const result = performSpellFusion(pokemon, selectedFusion.move1Index, selectedFusion.move2Index);
      if (result.success) {
        onFuseMove(result.pokemon, result.fusedMove);
      }
    }
    resetState();
  };

  const resetState = () => {
    setSelectedAction(null);
    setSelectedMoveIndex(null);
    setSelectedFusion(null);
  };

  const handleSkip = () => {
    resetState();
    onSkip();
  };

  // Determine available options
  const canLearn = newMove !== null;
  const canUpgrade = upgradableMoves.length > 0;
  const canFuse = possibleFusions.length > 0;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="max-w-4xl w-full max-h-[90vh] overflow-auto"
          initial={{ scale: 0.9, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 50 }}
        >
          <Card className="p-6 border-2 border-yellow-500/50 bg-gradient-to-b from-gray-900 to-black">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <motion.img
                src={pokemon.sprite}
                alt={pokemon.name}
                className="w-20 h-20 pixelated"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <div>
                <motion.h2
                  className="text-2xl font-bold text-yellow-400"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                >
                  {pokemon.name} leveled up!
                </motion.h2>
                <p className="text-white/70">
                  Choose a reward for your Pokemon
                </p>
              </div>
            </div>

            {/* Action Selection */}
            {!selectedAction && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Learn New Move Option */}
                <motion.button
                  onClick={() => canLearn && setSelectedAction('learn')}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    canLearn
                      ? 'border-green-500/50 bg-green-500/10 hover:bg-green-500/20 cursor-pointer'
                      : 'border-gray-600/50 bg-gray-800/30 opacity-50 cursor-not-allowed'
                  }`}
                  whileHover={canLearn ? { scale: 1.02 } : {}}
                  disabled={!canLearn}
                >
                  <div className="text-3xl mb-2">📚</div>
                  <h3 className="font-bold text-lg text-green-400">Learn New Move</h3>
                  <p className="text-sm text-white/50">
                    {canLearn ? `Learn ${newMove.name}` : 'No new move available'}
                  </p>
                </motion.button>

                {/* Upgrade Move Option */}
                <motion.button
                  onClick={() => canUpgrade && setSelectedAction('upgrade')}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    canUpgrade
                      ? 'border-blue-500/50 bg-blue-500/10 hover:bg-blue-500/20 cursor-pointer'
                      : 'border-gray-600/50 bg-gray-800/30 opacity-50 cursor-not-allowed'
                  }`}
                  whileHover={canUpgrade ? { scale: 1.02 } : {}}
                  disabled={!canUpgrade}
                >
                  <div className="text-3xl mb-2">⬆️</div>
                  <h3 className="font-bold text-lg text-blue-400">Upgrade Move</h3>
                  <p className="text-sm text-white/50">
                    {canUpgrade ? `${upgradableMoves.length} moves can be upgraded` : 'All moves at max level'}
                  </p>
                </motion.button>

                {/* Fuse Moves Option */}
                <motion.button
                  onClick={() => canFuse && setSelectedAction('fuse')}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    canFuse
                      ? 'border-purple-500/50 bg-purple-500/10 hover:bg-purple-500/20 cursor-pointer'
                      : 'border-gray-600/50 bg-gray-800/30 opacity-50 cursor-not-allowed'
                  }`}
                  whileHover={canFuse ? { scale: 1.02 } : {}}
                  disabled={!canFuse}
                >
                  <div className="text-3xl mb-2">🔮</div>
                  <h3 className="font-bold text-lg text-purple-400">Fuse Moves</h3>
                  <p className="text-sm text-white/50">
                    {canFuse ? `${possibleFusions.length} fusion${possibleFusions.length > 1 ? 's' : ''} available` : 'No compatible fusions'}
                  </p>
                </motion.button>
              </div>
            )}

            {/* Learn New Move Flow */}
            {selectedAction === 'learn' && newMove && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center gap-2 mb-4">
                  <Button onClick={() => setSelectedAction(null)} variant="ghost" className="text-sm">
                    ← Back
                  </Button>
                  <h3 className="text-lg font-bold text-green-400">Learn New Move</h3>
                </div>

                <NewMoveCard move={newMove} />

                <h4 className="font-bold text-white mt-4 mb-2">Select a slot:</h4>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {/* Existing Moves */}
                  {pokemon.moves.map((move, index) => (
                    <MoveOption
                      key={index}
                      move={move}
                      isSelected={selectedMoveIndex === index}
                      onClick={() => setSelectedMoveIndex(index)}
                    />
                  ))}
                  
                  {/* Empty Slots */}
                  {Array.from({ length: 4 - pokemon.moves.length }).map((_, i) => {
                    const slotIndex = pokemon.moves.length + i;
                    return (
                      <motion.button
                        key={`empty-${i}`}
                        onClick={() => setSelectedMoveIndex(slotIndex)}
                        className={`w-full p-3 rounded-lg border-2 border-dashed transition-all flex items-center justify-center min-h-[80px] ${
                          selectedMoveIndex === slotIndex
                            ? 'border-green-500 bg-green-500/20'
                            : 'border-white/20 bg-white/5 hover:bg-white/10'
                        }`}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div className="text-center">
                          <span className="text-xl block mb-1">✨</span>
                          <span className="text-sm font-bold text-white/60">Empty Slot</span>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {selectedMoveIndex !== null && (
                  <div className="p-3 bg-yellow-500/20 border border-yellow-500/50 rounded-lg text-center text-yellow-200 mb-4">
                    {pokemon.moves[selectedMoveIndex] ? (
                      <>
                        Replace <b>{pokemon.moves[selectedMoveIndex].name}</b> with <b className="text-green-400">{newMove.name}</b>?
                      </>
                    ) : (
                      <>
                        Learn <b className="text-green-400">{newMove.name}</b> in empty slot?
                      </>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {/* Upgrade Move Flow */}
            {selectedAction === 'upgrade' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center gap-2 mb-4">
                  <Button onClick={() => setSelectedAction(null)} variant="ghost" className="text-sm">
                    ← Back
                  </Button>
                  <h3 className="text-lg font-bold text-blue-400">Upgrade a Move</h3>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4">
                  {pokemon.moves.map((move, index) => {
                    const isUpgradable = (move.skillLevel || 0) < MAX_SKILL_LEVEL;
                    return (
                      <MoveOption
                        key={index}
                        move={move}
                        isSelected={selectedMoveIndex === index}
                        onClick={() => isUpgradable && setSelectedMoveIndex(index)}
                        showUpgradeInfo
                      />
                    );
                  })}
                </div>

                {selectedMoveIndex !== null && (
                  <div className="p-3 bg-blue-500/20 border border-blue-500/50 rounded-lg text-center text-blue-200 mb-4">
                    Upgrade <b>{pokemon.moves[selectedMoveIndex].name}</b> to{' '}
                    <b className="text-blue-400">
                      {getSkillLevelDisplay((pokemon.moves[selectedMoveIndex].skillLevel || 0) + 1)}
                    </b>?
                  </div>
                )}
              </motion.div>
            )}

            {/* Fuse Moves Flow */}
            {selectedAction === 'fuse' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center gap-2 mb-4">
                  <Button onClick={() => setSelectedAction(null)} variant="ghost" className="text-sm">
                    ← Back
                  </Button>
                  <h3 className="text-lg font-bold text-purple-400">Fuse Moves</h3>
                </div>

                <div className="space-y-3 mb-4">
                  {possibleFusions.map((fusion, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setSelectedFusion(fusion)}
                      className={`w-full text-left transition-all ${
                        selectedFusion === fusion ? 'ring-2 ring-purple-500' : ''
                      }`}
                      whileHover={{ scale: 1.01 }}
                    >
                      <FusionPreview fusion={fusion} />
                    </motion.button>
                  ))}
                </div>

                {selectedFusion && (
                  <div className="p-3 bg-purple-500/20 border border-purple-500/50 rounded-lg text-center text-purple-200 mb-4">
                    Fuse <b>{selectedFusion.move1.name}</b> + <b>{selectedFusion.move2.name}</b> into{' '}
                    <b className="text-purple-400">{selectedFusion.result.name}</b>?
                    <div className="text-xs text-white/50 mt-1">
                      (Both original moves will be consumed)
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center mt-4">
              {selectedAction && (
                <Button
                  onClick={handleConfirm}
                  disabled={
                    (selectedAction === 'learn' && selectedMoveIndex === null) ||
                    (selectedAction === 'upgrade' && selectedMoveIndex === null) ||
                    (selectedAction === 'fuse' && !selectedFusion)
                  }
                  className="px-6 py-3 bg-green-600 hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                  Confirm
                </Button>
              )}

              <Button
                onClick={handleSkip}
                variant="secondary"
                className="px-6 py-3"
              >
                Skip
              </Button>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
