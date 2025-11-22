// MoveLearningModal.jsx
// Modal for learning new moves during a run (level-up or Move Tutor)

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import typeColors from "../utils/typeColors";
import { TARGET_TYPES } from "../utils/moves";
import { Card, Button } from "./ui";

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

// Effect type badges
const EFFECT_CONFIG = {
  recoil: { emoji: '💔', label: 'Recoil', color: 'rgba(239, 68, 68, 0.5)', border: 'rgba(239, 68, 68, 0.7)', text: '#fca5a5' },
  flinch: { emoji: '😵', label: 'Flinch', color: 'rgba(251, 191, 36, 0.5)', border: 'rgba(251, 191, 36, 0.7)', text: '#fde047' },
  team_buff: { emoji: '🛡️', label: 'Team Buff', color: 'rgba(59, 130, 246, 0.5)', border: 'rgba(59, 130, 246, 0.7)', text: '#93c5fd' },
  heal: { emoji: '💚', label: 'Heal', color: 'rgba(34, 197, 94, 0.5)', border: 'rgba(34, 197, 94, 0.7)', text: '#86efac' },
  stat_change: { emoji: '📊', label: 'Stats', color: 'rgba(168, 85, 247, 0.5)', border: 'rgba(168, 85, 247, 0.7)', text: '#d8b4fe' },
};

function MoveCard({ move, isSelected, onSelect, isNewMove = false }) {
  const typeColor = typeColors[move.type] || "#999";

  return (
    <motion.div
      onClick={onSelect}
      className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
        isSelected ? "ring-2 ring-gaming-accent ring-offset-2 ring-offset-black" : ""
      }`}
      style={{
        borderColor: isSelected ? "#3b82f6" : typeColor,
        backgroundColor: `${typeColor}20`,
      }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* New Move Badge */}
      {isNewMove && (
        <motion.div
          className="absolute -top-3 -right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg"
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          NEW!
        </motion.div>
      )}

      {/* Move Name */}
      <div className="mb-2">
        <h4 className="font-bold text-lg" style={{ color: typeColor }}>
          {move.name}
        </h4>
        <div className="flex items-center gap-2 mt-1">
          <span
            className="text-xs px-2 py-0.5 rounded-full font-semibold uppercase"
            style={{ backgroundColor: typeColor, color: "#fff" }}
          >
            {move.type}
          </span>
          <span className="text-xs text-white/70 capitalize">
            {move.category}
          </span>
          {move.priority > 0 && (
            <span className="text-xs px-1.5 py-0.5 bg-yellow-500/30 border border-yellow-400/50 text-yellow-300 rounded font-bold">
              +{move.priority} Priority
            </span>
          )}
        </div>
      </div>

      {/* Effect Badges */}
      <div className="flex items-center gap-1.5 mb-2 flex-wrap">
        {isAOEMove(move.target) && (
          <span className="px-1.5 py-0.5 text-[10px] font-bold rounded border bg-orange-500/30 border-orange-400/50 text-orange-300">
            💥 AOE
          </span>
        )}
        {move.effect?.type && EFFECT_CONFIG[move.effect.type] && (
          <span
            className="px-1.5 py-0.5 text-[10px] font-bold rounded border"
            style={{
              backgroundColor: EFFECT_CONFIG[move.effect.type].color,
              borderColor: EFFECT_CONFIG[move.effect.type].border,
              color: EFFECT_CONFIG[move.effect.type].text,
            }}
          >
            {EFFECT_CONFIG[move.effect.type].emoji} {EFFECT_CONFIG[move.effect.type].label}
            {move.effect.percent && ` ${move.effect.percent}%`}
          </span>
        )}
        {move.effect?.status && STATUS_CONFIG[move.effect.status] && (
          <span
            className="px-1.5 py-0.5 text-[10px] font-bold rounded border"
            style={{
              backgroundColor: STATUS_CONFIG[move.effect.status].color,
              borderColor: STATUS_CONFIG[move.effect.status].border,
              color: STATUS_CONFIG[move.effect.status].text,
            }}
          >
            {STATUS_CONFIG[move.effect.status].emoji} {move.effect.chance || 100}%
          </span>
        )}
      </div>

      {/* Move Stats */}
      <div className="flex gap-3 text-sm">
        <span className="text-white/80">
          💥 <span className="font-bold">{move.power || '-'}</span>
        </span>
        <span className="text-white/80">
          🎯 <span className="font-bold">{move.accuracy}%</span>
        </span>
        <span className="text-white/80">
          PP: <span className="font-bold">{move.maxPP}</span>
        </span>
      </div>

      {/* Description */}
      <p className="text-xs text-white/60 mt-2 line-clamp-2">
        {move.description}
      </p>

      {/* Selection indicator */}
      {isSelected && (
        <motion.div
          className="absolute inset-0 rounded-lg border-2 border-gaming-accent pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          layoutId="moveSelection"
        />
      )}
    </motion.div>
  );
}

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
          <Card className="p-6 border-2 border-gaming-accent">
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
              <MoveCard move={newMove} isSelected={false} onSelect={() => {}} isNewMove />
            </div>

            {/* Current Moves */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-white mb-3">
                Current Moves (Select one to replace):
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {pokemon.moves.map((move, index) => (
                  <MoveCard
                    key={move.id || index}
                    move={move}
                    isSelected={selectedMoveIndex === index}
                    onSelect={() => setSelectedMoveIndex(index)}
                  />
                ))}
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
                  Replace <span className="font-bold">{pokemon.moves[selectedMoveIndex].name}</span> with{" "}
                  <span className="font-bold text-green-400">{newMove.name}</span>?
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
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
