// MoveLearningModal.jsx
// Modal for learning new moves during a run (level-up or Move Tutor)

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, Button } from "./ui";
import FullScreenModal from "./modals/FullScreenModal";
import { SelectableMoveCard } from "./cards";


export default function MoveLearningModal({
  isOpen,
  onClose,
  pokemon,
  newMove,
  onLearnMove,
  onDecline,
  source = "level-up", // "level-up" or "move-tutor"
}) {
  const [selectedMoveIndex, setSelectedMoveIndex] = useState(null);
  const [confirmingReplace, setConfirmingReplace] = useState(false);

  if (!isOpen || !pokemon || !newMove) return null;

  const handleConfirmLearn = () => {
    if (selectedMoveIndex === null) return;

    const moveToForget = pokemon.moves[selectedMoveIndex];
    onLearnMove(pokemon, newMove, selectedMoveIndex, moveToForget);
    setSelectedMoveIndex(null);
    setConfirmingReplace(false);
  };

  const handleDecline = () => {
    setSelectedMoveIndex(null);
    setConfirmingReplace(false);
    onDecline();
  };

  const sourceText = source === "level-up"
    ? `${pokemon.name} wants to learn a new move!`
    : "Choose a move to teach your Pokemon!";

  return (
    <FullScreenModal
      isOpen={true}
      onClose={() => {}} // Move learning can't be dismissed
      borderColor="purple-500"
      closeOnBackdrop={false}
      showCloseButton={false}
      maxWidth="4xl"
    >
      <Card className="border-none p-0">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <img
                src={pokemon.sprite}
                alt={pokemon.name}
                className="w-20 h-20 pixelated"
              />
              <div>
                <h2 className="text-2xl font-bold text-gaming-accent">
                  {sourceText}
                </h2>
                <p className="text-white/70">
                  {pokemon.name} already knows 4 moves. Choose one to replace.
                </p>
              </div>
            </div>

            {/* New Move to Learn */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-green-400 mb-3">
                New Move to Learn:
              </h3>
              <SelectableMoveCard move={newMove} isSelected={false} onSelect={() => {}} isNewMove />
            </div>

            {/* Current Moves */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-white mb-3">
                Current Moves (Select a slot):
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {/* Render existing moves */}
                {pokemon.moves.map((move, index) => (
                  <SelectableMoveCard
                    key={move.id || index}
                    move={move}
                    isSelected={selectedMoveIndex === index}
                    onSelect={() => setSelectedMoveIndex(index)}
                  />
                ))}
                
                {/* Render empty slots */}
                {Array.from({ length: 4 - pokemon.moves.length }).map((_, i) => {
                  const slotIndex = pokemon.moves.length + i;
                  return (
                    <motion.div
                      key={`empty-${i}`}
                      onClick={() => setSelectedMoveIndex(slotIndex)}
                      className={`relative p-4 rounded-lg border-2 border-dashed cursor-pointer transition-all duration-200 flex items-center justify-center min-h-[120px] ${
                        selectedMoveIndex === slotIndex 
                          ? "border-gaming-accent bg-gaming-accent/10" 
                          : "border-white/20 bg-white/5 hover:bg-white/10"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="text-center">
                        <span className="text-2xl mb-2 block">✨</span>
                        <span className="text-white/60 font-bold">Empty Slot</span>
                      </div>
                      
                      {/* Selection indicator */}
                      {selectedMoveIndex === slotIndex && (
                        <motion.div
                          className="absolute inset-0 rounded-lg border-2 border-gaming-accent pointer-events-none"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          layoutId="moveSelection"
                        />
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Confirmation */}
            {selectedMoveIndex !== null && (
              <motion.div
                className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="text-yellow-200 text-center">
                  {pokemon.moves[selectedMoveIndex] ? (
                    <>
                      Replace <span className="font-bold">{pokemon.moves[selectedMoveIndex].name}</span> with{" "}
                      <span className="font-bold text-green-400">{newMove.name}</span>?
                    </>
                  ) : (
                    <>
                      Learn <span className="font-bold text-green-400">{newMove.name}</span> in empty slot?
                    </>
                  )}
                </p>
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <Button
                onClick={handleConfirmLearn}
                disabled={selectedMoveIndex === null}
                className={`px-6 py-3 ${
                  selectedMoveIndex === null
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-500"
                }`}
              >
                Learn {newMove.name}
              </Button>

              <Button
                onClick={handleDecline}
                variant="secondary"
                className="px-6 py-3"
              >
                Don't Learn
              </Button>
            </div>
      </Card>
    </FullScreenModal>
  );
}
