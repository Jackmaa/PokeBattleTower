// SpellFusionModal.jsx
// Modal for fusing two spells into a powerful combined move

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Button } from './ui';
import {
  getPossibleFusions,
  performSpellFusion,
  FUSED_MOVES,
} from '../utils/spellFusion';
import { TARGET_TYPES, getRandomLearnableMove } from '../utils/moves';
import typeColors from '../utils/typeColors';
import FullScreenModal from './modals/FullScreenModal';
import { CompactMoveCard } from './cards';

/**
 * Fusion result preview
 */
function FusionPreview({ move1, move2, resultMove }) {
  const color1 = typeColors[move1.type] || '#888';
  const color2 = typeColors[move2.type] || '#888';
  const resultColor = typeColors[resultMove.type] || '#888';

  return (
    <motion.div
      className="p-4 rounded-xl border-2 border-purple-500/50 bg-gradient-to-br from-purple-900/30 to-black"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      {/* Fusion Formula */}
      <div className="flex items-center justify-center gap-2 mb-4 text-lg">
        <span style={{ color: color1 }}>{move1.name}</span>
        <motion.span
          className="text-2xl text-purple-400"
          animate={{ rotate: [0, 180, 360], scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          +
        </motion.span>
        <span style={{ color: color2 }}>{move2.name}</span>
        <span className="text-white/50">=</span>
        <motion.span
          className="font-bold text-xl"
          style={{ color: resultColor }}
          animate={{ textShadow: [`0 0 10px ${resultColor}`, `0 0 20px ${resultColor}`, `0 0 10px ${resultColor}`] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          {resultMove.name}
        </motion.span>
      </div>

      {/* Result Move Details */}
      <div className="bg-black/40 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <div
            className="px-2 py-1 rounded text-sm font-bold uppercase"
            style={{ backgroundColor: resultColor, color: 'white' }}
          >
            {resultMove.type}
          </div>
          {resultMove.secondaryType && (
            <div
              className="px-2 py-1 rounded text-sm font-bold uppercase"
              style={{ backgroundColor: typeColors[resultMove.secondaryType] || '#888', color: 'white' }}
            >
              {resultMove.secondaryType}
            </div>
          )}
          <span className="text-xs px-2 py-1 bg-purple-500/30 text-purple-300 rounded font-bold">
            FUSION
          </span>
        </div>

        <h3 className="text-2xl font-black text-white mb-2">{resultMove.name}</h3>
        <p className="text-white/70 text-sm mb-4">{resultMove.description}</p>

        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="p-2 bg-white/10 rounded">
            <div className="text-xs text-white/50">Power</div>
            <div className="text-lg font-bold text-red-400">{resultMove.power}</div>
          </div>
          <div className="p-2 bg-white/10 rounded">
            <div className="text-xs text-white/50">Accuracy</div>
            <div className="text-lg font-bold text-blue-400">{resultMove.accuracy}%</div>
          </div>
          <div className="p-2 bg-white/10 rounded">
            <div className="text-xs text-white/50">PP</div>
            <div className="text-lg font-bold text-green-400">{resultMove.maxPP}</div>
          </div>
          <div className="p-2 bg-white/10 rounded">
            <div className="text-xs text-white/50">Category</div>
            <div className="text-lg font-bold text-yellow-400 capitalize">{resultMove.category}</div>
          </div>
        </div>

        {resultMove.effect && (
          <div className="mt-3 p-2 bg-purple-500/20 rounded text-sm text-purple-200">
            <span className="font-bold">Effect:</span> {resultMove.effect.type}
            {resultMove.effect.status && ` (${resultMove.effect.status})`}
            {resultMove.effect.chance && ` - ${resultMove.effect.chance}% chance`}
          </div>
        )}

        {resultMove.target === TARGET_TYPES.ALL_ENEMIES && (
          <div className="mt-2 text-xs text-orange-400 font-bold">
            Hits all enemies!
          </div>
        )}

        {resultMove.priority > 0 && (
          <div className="mt-2 text-xs text-cyan-400 font-bold">
            Priority +{resultMove.priority} (Goes first!)
          </div>
        )}
      </div>
    </motion.div>
  );
}

/**
 * Main Spell Fusion Modal
 */
export default function SpellFusionModal({
  isOpen,
  onClose,
  pokemon,
  onFusion,
}) {
  const [selectedMoves, setSelectedMoves] = useState([]);
  const [possibleFusions, setPossibleFusions] = useState([]);
  const [currentFusion, setCurrentFusion] = useState(null);
  const [fusionComplete, setFusionComplete] = useState(false);
  const [fusionResult, setFusionResult] = useState(null);

  const [bonusMove, setBonusMove] = useState(null);

  // Calculate possible fusions when pokemon changes
  useEffect(() => {
    if (pokemon) {
      const fusions = getPossibleFusions(pokemon);
      setPossibleFusions(fusions);
    }
  }, [pokemon]);

  // Check for valid fusion when moves are selected
  useEffect(() => {
    if (selectedMoves.length === 2) {
      const fusion = possibleFusions.find(
        f =>
          (f.move1Index === selectedMoves[0] && f.move2Index === selectedMoves[1]) ||
          (f.move1Index === selectedMoves[1] && f.move2Index === selectedMoves[0])
      );
      setCurrentFusion(fusion || null);
    } else {
      setCurrentFusion(null);
    }
  }, [selectedMoves, possibleFusions]);

  const handleMoveClick = (index) => {
    const move = pokemon.moves[index];
    if (move.isFused) return; // Can't select fused moves

    setSelectedMoves(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      }
      if (prev.length >= 2) {
        return [prev[1], index];
      }
      return [...prev, index];
    });
  };

  const handleFuse = () => {
    if (!currentFusion) return;

    const result = performSpellFusion(
      pokemon,
      currentFusion.move1Index,
      currentFusion.move2Index
    );

    if (result.success) {
      setFusionResult(result);
      setFusionComplete(true);
      
      // Check if we need to offer a bonus move (if pokemon has < 4 moves)
      // The result.pokemon already has the fused move replacing one slot and the other removed
      // So it should have one less move than before
      if (result.pokemon.moves.length < 4) {
        const newMove = getRandomLearnableMove(result.pokemon);
        if (newMove) {
          setBonusMove(newMove);
        }
      }
      
      onFusion(result.pokemon, result.fusedMove);
    }
  };

  const handleLearnBonusMove = () => {
    if (!bonusMove || !fusionResult) return;
    
    // Add the bonus move to the pokemon
    const updatedPokemon = {
      ...fusionResult.pokemon,
      moves: [...fusionResult.pokemon.moves, bonusMove]
    };
    
    // Update the result to show the new state (optional, but good for consistency)
    setFusionResult({
      ...fusionResult,
      pokemon: updatedPokemon
    });
    
    // Notify parent of the update (this might be redundant if onFusion was called, 
    // but we need to update with the new move)
    onFusion(updatedPokemon, fusionResult.fusedMove);
    
    // Clear bonus move so we don't show it again
    setBonusMove(null);
  };

  const handleClose = () => {
    setSelectedMoves([]);
    setCurrentFusion(null);
    setFusionComplete(false);
    setFusionResult(null);
    setBonusMove(null);
    onClose();
  };

  if (!isOpen || !pokemon) return null;

  return (
    <FullScreenModal
      isOpen={true}
      onClose={handleClose}
      borderColor="purple-500"
      closeOnBackdrop={true}
      showCloseButton={false}
      maxWidth="3xl"
    >
      <Card className="border-none p-0 bg-gradient-to-b from-gray-900 to-black rounded-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <motion.span
                    className="text-3xl"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    🔮
                  </motion.span>
                  Spell Fusion
                </h2>
                <p className="text-white/50 text-sm mt-1">
                  Combine two moves to create a powerful fusion
                </p>
              </div>
              {possibleFusions.length > 0 && (
                <div className="text-right">
                  <div className="text-sm text-white/50">Possible Fusions</div>
                  <div className="text-2xl font-bold text-purple-400">{possibleFusions.length}</div>
                </div>
              )}
            </div>

            {/* Fusion Complete View */}
            {fusionComplete && fusionResult ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <motion.div
                  className="text-6xl mb-4"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 360],
                  }}
                  transition={{ duration: 1 }}
                >
                  ✨
                </motion.div>
                <h3 className="text-3xl font-black text-purple-400 mb-2">
                  Fusion Complete!
                </h3>
                <p className="text-white/70 mb-6">{fusionResult.message}</p>

                <FusionPreview
                  move1={fusionResult.consumedMoves[0]}
                  move2={fusionResult.consumedMoves[1]}
                  resultMove={fusionResult.fusedMove}
                />

                {bonusMove && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl"
                  >
                    <h4 className="text-green-400 font-bold mb-2 flex items-center justify-center gap-2">
                      <span>🎁</span> Bonus Move Available!
                    </h4>
                    <p className="text-white/70 text-sm mb-3">
                      Since you have an empty move slot, you can learn a new move!
                    </p>
                    
                    <div className="bg-black/40 p-3 rounded-lg mb-4 text-left">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-white">{bonusMove.name}</span>
                        <span 
                          className="text-xs px-2 py-0.5 rounded uppercase font-bold"
                          style={{ 
                            backgroundColor: typeColors[bonusMove.type] || '#888',
                            color: 'white'
                          }}
                        >
                          {bonusMove.type}
                        </span>
                      </div>
                      <p className="text-xs text-white/50">{bonusMove.description}</p>
                    </div>

                    <div className="flex gap-3 justify-center">
                      <Button
                        onClick={handleLearnBonusMove}
                        className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg"
                      >
                        Learn {bonusMove.name}
                      </Button>
                      <Button
                        onClick={() => setBonusMove(null)}
                        className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg"
                      >
                        Skip
                      </Button>
                    </div>
                  </motion.div>
                )}

                {!bonusMove && (
                  <Button
                    onClick={handleClose}
                    className="mt-6 px-8 py-3 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-lg"
                  >
                    Awesome!
                  </Button>
                )}
              </motion.div>
            ) : (
              <>
                {/* Pokemon Info */}
                <div className="flex items-center gap-4 mb-6 p-4 bg-white/5 rounded-xl">
                  <img
                    src={pokemon.sprite}
                    alt={pokemon.name}
                    className="w-16 h-16 pixelated"
                  />
                  <div>
                    <h3 className="text-xl font-bold text-white">{pokemon.name}</h3>
                    <div className="text-sm text-white/50">Select two moves to fuse</div>
                  </div>
                </div>

                {/* Moves Selection */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {pokemon.moves?.map((move, index) => (
                    <CompactMoveCard
                      key={move.id || index}
                      move={move}
                      isSelected={selectedMoves.includes(index)}
                      onClick={() => handleMoveClick(index)}
                      disabled={move.isFused}
                    />
                  ))}
                </div>

                {/* Fusion Preview */}
                {currentFusion ? (
                  <div className="mb-6">
                    <FusionPreview
                      move1={currentFusion.move1}
                      move2={currentFusion.move2}
                      resultMove={currentFusion.result}
                    />
                  </div>
                ) : selectedMoves.length === 2 ? (
                  <div className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/30 text-center">
                    <span className="text-red-400">
                      These moves cannot be fused together. Try a different combination!
                    </span>
                  </div>
                ) : possibleFusions.length === 0 ? (
                  <div className="mb-6 p-4 rounded-xl bg-yellow-500/20 border border-yellow-500/30 text-center">
                    <span className="text-yellow-400">
                      No fusion combinations available for this Pokemon's current moves.
                    </span>
                  </div>
                ) : (
                  <div className="mb-6 p-4 rounded-xl bg-white/5 text-center text-white/50">
                    Select two moves to see if they can be fused
                  </div>
                )}

                {/* Available Fusions Hint */}
                {possibleFusions.length > 0 && !currentFusion && (
                  <div className="mb-4 text-sm text-white/40 text-center">
                    Hint: {possibleFusions.map(f => `${f.move1.name} + ${f.move2.name}`).join(', ')}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 justify-center">
                  <Button
                    onClick={handleClose}
                    className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleFuse}
                    disabled={!currentFusion}
                    className={`px-8 py-2 font-bold rounded-lg transition-all ${
                      currentFusion
                        ? 'bg-purple-500 hover:bg-purple-600 text-white'
                        : 'bg-white/10 text-white/30 cursor-not-allowed'
                    }`}
                  >
                    {currentFusion ? `Fuse Moves!` : 'Select Compatible Moves'}
                  </Button>
                </div>
              </>
            )}
      </Card>
    </FullScreenModal>
  );
}
