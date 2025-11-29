// 📁 MoveSelector.jsx
// Move selection UI for battle - Now with skill level display!

import { motion } from "framer-motion";
import { getTypeEffectiveness } from "../utils/typeChart";
import { MAX_SKILL_LEVEL, getSkillLevelDisplay, getSkillLevelColor } from "../utils/moves";
import typeColors from "../utils/typeColors";
import { Card } from "./ui";
import { useMoveDisplay } from "../hooks/ui/useMoveDisplay";
import useKeyboardNavigation from "../hooks/useKeyboardNavigation";
import { keybindManager, getGridNumber } from "../utils/keybindConfig";
import FocusIndicator from "./keyboard/FocusIndicator";

export default function MoveSelector({ moves, onSelectMove, disabled = false, enemyTypes = [], onBack = null }) {
  if (!moves || moves.length === 0) {
    return null;
  }

  // Configuration de la navigation clavier
  const {
    selectedIndex,
    isKeyboardFocused,
    getItemProps,
  } = useKeyboardNavigation({
    items: moves,
    enabled: !disabled && keybindManager.isEnabled(),
    layout: 'grid',
    columns: 2,
    onSelect: (move, index) => {
      const isOutOfPP = move.pp <= 0;
      if (!isOutOfPP && !disabled) {
        onSelectMove(move, index);
      }
    },
    onCancel: onBack,
    enableNumberKeys: true,
    loop: true,
    isItemDisabled: (move) => move.pp <= 0,
  });

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        {onBack && (
          <motion.button
            onClick={onBack}
            className="flex items-center gap-2 text-neon-cyan hover:text-white transition-colors"
            whileHover={{ x: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-xl">←</span>
            <span className="font-display text-sm uppercase tracking-wider">Back</span>
          </motion.button>
        )}
        <h3 className={`text-xl font-bold text-gaming-accent ${onBack ? '' : 'text-center w-full'}`}>
          ⚔️ Choose Your Move
        </h3>
        {onBack && <div className="w-20" />} {/* Spacer for centering */}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {moves.map((move, index) => {
          const MoveButton = () => {
            const { typeColor, isOutOfPP, badges, styles } = useMoveDisplay(move, {
              showEnhancedInfo: true,
              showSkillLevel: true,
              showFused: true,
              showPP: true,
            });
            const effectiveness = enemyTypes.length > 0 ? getTypeEffectiveness(move.type, enemyTypes) : 1;
            const isSelected = index === selectedIndex && isKeyboardFocused;
            const keyNumber = getGridNumber(index);

            return (
              <FocusIndicator isVisible={isSelected && !isOutOfPP} color="yellow" animated>
                <motion.button
                  key={move.id || index}
                  {...getItemProps(index)}
                  onClick={() => !isOutOfPP && !disabled && onSelectMove(move, index)}
                  disabled={isOutOfPP || disabled}
                  className={`relative w-full p-4 rounded-lg border-2 transition-all duration-200 ${
                    isOutOfPP || disabled
                      ? "opacity-50 cursor-not-allowed bg-gray-700/30"
                      : "hover:scale-105 cursor-pointer"
                  }`}
                  style={styles.container}
                  whileHover={!isOutOfPP && !disabled ? { y: -3 } : {}}
                  whileTap={!isOutOfPP && !disabled ? { scale: 0.95 } : {}}
            >
              {/* Indicateur de touche numérique */}
              {!isOutOfPP && (
                <div className="absolute top-1 left-1 text-xs opacity-50 font-mono bg-black/50 px-1.5 py-0.5 rounded z-10">
                  {keyNumber}
                </div>
              )}

              {/* Move Name */}
              <div className="text-left mb-2">
                <div className="flex items-center gap-2">
                  <h4
                    className="font-bold text-lg"
                    style={{ color: typeColor }}
                  >
                    {move.name}
                  </h4>
                  {/* Badges from useMoveDisplay */}
                  {badges.filter(b => ['skillLevel', 'fused'].includes(b.type)).map((badge, badgeIndex) => (
                    <motion.span
                      key={`${badge.type}-${badgeIndex}`}
                      className="text-xs px-1.5 py-0.5 rounded font-bold"
                      style={{
                        backgroundColor: badge.color,
                        color: badge.text,
                        boxShadow: badge.type === 'skillLevel' && move.skillLevel >= 4
                          ? `0 0 8px ${badge.text}40`
                          : badge.type === 'fused'
                            ? '0 0 10px #a855f7'
                            : 'none',
                      }}
                      initial={{ scale: 0 }}
                      animate={badge.type === 'fused'
                        ? { scale: 1, boxShadow: ['0 0 0px #a855f7', '0 0 10px #a855f7', '0 0 0px #a855f7'] }
                        : { scale: 1 }
                      }
                      transition={badge.type === 'fused' ? { boxShadow: { repeat: Infinity, duration: 1.5 } } : {}}
                    >
                      {badge.label}
                      {badge.type === 'skillLevel' && move.skillLevel >= MAX_SKILL_LEVEL && ' MAX'}
                    </motion.span>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-semibold uppercase"
                    style={{
                      backgroundColor: typeColor,
                      color: "#fff",
                    }}
                  >
                    {move.type}
                  </span>
                  {/* Secondary type for fused moves */}
                  {move.secondaryType && (
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-semibold uppercase"
                      style={{
                        backgroundColor: typeColors[move.secondaryType] || '#888',
                        color: "#fff",
                      }}
                    >
                      {move.secondaryType}
                    </span>
                  )}
                  <span className="text-xs text-white/70 capitalize">
                    {move.category}
                  </span>
                </div>

                {/* AOE and Status Effect Badges from useMoveDisplay */}
                {badges.filter(b => ['aoe', 'status'].includes(b.type)).length > 0 && (
                  <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                    {badges.filter(b => ['aoe', 'status'].includes(b.type)).map((badge, badgeIndex) => (
                      <span
                        key={`${badge.type}-${badgeIndex}`}
                        className="px-1.5 py-0.5 text-[10px] font-bold rounded border"
                        style={{
                          backgroundColor: badge.color,
                          borderColor: badge.border,
                          color: badge.text,
                        }}
                      >
                        {badge.label}
                        {badge.type === 'status' && ` ${move.effect?.chance || 100}%`}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Move Stats */}
              <div className="flex justify-between items-center text-sm mb-2">
                <div className="flex gap-3">
                  <span className="text-white/80">
                    💥 <span className="font-bold">{move.power}</span>
                  </span>
                  <span className="text-white/80">
                    🎯 <span className="font-bold">{move.accuracy}%</span>
                  </span>
                </div>
              </div>

              {/* PP Bar */}
              <div className="mt-2">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-white/70">PP</span>
                  <span className={`font-mono font-bold ${move.pp < move.maxPP * 0.3 ? 'text-red-400' : 'text-white'}`}>
                    {move.pp}/{move.maxPP}
                  </span>
                </div>
                <div className="w-full h-2 bg-black/30 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background:
                        move.pp === 0
                          ? "#666"
                          : move.pp < move.maxPP * 0.3
                          ? "linear-gradient(90deg, #ef4444, #dc2626)"
                          : move.pp < move.maxPP * 0.6
                          ? "linear-gradient(90deg, #f59e0b, #d97706)"
                          : "linear-gradient(90deg, #10b981, #059669)",
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(move.pp / move.maxPP) * 100}%` }}
                    transition={{ type: "spring", stiffness: 100 }}
                  />
                </div>
              </div>

              {/* Type Effectiveness Badge */}
              {effectiveness !== 1 && !isOutOfPP && (
                <div className="absolute -top-2 -right-2 z-10">
                  <motion.div
                    className={`px-2 py-1 rounded-full text-xs font-bold shadow-lg ${
                      effectiveness > 1
                        ? "bg-green-500 text-white"
                        : effectiveness === 0
                        ? "bg-gray-600 text-white"
                        : "bg-red-500 text-white"
                    }`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.1 }}
                  >
                    {effectiveness >= 2
                      ? "×2"
                      : effectiveness > 1
                      ? "×" + effectiveness
                      : effectiveness === 0
                      ? "×0"
                      : "×" + effectiveness}
                  </motion.div>
                </div>
              )}

              {/* Out of PP indicator */}
              {isOutOfPP && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-lg">
                  <span className="text-red-400 font-bold text-sm">
                    OUT OF PP
                  </span>
                </div>
              )}
                </motion.button>
              </FocusIndicator>
            );
          };

          return <MoveButton key={move.id || index} />;
        })}
      </div>

      {disabled && (
        <p className="text-center text-white/60 text-sm mt-4">
          Battle in progress...
        </p>
      )}
    </Card>
  );
}
